import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSql, ensureSchema } from "@/lib/db";
import { Content, DocRef } from "@/lib/content";

// One-off migration: moves base64-embedded files (library PDFs, testimonial
// avatars, world item photos) out of the site_content JSONB row and into
// Vercel Blob storage, replacing each with a URL. Gated by MIGRATE_KEY
// (not admin auth) since it's meant to run exactly once, then be deleted.

function dataUriToBuffer(dataUri: string) {
  const m = dataUri.match(/^data:([^;]+);base64,([\s\S]*)$/);
  if (!m) throw new Error("Not a data URI");
  return { contentType: m[1], buffer: Buffer.from(m[2], "base64") };
}

async function uploadDataUri(dataUri: string, name: string) {
  const { contentType, buffer } = dataUriToBuffer(dataUri);
  const ext = contentType.split("/")[1] || "bin";
  const blob = await put(`migrated/${name}.${ext}`, buffer, {
    access: "public",
    contentType,
    addRandomSuffix: true,
  });
  return blob.url;
}

async function uploadBase64Pdf(base64: string, name: string) {
  const buffer = Buffer.from(base64, "base64");
  const blob = await put(`migrated/${name}.pdf`, buffer, {
    access: "public",
    contentType: "application/pdf",
    addRandomSuffix: true,
  });
  return blob.url;
}

async function migrateDoc(doc: DocRef | null | undefined, name: string): Promise<DocRef | null | undefined> {
  if (!doc) return doc;
  if (doc.type === "pdf") {
    const url = await uploadBase64Pdf(doc.data, name);
    return { type: "pdf-url", url };
  }
  if (doc.type === "images") {
    const urls: string[] = [];
    for (let i = 0; i < doc.pages.length; i++) {
      urls.push(await uploadDataUri(doc.pages[i], `${name}-p${i + 1}`));
    }
    return { type: "images", pages: urls };
  }
  return doc;
}

export async function POST(req: Request) {
  const key = req.headers.get("x-migrate-key");
  if (!key || key !== process.env.MIGRATE_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getSql();
  if (!sql) {
    return NextResponse.json({ error: "No database configured" }, { status: 500 });
  }
  await ensureSchema();

  const rows = (await sql`SELECT data FROM site_content WHERE id = 'main' LIMIT 1`) as { data: Content }[];
  if (!rows.length) {
    return NextResponse.json({ error: "No site_content row found" }, { status: 404 });
  }

  const data = rows[0].data;
  const before = JSON.stringify(data).length;
  const log: string[] = [];

  for (const p of data.projects || []) {
    if (p.deck) {
      log.push(`project deck: ${p.title}`);
      p.deck = (await migrateDoc(p.deck, `project-${p.id}`)) ?? null;
    }
  }
  for (const d of data.library || []) {
    if (d.doc) {
      log.push(`library doc: ${d.title}`);
      d.doc = (await migrateDoc(d.doc, `library-${d.id}`)) ?? null;
    }
  }
  for (const t of data.testimonials || []) {
    if (t.avatar && t.avatar.startsWith("data:")) {
      log.push(`testimonial avatar: ${t.name}`);
      t.avatar = await uploadDataUri(t.avatar, `avatar-${t.name.replace(/\s+/g, "-").toLowerCase()}`);
    }
  }
  for (const w of data.world || []) {
    if (w.img && w.img.startsWith("data:")) {
      log.push(`world item: ${w.cap}`);
      w.img = await uploadDataUri(w.img, `world-${w.id}`);
    }
  }

  const after = JSON.stringify(data).length;

  await sql`UPDATE site_content SET data = ${JSON.stringify(data)}::jsonb, updated_at = now() WHERE id = 'main'`;

  return NextResponse.json({ ok: true, before, after, uploaded: log });
}
