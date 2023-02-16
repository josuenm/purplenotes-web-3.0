import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface PageAnimationProps {
  children: ReactNode | ReactNode[];
}

export function PageAnimation({ children }: PageAnimationProps) {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.route}
        transition={{ duration: 0.45 }}
        initial={{ translateX: "-100vw" }}
        animate={{ translateX: "0" }}
        exit={{ translateX: "200vw" }}
        style={{ overflow: "auto" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
