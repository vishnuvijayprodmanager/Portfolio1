// Shared *phrase* → amber highlight pill renderer, used across every section
// so the same admin-editable markup works consistently everywhere prose is
// shown (not just the About heading).
export function renderHighlighted(raw: string) {
  const parts = raw.split(/(\*[^*]+\*)/g).filter((p) => p.length);
  return parts.map((part, i) => {
    const isEm = part.startsWith("*") && part.endsWith("*");
    if (!isEm) return <span key={i}>{part}</span>;
    return (
      <span
        key={i}
        className="rounded-lg bg-accent px-1.5 py-0.5 text-black"
        style={{ boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}
      >
        {part.slice(1, -1)}
      </span>
    );
  });
}
