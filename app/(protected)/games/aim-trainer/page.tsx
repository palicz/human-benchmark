"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, ArrowRight, Target } from 'lucide-react';
import { Button } from "@/app/(protected)/games/aim-trainer/_components/aim-button";
import { Card } from "@/app/(protected)/games/aim-trainer/_components/aim-card";
import confetti from 'canvas-confetti';
import { Navbar } from "@/components/layout/navbar";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { AimStats } from "@/app/(protected)/games/aim-trainer/_components/aim-stats";
import Explosion from "@/app/(protected)/games/aim-trainer/_components/explosion";

type GameState = "ready" | "playing" | "gameover";

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

export default function AimTrainerGame() {
    const [gameState, setGameState] = useState<GameState>("ready");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [highScore, setHighScore] = useState<number | null>(null);
    const { data: session } = useSession();
    const [rank, setRank] = useState<number | undefined>();
    const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
    const [targetSize, setTargetSize] = useState(7);
    const [improvementMessage, setImprovementMessage] = useState<string | null>(null);
    const [explosionVisible, setExplosionVisible] = useState(false);
    const [explosionPosition, setExplosionPosition] = useState({ x: 0, y: 0 });

    const generateTarget = useCallback(() => {
        const minSize = 35;
        const maxSize = 80;
        const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;

        const maxX = 100 - (size / 4);
        const maxY = 100 - (size / 4);

        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        setTargetPosition({ x, y });
        setTargetSize(size);
    }, []);

    const startGame = () => {
        setGameState("playing");
        setScore(0);
        setTimeLeft(30);
        generateTarget();
    };

    const handleTargetClick = () => {
        const currentPosition = targetPosition;
        setScore((prevScore) => prevScore + 1);
        setExplosionPosition(currentPosition);
        setExplosionVisible(true);
        generateTarget();
    };

    const handleExplosionComplete = () => {
        setExplosionVisible(false);
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
                    aimScore: score
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save score');
            }

            if (score > (highScore ?? 0)) {
                setHighScore(score);
                triggerConfetti();
                setImprovementMessage(`+${score - (highScore ?? 0)} points improvement!`);
            }
            const rankResponse = await fetch('/api/user-scores');
            if (rankResponse.ok) {
                const data = await rankResponse.json();
                setRank(data.ranks.aimRank);
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
                setHighScore(data.aimScore);
                setRank(data.ranks.aimRank);
            }
        } catch (error) {
            console.error('Error fetching high score:', error);
        }
    };


    useEffect(() => {
        fetchHighScore();
    }, [session]);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (gameState === "playing" && timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (gameState === "playing" && timeLeft === 0) {
            setGameState("gameover");
            saveScore();
        }

        return () => clearTimeout(timer);
    }, [gameState, timeLeft]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            <Navbar />

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
                            <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 inline-block">
                                <Crosshair className="w-8 h-8 text-yellow-500" />
                            </div>
                        </motion.div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
                            Aim Trainer
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Test your reflexes and accuracy by clicking targets as fast as you can
                        </p>
                    </div>

                    {/* Game Stats */}
                    <AimStats
                        score={score}
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
                                    <h2 className="text-2xl font-semibold">Ready to test your aim?</h2>
                                    <p className="text-muted-foreground">Click as many targets as you can in 30 seconds</p>
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
                                    className="relative h-[600px] rounded-lg overflow-hidden cursor-crosshair"
                                >
                                    <motion.div
                                        className="absolute inset-0 animated-background opacity-50"
                                        style={{
                                            background: 'linear-gradient(270deg, rgba(5, 26, 145, 0.6), rgba(19, 46, 197, 0.6), rgba(33, 115, 203, 0.6), rgba(39, 185, 217, 0.6), rgba(41, 223, 225, 0.6), rgba(48, 239, 178, 0.6), rgba(37, 247, 126, 0.6))',
                                            backgroundSize: '400% 400%',
                                        }}
                                    />
                                    {explosionVisible && (
                                        <Explosion position={explosionPosition} onComplete={handleExplosionComplete} />
                                    )}
                                    <motion.div
                                        className="absolute text-red-500"
                                        style={{
                                            left: `${targetPosition.x}%`,
                                            top: `${targetPosition.y}%`,
                                            width: `${targetSize}px`,
                                            height: `${targetSize}px`
                                        }}
                                        onClick={handleTargetClick}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                    >
                                        <Target className="w-full h-full" />
                                    </motion.div>
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
                                                <Badge variant="score" className="text-2xl px-6 py-3 bg-primary">
                                                    Final Score: {score}
                                                </Badge>

                                                <div className="flex flex-col items-center gap-2">
                                                    <Badge variant="outline" className="text-xl px-4 py-2">
                                                        Previous Best: {highScore}
                                                    </Badge>

                                                    {highScore !== null && score > highScore && (
                                                        <Badge variant="improvement" className="text-xl px-4 py-2 bg-green-500/20 text-green-500">
                                                            {improvementMessage}
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
                    </Card>

                    {/* Game Instructions */}
                    <Card className="p-6 bg-secondary/50">
                        <h3 className="font-semibold mb-2">How to Play</h3>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Click on the targets as quickly as you can</li>
                            <li>Each successful click earns you a point</li>
                            <li>The game lasts for 30 seconds</li>
                            <li>Try to beat your high score!</li>
                        </ul>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

