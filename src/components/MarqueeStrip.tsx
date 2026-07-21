export default function MarqueeStrip({ text }: { text: string }) {
  const items = Array.from({ length: 10 });
  return (
    <div
      className="overflow-hidden border-y border-line bg-white/[0.02] py-3.5 whitespace-nowrap"
      aria-hidden="true"
    >
      <div className="motion-safe:animate-marquee inline-flex">
        {items.map((_, i) => (
          <span
            key={i}
            className="pr-11 text-[clamp(16px,2.2vw,26px)] font-black tracking-[0.14em] text-transparent uppercase opacity-70"
            style={{ WebkitTextStroke: "1px var(--muted)" }}
          >
            {text} <i className="px-4 text-accent not-italic" style={{ WebkitTextStroke: 0 }}>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}
