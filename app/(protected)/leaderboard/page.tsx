"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Brain, Timer, Eye, Trophy, Search, Medal, Crown, Star, Crosshair, Palette, Zap} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Input } from "@/app/(protected)/leaderboard/_components/leaderboard-input";
import { Card } from "@/app/(protected)/leaderboard/_components/leaderboard-card";
import { Badge } from "@/app/(protected)/leaderboard/_components/leaderboard-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/(protected)/leaderboard/_components/leaderboard-tabs";

interface Score {
  id: string;
  playerName: string;
  aimScore: number | null;
  typeScore: number | null;
  score: number | null;
  createdAt: string;
}

const games = [
  {
    id: "aim-trainer",
    name: "Aim Trainer",
    icon: Crosshair,
    color: "text-yellow-500",
    gradient: "from-yellow-500 to-orange-500",
    scoreKey: "aimScore",
    scoreFormat: (score: number) => `${score} points`,
  },
  {
    id: "number-memory",
    name: "Number Memory",
    icon: Brain,
    color: "text-blue-500",
    gradient: "from-blue-500 to-indigo-500",
    scoreKey: "score",
    scoreFormat: (score: number) => `${score} points`,
  },
  {
    id: "typing-test",
    name: "Typing Test",
    icon: Timer,
    color: "text-green-500",
    gradient: "from-green-500 to-emerald-500",
    scoreKey: "typeScore",
    scoreFormat: (score: number) => `${score} WPM`,
  },
  {
    id: "stroop-test",
    name: "Stroop Test",
    icon: Palette,
    color: "text-red-500",
    gradient: "from-red-500 to-orange-500",
    scoreKey: "stroopScore",
    scoreFormat: (score: number) => `${score} points`,
  },
  {
    id: "reaction-time",
    name: "Reaction Test",
    icon: Zap,
    color: "text-cyan-500",
    gradient: "from-cyan-500 to-blue-500",
    scoreKey: "reactionScore",
    scoreFormat: (score: number) => `${score} ms`,
  },
  {
    id: "visual-memory-test",
    name: "Visual Memory Test",
    icon: Eye,
    color: "text-purple-500",
    gradient: "from-purple-500 to-pink-500",
    scoreKey: "visualScore",
    scoreFormat: (score: number) => `${score} points`,
  },
];

const generateFloatingIcons = () => {
  const positions = [
    { x: 15, y: 25 }, { x: 35, y: 45 }, { x: 55, y: 15 }, 
    { x: 75, y: 65 }, { x: 25, y: 85 }, { x: 45, y: 35 },
    { x: 65, y: 75 }, { x: 85, y: 25 }, { x: 20, y: 55 },
    { x: 40, y: 15 }, { x: 60, y: 85 }, { x: 80, y: 45 },
    { x: 30, y: 65 }, { x: 50, y: 35 }, { x: 70, y: 95 }
  ];

  return positions.map((pos, i) => ({
    icon: [Brain, Crosshair, Timer, Eye][i % 4],
    initialX: pos.x,
    initialY: pos.y,
    duration: 15 + (i * 1.5),
    delay: -1 * (i * 1.3),
  }));
};

const floatingIcons = generateFloatingIcons();

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState(games[0].id);
  const [isLoading, setIsLoading] = useState(true);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [gameScores, setGameScores] = useState<{[key: string]: any[]}>({});
  const [error, setError] = useState<string | null>(null);

  const fetchGameScores = useCallback(async (gameId: string) => {
    try {
      setIsTabLoading(true);
      const response = await fetch(`/api/scores?game=${gameId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      
      const game = games.find(g => g.id === gameId);
      if (!game) return;
      let processedScores;
      if(gameId!='reaction-time'){
       processedScores = data
        .filter((score: Score) => score[game.scoreKey as keyof Score] !== null)
        .sort((a: Score, b: Score) => {
          const scoreA = a[game.scoreKey as keyof Score] as number;
          const scoreB = b[game.scoreKey as keyof Score] as number;
          return scoreB - scoreA;
        })
        .map((score: Score, index: number) => ({
          rank: index + 1,
          username: score.playerName,
          score: game.scoreFormat(score[game.scoreKey as keyof Score] as number),
          date: new Date(score.createdAt).toLocaleDateString(),
          change: 0,
        }))}
      else{
        processedScores = data
            .filter((score: Score) => score[game.scoreKey as keyof Score] !== null)
            .sort((a: Score, b: Score) => {
              const scoreA = a[game.scoreKey as keyof Score] as number;
              const scoreB = b[game.scoreKey as keyof Score] as number;
              return scoreA - scoreB;
            })
            .map((score: Score, index: number) => ({
              rank: index + 1,
              username: score.playerName,
              score: game.scoreFormat(score[game.scoreKey as keyof Score] as number),
              date: new Date(score.createdAt).toLocaleDateString(),
              change: 0,
            }))
      };

      setGameScores(prev => ({
        ...prev,
        [gameId]: processedScores
      }));
    } catch (error) {
      console.error('Error fetching scores:', error);
      setError('Failed to fetch scores');
    } finally {
      setIsTabLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGameScores(games[0].id).finally(() => {
      setIsLoading(false);
    });
  }, [fetchGameScores]);

  const handleGameChange = useCallback((gameId: string) => {
    setSelectedGame(gameId);
    if (!gameScores[gameId]) {
      fetchGameScores(gameId);
    }
  }, [fetchGameScores, gameScores]);

  const currentGameScores = useMemo(() => {
    const scores = gameScores[selectedGame] || [];
    if (!searchTerm) return scores;
    return scores.filter(score => 
      score.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedGame, gameScores, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Floating Background Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute opacity-5 pointer-events-none"
          initial={{ x: `${item.initialX}vw`, y: `${item.initialY}vh` }}
          animate={{
            x: [`${item.initialX}vw`, `${(item.initialX + 30) % 100}vw`],
            y: [`${item.initialY}vh`, `${(item.initialY + 40) % 100}vh`],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
            delay: item.delay,
          }}
        >
          <item.icon className="w-12 h-12" />
        </motion.div>
      ))}

      <Navbar />
      
      <div className="pt-24 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="inline-block"
              >
                <div className="relative">
                  <Trophy className="w-16 h-16 text-primary mx-auto" />
                  <motion.div
                    className="absolute -top-1 -right-1 text-yellow-500"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Crown className="w-6 h-6" />
                  </motion.div>
                </div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
              >
                Global Rankings
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground max-w-2xl mx-auto"
              >
                Compete with players worldwide and claim your spot at the top
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative max-w-md mx-auto"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </motion.div>

            <Tabs 
              value={selectedGame} 
              onValueChange={handleGameChange}
              className="w-full"
            >
              <TabsList className="flex justify-center mb-8">
                {games.map((game) => (
                  <TabsTrigger
                    key={game.id}
                    value={game.id}
                    className="relative overflow-hidden group"
                  >
                    <div className="flex items-center gap-2">
                      <game.icon className={`w-4 h-4 ${game.color}`} />
                      <span>{game.name}</span>
                    </div>
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${game.gradient}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: selectedGame === game.id ? 0.1 : 0 }}
                      whileHover={{ opacity: 0.15 }}
                      transition={{ duration: 0.2 }}
                    />
                  </TabsTrigger>
                ))}
              </TabsList>

              {isTabLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <TabsContent 
                  key={selectedGame}
                  value={selectedGame}
                  className="outline-none"
                >
                  <motion.div
                    key={selectedGame}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-4"
                  >
                    {currentGameScores.map((score, index) => (
                      <Card
                        key={`${score.username}-${score.rank}`}
                        className="p-4 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                      >
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${games.find(g => g.id === selectedGame)?.gradient}`}
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 0.05 }}
                          transition={{ duration: 0.2 }}
                        />
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 text-center font-bold">
                                {score.rank <= 3 ? (
                                  <Medal className={`w-6 h-6 ${
                                    score.rank === 1 ? "text-yellow-500" :
                                    score.rank === 2 ? "text-gray-400" :
                                    "text-amber-600"
                                  }`} />
                                ) : (
                                  `#${score.rank}`
                                )}
                              </div>
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatDelay: Math.random() * 5,
                                }}
                              >
                                <Star className={`w-4 h-4 ${score.rank <= 10 ? games.find(g => g.id === selectedGame)?.color : "text-muted"}`} />
                              </motion.div>
                            </div>
                            <div>
                              <div className="font-semibold">
                                {score.username}
                              </div>
                              <Badge variant="secondary">
                                {score.date}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-xl font-bold">{score.score}</div>
                            {score.change !== 0 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`text-sm ${
                                  score.change > 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {score.change > 0 ? "↑" : "↓"}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </motion.div>
                </TabsContent>
              )}
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}