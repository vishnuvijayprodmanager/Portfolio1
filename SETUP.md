# Vishnu Vijay — Portfolio + Admin

A single-page portfolio (Next.js 16 + Tailwind) with an admin panel at `/admin`
where you can edit every section. Content is stored as JSON in a Neon Postgres
database; with no database it falls back to the seeded content so the site
always renders.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000  (or the port shown)
```

- Public site: `/`
- Admin: `/admin` (password from `ADMIN_PASSWORD`, default `admin` locally)

Without `DATABASE_URL`, the admin loads but **saving is disabled**. Add a Neon
URL to `.env.local` to enable saving locally.

## Environment variables

| Variable         | What it is                                              |
| ---------------- | ------------------------------------------------------- |
| `DATABASE_URL`   | Neon Postgres connection string                         |
| `ADMIN_PASSWORD` | Password to log into `/admin`                           |
| `SESSION_SECRET` | Long random string used to sign the admin login cookie  |

See `.env.example`.

## Deploy to Vercel (free)

1. **Push this folder to a GitHub repo.**
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. **Add a database:** Project → **Storage** → **Create → Neon (Postgres)**.
   Vercel auto-adds `DATABASE_URL` to the project's env vars.
4. **Add the other env vars** (Project → Settings → Environment Variables):
   - `ADMIN_PASSWORD` = a password only you know
   - `SESSION_SECRET` = run
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
     and paste the result
5. **Deploy.** The content table is created automatically on first load.
6. Visit `/admin`, log in, edit anything, hit **Save** — changes go live instantly.

> The database table (`site_content`) is created on demand the first time the
> app talks to the database. No migration step needed.

## Your resume

The hero "Download resume" button points at `/resume/VishnuVijay_Resume.pdf`.
Drop your PDF into `public/resume/` with that filename (or change the Resume URL
in the admin Profile section).

## Editing content

Everything on the page is editable from `/admin`, organized into tabs:

- **Content** — profile, social links, quick facts, About text
- **Projects & Decks** — case studies, outcomes, tags, and an optional slide-deck
  upload (PDF or images) that opens in the on-site viewer
- **Library** — case-study/PRD/guesstimate documents, each with its own file upload
- **Approach** — your working principles
- **Testimonials** — quotes, with optional photo and LinkedIn link
- **My World** — the draggable-canvas items (emoji or photo + caption)
- **Messages** — contact-form submissions, with delete

Add, edit, or delete items in any tab, then hit **Save changes** — it saves
everything across all tabs at once. Uploaded decks/docs/photos are stored as
part of the same content record (no separate file storage needed).
