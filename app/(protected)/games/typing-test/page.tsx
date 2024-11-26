"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Timer } from 'lucide-react';
import { Button } from "@/app/(protected)/games/typing-test/_components/typing-button";
import { Card } from "@/app/(protected)/games/typing-test/_components/typing-card";
import { Input } from "@/app/(protected)/games/typing-test/_components/typing-input";
import { TypingStats } from "@/app/(protected)/games/typing-test/_components/typing-stats";
import { useSession } from "next-auth/react";

const words = ["hello", "world", "react", "javascript", "typing", "speed", "test", "game"];

export default function TypingSpeedTestGame() {
    const [gameState, setGameState] = useState<"ready" | "playing" | "gameover">("ready");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [wpm, setWpm] = useState(0);
    const { data: session } = useSession();
    const [startTime, setStartTime] = useState<number | null>(null);
    const [highScore, setHighScore] = useState<number | null>(null);
    const [rank, setRank] = useState<number | null>(null);
    const [remainingWords, setRemainingWords] = useState(words);

    const startGame = () => {
        setGameState("playing");
        setCurrentWordIndex(0);
        setInputValue("");
        setStartTime(Date.now());
        setRemainingWords(words);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);

        if (value.endsWith(" ")) {
            const typedWord = value.trim();
            if (typedWord === remainingWords[currentWordIndex]) {
                setCurrentWordIndex((prevIndex) => prevIndex + 1);
                setInputValue("");

                if (currentWordIndex + 1 >= remainingWords.length) {
                    setGameState("gameover");
                    saveScore();
                }
            } else {
                setInputValue("");
            }
        }
    };

    useEffect(() => {
        if (gameState === "playing" && startTime) {
            const interval = setInterval(() => {
                const secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
                if (secondsElapsed > 0) {
                    setWpm(Math.floor((currentWordIndex / secondsElapsed) * 60));
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [startTime, currentWordIndex, gameState]);

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
                    typeScore: wpm
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save score');
            }

            if (wpm > (highScore ?? 0)) {
                setHighScore(wpm);
            }

            const rankResponse = await fetch('/api/user-scores');
            if (rankResponse.ok) {
                const data = await rankResponse.json();
                setRank(data.ranks.typeRank);
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
                setHighScore(data.typeScore);
                setRank(data.ranks.typeRank);
            }
        } catch (error) {
            console.error('Error fetching high score:', error);
        }
    };

    useEffect(() => {
        fetchHighScore();
    }, [session, wpm]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            <div className="container max-w-10xl mx-auto pt-24 px-6 pb-16 relative">
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
                            <div className="p-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 inline-block">
                                <Timer className="w-8 h-8 text-green-500" />
                            </div>
                        </motion.div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-500">
                            Typing Speed Test
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Type the words as fast as you can!
                        </p>
                    </div>
                    {/* Game Stats */}
                    <TypingStats
                        wpm={wpm}
                        wordsTyped={currentWordIndex}
                        highScore={highScore}
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
                                    <h2 className="text-2xl font-semibold">Ready to test your typing speed?</h2>
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
                                    className="text-center space-y-6"
                                >
                                    <div className="text-2xl font-semibold">
                                        {remainingWords.map((word, index) => (
                                            <span key={index} className="mr-2">
                                                {index === currentWordIndex ? (
                                                    Array.from(word).map((letter, letterIndex) => (
                                                        <span key={letterIndex} className={inputValue[letterIndex] === letter ? "text-green-500" : inputValue[letterIndex] !== undefined ? "text-red-500" : ""}>
                                                            {letter}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span>{word}</span>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                    <Input
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        className="mt-4"
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
                                    <div className="space-y-4">
                                        <p className="text-xl">Your WPM: {wpm}</p>
                                        <Button
                                            onClick={() => {
                                                setGameState("ready");
                                                setInputValue("");
                                                setCurrentWordIndex(0);
                                                setWpm(0);
                                                setRemainingWords(words);
                                            }}
                                            size="lg"
                                            className="mt-4"
                                        >
                                            Play Again
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>

                    {/* Game Instructions */}
                    <Card className="p-6 bg-secondary/50">
                        <h3 className="font-semibold mb-2">How to Play</h3>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Type the words as they appear on the screen</li>
                            <li>Each correct letter will turn green, incorrect letters will turn red</li>
                            <li>The game ends when you type all the words</li>
                            <li>Try to achieve the highest WPM!</li>
                        </ul>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}