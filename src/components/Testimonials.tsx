"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame, useReducedMotion } from "framer-motion";
import { Content } from "@/lib/content";
import { renderHighlighted } from "./Highlighted";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ReviewCard({ t }: { t: Content["testimonials"][number] }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = t.quote.length > 220;
  const short = t.quote.slice(0, 190).replace(/\n\n/g, " ") + "…";
  const relLine = [t.role, t.company].filter(Boolean).join(" · ");

  return (
    <div className="review glass w-[min(380px,82vw)] shrink-0 rounded-[22px] p-7 transition-[border-color] select-none hover:border-accent">
      <div className="mb-3.5 flex items-center gap-3.5">
        {t.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.avatar}
            alt={t.name}
            loading="lazy"
            decoding="async"
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent bg-[var(--amber-dim)] text-[17px] font-extrabold text-accent">
            {initials(t.name)}
          </div>
        )}
        <div>
          <h3 className="text-base font-extrabold">
            {t.link ? (
              <a href={t.link} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                {t.name}
              </a>
            ) : (
              t.name
            )}
          </h3>
          <div className="text-[12.5px] leading-snug text-ink-soft">{relLine}</div>
        </div>
      </div>
      <blockquote className="text-[14.5px] leading-relaxed text-ink-soft before:mr-0.5 before:font-black before:text-accent before:content-['“']">
        {isLong && !expanded ? (
          <>
            {renderHighlighted(short)}{" "}
            <button
              onClick={() => setExpanded(true)}
              className="font-mono text-[11px] tracking-[0.06em] text-accent uppercase underline underline-offset-2"
            >
              Read more
            </button>
          </>
        ) : (
          <>
            {t.quote.split("\n\n").map((p, i) => (
              <span key={i}>
                {i > 0 && (
                  <>
                    <br />
                    <br />
                  </>
                )}
                {renderHighlighted(p)}
              </span>
            ))}
            {isLong && (
              <>
                {" "}
                <button
                  onClick={() => setExpanded(false)}
                  className="font-mono text-[11px] tracking-[0.06em] text-accent uppercase underline underline-offset-2"
                >
                  Show less
                </button>
              </>
            )}
          </>
        )}
      </blockquote>
    </div>
  );
}

export default function Testimonials({ content }: { content: Content }) {
  const { testimonials, testimonialsSub } = content;
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const vx = useRef(0);
  const half = useRef(0);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartVal = useRef(0);
  const paused = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    function measure() {
      half.current = (trackRef.current?.scrollWidth || 0) / 2;
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [testimonials]);

  function wrap() {
    const h = half.current;
    if (h <= 0) return;
    let val = x.get();
    if (val <= -h) val += h;
    if (val > 0) val -= h;
    x.set(val);
  }

  useAnimationFrame(() => {
    if (!dragging.current) {
      vx.current *= 0.94;
      const drift = reduced || paused.current ? 0 : -0.55;
      x.set(x.get() + vx.current + (Math.abs(vx.current) > 0.4 ? 0 : drift));
      wrap();
    }
  });

  function onPointerDown(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest("button,a")) return;
    dragging.current = true;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartVal.current = x.get();
    vx.current = 0;
    railRef.current?.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - dragStartX.current;
    const nx = dragStartVal.current + dx;
    vx.current = nx - x.get();
    x.set(nx);
    wrap();
  }
  function onPointerUp() {
    dragging.current = false;
    setIsDragging(false);
  }

  const doubled = [...testimonials, ...testimonials];

  return (
    <section id="reviews" className="px-6 py-[clamp(70px,9vw,130px)] sm:px-16">
      <h2 className="flex flex-col text-[clamp(40px,8vw,120px)] leading-[1.05] font-black tracking-tight lowercase">
        <span>don&apos;t just take</span>
        <span className="text-transparent" style={{ WebkitTextStroke: "1.5px var(--ink)" }}>
          my word
        </span>
      </h2>
      {testimonialsSub && (
        <p className="mt-5.5 max-w-[560px] text-[clamp(16px,1.8vw,22px)] font-medium text-ink-soft">
          {renderHighlighted(testimonialsSub)}
        </p>
      )}

      <div
        ref={railRef}
        className={`mt-12 -mx-6 overflow-hidden py-2 pb-4.5 sm:-mx-16 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        <motion.div
          ref={trackRef}
          className="flex w-max gap-4 px-6 sm:px-16"
          style={{ x }}
        >
          {doubled.map((t, i) => (
            <ReviewCard key={i} t={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
