import { motion } from "framer-motion";
import { Crosshair, Trophy, Star, Clock } from 'lucide-react';
import { Card } from "@/app/(protected)/games/aim-trainer/_components/aim-card";

interface AimStatsProps {
  score: number;
  highScore: number | null;
  timeLeft: number;
  rank?: number;
}

export function AimStats({ score, highScore, timeLeft, rank }: AimStatsProps) {
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
      icon: Crosshair,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Personal Best",
      value: highScore ?? "N/A",
      icon: Trophy,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
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
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </motion.div>
  );
}

