"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, ArrowRight, Brain, Timer, Crosshair, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { useSession } from "next-auth/react";
import { StroopStats } from "./_components/stroop-stats";
import { Card } from "./_components/stroop-card";
import { StroopButton } from "./_components/stroop-button";
import CardDisplay from "./_components/CardDisplay";

type GameState = "ready" | "playing" | "gameover";

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'brown', 'black', 'pink', 'gray'];
const COLOR_NAMES = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Brown', 'Black', 'Pink', 'Gray'];

interface StroopOption {
  text: string;
  backgroundColor: string;
  textColor: string;
}

export default function StroopTest() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [stroopScore, setStroopScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [rank, setRank] = useState<number | undefined>();
  const { data: session } = useSession();
  const [currentWord, setCurrentWord] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [options, setOptions] = useState<StroopOption[]>([]);

  const generateRound = () => {
    const wordIndex = Math.floor(Math.random() * COLOR_NAMES.length);
    const colorIndex = Math.floor(Math.random() * COLORS.length);
    setCurrentWord(COLOR_NAMES[wordIndex]);
    setCurrentColor(COLORS[colorIndex]);

    const correctAnswer = COLOR_NAMES[COLORS.indexOf(COLORS[colorIndex])];
    const otherOptions = COLOR_NAMES.filter(name => name !== correctAnswer);
    const shuffledOtherOptions = otherOptions.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [correctAnswer, ...shuffledOtherOptions];

    const shuffledBackgroundColors = [...COLORS].sort(() => Math.random() - 0.5).slice(0, 4);

    const newOptions: StroopOption[] = allOptions.map((option, index) => {
      const backgroundColor = shuffledBackgroundColors[index];
      let textColor;
      do {
        textColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      } while (textColor === backgroundColor || textColor.toLowerCase() === option.toLowerCase());

      return {
        text: option,
        backgroundColor,
        textColor,
      };
    });

    setOptions(newOptions.sort(() => Math.random() - 0.5));
  };

  const startGame = () => {
    setGameState("playing");
    setStroopScore(0);
    setTimeLeft(30);
    generateRound();
  };

  const handleAnswer = (answer: string) => {
    if (answer.toLowerCase() === currentColor) {
      setStroopScore(stroopScore + 100);
      generateRound();
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameState("gameover");
    saveScore();
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
          stroopScore: stroopScore
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save score');
      }

      if (stroopScore > (highScore ?? 0)) {
        setHighScore(stroopScore);
      }
      const rankResponse = await fetch('/api/user-scores');
      if (rankResponse.ok) {
        const data = await rankResponse.json();
        setRank(data.ranks.stroopRank);
      }
    } catch (error) {
      console.error('Error saving score:', error);
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

  const fetchHighScore = async () => {
    if (!session?.user?.name) return;

    try {
      const response = await fetch('/api/user-scores');
      if (response.ok) {
        const data = await response.json();
        setHighScore(data.stroopScore);
        setRank(data.ranks.stroopRank);
      }
    } catch (error) {
      console.error('Error fetching high score:', error);
    }
  };

  useEffect(() => {
    fetchHighScore();
  }, [session, stroopScore]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (gameState === "playing" && timeLeft === 0) {
      endGame();
    }

    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

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
              <div className="p-3 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 inline-block">
                <Palette className="w-8 h-8 text-red-500" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
              Stroop Test
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the button with the word that matches the color of the text in the center!
            </p>
          </div>

          {/* Game Stats */}
          <StroopStats
            score={stroopScore}
            highScore={highScore}
            timeLeft={timeLeft}
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
                  <h2 className="text-2xl font-semibold">Ready to start?</h2>
                  <Button onClick={startGame} size="lg">
                    Start
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {gameState === "playing" && (
                <motion.div
                  key="playing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <CardDisplay word={currentWord} color={currentColor} />
                  <div className="grid grid-cols-2 gap-4">
                    {options.map((option, index) => (
                      <StroopButton
                        key={index}
                        onClick={() => handleAnswer(option.text)}
                        backgroundColor={option.backgroundColor}
                        textColor={option.textColor}
                      >
                        {option.text}
                      </StroopButton>
                    ))}
                  </div>
                  <motion.div
                    className="w-full h-2 rounded-full overflow-hidden"
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: timeLeft, ease: "linear" }}
                    style={{ backgroundColor: currentColor }}
                  />
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
                  <h2 className="text-2xl font-semibold text-destructive">Game Over</h2>
                  <p className="text-xl">Final Score: {stroopScore}</p>
                  {highScore !== null && stroopScore > highScore && (
                    <p className="text-xl text-green-500">New High Score!</p>
                  )}
                  <Button onClick={startGame} size="lg">
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
              <li>A color word will appear in the center, written in a different color</li>
              <li>Choose the button with the word that matches the color of the text in the center</li>
              <li>Ignore the meaning of the central word and focus on its color</li>
              <li>Be quick and accurate to score points</li>
              <li>You have 30 seconds to score as many points as possible</li>
              <li>The game ends if you make a mistake or when time runs out</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

