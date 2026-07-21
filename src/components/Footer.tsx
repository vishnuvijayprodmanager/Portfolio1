import { Content } from "@/lib/content";

export default function Footer({ content }: { content: Content }) {
  const year = new Date().getFullYear();
  return (
    <footer className="flex flex-wrap justify-between gap-3.5 border-t border-line px-6 py-6.5 font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase sm:px-16">
      <span>
        © {year} {content.meta.name}
      </span>
      <span>
        {content.meta.role} · <a href="/admin" className="hover:text-accent">Admin</a>
      </span>
    </footer>
  );
}
