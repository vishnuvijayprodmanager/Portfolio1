"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, animate } from "framer-motion";

export default function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reduced-motion preference is only known post-mount
      setDone(true);
      return;
    }
    document.body.style.overflow = "hidden";
    const controls = animate(0, 100, {
      duration: 1.4,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        setTimeout(() => {
          setDone(true);
          document.body.style.overflow = "";
        }, 300);
      },
    });
    return () => controls.stop();
  }, [reduced]);

  // Always render the same node so server/client hydration never disagrees on
  // tree shape — visibility is driven entirely by animated style, and once
  // "done" this sits off-screen with pointer-events disabled, harmlessly.
  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-4 bg-black text-[#f5f2ea]"
      initial={false}
      animate={done ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      style={{ pointerEvents: done ? "none" : "auto" }}
    >
      <div className="overflow-hidden">
        <motion.div
          className="text-[clamp(28px,5vw,52px)] font-black tracking-tight"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          Vishnu&nbsp;Vijay
        </motion.div>
      </div>
      <div className="h-[2px] w-[min(260px,60vw)] bg-white/15">
        <div className="h-full bg-accent" style={{ width: `${count}%` }} />
      </div>
      <div className="font-mono text-xs tracking-[0.2em] text-accent">{count}%</div>
    </motion.div>
  );
}
