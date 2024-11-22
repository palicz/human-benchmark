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
            console.log('Response:', response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setTopScores(data);
        } catch (error) {
            console.error("Error fetching top scores:", error);
        }
    };


    const saveScoreToDatabase = async () => {
        try {
            if (status === "authenticated" && session?.user?.name) {
                const userName = session.user.name;
                // Use the userName variable as needed

                const payload = { name: userName, score };
                console.log('Sending payload:', payload);
                // Save the score in the database
                const response = await fetch('/api/scores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });// Replace with actual player name if you have one
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                console.log("Score saved:", result);
            }
        } catch (error) {
            console.error("Error saving score:", error);
        }
    };

    // Generate a random number string of increasing length
    const generateNextNumber = (newScore: number) => {
        setPlayerInput('');
        const length = newScore + 1; // Use the new score to determine length
        let newNumber = '';
        for (let i = 0; i < length; i++) {
            if (i === 0) {
                newNumber += (Math.floor(Math.random() * 9) + 1).toString(); // First digit cannot be 0
            } else {
                newNumber += Math.floor(Math.random() * 10).toString(); // Subsequent digits can be 0-9
            }
        }
        setCurrentNumber(newNumber);
        setShowNumber(true);
        setTimeLeft(5); // Reset the timer to 5 seconds
    };

    const startNumberTimer = () => {
        // Clear any existing timer and countdown
        resetTimers();

        // Start a countdown to display the remaining time
        countdownRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev > 1) {
                    return prev - 1; // Decrease timeLeft by 1 each second
                } else {
                    clearInterval(countdownRef.current!); // Stop the countdown when it reaches 0
                    return 0;
                }
            });
        }, 1000);

        // Start a timer to hide the number after 5 seconds
        timerRef.current = setTimeout(() => {
            setShowNumber(false);
            clearInterval(countdownRef.current!); // Clear countdown when hiding the number
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

    // Start the game
    const startGame = () => {
        setGameStarted(true);
        setScore(0);
        setGameOver(false);
        generateNextNumber(0); // Generate the first number
        startNumberTimer(); // Start the timer for the first number
    };

    // Check player input
    const checkInput = async () => {
        if (playerInput === currentNumber) {
            setScore((prevScore) => prevScore + 1);
        } else {
            await saveScoreToDatabase();
            setGameOver(true);
            resetTimers(); // Stop the timer if the game is over
        }
    };

    // Restart the game
    const restartGame = () => {
        setGameStarted(true);
        setScore(0);
        setGameOver(false);
        generateNextNumber(0); // Start from score 0
        startNumberTimer();
    };

    // Generate a new number whenever the score changes
    useEffect(() => {
        if (!gameOver && gameStarted) {
            generateNextNumber(score);
            startNumberTimer(); // Reset the timer for the new number
        }
    }, [score]);

    // Cleanup timers on component unmount
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
                            <h1 className="text-4xl font-bold mb-5 text-white tracking-widest">Number Memory Game</h1>
                            <p className="w-full justify-self-center text-xl text-white mb-5">The Number Memory Game is a task where a number appears starting with one digit and progressively increases in length, and you will have 5 seconds to memorize it before typing the number from memory.</p>
                            <button
                                onClick={startGame}
                                className="px-4 py-2 rounded-md text-xl font-bold text-background bg-secondary border-2 border-primary hover:bg-background hover:text-secondary hover-scale"
                            >
                                Start
                            </button>
                            <h2 className="text-2xl font-bold mt-5 text-white">Top Scores:</h2>
                            <ul className="top-scores mt-3">
                                {topScores
                                    .filter((score: Score) => score.score !== null && score.score !== undefined)
                                    .map((score: Score) => (
                                        <li key={score.id} className="text-lg text-white">
                                            {score.playerName}: Memory Game - {score.score ?? "N/A"}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="game-screen text-center max-w-xl w-full">
                            <h1 className="text-4xl font-bold mb-5 text-white">Number Memory Game</h1>

                            {!gameOver ? (
                                <>
                                    {showNumber ? (
                                        <div className="number-display text-4xl font-bold my-5 text-white">
                                            <p className="text-secondary">{currentNumber}</p>
                                            <p className="text-xl font-bold mt-3">Time Left: <span className="text-xl font-bold text-red-500">{timeLeft}s</span></p>
                                        </div>
                                    ) : (
                                        <div className="input-section my-5 flex-col">
                                            <label htmlFor="playerInput" className="block text-xl font-bold mb-2 text-white">
                                                Enter the number:
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
                                                Submit
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-xl font-bold mt-5 text-white">Score: {score}</p>
                                </>
                            ) : (
                                <div className="game-over text-center mt-5">
                                    <h2 className="text-2xl font-bold text-red-500 mb-4">Game Over!</h2>
                                    <p className="text-xl font-bold mb-5 text-white">Your final score: {score}</p>
                                    <button
                                        onClick={restartGame}
                                        className="px-4 py-2 rounded text-xl font-bold text-white bg-secondary hover:bg-white hover:text-secondary hover-scale"
                                    >
                                        Restart
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
