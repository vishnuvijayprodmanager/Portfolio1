"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Content } from "@/lib/content";
import { useDeckViewer } from "./DeckViewerContext";

export default function Library({ content }: { content: Content }) {
  const { library, librarySub } = content;
  const [filter, setFilter] = useState("All");
  const openDeck = useDeckViewer();

  const cats = useMemo(() => ["All", ...Array.from(new Set(library.map((d) => d.cat)))], [library]);
  const items = filter === "All" ? library : library.filter((d) => d.cat === filter);

  return (
    <section id="library" className="px-6 py-[clamp(70px,9vw,130px)] sm:px-16">
      <h2 className="flex flex-col text-[clamp(58px,13vw,190px)] leading-[1.05] font-black tracking-tight lowercase">
        <span className="text-transparent" style={{ WebkitTextStroke: "1.5px var(--ink)" }}>
          the
        </span>
        <span>library</span>
      </h2>
      <p className="mt-5.5 max-w-[560px] text-[clamp(16px,1.8vw,22px)] font-medium text-ink-soft">{librarySub}</p>

      <div className="mt-8.5 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4.5 py-2.5 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors ${
              filter === c
                ? "border-accent bg-accent font-medium text-black"
                : "border-line text-ink-soft hover:border-accent hover:text-accent"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {items.length ? (
        <div className="mt-6.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <motion.div
              key={d.id}
              className={`glass flex flex-col gap-3 rounded-[20px] p-6.5 transition-[transform,border-color] hover:-translate-y-1.5 hover:border-accent ${
                d.doc ? "" : "opacity-65"
              }`}
              initial={{ opacity: 0, y: 26, scale: 0.97 }}
              whileInView={{ opacity: d.doc ? 1 : 0.65, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="w-fit rounded-full border border-[rgba(255,183,3,0.35)] bg-[rgba(255,183,3,0.08)] px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-accent uppercase">
                {d.cat}
              </span>
              <h3 className="text-[19px] leading-tight font-extrabold tracking-tight">{d.title}</h3>
              <p className="flex-1 text-sm text-ink-soft">{d.desc}</p>
              <div className="flex items-center justify-between gap-2.5 border-t border-line pt-3.5">
                <span className="font-mono text-[10px] tracking-[0.1em] text-ink-soft uppercase">
                  {d.doc ? (d.doc.type === "images" ? "Slides · view inline" : "PDF · view inline") : "Coming soon"}
                </span>
                {d.doc && (
                  <button
                    onClick={() =>
                      openDeck({
                        doc: d.doc,
                        title: d.title,
                        meta: `${d.cat}${d.doc?.type === "images" ? " · slides" : " · PDF"}`,
                      })
                    }
                    className="rounded-full bg-accent px-4 py-2 font-mono text-[11px] font-medium tracking-[0.08em] text-black uppercase"
                  >
                    Open ↗
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="mt-7.5 font-mono text-xs tracking-[0.08em] text-ink-soft">Nothing on this shelf yet.</p>
      )}
    </section>
  );
}
