"use client";

import { useEffect, useRef, useState } from "react";
import { DocRef } from "@/lib/content";

function Slide({ children, index, total }: { children: React.ReactNode; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`w-[min(960px,100%)] shrink-0 overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-600 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {children}
      <div className="border-t border-line px-3.5 py-2 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
        Slide {index} / {total}
      </div>
    </div>
  );
}

export default function DeckViewer({
  open,
  doc,
  title,
  meta,
  onClose,
}: {
  open: boolean;
  doc: DocRef | null | undefined;
  title: string;
  meta?: string;
  onClose: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [pages, setPages] = useState<{ kind: "canvas" | "img"; src?: string; canvas?: HTMLCanvasElement }[] | null>(
    null
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset derived state whenever the target doc changes
    setPages(null);
    setError(false);
    setProgress(0);
    if (!doc) return;

    let cancelled = false;

    async function render() {
      if (doc!.type === "images") {
        if (!cancelled) setPages(doc!.type === "images" ? doc!.pages.map((src) => ({ kind: "img", src })) : []);
        return;
      }
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        let bytes: Uint8Array;
        if (doc!.type === "pdf-url") {
          const resp = await fetch(doc!.url);
          bytes = new Uint8Array(await resp.arrayBuffer());
        } else {
          const bin = atob(doc!.data);
          bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        }

        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        // Capped lower than device pixel ratio would suggest — on image-heavy
        // decks a 2-2.5x canvas made every page render take several seconds
        // (worse on mobile), which is the "slides are slow to open" symptom.
        // 1.5x is still crisp for a case-study deck viewed on screen.
        const scale = Math.min(1.5, window.devicePixelRatio || 1);

        // Render every page concurrently instead of one at a time — wall-clock
        // time becomes "slowest page" instead of "sum of every page". A single
        // slow or failing page is skipped rather than aborting the whole deck.
        const results = await Promise.allSettled(
          Array.from({ length: pdf.numPages }, async (_, i) => {
            const page = await pdf.getPage(i + 1);
            const vp = page.getViewport({ scale });
            const canvas = document.createElement("canvas");
            canvas.width = vp.width;
            canvas.height = vp.height;
            canvas.className = "w-full h-auto block";
            const renderTask = page.render({ canvas, viewport: vp });
            await Promise.race([
              renderTask.promise,
              new Promise((_, reject) => setTimeout(() => reject(new Error("PDF page render timed out")), 20000)),
            ]);
            return canvas;
          })
        );

        if (cancelled) return;
        const rendered = results
          .filter((r): r is PromiseFulfilledResult<HTMLCanvasElement> => r.status === "fulfilled")
          .map((r) => ({ kind: "canvas" as const, canvas: r.value }));
        results
          .filter((r) => r.status === "rejected")
          .forEach((r) => console.error("DeckViewer page render failed:", (r as PromiseRejectedResult).reason));

        if (!rendered.length) {
          setError(true);
        } else {
          setPages(rendered);
        }
      } catch (err) {
        console.error("DeckViewer render failed:", err);
        if (!cancelled) setError(true);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [open, doc]);

  function onScroll() {
    const el = bodyRef.current;
    if (!el) return;
    const m = el.scrollHeight - el.clientHeight;
    setProgress(m > 0 ? (el.scrollTop / m) * 100 : 0);
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex-col bg-bg ${open ? "flex" : "hidden"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Slide deck viewer"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3.5 sm:px-8">
        <div>
          <h3 className="text-base font-extrabold">{title}</h3>
          {meta && (
            <span className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">{meta}</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-full bg-accent px-4.5 py-2 font-mono text-xs font-medium tracking-[0.08em] text-black uppercase"
        >
          Close ✕
        </button>
      </div>
      <div className="h-[3px] bg-line">
        <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
      </div>
      <div
        ref={bodyRef}
        onScroll={onScroll}
        className="flex flex-1 flex-col items-center gap-4 overflow-y-auto p-4 sm:gap-7 sm:p-10"
      >
        {!doc && <p className="mt-[10vh] text-center font-mono text-sm text-muted">Nothing uploaded here yet.</p>}
        {doc && error && (
          <p className="mt-[10vh] px-6 text-center font-mono text-sm text-muted">
            Couldn&apos;t render this document. Try re-uploading it as a PDF from the admin portal.
          </p>
        )}
        {doc && !error && !pages && <p className="mt-[10vh] font-mono text-sm text-muted">Loading…</p>}
        {pages &&
          pages.map((p, i) => (
            <Slide key={i} index={i + 1} total={pages.length}>
              {p.kind === "img" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.src} alt={`${title} — page ${i + 1}`} className="block h-auto w-full" />
              ) : (
                <div
                  ref={(node) => {
                    if (node && p.canvas && !node.contains(p.canvas)) {
                      node.innerHTML = "";
                      node.appendChild(p.canvas);
                    }
                  }}
                />
              )}
            </Slide>
          ))}
      </div>
    </div>
  );
}
