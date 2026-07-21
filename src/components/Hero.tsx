"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Content } from "@/lib/content";

export default function Hero({ content }: { content: Content }) {
  const { meta } = content;
  const firstName = meta.name.split(" ")[0];
  const city = meta.location.split(",")[0].trim();
  const reduced = useReducedMotion();

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 60]);
  const photoRotate = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -2]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -40]);

  return (
    <header
      ref={ref}
      id="intro"
      className="grid min-h-[100svh] gap-5 overflow-hidden px-6 pt-24 pb-12 sm:gap-14 sm:px-16 sm:pt-28 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-[110px] md:pb-12"
    >
      <div>
        <motion.h1
          style={{ y: titleY }}
          className="text-[clamp(72px,15vw,220px)] leading-[0.85] font-black tracking-tight"
          aria-label={`I'm ${firstName}, ${meta.role}`}
        >
          <span className="block overflow-hidden">
            <motion.span
              className="inline-block text-[0.42em] font-light text-ink-soft"
              initial={{ y: "115%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
            >
              I&apos;m
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="inline-block text-accent"
              initial={{ y: "115%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 1.74 }}
            >
              {firstName}
            </motion.span>
          </span>
        </motion.h1>

        <motion.p
          className="mt-5.5 text-[clamp(18px,2.2vw,28px)] font-bold tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 2.1 }}
        >
          {meta.role}
        </motion.p>
        <motion.p
          className="mt-2.5 max-w-[430px] text-[clamp(15px,1.4vw,17px)] text-ink-soft"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 2.2 }}
        >
          {meta.tagline}
        </motion.p>

        <motion.div
          className="mt-7.5 flex flex-wrap gap-3.5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 2.3 }}
        >
          <a
            href={`mailto:${meta.email}`}
            className="btn-amber inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 font-mono text-[13px] font-medium tracking-[0.06em] text-black uppercase"
          >
            Let&apos;s work together
          </a>
          {meta.resumeUrl && (
            <a
              href={meta.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-line px-7 py-3.5 font-mono text-[13px] tracking-[0.06em] text-ink uppercase hover:border-accent hover:text-accent"
            >
              Download resume
            </a>
          )}
        </motion.div>
      </div>

      <motion.div
        className="relative order-first w-[min(72vw,320px)] justify-self-center md:order-none md:w-full md:max-w-[420px]"
        style={{ y: photoY, rotate: photoRotate }}
        initial={{ opacity: 0, scale: 0.88, rotate: 3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 1.9 }}
      >
        <motion.div
          animate={reduced ? undefined : { y: [-12, 12] }}
          transition={{ duration: 3.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 3.2 }}
        >
          <span className="absolute -top-6.5 right-1.5 font-mono text-[11px] tracking-[0.06em] text-ink-soft">
            currently building <i className="not-italic text-accent">↘</i>
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/vishnu-portrait.jpg"
            alt="Pixel-art portrait of Vishnu Vijay"
            className="w-full rounded-3xl border border-line"
          />
          <span className="absolute -bottom-6.5 left-1.5 font-mono text-[11px] tracking-[0.06em] text-ink-soft">
            <i className="not-italic text-accent">↖</i> and overthinking, from {city}
          </span>
        </motion.div>
      </motion.div>
    </header>
  );
}
