import "server-only";
import { getSql, ensureSchema } from "./db";

export type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

// Read all contact-form submissions, newest first. Returns an empty list
// when there is no database configured, so the public form still works.
export async function listMessages(): Promise<Message[]> {
  const sql = getSql();
  if (!sql) return [];
  await ensureSchema();
  const rows = (await sql`
    SELECT id, name, email, message, created_at FROM messages ORDER BY created_at DESC
  `) as { id: number; name: string; email: string; message: string; created_at: string }[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    message: r.message,
    createdAt: r.created_at,
  }));
}

export async function addMessage(data: { name: string; email: string; message: string }): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  await ensureSchema();
  await sql`
    INSERT INTO messages (name, email, message) VALUES (${data.name}, ${data.email}, ${data.message})
  `;
}

export async function deleteMessage(id: number): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not configured");
  await sql`DELETE FROM messages WHERE id = ${id}`;
}
