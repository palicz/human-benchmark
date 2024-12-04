// CardDisplay.tsx
import React from 'react';
import { motion } from "framer-motion";
import { Card } from './stroop-card'; // Adjust the import based on your file structure

interface CardDisplayProps {
  word: string;
  color: string;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ word, color }) => {
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
};

export default CardDisplay;

