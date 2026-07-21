import "server-only";
import { getSql, ensureSchema } from "./db";
import { Content, defaultContent } from "./content";

const CONTENT_ID = "main";

// Read all site content. Falls back to the seeded defaults when there is no
// database configured or no row yet, so the public site always renders.
export async function getContent(): Promise<Content> {
  const sql = getSql();
  if (!sql) return defaultContent;
  try {
    await ensureSchema();
    const rows = (await sql`
      SELECT data FROM site_content WHERE id = ${CONTENT_ID} LIMIT 1
    `) as { data: Content }[];
    if (!rows.length) return defaultContent;
    // Shallow-merge over defaults so newly added fields are never undefined.
    return { ...defaultContent, ...rows[0].data };
  } catch (err) {
    console.error("getContent failed, using defaults:", err);
    return defaultContent;
  }
}

// Persist the full content object (admin save).
export async function saveContent(data: Content): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  await ensureSchema();
  await sql`
    INSERT INTO site_content (id, data, updated_at)
    VALUES (${CONTENT_ID}, ${JSON.stringify(data)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE
      SET data = ${JSON.stringify(data)}::jsonb, updated_at = now()
  `;
}
