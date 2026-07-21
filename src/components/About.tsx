"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Content } from "@/lib/content";

type Token = { text: string; emphasis: boolean; space: boolean };

function tokenize(raw: string): Token[] {
  const parts = raw.split(/(\*[^*]+\*)/g).filter((p) => p.length);
  const tokens: Token[] = [];
  for (const part of parts) {
    const isEm = part.startsWith("*") && part.endsWith("*");
    const text = isEm ? part.slice(1, -1) : part;
    const words = text.split(/(\s+)/).filter((w) => w.length);
    for (const w of words) {
      tokens.push({ text: w, emphasis: isEm, space: /^\s+$/.test(w) });
    }
  }
  return tokens;
}

function BigStatement({ raw }: { raw: string }) {
  const tokens = tokenize(raw);
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-18% 0px" });
  let wordIndex = 0;

  return (
    <p
      ref={ref}
      className="max-w-[1000px] text-[clamp(26px,4vw,52px)] leading-[1.16] font-extrabold tracking-tight"
    >
      {tokens.map((t, i) => {
        if (t.space) return <span key={i}>{t.text}</span>;
        const idx = wordIndex++;
        const word = (
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={inView ? { y: 0 } : undefined}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.035 }}
          >
            {t.text}
          </motion.span>
        );
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            {t.emphasis ? <em className="not-italic text-accent">{word}</em> : word}
          </span>
        );
      })}
    </p>
  );
}

function Fact({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const [display, setDisplay] = useState(value);
  const match = value.match(/^(\d+)(.*)$/);

  useEffect(() => {
    if (!inView || !match) return;
    const end = Number(match[1]);
    const suffix = match[2];
    const controls = animate(0, end, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v) + suffix),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      className="glass rounded-[20px] p-7 transition-[border-color,transform] hover:-translate-y-1 hover:border-accent"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <div className="text-[clamp(44px,5.5vw,72px)] leading-none font-black tracking-tight text-accent">
        {display}
      </div>
      <div className="mt-2.5 text-sm text-ink-soft">{label}</div>
    </motion.div>
  );
}

export default function About({ content }: { content: Content }) {
  const { stats, aboutHeading, aboutBody } = content;

  return (
    <section id="usp" className="px-6 py-[clamp(70px,9vw,130px)] sm:px-16">
      <p className="mb-4 font-mono text-[11px] tracking-[0.22em] text-accent uppercase">About me</p>
      <BigStatement raw={aboutHeading} />
      <p className="mt-5.5 max-w-[760px] text-[clamp(16px,1.6vw,20px)] font-medium text-ink-soft">
        {aboutBody}
      </p>

      <p className="mt-15 mb-4 font-mono text-[11px] tracking-[0.22em] text-accent uppercase">Quick facts</p>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s, i) => (
          <Fact key={i} value={s.value} label={s.label} />
        ))}
      </div>
    </section>
  );
}
