"use client";

import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Primary"
        className="glass fixed top-3.5 left-1/2 z-[60] flex max-w-[calc(100vw-20px)] -translate-x-1/2 items-center gap-1.5 rounded-full p-2"
      >
        <a
          href="#intro"
          className="shrink-0 rounded-full px-3.5 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-accent uppercase"
        >
          VV
        </a>

        <div className="hidden items-center gap-1.5 sm:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-full px-3.5 py-2 font-mono text-[11px] tracking-[0.08em] whitespace-nowrap text-ink-soft uppercase transition-colors hover:bg-[var(--amber-dim)] hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex shrink-0 items-center justify-center rounded-full px-3 py-2 text-[15px] text-ink sm:hidden"
        >
          {open ? "✕" : "☰"}
        </button>

        <ThemeToggle />
      </nav>

      {open && (
        <div className="glass fixed top-[68px] left-1/2 z-[59] flex w-[calc(100vw-20px)] max-w-[320px] -translate-x-1/2 flex-col gap-1 rounded-2xl p-2 sm:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-center font-mono text-xs tracking-[0.1em] text-ink-soft uppercase transition-colors hover:bg-[var(--amber-dim)] hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
