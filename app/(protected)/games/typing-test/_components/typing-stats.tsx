import { motion } from "framer-motion";
import { Timer, Eye, Star, TrendingUp } from "lucide-react";
import { Card } from "./typing-card";

interface TypingStatsProps {
  wpm: number; // Current WPM
  wordsTyped: number; // Total words typed
  highScore: number | null; // Personal best WPM
  rank?: number | null; // Global rank
}

export function TypingStats({ wpm, wordsTyped, highScore, rank }: TypingStatsProps) {
  const stats = [
    {
      label: "Current WPM",
      value: wpm, // Use the wpm prop directly
      icon: TrendingUp,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Words Typed",
      value: wordsTyped,
      icon: Timer,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Personal Best",
      value: highScore ?? "N/A",
      icon: Eye,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Global Rank",
      value: rank ? `#${rank}` : "N/A",
      icon: Star,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </motion.div>
  );
}