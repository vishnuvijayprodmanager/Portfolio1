"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the theme the inline pre-hydration script already applied to <html>
    setTheme((document.documentElement.dataset.theme as "light" | "dark") || "light");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("vv_theme", next);
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="shrink-0 rounded-full px-2.5 py-1.5 text-[15px] text-ink"
    >
      ◐
    </button>
  );
}
