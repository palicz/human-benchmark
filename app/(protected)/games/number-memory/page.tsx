'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";

interface Score {
    id: number;
    playerName: string;
    score: number;
    createdAt: string;
}
const MemoryGamePage = () => {
    const [currentNumber, setCurrentNumber] = useState('');
    const [playerInput, setPlayerInput] = useState('');
    const [score, setScore] = useState(0);
    const [showNumber, setShowNumber] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);
    const [topScores, setTopScores] = useState<Score[]>([]);
    const { data: session, status } = useSession();

    const fetchTopScores = async () => {
        try {
            const response = await fetch('/api/scores');
            if (!response.ok) {
                throw new Error(`HTTP hiba! státusz: ${response.status}`);
            }
            const data = await response.json();
            setTopScores(data);
        } catch (error) {
            console.error("Hiba a legjobb eredmények lekérésekor:", error);
        }
    };

    const saveScoreToDatabase = async () => {
        try {
            if (status === "authenticated" && session?.user?.name) {
                const userName = session.user.name;
                const payload = { name: userName, score };
                const response = await fetch('/api/scores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    throw new Error(`HTTP hiba! státusz: ${response.status}`);
                }
                const result = await response.json();
            }
        } catch (error) {
            console.error("Hiba az eredmény mentésekor:", error);
        }
    };

    const generateNextNumber = (newScore: number) => {
        setPlayerInput('');
        const length = newScore + 1;
        let newNumber = '';
        for (let i = 0; i < length; i++) {
            if (i === 0) {
                newNumber += (Math.floor(Math.random() * 9) + 1).toString();
            } else {
                newNumber += Math.floor(Math.random() * 10).toString();
            }
        }
        setCurrentNumber(newNumber);
        setShowNumber(true);
        setTimeLeft(5);
    };

    const startNumberTimer = () => {
        resetTimers();

        countdownRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev > 1) {
                    return prev - 1;
                } else {
                    clearInterval(countdownRef.current!);
                    return 0;
                }
            });
        }, 1000);

        timerRef.current = setTimeout(() => {
            setShowNumber(false);
            clearInterval(countdownRef.current!);
        }, 5000);
    };

    const resetTimers = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
    };

    const startGame = () => {
        setGameStarted(true);
        setScore(0);
        setGameOver(false);
        generateNextNumber(0);
        startNumberTimer();
    };

    const checkInput = async () => {
        if (playerInput === currentNumber) {
            setScore((prevScore) => prevScore + 1);
        } else {
            await saveScoreToDatabase();
            setGameOver(true);
            resetTimers();
        }
    };

    const restartGame = () => {
        setGameStarted(true);
        setScore(0);
        setGameOver(false);
        generateNextNumber(0);
        startNumberTimer();
    };

    useEffect(() => {
        if (!gameOver && gameStarted) {
            generateNextNumber(score);
            startNumberTimer();
        }
    }, [score]);

    useEffect(() => {
        return () => {
            resetTimers();
        };
    }, []);
    useEffect(() => {
        if (!gameStarted) {
            fetchTopScores();
        }
    }, [gameStarted]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white">
            <div className="game-container text-center p-5">
                <div className="border-4 border-primary px-10 py-10 rounded-xl bg-primary">
                    {!gameStarted ? (
                        <div className="start-screen text-center max-w-xl w-full">
                            <h1 className="text-4xl font-bold mb-5 text-white tracking-widest">Number Memory Test</h1>
                            <p className="w-full justify-self-center text-xl text-white mb-5">A Number Memory Test-ben egy szám jelenik meg, ami egyjegyűvel kezdődik, és folyamatosan nő a hossza. 5 másodperced van megjegyezni, mielőtt be kell gépelned emlékezetből.</p>
                            <button
                                onClick={startGame}
                                className="px-4 py-2 rounded-md text-xl font-bold text-background bg-secondary border-2 border-primary hover:bg-background hover:text-secondary hover-scale"
                            >
                                Indítás
                            </button>
                            <h2 className="text-2xl font-bold mt-5 text-white">Legjobb Eredmények:</h2>
                            <ul className="top-scores mt-3">
                                {topScores
                                    .filter((score: Score) => score.score !== null && score.score !== undefined)
                                    .map((score: Score) => (
                                        <li key={score.id} className="text-md font-bold text-secondary">
                                            {score.playerName}: Number Memory Test - {score.score ?? "N/A"}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="game-screen text-center max-w-xl w-full">
                            <h1 className="text-4xl font-bold mb-5 text-white">Number Memory Test</h1>

                            {!gameOver ? (
                                <>
                                    {showNumber ? (
                                        <div className="number-display text-4xl font-bold my-5 text-white">
                                            <p className="text-secondary">{currentNumber}</p>
                                            <p className="text-xl font-bold mt-3">Hátralévő idő: <span className="text-xl font-bold text-red-500">{timeLeft} mp</span></p>
                                        </div>
                                    ) : (
                                        <div className="input-section my-5 flex-col">
                                            <label htmlFor="playerInput" className="block text-xl font-bold mb-2 text-white">
                                                Írd be a számot:
                                            </label>
                                            <input
                                                id="playerInput"
                                                type="text"
                                                className="text-secondary text-md font-bold border-4 border-white p-2 rounded"
                                                value={playerInput}
                                                onChange={(e) => setPlayerInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                      checkInput();
                                                    }
                                                  }}
                                            />
                                            <button
                                                onClick={checkInput}
                                                className="ml-3 px-4 py-2 rounded text-white text-xl font-bold bg-secondary hover:bg-white hover:text-secondary hover-scale"
                                            >
                                                Beküldés
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-xl font-bold mt-5 text-white">Pontszám: {score}</p>
                                </>
                            ) : (
                                <div className="game-over text-center mt-5">
                                    <h2 className="text-2xl font-bold text-red-500 mb-4">Játék vége!</h2>
                                    <p className="text-xl font-bold mb-5 text-white">Végső pontszámod: {score}</p>
                                    <button
                                        onClick={restartGame}
                                        className="px-4 py-2 rounded text-xl font-bold text-white bg-secondary hover:bg-white hover:text-secondary hover-scale"
                                    >
                                        Újrajátszás
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemoryGamePage;
