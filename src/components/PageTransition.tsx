import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useLocation } from "react-router-dom";
import { ReactNode } from "react";

const pageVariants = {
  initial: { opacity: 0.65, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0.78,
    transition: { duration: 0.1, ease: "easeIn" },
  },
} as const;

export const PageTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial={reduceMotion ? false : "initial"}
        animate="enter"
        exit={reduceMotion ? undefined : "exit"}
        style={{ width: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
