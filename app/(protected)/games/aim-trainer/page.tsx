'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from "next-auth/react";

interface Score {
    id: number;
    playerName: string;
    aimScore: number;
    createdAt: string;
}

interface TargetProps {
    x: number;
    y: number;
    onClick: () => void;
}

const Target: React.FC<TargetProps> = ({ x, y, onClick }) => {
    return (
        <button
            className="absolute w-10 h-10 bg-red-500 rounded-full cursor-crosshair"
            style={{ left: `${x}px`, top: `${y}px` }}
            onClick={onClick}
            aria-label="Célpont"
        />
    );
};

interface GameAreaProps {
    gameStarted: boolean;
    incrementScore: () => void;
}

const GameArea: React.FC<GameAreaProps> = ({ gameStarted, incrementScore }) => {
    const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
    const gameAreaRef = useRef<HTMLDivElement>(null);

    const generateRandomPosition = useCallback(() => {
        if (gameAreaRef.current) {
            const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
            const targetSize = 50;

            const maxX = gameAreaRect.width - targetSize;
            const maxY = gameAreaRect.height - targetSize;

            const x = Math.floor(Math.random() * maxX);
            const y = Math.floor(Math.random() * maxY);

            setTargetPosition({ x, y });
        }
    }, []);

    useEffect(() => {
        if (gameStarted) {
            generateRandomPosition();
        }
    }, [gameStarted, generateRandomPosition]);

    const handleTargetClick = useCallback(() => {
        incrementScore();
        generateRandomPosition();
    }, [incrementScore, generateRandomPosition]);

    return (
        <div ref={gameAreaRef} className="w-full h-[60vh] bg-gray-800 relative rounded-lg overflow-hidden p-5 cursor-crosshair">
            {gameStarted && (
                <Target
                    x={targetPosition.x}
                    y={targetPosition.y}
                    onClick={handleTargetClick}
                />
            )}
        </div>
    );
};

export default function AimTrainingPage() {
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [topScores, setTopScores] = useState<Score[]>([]);
    const { data: session, status } = useSession();

    const fetchTopScores = async () => {
        try {
            const response = await fetch('/api/scores');
            if (!response.ok) {
                throw new Error(`HTTP hiba! Státusz: ${response.status}`);
            }
            const data = await response.json();
            setTopScores(data);
        } catch (error) {
            console.error("Hiba a legjobb pontszámok lekérésekor:", error);
        }
    };

    const saveScoreToDatabase = async (finalScore: number) => {
        try {
            console.log("Pontszám mentése:", finalScore);
            if (status === "authenticated" && session?.user?.name) {
                const userName = session.user.name;
                const payload = { name: userName, aimScore: finalScore };
                const response = await fetch('/api/scores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    throw new Error(`HTTP hiba! Státusz: ${response.status}`);
                }
                const result = await response.json();
                console.log("Pontszám mentve:", result);
            }
        } catch (error) {
            console.error("Hiba a pontszám mentésekor:", error);
        }
    };

    const startGame = () => {
        setGameStarted(true);
        setScore(0);
        scoreRef.current = 0;
        setGameOver(false);
        setTimeLeft(30);
        timerRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime > 1) {
                    return prevTime - 1;
                } else {
                    clearInterval(timerRef.current!);
                    setGameOver(true);
                    saveScoreToDatabase(scoreRef.current)
                        .then(() => console.log("Pontszám sikeresen mentve"))
                        .catch((error) => console.error("Hiba a pontszám mentésekor:", error));
                    return 0;
                }
            });
        }, 1000);
    };
    const scoreRef = useRef(0);
    const incrementScore = () => {
        setScore((prevScore) => {
            scoreRef.current = prevScore + 1;
            return scoreRef.current;
        });
    };

    const restartGame = () => {
        setGameStarted(false);
        setTimeout(() => {
            startGame();
        }, 0);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!gameStarted) {
            fetchTopScores();
        }
    }, [gameStarted]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background w-3/5">
            <div className="game-container text-center p-5 w-11/12 max-w-6xl">
                {!gameStarted || gameOver ? (
                    <div className="game-screen text-center max-w-xl mx-auto bg-primary px-10 py-10 rounded-xl">
                        {!gameStarted ? (
                            <>
                                <h1 className="text-4xl font-bold mb-5 text-white">Aim Trainer</h1>
                                <p className="w-full justify-self-center text-xl text-white mb-5">
                                    Kattints a célpontokra, amilyen gyorsan csak lehet! 30 másodperced van, hogy minél több pontot szerezz!
                                </p>
                                <button
                                    onClick={startGame}
                                    className="px-4 py-2 rounded text-xl font-bold text-white bg-secondary hover:bg-white hover:text-secondary hover-scale"
                                >
                                    Indítás
                                </button>
                                <h2 className="text-2xl font-bold mt-5 text-white">Legjobb pontszámok:</h2>
                                <ul className="top-scores mt-3">
                                    {topScores
                                        .filter((score: Score) => score.aimScore !== null && score.aimScore !== undefined)
                                        .map((score: Score) => (
                                            <li key={score.id} className="text-md font-bold text-secondary">
                                                {score.playerName}: Célozz és találj - {score.aimScore ?? "N/A"}
                                            </li>
                                        ))}
                                </ul>
                            </>
                        ) : (
                            <div className="game-over text-center">
                                <h2 className="text-4xl font-bold text-red-500 mb-4">Játék vége!</h2>
                                <p className="text-2xl font-bold mb-5 text-white">Végső pontszámod: {score}</p>
                                <button
                                    onClick={restartGame}
                                    className="px-4 py-2 rounded text-xl font-bold text-white bg-secondary hover:bg-white hover:text-secondary hover:scale-105 transition-transform"
                                >
                                    Újraindítás
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <h1 className="text-4xl font-bold mb-5 text-primary">Aim Trainer</h1>
                        <div className="mb-4">
                            <span className="text-xl font-bold text-secondary mr-4">Pontszám: {score}</span>
                            <span className="text-xl font-bold text-secondary font-bold">Hátralévő idő: <span className="text-red-500">{timeLeft}s</span></span>
                        </div>
                        <GameArea
                            gameStarted={gameStarted}
                            incrementScore={incrementScore}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
