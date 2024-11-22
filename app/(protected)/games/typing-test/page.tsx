'use client';
import React, { useState, useEffect, useRef } from "react";
import {useSession} from "next-auth/react";
interface Score {
    id: number;
    playerName: string;
    typeScore: number;
    createdAt: string;
}
const TypingChallengeGame: React.FC = () => {
    const [codeSnippet, setCodeSnippet] = useState("");
    const [userInput, setUserInput] = useState("");
    const [elapsedTime, setElapsedTime] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [wpm, setWpm] = useState<number | null>(null);
    const timerRef = useRef<number | null>(null); // Use number for browser environment
    const [topScores, setTopScores] = useState<Score[]>([]);
    const { data: session, status } = useSession();
    const startTimeRef = useRef<number>(0);
    const words = [
        "apple", "banana", "orange", "grape", "strawberry", "blueberry", "cherry", "kiwi", "mango",
        "watermelon", "peach", "plum", "pineapple", "pear", "papaya", "lime", "lemon", "apricot",
        "coconut", "fig", "pomegranate", "raspberry", "blackberry", "avocado", "date", "guava",
        "nectarine", "dragonfruit", "passionfruit", "persimmon", "quince", "starfruit", "lychee",
        "durian", "cranberry", "elderberry", "mulberry", "boysenberry", "tangerine", "kumquat",
        "jackfruit", "sapodilla", "cantaloupe", "honeydew", "melon", "carambola", "soursop",
        "rhubarb", "longan", "physalis", "loganberry", "gooseberry", "breadfruit", "pricklypear",
        "sugarapple", "salak", "cherimoya", "feijoa", "medlar", "jambul", "bilberry", "huckleberry",
        "jostaberry", "marionberry", "cloudberry", "lingonberry", "rowanberry", "seabuckthorn",
        "olive", "currant", "caper", "goldenberry", "akee", "baobab", "cempedak", "jaboticaba",
        "mamoncillo", "miraclefruit", "naranjilla", "rambutan", "santol", "tamarind", "ugli",
        "voavanga", "yumberry", "zucchini", "spinach", "broccoli", "carrot", "onion", "tomato",
        "cucumber", "lettuce", "celery", "bellpepper", "radish", "beet", "pumpkin", "squash",
        "turnip", "cauliflower", "kale", "arugula", "brusselsprout", "leek", "chard", "peas",
        "greenbean", "eggplant", "artichoke", "asparagus", "okra", "mushroom", "garlic", "ginger",
        "turmeric", "potato", "sweetpotato", "yam", "cassava", "plantain", "corn", "rice", "quinoa",
        "millet", "sorghum", "wheat", "barley", "oats", "rye", "spelt", "buckwheat", "teff", "amaranth",
        "soybean", "lentil", "chickpea", "blackbean", "kidneybean", "pinto", "navybean", "lima",
        "adzuki", "mung", "fava", "peanut", "almond", "cashew", "walnut", "pistachio", "hazelnut",
        "pecan", "macadamia", "brazilnut", "chestnut", "acorn", "pine", "coconut", "cacao", "coffee",
        "tea", "sugarcane", "maple", "vanilla", "cinnamon", "pepper", "cardamom", "clove", "nutmeg",
        "mace", "saffron", "oregano", "basil", "thyme", "rosemary", "parsley", "cilantro", "dill",
        "mint", "tarragon", "sage", "marjoram", "chive", "bayleaf", "lemongrass", "fenugreek",
        "turmeric", "mustard", "horseradish", "wasabi", "sesame", "flax", "chia", "hemp", "poppy",
        "sunflower", "pumpkinseed", "watermelonseed", "cumin", "fennel", "caraway", "anise", "dandelion",
        "chamomile", "echinacea", "lavender", "valerian", "ginseng", "ginger", "turmeric", "licorice",
        "peppermint", "spearmint", "wintergreen", "yarrow", "elderflower", "hibiscus", "rosehip",
        "cranberry", "blackcurrant", "blueberry", "raspberry"
    ];
    const getRandomWords = (wordPool: string[], count: number) => {
        const shuffled = [...wordPool].sort(() => Math.random() - 0.5); // Shuffle the array
        return shuffled.slice(0, count).join(", "); // Take the first `count` words and join with a comma
    };

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setWpm(null);
        setUserInput("");
        setElapsedTime(0);
        // Select a random paragraph instead of generating random words
        const newSnippet = getRandomWords(words, 50);
        setCodeSnippet(newSnippet);

        // Reset accuracy and error tracking
        setAccuracy(100);
        setCorrectChars(0);
        setErrorCount(0);

        // Start tracking time from first keystroke instead of setting a timer
        startTimeRef.current = 0; // Will be set on first keystroke

        // Clear any existing timer
        if (timerRef.current) {
            clearInterval(timerRef.current);

        }
    };

    const endGame = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        const elapsedTime = (Date.now() - startTimeRef.current) / 1000; // Elapsed time in seconds
        const wordsTyped = userInput.trim().split(/\s+/).length; // Count words in user input
        const calculatedWpm = Math.round((wordsTyped / elapsedTime) * 60);
        setWpm(calculatedWpm);
        setGameOver(true);
    };
    const getWordCount = (text: string) => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const calculateAccuracy = (input: string, targetText: string) => {
        if (input.length === 0) return 100;
        let correct = 0;
        const inputLength = Math.min(input.length, targetText.length);

        for (let i = 0; i < inputLength; i++) {
            if (input[i] === targetText[i]) {
                correct++;
            }
        }

        return Math.floor((correct / inputLength) * 100);
    };

// Add these to your existing state declarations
    const [accuracy, setAccuracy] = useState<number>(100);
    const [correctChars, setCorrectChars] = useState<number>(0);
    const [errorCount, setErrorCount] = useState<number>(0);
    const calculateWpm = (userInput: string, elapsedTime: number): number => {
        const minutes = elapsedTime / 60;
        if (minutes === 0) return 0;

        // Get the gross words typed (every 5 characters counts as one word)
        const grossWords = userInput.length / 5;

        // Calculate error words (each error counts as one word penalty)
        const errorWords = errorCount / 5;

        // Calculate net WPM using the standard formula: ((all typed entries / 5) - errors) / time(minutes)
        const netWpm = Math.max(0, Math.round((grossWords - errorWords) / minutes));

        return netWpm;
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const targetText = codeSnippet; // Use your existing text variable name

        if (!gameStarted||startTimeRef.current===0) {
            setGameStarted(true);
            startTimeRef.current = Date.now();
        }
        timerRef.current = window.setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 100); // Update every 100ms for smooth display


        // Calculate errors and accuracy
        let newErrorCount = 0;
        let newCorrectChars = 0;

        for (let i = 0; i < newValue.length; i++) {
            if (i >= targetText.length) {
                newErrorCount++;
            } else if (newValue[i] !== targetText[i]) {
                newErrorCount++;
            } else {
                newCorrectChars++;
            }
        }

        setErrorCount(newErrorCount);
        setCorrectChars(newCorrectChars);
        setAccuracy(calculateAccuracy(newValue, targetText));
        setUserInput(newValue);

        // Calculate WPM based on elapsed time
        const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
        const currentWpm = calculateWpm(newValue, elapsedTime);
        setWpm(currentWpm);

        // Check if the text is completed
        if (newValue === targetText) {
            endGame();
        }
    };

    const preventCopyPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
    };

    const preventContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    
    const getHighlightedText = () => {
        const targetText = codeSnippet; // Use your existing text variable name
        return (
            <div style={{ whiteSpace: 'pre-wrap' }}>
                {targetText.split('').map((char, index) => {
                    let color = 'gray';
                    if (index < userInput.length) {
                        color = userInput[index] === char ? '#4CAF50' : '#FF5252';
                    }
                    return (
                        <span
                            key={index}
                            style={{
                                color,
                                backgroundColor: index === userInput.length ? '#e0e0e0' : 'transparent'
                            }}
                        >
                        {char}
                    </span>
                    );
                })}
            </div>
        );
    };
    const fetchTopScores = async () => {
        try {
            const response = await fetch('/api/scores');
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
        if (wpm && wpm > 0) {
            try {
                console.log("Saving score:", wpm);
                if (status === "authenticated" && session?.user?.name) {
                    const userName = session.user.name;
                    const payload = { name: userName, typeScore:wpm };
                    const response = await fetch('/api/scores', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const result = await response.json();
                    console.log("Score saved:", result);
                }
            } catch (error) {
                console.error("Error saving score:", error);
            }
        }}

    useEffect(() => {
        return () => clearInterval(timerRef.current!); // Cleanup timer
    }, []);
    useEffect(() => {
        if (!gameStarted) {
            fetchTopScores();
        }
    }, [gameStarted]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="game-container text-center p-8 bg-primary rounded-xl shadow-lg border-4 border-primary max-w-4xl w-full">
                {!gameStarted ? (
                    <div className="start-screen text-center w-full">
                        <h1 className="text-4xl font-bold mb-6 text-white">Typing Challenge</h1>
                        <p className="text-xl text-white mb-8">
                            Test your typing speed and accuracy by typing the words displayed
                            as fast as you can before the timer runs out!
                        </p>
                        <button
                            onClick={startGame}
                            className="px-6 py-3 rounded-lg text-xl font-bold text-white bg-secondary hover:bg-white hover:text-secondary hover-scale"
                        >
                            Start
                        </button>
                        <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Top Scores:</h2>
                        <ul className="top-scores space-y-2">
                            {topScores
                                .filter((score: Score) => score.typeScore !== null && score.typeScore !== undefined)
                                .map((score: Score) => (
                                    <li key={score.id} className="text-lg text-primary">
                                        {score.playerName}: Typing Speed - {score.typeScore ?? "N/A"} WPM
                                    </li>
                                ))}
                        </ul>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold mb-6 text-white">Typing Challenge</h1>

                        {!gameOver ? (
                            <>
                                <div className="text-left text-xl font-bold text-secondary mb-4">
                                    <p>Time Elapsed: <span className="font-bold text-red-500">{elapsedTime}s</span></p>
                                </div>
                                <pre 
                                    style={{
                                        textAlign: "justify",
                                        color: "lightgreen",
                                        fontSize: "1.2em",
                                        wordWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                        userSelect: "none",
                                        WebkitUserSelect: "none",
                                        MozUserSelect: "none",
                                        msUserSelect: "none",
                                    }} 
                                    className="code-snippet p-4 bg-gray-100 text-left rounded-lg text-md text-secondary border mb-4"
                                    onCopy={preventCopyPaste}
                                    onCut={preventCopyPaste}
                                    onPaste={preventCopyPaste}
                                    onContextMenu={preventContextMenu}
                                >
                                    {getHighlightedText()}
                                </pre>
                                <textarea
                                    value={userInput}
                                    onChange={handleInputChange}
                                    onCopy={preventCopyPaste}
                                    onCut={preventCopyPaste}
                                    onPaste={preventCopyPaste}
                                    onContextMenu={preventContextMenu}
                                    placeholder="Type the text here..."
                                    className="mt-4 p-3 border rounded-lg w-full text-md"
                                    style={{
                                        userSelect: "none",
                                        WebkitUserSelect: "none",
                                        MozUserSelect: "none",
                                        msUserSelect: "none",
                                    }}
                                />
                            </>
                        ) : (
                            <div className="game-over text-center mt-6">
                                <h2 className="text-3xl font-bold text-green-300 mb-4">Good job!</h2>
                                <p className="text-2xl font-bold mb-6 text-white">
                                    Your typing speed: <span className="font-bold text-green-300">{wpm || "N/A"} WPM</span>
                                </p>
                                <button
                                    onClick={saveScoreToDatabase}
                                    className="px-6 py-3 mr-4 rounded-lg text-xl font-bold text-white bg-secondary hover:bg-white hover:text-secondary hover-scale"
                                >
                                    Save Score
                                </button>
                                <button
                                    onClick={startGame}
                                    className="px-6 py-3 rounded-lg text-xl font-bold text-secondary bg-white hover:bg-secondary hover:text-white hover-scale"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default TypingChallengeGame;
