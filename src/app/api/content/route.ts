import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";
import { Content } from "@/lib/content";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data: Content;
  try {
    data = (await req.json()) as Content;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!data?.meta?.name) {
    return NextResponse.json({ error: "Missing required content" }, { status: 400 });
  }

  try {
    await saveContent(data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("saveContent failed:", err);
    return NextResponse.json(
      { error: "Could not save. Is DATABASE_URL configured?" },
      { status: 500 }
    );
  }
}
