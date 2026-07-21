"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Content, Project, Testimonial, LibraryDoc, WorldItem, DocRef } from "@/lib/content";
import { Message } from "@/lib/messages";
import { Plus, Trash2, GripVertical } from "lucide-react";

/* ---------- small UI primitives ---------- */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-soft">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-ink"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-soft">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-ink"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-soft">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-ink"
      />
    </label>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-2xl p-6">
      <div className="mb-5">
        <h2 className="font-display text-xl">{title}</h2>
        {desc && <p className="mt-1 text-sm text-ink-soft">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

function Card({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="glass-soft relative rounded-xl p-4">
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-3 top-3 text-muted hover:text-accent-ink"
        aria-label="Remove"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-1 pb-3 text-muted">
        <GripVertical className="h-4 w-4" />
      </div>
      {children}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-sm text-ink-soft hover:border-ink hover:text-ink"
    >
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

async function filesToDoc(files: File[]): Promise<DocRef | null> {
  if (!files.length) return null;
  if (files[0].type === "application/pdf") {
    if (files[0].size > 4 * 1024 * 1024) {
      alert("PDF over 4 MB — compress it first");
      return null;
    }
    const b64 = await fileToBase64(files[0]);
    return { type: "pdf", data: b64.split(",")[1] };
  }
  const pages: string[] = [];
  for (const f of files) {
    if (f.type.startsWith("image/")) pages.push(await fileToBase64(f));
  }
  if (!pages.length) {
    alert("Pick a PDF or images");
    return null;
  }
  return { type: "images", pages };
}

function DocUpload({ doc, onChange }: { doc: DocRef | null | undefined; onChange: (d: DocRef | null) => void }) {
  const label = doc
    ? `File attached (${doc.type === "images" ? "images" : doc.type === "pdf-url" ? "hosted PDF" : "PDF"}) — click to replace`
    : "⬆ Upload file — PDF (export PPT/doc as PDF) or page images";
  return (
    <div className="space-y-2">
      <label className="block cursor-pointer rounded-lg border border-dashed border-line p-4 text-center text-sm text-ink-soft hover:border-ink hover:text-ink">
        {label}
        <input
          type="file"
          hidden
          accept="application/pdf,image/*"
          multiple
          onChange={async (e) => {
            const files = [...(e.target.files || [])];
            const d = await filesToDoc(files);
            if (d) onChange(d);
            e.target.value = "";
          }}
        />
      </label>
      {doc && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs text-muted hover:text-accent-ink"
        >
          Remove file
        </button>
      )}
    </div>
  );
}

/* ---------- main editor ---------- */

const TABS = [
  { key: "content", label: "Content" },
  { key: "projects", label: "Projects & Decks" },
  { key: "library", label: "Library" },
  { key: "approach", label: "Approach" },
  { key: "testimonials", label: "Testimonials" },
  { key: "world", label: "My World" },
  { key: "messages", label: "Messages" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export default function Editor({
  initial,
  initialMessages,
  dbConfigured,
}: {
  initial: Content;
  initialMessages: Message[];
  dbConfigured: boolean;
}) {
  const router = useRouter();
  const [content, setContent] = useState<Content>(initial);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [tab, setTab] = useState<TabKey>("content");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const mutate = (fn: (draft: Content) => void) =>
    setContent((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });

  async function save() {
    setStatus("saving");
    setErrorMsg("");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    if (res.ok) {
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2500);
    } else {
      const j = await res.json().catch(() => ({}));
      setErrorMsg(j.error || "Save failed");
      setStatus("error");
    }
  }

  async function deleteMessage(id: number) {
    const res = await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
    if (res.ok) setMessages((m) => m.filter((x) => x.id !== id));
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const newProject = (): Project => ({
    id: `project-${Date.now()}`,
    title: "New project",
    subtitle: "",
    description: "",
    role: "Product Manager",
    status: "Shipped",
    outcome: "",
    outcomes: [],
    metrics: [{ value: "", label: "" }],
    tags: [],
    deck: null,
  });

  const newTestimonial = (): Testimonial => ({
    name: "",
    role: "",
    company: "",
    quote: "",
  });

  const newLibraryDoc = (): LibraryDoc => ({
    id: `doc-${Date.now()}`,
    cat: "Case Study",
    title: "New document",
    desc: "",
    doc: null,
  });

  const newWorldItem = (): WorldItem => ({
    id: `world-${Date.now()}`,
    emo: "✨",
    cap: "New thing",
    x: 10 + Math.random() * 70,
    y: 10 + Math.random() * 70,
  });

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      {/* header */}
      <div className="sticky top-0 z-10 -mx-5 mb-8 flex items-center justify-between border-b border-white/40 bg-white/40 px-5 py-4 backdrop-blur-xl backdrop-saturate-150 sm:-mx-8 sm:px-8">
        <div>
          <h1 className="font-display text-2xl">Site editor</h1>
          <p className="text-xs text-ink-soft">Edit any section, then save. Changes go live immediately.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="text-sm text-ink-soft hover:text-ink">
            View site ↗
          </a>
          <button onClick={logout} className="text-sm text-ink-soft hover:text-ink">
            Log out
          </button>
          <button
            onClick={save}
            disabled={status === "saving"}
            className="rounded-lg bg-ink px-5 py-2 text-sm text-bg hover:bg-accent hover:text-ink disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save changes"}
          </button>
        </div>
      </div>

      {!dbConfigured && (
        <div className="mb-6 rounded-xl border border-accent/40 bg-accent/5 p-4 text-sm text-accent-ink">
          No database connected yet. You can edit here, but saving needs{" "}
          <code className="rounded bg-bg px-1">DATABASE_URL</code> set. See SETUP.md.
        </div>
      )}
      {status === "error" && (
        <div className="mb-6 rounded-xl border border-accent/40 bg-accent/5 p-4 text-sm text-accent-ink">
          {errorMsg}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wide ${
              tab === t.key ? "border-ink bg-ink text-bg" : "border-line text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            {t.label}
            {t.key === "messages" && messages.length ? ` (${messages.length})` : ""}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {tab === "content" && (
          <>
            <Section title="Profile" desc="The basics shown in the hero and footer.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" value={content.meta.name} onChange={(v) => mutate((d) => (d.meta.name = v))} />
                <Field label="Role / title" value={content.meta.role} onChange={(v) => mutate((d) => (d.meta.role = v))} />
              </div>
              <div className="mt-4">
                <Area label="Tagline (hero subtitle)" value={content.meta.tagline} onChange={(v) => mutate((d) => (d.meta.tagline = v))} />
              </div>
              <div className="mt-4">
                <Area label="Short bio" value={content.meta.bio} onChange={(v) => mutate((d) => (d.meta.bio = v))} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Email" value={content.meta.email} onChange={(v) => mutate((d) => (d.meta.email = v))} />
                <Field label="Phone" value={content.meta.phone} onChange={(v) => mutate((d) => (d.meta.phone = v))} />
                <Field label="Location" value={content.meta.location} onChange={(v) => mutate((d) => (d.meta.location = v))} />
                <Field label="Resume URL" value={content.meta.resumeUrl} onChange={(v) => mutate((d) => (d.meta.resumeUrl = v))} />
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={content.meta.available}
                  onChange={(e) => mutate((d) => (d.meta.available = e.target.checked))}
                />
                Show &ldquo;Open to new opportunities&rdquo; badge
              </label>
            </Section>

            <Section title="Social links" desc="Buttons in the hero and footer.">
              <div className="space-y-3">
                {content.social.map((s, i) => (
                  <Card key={i} onRemove={() => mutate((d) => d.social.splice(i, 1))}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Label" value={s.label} onChange={(v) => mutate((d) => (d.social[i].label = v))} />
                      <Field label="URL" value={s.url} onChange={(v) => mutate((d) => (d.social[i].url = v))} />
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-3">
                <AddButton label="Add link" onClick={() => mutate((d) => d.social.push({ label: "", url: "" }))} />
              </div>
            </Section>

            <Section title="Quick facts" desc="The stat cards in the About section.">
              <div className="space-y-3">
                {content.stats.map((s, i) => (
                  <Card key={i} onRemove={() => mutate((d) => d.stats.splice(i, 1))}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Value" value={s.value} onChange={(v) => mutate((d) => (d.stats[i].value = v))} placeholder="30%" />
                      <Field label="Label" value={s.label} onChange={(v) => mutate((d) => (d.stats[i].label = v))} placeholder="Lift in adoption" />
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-3">
                <AddButton label="Add stat" onClick={() => mutate((d) => d.stats.push({ value: "", label: "" }))} />
              </div>
            </Section>

            <Section title="About" desc="Use *word* around a phrase to highlight it in amber.">
              <Area label="Big statement" value={content.aboutHeading} onChange={(v) => mutate((d) => (d.aboutHeading = v))} rows={2} />
              <div className="mt-4">
                <Area label="Supporting line" value={content.aboutBody} onChange={(v) => mutate((d) => (d.aboutBody = v))} rows={5} />
              </div>
            </Section>
          </>
        )}

        {tab === "projects" && (
          <Section title="Work / Projects" desc="Your case studies and their slide decks.">
            <div className="space-y-4">
              {content.projects.map((p, i) => (
                <Card key={p.id} onRemove={() => mutate((d) => d.projects.splice(i, 1))}>
                  <div className="grid gap-3">
                    <Field label="Title" value={p.title} onChange={(v) => mutate((d) => (d.projects[i].title = v))} />
                    <Field label="Subtitle" value={p.subtitle} onChange={(v) => mutate((d) => (d.projects[i].subtitle = v))} />
                    <Area label="Description" value={p.description} onChange={(v) => mutate((d) => (d.projects[i].description = v))} />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Role" value={p.role} onChange={(v) => mutate((d) => (d.projects[i].role = v))} />
                      <Field label="Status" value={p.status} onChange={(v) => mutate((d) => (d.projects[i].status = v))} />
                    </div>
                    <Area
                      label="Outcomes (one per line)"
                      value={(p.outcomes || []).join("\n")}
                      onChange={(v) =>
                        mutate((d) => (d.projects[i].outcomes = v.split("\n").map((s) => s.trim()).filter(Boolean)))
                      }
                    />
                    <Field label="Link (optional)" value={p.link || ""} onChange={(v) => mutate((d) => (d.projects[i].link = v))} />
                    <Field
                      label="Tags (comma separated)"
                      value={p.tags.join(", ")}
                      onChange={(v) => mutate((d) => (d.projects[i].tags = v.split(",").map((t) => t.trim()).filter(Boolean)))}
                    />

                    <div className="rounded-lg border border-line p-3">
                      <p className="mb-2 text-xs font-medium text-ink-soft">Metrics (shown on the dark card)</p>
                      <div className="space-y-2">
                        {p.metrics.map((m, mi) => (
                          <div key={mi} className="flex items-end gap-2">
                            <div className="flex-1">
                              <Field label="Value" value={m.value} onChange={(v) => mutate((d) => (d.projects[i].metrics[mi].value = v))} />
                            </div>
                            <div className="flex-1">
                              <Field label="Label" value={m.label} onChange={(v) => mutate((d) => (d.projects[i].metrics[mi].label = v))} />
                            </div>
                            <button
                              type="button"
                              onClick={() => mutate((d) => d.projects[i].metrics.splice(mi, 1))}
                              className="mb-2 text-muted hover:text-accent-ink"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2">
                        <AddButton label="Add metric" onClick={() => mutate((d) => d.projects[i].metrics.push({ value: "", label: "" }))} />
                      </div>
                    </div>

                    <div className="rounded-lg border border-line p-3">
                      <p className="mb-2 text-xs font-medium text-ink-soft">Slide deck</p>
                      <DocUpload doc={p.deck} onChange={(doc) => mutate((d) => (d.projects[i].deck = doc))} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-3">
              <AddButton label="Add project" onClick={() => mutate((d) => d.projects.push(newProject()))} />
            </div>
            <p className="mt-3 text-xs text-ink-soft">
              Decks: export your slides as <b className="text-accent-ink">PDF</b> and upload — it renders as scrollable
              slides. Slide images (multi-select) also work.
            </p>
          </Section>
        )}

        {tab === "library" && (
          <Section title="Library" desc="Case studies, PRDs, guesstimates and other viewable documents.">
            <div className="mb-4">
              <Area label="Section intro" value={content.librarySub} onChange={(v) => mutate((d) => (d.librarySub = v))} rows={2} />
            </div>
            <div className="space-y-4">
              {content.library.map((doc, i) => (
                <Card key={doc.id} onRemove={() => mutate((d) => d.library.splice(i, 1))}>
                  <div className="grid gap-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Title" value={doc.title} onChange={(v) => mutate((d) => (d.library[i].title = v))} />
                      <Field label="Category" value={doc.cat} onChange={(v) => mutate((d) => (d.library[i].cat = v))} />
                    </div>
                    <Area label="Description" value={doc.desc} onChange={(v) => mutate((d) => (d.library[i].desc = v))} />
                    <div className="rounded-lg border border-line p-3">
                      <p className="mb-2 text-xs font-medium text-ink-soft">File</p>
                      <DocUpload doc={doc.doc} onChange={(d2) => mutate((d) => (d.library[i].doc = d2))} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-3">
              <AddButton label="Add document" onClick={() => mutate((d) => d.library.push(newLibraryDoc()))} />
            </div>
            <p className="mt-3 text-xs text-ink-soft">
              Cards without a file show as &ldquo;coming soon&rdquo; on the site.
            </p>
          </Section>
        )}

        {tab === "approach" && (
          <Section title="My Approach" desc="Your working principles.">
            <Area label="Section intro" value={content.approachSub || ""} onChange={(v) => mutate((d) => (d.approachSub = v))} rows={2} />
            <div className="mt-4 space-y-3">
              {content.approach.map((a, i) => (
                <Card key={i} onRemove={() => mutate((d) => d.approach.splice(i, 1))}>
                  <Field label="Title" value={a.title} onChange={(v) => mutate((d) => (d.approach[i].title = v))} />
                  <div className="mt-3">
                    <Area label="Description" value={a.description} onChange={(v) => mutate((d) => (d.approach[i].description = v))} rows={2} />
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-3">
              <AddButton label="Add principle" onClick={() => mutate((d) => d.approach.push({ title: "", description: "" }))} />
            </div>
          </Section>
        )}

        {tab === "testimonials" && (
          <Section title="Testimonials" desc="The sample quotes are placeholders — replace with real ones (with permission).">
            <Area
              label="Section intro"
              value={content.testimonialsSub || ""}
              onChange={(v) => mutate((d) => (d.testimonialsSub = v))}
              rows={2}
            />
            <div className="mt-4 space-y-3">
              {content.testimonials.map((t, i) => (
                <Card key={i} onRemove={() => mutate((d) => d.testimonials.splice(i, 1))}>
                  <Area label="Quote" value={t.quote} onChange={(v) => mutate((d) => (d.testimonials[i].quote = v))} />
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <Field label="Name" value={t.name} onChange={(v) => mutate((d) => (d.testimonials[i].name = v))} />
                    <Field label="Role" value={t.role} onChange={(v) => mutate((d) => (d.testimonials[i].role = v))} />
                    <Field label="Company" value={t.company} onChange={(v) => mutate((d) => (d.testimonials[i].company = v))} />
                  </div>
                  <div className="mt-3">
                    <Field label="LinkedIn URL (optional)" value={t.link || ""} onChange={(v) => mutate((d) => (d.testimonials[i].link = v))} />
                  </div>
                  <div className="mt-3 space-y-2">
                    <label className="block cursor-pointer rounded-lg border border-dashed border-line p-3 text-center text-sm text-ink-soft hover:border-ink hover:text-ink">
                      {t.avatar ? "Photo attached — click to replace" : "⬆ Upload photo (optional — replaces the initials)"}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          if (f.size > 800 * 1024) {
                            alert("Image over 800 KB — use a smaller one");
                            return;
                          }
                          const b64 = await fileToBase64(f);
                          mutate((d) => (d.testimonials[i].avatar = b64));
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {t.avatar && (
                      <button
                        type="button"
                        onClick={() => mutate((d) => (d.testimonials[i].avatar = undefined))}
                        className="text-xs text-muted hover:text-accent-ink"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-3">
              <AddButton label="Add testimonial" onClick={() => mutate((d) => d.testimonials.push(newTestimonial()))} />
            </div>
          </Section>
        )}

        {tab === "world" && (
          <Section title="My World" desc="Emoji or photo + caption cards scattered on the draggable canvas.">
            <Area label="Section intro" value={content.worldSub} onChange={(v) => mutate((d) => (d.worldSub = v))} rows={2} />
            <div className="mt-4 space-y-3">
              {content.world.map((w, i) => (
                <Card key={w.id} onRemove={() => mutate((d) => d.world.splice(i, 1))}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Emoji (used when no photo)" value={w.emo} onChange={(v) => mutate((d) => (d.world[i].emo = v))} />
                    <Field label="Caption" value={w.cap} onChange={(v) => mutate((d) => (d.world[i].cap = v))} />
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <NumberField label="X position (%)" value={w.x} onChange={(v) => mutate((d) => (d.world[i].x = v))} />
                    <NumberField label="Y position (%)" value={w.y} onChange={(v) => mutate((d) => (d.world[i].y = v))} />
                  </div>
                  <div className="mt-3 space-y-2">
                    <label className="block cursor-pointer rounded-lg border border-dashed border-line p-3 text-center text-sm text-ink-soft hover:border-ink hover:text-ink">
                      {w.img ? "Photo attached — click to replace" : "⬆ Upload photo (optional — replaces the emoji)"}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          if (f.size > 800 * 1024) {
                            alert("Image over 800 KB — use a smaller one");
                            return;
                          }
                          const b64 = await fileToBase64(f);
                          mutate((d) => (d.world[i].img = b64));
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {w.img && (
                      <button
                        type="button"
                        onClick={() => mutate((d) => delete d.world[i].img)}
                        className="text-xs text-muted hover:text-accent-ink"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-3">
              <AddButton label="Add item" onClick={() => mutate((d) => d.world.push(newWorldItem()))} />
            </div>
          </Section>
        )}

        {tab === "messages" && (
          <Section title="Messages" desc="Contact-form submissions from the site.">
            {!messages.length && <p className="text-sm text-ink-soft">No messages yet.</p>}
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className="glass-soft rounded-xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="font-medium">{m.name}</span>
                      <span className="ml-2 text-xs text-muted">{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                    <button onClick={() => deleteMessage(m.id)} className="text-muted hover:text-accent-ink" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <a href={`mailto:${m.email}`} className="text-xs text-accent-ink">
                    {m.email}
                  </a>
                  <p className="mt-2 text-sm text-ink-soft">{m.message}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        <div className="flex justify-end pb-16">
          <button
            onClick={save}
            disabled={status === "saving"}
            className="rounded-lg bg-ink px-6 py-3 text-sm text-bg hover:bg-accent hover:text-ink disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
