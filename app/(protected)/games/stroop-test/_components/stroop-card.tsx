import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface StroopCardProps {
  word: string;
  color: string;
}

export function StroopCard({ word, color }: StroopCardProps) {
  return (
    <Card className="p-8 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <h2 
          className="text-6xl font-bold"
          style={{ color: color }}
          aria-label={`The word ${word} displayed in ${color} color`}
        >
          {word}
        </h2>
      </motion.div>
    </Card>
  );
}

