"use client";

import { motion } from "framer-motion";
import { Brain, Zap, Timer, Trophy, Mail, Hash, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/app/(protected)/settings/_components/stats-card";
import { Badge } from "@/app/(protected)/settings/_components/stats-badge";
import { Separator } from "@/app/(protected)/settings/_components/stats-separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/(protected)/settings/_components/stats-tabs";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserScores {
    aimScore: number | null;
    typeScore: number | null;
    score: number | null;
    ranks: {
        aimRank?: number;
        typeRank?: number;
        memoryRank?: number;
    };
}

export default function ProfilePage() {
  const user = useCurrentUser();
  const [userScores, setUserScores] = useState<UserScores | null>(null);

  useEffect(() => {
    const fetchUserScores = async () => {
      try {
        const response = await fetch('/api/user-scores');
        if (response.ok) {
          const data = await response.json();
          setUserScores(data);
        }
      } catch (error) {
        console.error("Error fetching user scores:", error);
      }
    };

    if (user) {
      fetchUserScores();
    }
  }, [user]);

  if (!user) return null;

  const gameStats = [
    {
        name: "Aim Trainer",
        icon: Zap,
        score: userScores?.aimScore ? `${userScores.aimScore} points` : "No score yet",
        rank: userScores?.ranks.aimRank ? `#${userScores.ranks.aimRank}` : "N/A",
        color: "text-yellow-500",
    },
    {
        name: "Number Memory Test",
        icon: Brain,
        score: userScores?.score ? `${userScores.score} points` : "No score yet",
        rank: userScores?.ranks.memoryRank ? `#${userScores.ranks.memoryRank}` : "N/A",
        color: "text-blue-500",
    },
    {
        name: "Typing Test",
        icon: Timer,
        score: userScores?.typeScore ? `${userScores.typeScore} WPM` : "No score yet",
        rank: userScores?.ranks.typeRank ? `#${userScores.ranks.typeRank}` : "N/A",
        color: "text-green-500",
    },
];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="h-16" />
      <div className="w-full h-px bg-border" />

      <main className="py-8 bg-gradient-to-b from-background to-secondary/20 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Profile Header */}
          <div className="flex items-center gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="relative"
            >
                <Avatar className="w-24 h-24">
                    <AvatarImage 
                        src={user?.image || undefined} 
                        alt={user?.name || "Profile"} 
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500">
                        <span className="text-3xl font-bold text-white">
                            {user.name?.charAt(0)}
                        </span>
                    </AvatarFallback>
                </Avatar>
              {user.emailVerified && (
                <Badge className="absolute -bottom-2 -right-2 bg-green-500">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </motion.div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <div className="flex gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Game Stats */}
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="stats">Game Stats</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {gameStats.map((game, index) => (
                  <motion.div
                    key={game.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full bg-secondary ${game.color}`}>
                          <game.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{game.name}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-2xl font-bold">{game.score}</p>
                            <Badge variant="secondary" className="text-sm">
                              Rank {game.rank}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <Card className="p-6">
                <p className="text-muted-foreground">Game history coming soon...</p>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}