import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getContent } from "@/lib/data";
import { listMessages } from "@/lib/messages";
import Editor from "@/components/admin/Editor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  const [content, messages] = await Promise.all([getContent(), listMessages()]);
  return (
    <Editor initial={content} initialMessages={messages} dbConfigured={!!process.env.DATABASE_URL} />
  );
}
