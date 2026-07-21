"use client";

import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[200] h-[3px] bg-accent"
      style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%", width: "100%" }}
    />
  );
}
