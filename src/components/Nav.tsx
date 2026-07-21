import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#usp", label: "About" },
  { href: "#work", label: "Projects" },
  { href: "#library", label: "Library" },
  { href: "#approach", label: "My Approach" },
  { href: "#reviews", label: "Testimonials" },
  { href: "#canvas", label: "My World" },
];

export default function Nav() {
  return (
    <nav
      aria-label="Primary"
      className="glass fixed top-3.5 left-1/2 z-[60] flex max-w-[calc(100vw-20px)] -translate-x-1/2 items-center gap-1.5 overflow-x-auto rounded-full p-2 sm:gap-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <a
        href="#intro"
        className="shrink-0 rounded-full px-3.5 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-accent uppercase"
      >
        VV
      </a>
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="shrink-0 rounded-full px-2.5 py-1.5 font-mono text-[10px] tracking-[0.08em] whitespace-nowrap text-ink-soft uppercase transition-colors hover:bg-[var(--amber-dim)] hover:text-ink sm:px-3.5 sm:py-2 sm:text-[11px]"
        >
          {l.label}
        </a>
      ))}
      <ThemeToggle />
    </nav>
  );
}
