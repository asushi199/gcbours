"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type PhotoRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Soft veil lift over photos — scale + opacity, paper-archive feel. */
export function PhotoReveal({ children, className, delay = 0 }: PhotoRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
