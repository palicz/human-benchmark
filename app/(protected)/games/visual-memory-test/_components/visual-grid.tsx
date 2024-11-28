"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface VisualGridProps {
  sequence: number[];
  userSequence: number[];
  gameState: "ready" | "showing" | "input" | "gameover" | "success";
  onSquareClick: (index: number) => void;
  currentShowingIndex?: number;
}

export function VisualGrid({ 
  sequence, 
  userSequence, 
  gameState, 
  onSquareClick,
  currentShowingIndex 
}: VisualGridProps) {
  const [animatingSquares, setAnimatingSquares] = useState<{ [key: number]: boolean }>({});

  const activeStyles = [
    { gradient: 'radial-gradient(circle, rgb(59, 130, 246) 0%, rgb(37, 99, 235) 100%)', glow: '0 0 20px rgb(59 130 246 / 0.7)' },
    { gradient: 'radial-gradient(circle, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)', glow: '0 0 20px rgb(168 85 247 / 0.7)' },
    { gradient: 'radial-gradient(circle, rgb(34, 197, 94) 0%, rgb(22, 163, 74) 100%)', glow: '0 0 20px rgb(34 197 94 / 0.7)' },
    { gradient: 'radial-gradient(circle, rgb(234, 179, 8) 0%, rgb(202, 138, 4) 100%)', glow: '0 0 20px rgb(234 179 8 / 0.7)' },
    { gradient: 'radial-gradient(circle, rgb(236, 72, 153) 0%, rgb(219, 39, 119) 100%)', glow: '0 0 20px rgb(236 72 153 / 0.7)' },
    { gradient: 'radial-gradient(circle, rgb(6, 182, 212) 0%, rgb(8, 145, 178) 100%)', glow: '0 0 20px rgb(6 182 212 / 0.7)' },
    { gradient: 'radial-gradient(circle, rgb(239, 68, 68) 0%, rgb(220, 38, 38) 100%)', glow: '0 0 20px rgb(239 68 68 / 0.7)' },
    { gradient: 'radial-gradient(circle, rgb(249, 115, 22) 0%, rgb(234, 88, 12) 100%)', glow: '0 0 20px rgb(249 115 22 / 0.7)' },
    { gradient: 'radial-gradient(circle, rgb(16, 185, 129) 0%, rgb(5, 150, 105) 100%)', glow: '0 0 20px rgb(16 185 129 / 0.7)' },
  ];

  const isActive = (index: number) => {
    if (gameState === "showing") {
      return currentShowingIndex !== undefined && sequence[currentShowingIndex] === index;
    }
    return animatingSquares[index];
  };

  const handleClick = (index: number) => {
    if (gameState !== "input") return;
    
    setAnimatingSquares(prev => ({ ...prev, [index]: true }));
    
    setTimeout(() => {
      setAnimatingSquares(prev => ({ ...prev, [index]: false }));
    }, 200);
    
    onSquareClick(index);
  };

  return (
    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
      {Array.from({ length: 9 }).map((_, index) => (
        <motion.button
          key={index}
          onClick={() => handleClick(index)}
          className={`
            aspect-square rounded-lg transition-none
            ${gameState === "showing" ? "cursor-default" : "cursor-pointer"}
          `}
          initial={{
            background: 'radial-gradient(circle, hsl(var(--secondary)) 0%, hsl(var(--secondary)/0.7) 100%)',
            boxShadow: 'none'
          }}
          animate={{
            background: isActive(index) 
              ? activeStyles[index].gradient 
              : 'radial-gradient(circle, hsl(var(--secondary)) 0%, hsl(var(--secondary)/0.7) 100%)',
            boxShadow: isActive(index) 
              ? activeStyles[index].glow 
              : 'none',
            scale: isActive(index) ? 1.05 : 1,
          }}
          transition={{
            scale: { duration: 0.2 },
            background: { 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            },
            boxShadow: { 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }
          }}
        />
      ))}
    </div>
  );
}