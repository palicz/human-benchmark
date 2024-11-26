import { motion } from "framer-motion";
import { Brain, Trophy, Star, TrendingUp } from "lucide-react";
import { Card } from "./memory-card";

interface MemoryStatsProps {
  score: number;
  highScore: number | null;
  level: number;
  rank?: number;
}

export function MemoryStats({ score, highScore, level, rank }: MemoryStatsProps) {
  const stats = [
    {
      label: "Current Level",
      value: level,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Current Score",
      value: score,
      icon: Brain,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Personal Best",
      value: highScore ?? "N/A",
      icon: Trophy,
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