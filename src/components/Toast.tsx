"use client";

import { useCallback, useRef, useState } from "react";

export function useToast() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((m: string) => {
    setMsg(m);
    setShow(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 2400);
  }, []);

  const ToastEl = (
    <div
      className={`fixed bottom-6 left-1/2 z-[500] -translate-x-1/2 rounded-full bg-accent px-6 py-3 font-mono text-xs font-medium text-black transition-transform duration-400 ${
        show ? "translate-y-0" : "translate-y-20"
      }`}
    >
      {msg}
    </div>
  );

  return { toast, ToastEl };
}
