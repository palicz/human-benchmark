"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Trophy, Brain, Timer, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/app/(protected)/games/visual-memory-test/_components/visual-card";
import { Navbar } from "@/components/layout/navbar";
import { VisualGrid } from "@/app/(protected)/games/visual-memory-test/_components/visual-grid";
import { VisualStats } from "@/app/(protected)/games/visual-memory-test/_components/game-stats";
import { GameInstructions } from "@/app/(protected)/games/visual-memory-test/_components/game-instructions";
import { useSession } from "next-auth/react";

type GameState = "ready" | "showing" | "input" | "gameover" | "success";

export default function VisualMemoryGame() {
  const { data: session } = useSession();
  const [gameState, setGameState] = useState<GameState>("ready");
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [currentShowingIndex, setCurrentShowingIndex] = useState<number | undefined>();
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  const generateSequence = (level: number) => {
    const sequenceLength = level;
    return Array.from({ length: sequenceLength }, () => Math.floor(Math.random() * 9));
  };

  const startLevel = () => {
    const currentLevel = level + 1;
    setLevel(currentLevel);
    setGameState("showing");
    
    const startSequence = () => {
      const newSequence = generateSequence(currentLevel);
      setSequence(newSequence);
      setUserSequence([]);
      
      setTimeout(() => {
        setIsShowingSequence(true);
        let currentIndex = 0;
        const showInterval = setInterval(() => {
          if (currentIndex >= newSequence.length) {
            clearInterval(showInterval);
            setIsShowingSequence(false);
            setGameState("input");
            return;
          }
          setCurrentShowingIndex(currentIndex);
          setTimeout(() => {
            setCurrentShowingIndex(undefined);
          }, 300);
          currentIndex++;
        }, 400);
      }, 500);
    };

    if (currentLevel === 1) {
      setTimeout(startSequence, 2000);
    } else {
      startSequence();
    }
  };

  const handleSquareClick = (index: number) => {
    if (gameState !== "input") return;

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    if (sequence[userSequence.length] !== index) {
      setGameState("gameover");
      saveScore();
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setGameState("success");
      const newScore = score + (level * 100);
      setScore(newScore);
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setTimeout(() => {
        startLevel();
      }, 1500);
    }
  };

  const saveScore = async () => {
    if (!session?.user?.name) return;

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: session.user.name,
          visualScore: score
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save score');
      }

      if (score > (highScore ?? 0)) {
        setHighScore(score);
      }
      
      const rankResponse = await fetch('/api/user-scores');
      if (rankResponse.ok) {
        const data = await rankResponse.json();
        setRank(data.ranks.visualRank);
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const fetchHighScore = async () => {
    if (!session?.user?.name) return;

    try {
      const response = await fetch('/api/user-scores');
      if (response.ok) {
        const data = await response.json();
        setHighScore(data.visualScore);
        setRank(data.ranks.visualRank);
      }
    } catch (error) {
      console.error('Error fetching high score:', error);
    }
  };

  useEffect(() => {
    fetchHighScore();
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <div className="container max-w-4xl mx-auto pt-24 px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Game Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="inline-block"
            >
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 inline-block">
                <Eye className="w-8 h-8 text-purple-500" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Visual Memory Test</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Remember the pattern and repeat it in the correct order
            </p>
          </div>

          {/* Game Stats */}
          <VisualStats level={level} score={score} highScore={highScore} rank={rank} />

          {/* Game Grid */}
          <Card className="p-8">
            <AnimatePresence mode="wait">
              {gameState === "ready" && (
                <motion.div
                  key="start-game"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-6"
                >
                  <h2 className="text-2xl font-semibold">Ready to start?</h2>
                  <Button onClick={startLevel} size="lg">
                    Start
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {(gameState === "showing" || gameState === "input" || gameState === "success") && (
                <motion.div
                  key="game-area"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="h-8 relative flex items-start justify-center">
                    {gameState === "showing" && isShowingSequence && (
                      <motion.div
                        key="timer"
                        className="w-full bg-secondary h-2 rounded-full overflow-hidden"
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{ 
                          duration: (sequence.length * 0.4) + 0.2,
                          ease: "linear" 
                        }}
                      />
                    )}
                    {gameState === "success" && (
                      <motion.p
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-2xl font-semibold text-green-500 absolute -top-1"
                      >
                        Correct!
                      </motion.p>
                    )}
                  </div>

                  <VisualGrid
                    sequence={sequence}
                    userSequence={userSequence}
                    gameState={gameState}
                    onSquareClick={handleSquareClick}
                    currentShowingIndex={currentShowingIndex}
                  />
                </motion.div>
              )}

              {gameState === "gameover" && (
                <motion.div
                  key="gameover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-destructive">Game Over!</h2>
                  <div className="space-y-2">
                    <p className="text-xl">Final Score: {score}</p>
                    <p>Level Reached: {level}</p>
                  </div>
                  <Button
                    onClick={() => {
                      setLevel(0);
                      setScore(0);
                      setGameState("ready");
                      setSequence([]);
                      setUserSequence([]);
                    }}
                    size="lg"
                  >
                    Play Again
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Game Instructions */}
          <GameInstructions />
        </motion.div>
      </div>
    </div>
  );
}