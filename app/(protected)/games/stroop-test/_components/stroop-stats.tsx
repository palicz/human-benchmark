import { motion } from "framer-motion";
import { Eye, Palette, Star, Clock } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface StroopStatsProps {
  score: number;
  highScore: number | null;
  timeLeft: number;
  rank?: number;
}

export function StroopStats({ score, highScore, timeLeft, rank }: StroopStatsProps) {
  const stats = [
    {
      label: "Time Left",
      value: `${timeLeft}s`,
      icon: Clock,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Current Score",
      value: score,
      icon: Palette,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
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

