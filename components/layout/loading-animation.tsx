"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain } from "lucide-react";
import { useLoading } from "@/hooks/use-loading";

export function LoadingAnimation() {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-primary"
            >
              <Brain className="w-16 h-16" />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(var(--primary), 0)",
                  "0 0 0 20px rgba(var(--primary), 0.1)",
                  "0 0 0 40px rgba(var(--primary), 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}