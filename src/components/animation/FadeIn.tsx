"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function FadeIn({
  children,
  delay = 0,
  y = 8,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: keyof typeof motion;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[Tag] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
