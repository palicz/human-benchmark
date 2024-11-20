'use client';

import React, { useState, useEffect } from 'react';

const MemoryGamePage = () => {
    const [currentNumber, setCurrentNumber] = useState('');
    const [playerInput, setPlayerInput] = useState('');
    const [score, setScore] = useState(0);
    const [showNumber, setShowNumber] = useState(true);
    const [gameOver, setGameOver] = useState(false);

    // Generate a random number string of increasing length
    const generateNextNumber = () => {
        setPlayerInput('');
        const nextLength = score + 1;
        let newNumber = '';
        for (let i = 0; i < nextLength; i++) {
            newNumber += Math.floor(Math.random() * 10).toString();
        }
        setCurrentNumber(newNumber);
        setShowNumber(true);

        // Hide the number after 5 seconds
        setTimeout(() => {
            setShowNumber(false);
        }, 5000);
    };

    // Check player input
    const checkInput = () => {
        if (playerInput === currentNumber) {
            setScore(score + 1);
            generateNextNumber();
        } else {
            setGameOver(true);
        }
    };

    // Restart the game
    const restartGame = () => {
        setScore(0);
        setGameOver(false);
        generateNextNumber();
    };

    // Start the game on initial render
    useEffect(() => {
        generateNextNumber();
    }, []);

    return (
        <div className="game-container text-center p-5">
            <h1 className="text-3xl font-bold mb-5">Number Memory Game</h1>

            {!gameOver ? (
                <>
                    {showNumber ? (
                        <div className="number-display text-4xl font-bold my-5">
                            <p>{currentNumber}</p>
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
        </div>
    );
};

export default MemoryGamePage;
