"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Content } from "@/lib/content";
import { useDeckViewer } from "./DeckViewerContext";

function CaseCard({ p }: { p: Content["projects"][number] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-14% 0px" });
  const openDeck = useDeckViewer();
  const outcomes = p.outcomes?.length ? p.outcomes : p.outcome ? [p.outcome] : [];

  return (
    <motion.article
      ref={ref}
      className="case glass mt-6.5 rounded-[26px] p-6 transition-[border-color] hover:border-[rgba(255,183,3,0.5)] sm:p-13"
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,183,3,0.35)] bg-[rgba(255,183,3,0.08)] px-3.5 py-1.5 font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent">
        {p.status}
      </span>
      <h3 className="mt-4.5 mb-1.5 text-[clamp(22px,3.2vw,40px)] leading-tight font-extrabold tracking-tight">
        {p.title}
      </h3>
      <p className="max-w-[880px] text-[clamp(17px,2vw,24px)] leading-snug font-semibold tracking-tight">
        {p.description}
      </p>
      <div className="mt-7 grid grid-cols-1 gap-4.5 border-t border-line pt-6 sm:grid-cols-2 sm:gap-10">
        <div>
          <h4 className="mb-2.5 font-mono text-[11px] tracking-[0.2em] text-accent uppercase">Role</h4>
          <p className="text-[15px] text-ink-soft">{p.role}</p>
        </div>
        <div>
          <h4 className="mb-2.5 font-mono text-[11px] tracking-[0.2em] text-accent uppercase">Outcomes</h4>
          <ul className="grid gap-1.5 text-[15px] text-ink-soft">
            {outcomes.map((o, i) => (
              <li key={i}>
                <span className="text-accent">— </span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-5.5 flex flex-wrap gap-2">
        {p.tags.map((t) => (
          <span key={t} className="rounded-full border border-line px-3 py-1.5 font-mono text-[10px] tracking-[0.08em] text-ink-soft uppercase">
            {t}
          </span>
        ))}
      </div>
      {p.deck && (
        <div className="mt-6">
          <button
            onClick={() =>
              openDeck({ doc: p.deck, title: p.title, meta: p.deck?.type === "images" ? "Image deck" : "PDF deck" })
            }
            className="btn-amber inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 font-mono text-[13px] font-medium tracking-[0.06em] text-black uppercase"
          >
            ▶ View the slides
          </button>
        </div>
      )}
    </motion.article>
  );
}

export default function Projects({ content }: { content: Content }) {
  return (
    <section id="work" className="px-6 py-[clamp(70px,9vw,130px)] sm:px-16">
      <h2 className="flex flex-col text-[clamp(58px,13vw,190px)] leading-[1.05] font-black tracking-tight lowercase">
        <span className="text-transparent" style={{ WebkitTextStroke: "1.5px var(--ink)" }}>
          projects
        </span>
        <span>showcase</span>
      </h2>
      <div>
        {content.projects.map((p) => (
          <CaseCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
