"use client";

import { useEffect, useRef } from "react";
import { Content } from "@/lib/content";
import { renderHighlighted } from "./Highlighted";

type Drag =
  | { type: "pan"; sx: number; sy: number; ox: number; oy: number }
  | { type: "item"; el: HTMLElement; sx: number; sy: number; ox: number; oy: number };

export default function MyWorld({ content }: { content: Content }) {
  const { world, worldSub } = content;
  const worldRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const worldEl = worldRef.current;
    const innerEl = innerRef.current;
    if (!worldEl || !innerEl) return;

    const pan = { x: 0, y: 0 };
    let drag: Drag | null = null;

    function clampPan() {
      const w = worldEl!.clientWidth;
      const h = worldEl!.clientHeight;
      pan.x = Math.max(-w * 0.6, Math.min(w * 0.6, pan.x));
      pan.y = Math.max(-h * 0.6, Math.min(h * 0.6, pan.y));
    }

    function onDown(e: PointerEvent) {
      const item = (e.target as HTMLElement).closest<HTMLElement>(".witem");
      worldEl!.setPointerCapture(e.pointerId);
      if (item) {
        drag = { type: "item", el: item, sx: e.clientX, sy: e.clientY, ox: item.offsetLeft, oy: item.offsetTop };
      } else {
        drag = { type: "pan", sx: e.clientX, sy: e.clientY, ox: pan.x, oy: pan.y };
        worldEl!.classList.add("cursor-grabbing");
      }
    }
    function onMove(e: PointerEvent) {
      if (!drag) return;
      const dx = e.clientX - drag.sx;
      const dy = e.clientY - drag.sy;
      if (drag.type === "pan") {
        pan.x = drag.ox + dx;
        pan.y = drag.oy + dy;
        clampPan();
        innerEl!.style.transform = `translate(${pan.x}px,${pan.y}px)`;
      } else {
        drag.el.style.left = `${drag.ox + dx}px`;
        drag.el.style.top = `${drag.oy + dy}px`;
      }
    }
    function onEnd() {
      worldEl!.classList.remove("cursor-grabbing");
      drag = null;
    }

    worldEl.addEventListener("pointerdown", onDown);
    worldEl.addEventListener("pointermove", onMove);
    worldEl.addEventListener("pointerup", onEnd);
    worldEl.addEventListener("pointercancel", onEnd);
    return () => {
      worldEl.removeEventListener("pointerdown", onDown);
      worldEl.removeEventListener("pointermove", onMove);
      worldEl.removeEventListener("pointerup", onEnd);
      worldEl.removeEventListener("pointercancel", onEnd);
    };
  }, [world]);

  return (
    <section id="canvas" className="px-6 py-[clamp(70px,9vw,130px)] sm:px-16">
      <h2 className="flex flex-col text-[clamp(58px,13vw,190px)] leading-[1.05] font-black tracking-tight lowercase">
        <span className="text-transparent" style={{ WebkitTextStroke: "1.5px var(--ink)" }}>
          my
        </span>
        <span>world</span>
      </h2>
      <p className="mt-4.5 text-ink-soft">{renderHighlighted(worldSub)}</p>
      <p className="mt-2.5 font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
        Hold and drag to move around the canvas
      </p>

      <div
        ref={worldRef}
        className="world-grid relative mt-8.5 h-[min(72vh,640px)] cursor-grab touch-none overflow-hidden rounded-[26px] border border-line"
      >
        <div ref={innerRef} className="absolute inset-0 will-change-transform">
          {world.map((w) => (
            <div
              key={w.id}
              className="witem glass absolute w-[132px] rounded-[18px] p-3.5 text-center transition-[border-color] select-none hover:border-accent sm:w-[170px]"
              style={{ left: `${w.x}%`, top: `${w.y}%` }}
            >
              {w.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={w.img} alt={w.cap} loading="lazy" decoding="async" className="w-full rounded-xl" />
              ) : (
                <div className="text-[36px] leading-tight sm:text-[46px]">{w.emo}</div>
              )}
              <div className="mt-2 text-sm font-bold sm:text-[14px]">{w.cap}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
