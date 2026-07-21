import "server-only";
import { neon } from "@neondatabase/serverless";

// Lazily create the SQL client so the app still builds/renders without a
// database (the data layer falls back to seeded defaults in that case).
let sqlClient: ReturnType<typeof neon> | null = null;

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!sqlClient) sqlClient = neon(url);
  return sqlClient;
}

// Create the content and messages tables on demand. Cheap and idempotent.
export async function ensureSchema() {
  const sql = getSql();
  if (!sql) return;
  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}
