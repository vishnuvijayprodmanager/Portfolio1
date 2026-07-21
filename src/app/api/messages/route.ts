import { NextResponse } from "next/server";
import { addMessage, deleteMessage } from "@/lib/messages";
import { isAuthenticated } from "@/lib/auth";

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing name, email, or message" }, { status: 400 });
  }

  try {
    await addMessage({ name, email, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("addMessage failed:", err);
    return NextResponse.json(
      { error: "Could not send. Is DATABASE_URL configured?" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await deleteMessage(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("deleteMessage failed:", err);
    return NextResponse.json({ error: "Could not delete" }, { status: 500 });
  }
}
