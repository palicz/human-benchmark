"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight, Timer, Crosshair, Gauge } from 'lucide-react';
import { Button } from "@/app/(protected)/games/reaction-time/_components/reaction-button";
import { Card } from "@/app/(protected)/games/reaction-time/_components/reaction-card";
import { Navbar } from "@/components/layout/navbar";
import { useSession } from "next-auth/react";
import confetti from 'canvas-confetti';
import { Badge } from "@/components/ui/badge";
import { ReactionStats } from "@/app/(protected)/games/reaction-time/_components/reaction-stats";

type GameState = "ready" | "waiting" | "click" | "result" | "gameover" | "tooEarly";

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

export default function ReactionTimeTest() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [averageTime, setAverageTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const { data: session } = useSession();
  const [rank, setRank] = useState<number | undefined>();
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [tooEarly, setTooEarly] = useState(false);

  const startTest = useCallback(() => {
    setGameState("waiting");
    const delay = Math.random() * 3000 + 1000;
    const id = setTimeout(() => {
      setGameState("click");
      setStartTime(Date.now());
    }, delay);
    setTimerId(id);
    if (attempts >= 5) {
      setBestTime(null);
      setAverageTime(null);
      setAttempts(0);
    }

  }, []);

  const handleClick = useCallback(() => {
    if (gameState === "waiting") {
      clearTimeout(timerId!); // Clear the timer
      setAttempts(prev => prev + 1);
      setGameState("tooEarly"); // Set to tooEarly state
      setReactionTime(null);
    } else if (gameState === "click" && startTime) {
      const endTime = Date.now();
      const time = endTime - startTime;
      setReactionTime(time);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (bestTime === null || time < bestTime) {
        setBestTime(time);
        triggerConfetti();
      }

      setAverageTime(prev =>
        prev === null ? time : Math.round((prev * attempts + time) / newAttempts)
      );

      if (newAttempts >= 5) {
        setGameState("gameover");
        saveScore();
      } else {
        setGameState("result");
      }
    }
  }, [gameState, startTime, attempts, bestTime, timerId]);

  const tryAgain = () => {
    setTooEarly(false);
    setGameState("ready");
  }

  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);


  const saveScore = async () => {
    if (!session?.user?.name || !bestTime) return;

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: session.user.name,
          reactionScore: bestTime
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save score');
      }

      const rankResponse = await fetch('/api/user-scores');
      if (rankResponse.ok) {
        const data = await rankResponse.json();
        setRank(data.ranks.reactionRank);
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
        setHighScore(data.reactionScore);
        setRank(data.ranks.reactionRank);
      }
    } catch (error) {
      console.error('Error fetching high score:', error);
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

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (gameState === "result" && reactionTime !== null && (bestTime === null || reactionTime < bestTime)) {
      setIsConfettiActive(true);
      cleanup = startInfiniteConfetti();
    }

    return () => {
      if (cleanup) cleanup();
      setIsConfettiActive(false);
    };
  }, [gameState, reactionTime, bestTime]);

  useEffect(() => {
    if (attempts === 5) {
      setGameState("gameover");
      saveScore();
    }
  }, [attempts, saveScore]);


  useEffect(() => {
    fetchHighScore();
  }, [session]);

  const generateFloatingIcons = () => {
    const positions = [
      { x: 15, y: 25 }, { x: 35, y: 45 }, { x: 55, y: 15 },
      { x: 75, y: 65 }, { x: 25, y: 85 }, { x: 45, y: 35 },
      { x: 65, y: 75 }, { x: 85, y: 25 }, { x: 20, y: 55 },
      { x: 40, y: 15 }, { x: 60, y: 85 }, { x: 80, y: 45 },
      { x: 30, y: 65 }, { x: 50, y: 35 }, { x: 70, y: 95 }
    ];

    return positions.map((pos, i) => ({
      icon: [Zap, Crosshair, Timer, Gauge][i % 4],
      initialX: pos.x,
      initialY: pos.y,
      duration: 15 + (i * 1.5),
      delay: -1 * (i * 1.3),
    }));
  };

  const floatingIcons = generateFloatingIcons();

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
              <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-red-500/20 inline-block">
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-red-500">
              Reaction Time Test
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Test your reflexes! Click as fast as you can when the color changes.
            </p>
          </div>

          {/* Game Stats */}
          <ReactionStats
            bestTime={bestTime}
            averageTime={averageTime}
            attempts={attempts}
            rank={rank}
          />

          {/* Game Area */}
          <Card className="p-8">
            <div className="h-[300px] w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                {gameState === "ready" && (
                  <motion.div
                    key="ready"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6"
                  >
                    <h2 className="text-2xl font-semibold">Ready to test your reflexes?</h2>
                    <Button onClick={startTest} size="lg">
                      Start Test
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                )}

                {gameState === "waiting" && (
                  <div className="w-48 h-48 mx-auto bg-red-500 rounded-md flex items-center justify-center cursor-pointer w-[100%] h-[100%]"
                    onClick={handleClick}>
                    <span className="text-white text-2xl font-bold">Wait...</span>
                  </div>
                )}

                {gameState === "click" && (
                  <div
                    className="w-full h-48 mx-auto bg-green-500 rounded-md flex items-center justify-center cursor-pointer w-[100%] h-[100%]"
                    onClick={handleClick}
                  >
                    <span className="text-white text-2xl font-bold">Click!</span>
                  </div>
                )}

                {gameState === "result" && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6"
                  >
                    <h2 className="text-2xl font-semibold">
                      {`Your reaction time: ${reactionTime} ms`}
                    </h2>
                    <Button onClick={startTest} size="lg">
                      {attempts >= 5 ? "Play Again" : "Next Round"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                )}

                {gameState === "tooEarly" && (
                  <motion.div
                    key="tooEarly"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-6 font-bold"
                  >
                    <h2 className="text-2xl font-semibold text-red-500">Too Early!</h2>
                    <p className="text-muted-foreground">You clicked too soon. Please wait for the green light.</p>
                    <Button onClick={tryAgain} size="lg">
                      Try Again
                    </Button>
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
                    <h2 className="text-4xl font-bold text-primary">
                      Game Over!
                    </h2>
                    <div className="space-y-4">
                      <Badge variant="default" className="text-2xl px-6 py-3 bg-primary hover:bg-primary">
                        Best Time: {bestTime} ms
                      </Badge>
                      <Badge variant="secondary" className="text-xl px-4 py-2">
                        Average Time: {averageTime} ms
                      </Badge>
                    </div>
                    <Button
                      onClick={() => {
                        setBestTime(null);
                        setAverageTime(null);
                        setAttempts(0);
                        setGameState("ready");
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
            </div>
          </Card>

          {/* Game Instructions */}
          <Card className="p-6 bg-secondary/50">
            <h3 className="font-semibold mb-2">How to Play</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Click "Start Test" to begin</li>
              <li>Wait for the red circle to turn green</li>
              <li>Click as fast as you can when it turns green</li>
              <li>Try to get the lowest reaction time possible</li>
              <li>You have 5 attempts to set your best time</li>
            </ul>
          </Card>

        </motion.div>
      </div>
    </div>
  );
}
