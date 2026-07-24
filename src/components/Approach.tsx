"use client";

import { motion } from "framer-motion";
import { Content } from "@/lib/content";
import { renderHighlighted } from "./Highlighted";

export default function Approach({ content }: { content: Content }) {
  const { approach, approachSub } = content;

  return (
    <section id="approach" className="px-6 py-[clamp(70px,9vw,130px)] sm:px-16">
      <h2 className="flex flex-col text-[clamp(58px,13vw,190px)] leading-[1.05] font-black tracking-tight lowercase">
        <span className="text-transparent" style={{ WebkitTextStroke: "1.5px var(--ink)" }}>
          my
        </span>
        <span>approach</span>
      </h2>
      {approachSub && (
        <p className="mt-5.5 max-w-[560px] text-[clamp(16px,1.8vw,22px)] font-medium text-ink-soft">
          {renderHighlighted(approachSub)}
        </p>
      )}
      <div className="mt-12 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {approach.map((a, i) => (
          <motion.div
            key={i}
            className="glass rounded-[20px] p-7 transition-[transform,border-color] hover:-translate-y-1.5 hover:border-accent"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: (i % 3) * 0.06 }}
          >
            <div className="font-mono text-xs tracking-[0.14em] text-accent">
              0{i + 1}
            </div>
            <h3 className="mt-3 mb-2 text-lg font-extrabold tracking-tight">{a.title}</h3>
            <p className="text-[15px] text-ink-soft">{renderHighlighted(a.description)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
