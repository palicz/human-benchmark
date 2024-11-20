'use client';

import React, { useState, useEffect, useRef } from 'react';

const MemoryGamePage = () => {
    const [currentNumber, setCurrentNumber] = useState('');
    const [playerInput, setPlayerInput] = useState('');
    const [score, setScore] = useState(0);
    const [showNumber, setShowNumber] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5); // Timer state
    const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref to manage the timer
    const countdownRef = useRef<NodeJS.Timeout | null>(null); // Ref to manage the countdown interval

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
    const checkInput = () => {
        if (playerInput === currentNumber) {
            setScore((prevScore) => prevScore + 1);
        } else {
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

    return (
        <div className="game-container text-center p-5">
            {!gameStarted ? (
                <div className="start-screen text-center">
                    <h1 className="text-3xl font-bold mb-5">Number Memory Game</h1>
                    <button
                        onClick={startGame}
                        className="px-4 py-2 bg-blue-500 text-white rounded text-lg"
                    >
                        Start
                    </button>
                </div>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-5">Number Memory Game</h1>

                    {!gameOver ? (
                        <>
                            {showNumber ? (
                                <div className="number-display text-4xl font-bold my-5">
                                    <p>{currentNumber}</p>
                                    <p className="text-lg text-gray-600 mt-3">Time Left: {timeLeft}s</p>
                                </div>
                            ) : (
                                <div className="input-section my-5">
                                    <label htmlFor="playerInput" className="block text-lg mb-2">
                                        Enter the number:
                                    </label>
                                    <input
                                        id="playerInput"
                                        type="text"
                                        className="border p-2 rounded"
                                        value={playerInput}
                                        onChange={(e) => setPlayerInput(e.target.value)}
                                    />
                                    <button
                                        onClick={checkInput}
                                        className="ml-3 px-4 py-2 bg-blue-500 text-white rounded"
                                    >
                                        Submit
                                    </button>
                                </div>
                            )}
                            <p className="text-lg mt-5">Score: {score}</p>
                        </>
                    ) : (
                        <div className="game-over text-center mt-5">
                            <h2 className="text-2xl font-bold text-red-600 mb-4">Game Over!</h2>
                            <p className="text-lg mb-5">Your final score: {score}</p>
                            <button
                                onClick={restartGame}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Restart
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MemoryGamePage;
