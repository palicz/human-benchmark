"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ArrowRight, Crosshair, Timer, Eye } from "lucide-react";
import { Button } from "@/app/(protected)/games/number-memory/_components/memory-button";
import { Card } from "@/app/(protected)/games/number-memory/_components/memory-card";
import { Input } from "@/app/(protected)/games/number-memory/_components/memory-input";
import { Navbar } from "@/components/layout/navbar";
import { useSession } from "next-auth/react";
import confetti from 'canvas-confetti';
import { Badge } from "@/components/ui/badge";
import { MemoryStats } from "./_components/memory-stats";

type GameState = "ready" | "memorize" | "recall" | "feedback" | "gameover";

const startInfiniteConfetti = () => {
  let frameId: number;
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
  
  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    frameId = requestAnimationFrame(frame);
  };

  frame();

  return () => cancelAnimationFrame(frameId);
};

export default function NumberMemoryGame() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [currentNumber, setCurrentNumber] = useState("");
  const [userInput, setUserInput] = useState("");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [highScore, setHighScore] = useState<number | null>(null);
  const { data: session } = useSession();
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [rank, setRank] = useState<number | undefined>();

  const generateNumber = (currentLevel: number) => {
    const length = currentLevel;
    let number = '';
    number += Math.floor(Math.random() * 9) + 1;
    for (let i = 1; i < length; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return number;
  };

  const startLevel = () => {
    const newNumber = generateNumber(level);
    setCurrentNumber(newNumber);
    setGameState("memorize");
    setTimeLeft(Math.min(7, 3 + Math.floor(level / 4)));
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
          score: score
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
        setRank(data.ranks.memoryRank);
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        spread: 90,
        scalar: 1.2,
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const checkAnswer = async () => {
    if (userInput === currentNumber) {
      const newScore = score + 100;
      setScore(newScore);
      setLevel(level + 1);
      
      if (highScore !== null && newScore > highScore) {
        triggerConfetti();
      }
      
      setUserInput("");
      setGameState("ready");
    } else {
      setGameState("gameover");
      await saveScore();
    }
  };

  const fetchHighScore = async () => {
    if (!session?.user?.name) return;
    
    try {
      const response = await fetch('/api/user-scores');
      if (response.ok) {
        const data = await response.json();
        setHighScore(data.score);
        setRank(data.ranks.memoryRank);
      }
    } catch (error) {
      console.error('Error fetching high score:', error);
    }
  };

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

  useEffect(() => {
    fetchHighScore();
  }, [session, score]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameState === "memorize" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (gameState === "memorize" && timeLeft === 0) {
      setGameState("recall");
    }

    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (gameState === "gameover" && score > (highScore ?? 0)) {
      setIsConfettiActive(true);
      cleanup = startInfiniteConfetti();
    }

    return () => {
      if (cleanup) cleanup();
      setIsConfettiActive(false);
    };
  }, [gameState, score, highScore]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
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
      
      <div className="container max-w-4xl mx-auto pt-24 px-6 pb-16 relative">
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
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 inline-block">
                <Brain className="w-8 h-8 text-blue-500" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
              Number Memory Test
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Remember the number sequence and type it back correctly
            </p>
          </div>

          {/* Game Stats */}
          <MemoryStats
            score={score}
            highScore={highScore}
            level={level}
            rank={rank}
          />

          {/* Game Area */}
          <Card className="p-8">
            <AnimatePresence mode="wait">
              {gameState === "ready" && (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-6"
                >
                  <h2 className="text-2xl font-semibold">Ready to continue?</h2>
                  <p className="text-muted-foreground">Current Score: {score}</p>
                  <Button onClick={startLevel} size="lg">
                    Start
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {gameState === "memorize" && (
                <motion.div
                  key="memorize"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center space-y-6"
                >
                  <div 
                    className="text-6xl font-mono font-bold tracking-wider select-none"
                    onCopy={(e) => e.preventDefault()}
                  >
                    {currentNumber}
                  </div>
                  <motion.div
                    className="w-full bg-secondary h-2 rounded-full overflow-hidden"
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: timeLeft, ease: "linear" }}
                  />
                </motion.div>
              )}

              {gameState === "recall" && (
                <motion.div
                  key="recall"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">What was the number?</h2>
                    <Input
                      type="number"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="text-center text-2xl max-w-[200px] mx-auto [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-center">
                    <Button onClick={checkAnswer} size="lg">
                      Submit Answer
                    </Button>
                  </div>
                </motion.div>
              )}

              {gameState === "gameover" && (
                <motion.div
                  key="gameover"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-6"
                >
                  {score >= (highScore ?? 0) ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="space-y-6"
                    >
                      <h2 className="text-4xl font-bold text-primary">
                        🎉 New High Score! 🎉
                      </h2>

                      <div className="space-y-4">
                        <Badge variant="default" className="text-2xl px-6 py-3 bg-primary hover:bg-primary">
                          Final Score: {score}
                        </Badge>

                        <div className="flex flex-col items-center gap-2">
                          <Badge variant="outline" className="text-xl px-4 py-2">
                            Previous Best: {highScore}
                          </Badge>

                          {highScore !== null && score > highScore && (
                            <Badge variant="secondary" className="text-xl px-4 py-2 bg-green-500/20 text-green-500">
                              +{score - highScore} points improvement!
                            </Badge>
                          )}
                        </div>
                      </div>

                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold text-destructive">Game Over</h2>
                      <div className="space-y-4">
                        <Badge variant="default" className="text-2xl px-6 py-3">
                          Final Score: {score}
                        </Badge>
                        
                        {highScore !== null && (
                          <div className="flex flex-col items-center gap-2">
                            <Badge variant="outline" className="text-xl px-4 py-2">
                              Personal Best: {highScore}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Keep practicing! You're just {highScore - score} points away from your best score.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  
                  <Button
                        onClick={() => {
                          setScore(0);
                          setLevel(1);
                          setGameState("ready");
                          setUserInput("");
                        }}
                        size="lg"
                        className="mt-4"
                      >
                        Play Again
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                      
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Game Instructions */}
          <Card className="p-6 bg-secondary/50">
            <h3 className="font-semibold mb-2">How to Play</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Memorize the number shown on screen</li>
              <li>Type the exact number sequence when prompted</li>
              <li>Numbers get longer as you progress</li>
              <li>Make a mistake and the game ends</li>
            </ul>
          </Card>
          
        </motion.div>
      </div>
    </div>
  );
}