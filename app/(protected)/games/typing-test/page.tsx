"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Timer, Brain, Crosshair, Eye } from 'lucide-react';
import { Button } from "@/app/(protected)/games/typing-test/_components/typing-button";
import { Card } from "@/app/(protected)/games/typing-test/_components/typing-card";
import { Input } from "@/app/(protected)/games/typing-test/_components/typing-input";
import { TypingStats } from "@/app/(protected)/games/typing-test/_components/typing-stats";
import { Progress } from "@/components/ui/progress"
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";

const words = ["ability", "able", "about", "above", "accept", "according", "account", "across", "action", "actually", "add", "address", "administration", "admit", "adult", "affect", "after", "again", "against", "age", "agency", "agent", "ago", "agree", "agreement", "ahead", "air", "all", "allow", "almost", "alone", "along", "already", "also", "although", "always", "American", "among", "amount", "analysis", "and", "animal", "another", "answer", "any", "anyone", "anything", "appear", "apply", "approach", "area", "argue", "arm", "around", "arrive", "article", "artist", "ask", "assume", "attack", "attention", "attorney", "audience", "author", "available", "avoid", "away", "baby", "back", "bad", "bag", "ball", "bank", "bar", "base", "beautiful", "because", "become", "bed", "before", "begin", "behavior", "behind", "believe", "benefit", "best", "better", "between", "beyond", "big", "bill", "billion", "bit", "black", "blood", "blue", "board", "body", "book", "born", "both", "box", "boy", "break", "bring", "brother", "budget", "build", "building", "business", "buy", "call", "camera", "campaign", "can", "cancer", "candidate", "capital", "car", "card", "care", "career", "carry", "case", "catch", "cause", "cell", "center", "central", "century", "certain", "certainly", "chair", "challenge", "chance", "change", "character", "charge", "check", "child", "choice", "choose", "church", "citizen", "city", "civil", "claim", "class", "clear", "clearly", "close", "coach", "cold", "collection", "college", "color", "come", "commercial", "common", "community", "company", "compare", "computer", "concern", "condition", "conference", "Congress", "consider", "consumer", "contain", "continue", "control", "cost", "could", "country", "couple", "course", "court", "cover", "create", "crime", "cultural", "culture", "cup", "current", "customer", "cut", "dark", "data", "daughter", "day", "dead", "deal", "death", "debate", "decade", "decide", "decision", "deep", "defense", "degree", "Democrat", "democratic", "describe", "design", "despite", "detail", "determine", "develop", "development", "die", "difference", "different", "difficult", "dinner", "direction", "director", "discover", "discuss", "discussion", "disease", "do", "doctor", "dog", "door", "down", "draw", "dream", "drive", "drop", "drug", "during", "each", "early", "east", "easy", "economic", "economy", "edge", "education", "effect", "effort", "eight", "either", "election", "else", "employee", "end", "energy", "enjoy", "enough", "enter", "entire", "environment", "environmental", "especially", "establish", "even", "evening", "event", "ever", "every", "everybody", "everyone", "everything", "evidence", "exactly", "example", "executive", "exist", "expect", "experience", "expert", "explain", "eye", "face", "fact", "factor", "fail", "fall", "family", "far", "fast", "father", "fear", "federal", "feel", "feeling", "few", "field", "fight", "figure", "fill", "film", "final", "finally", "financial", "find", "fine", "finger", "finish", "fire", "firm", "first", "fish", "five", "floor", "fly", "focus", "follow", "food", "foot", "for", "force", "foreign", "forget", "form", "former", "forward", "four", "free", "friend", "from", "front", "full", "fund", "future", "game", "garden", "gas", "general", "generation", "get", "girl", "give", "glass", "go", "goal", "good", "government", "great", "green", "ground", "group", "grow", "growth", "guess", "gun", "guy", "hair", "half", "hand", "hang", "happen", "happy", "hard", "have", "head", "health", "hear", "heart", "heat", "heavy", "help", "her", "here", "herself", "high", "him", "himself", "his", "history", "hit", "hold", "home", "hope", "hospital", "hot", "hotel", "hour", "house", "how", "however", "huge", "human", "hundred", "husband", "idea", "identify", "if", "image", "imagine", "impact", "important", "improve", "in", "include", "including", "increase", "indeed", "indicate", "individual", "industry", "information", "inside", "instead", "institution", "interest", "interesting", "international", "interview", "into", "investment", "involve", "issue", "it", "item", "its", "itself", "job", "join", "just"];

const totalWords = 60;

const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export default function TypingSpeedTestGame() {
    const [gameState, setGameState] = useState<"ready" | "playing" | "gameover">("ready");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [wpm, setWpm] = useState(0);
    const { data: session } = useSession();
    const [startTime, setStartTime] = useState<number | null>(null);
    const [highScore, setHighScore] = useState<number | null>(null);
    const [rank, setRank] = useState<number | null>(null);
    const [remainingWords, setRemainingWords] = useState<string[]>([]);

    const startGame = () => {
        const shuffledWords = shuffleArray([...words]);
        setRemainingWords(shuffledWords.slice(0, totalWords));
        setGameState("playing");
        setCurrentWordIndex(0);
        setInputValue("");
        setStartTime(Date.now());
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
    
        if (value === remainingWords[currentWordIndex]) {
            setCurrentWordIndex((prevIndex) => prevIndex + 1);
            setInputValue("");
    
            if (currentWordIndex + 1 >= remainingWords.length) {
                setGameState("gameover");
                saveScore();
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

    useEffect(() => {
        fetchHighScore();
    }, [session, wpm]);

    const progressValue = (currentWordIndex / totalWords) * 100;

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
                            <div className="p-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 inline-block">
                                <Timer className="w-8 h-8 text-green-500" />
                            </div>
                        </motion.div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-500">
                            Typing Speed Test
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Type the word as fast as you can!
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
                                    <div className="relative h-auto bg-grey-500/30 overflow-hidden text-2xl font-semibold flex justify-center items-center ">
                                        <span className="text-4xl select-none">
                                            {Array.from(remainingWords[currentWordIndex]).map((letter, index) => {
                                                const inputLetter = inputValue[index];
                                                const isCorrect = inputLetter === letter;
                                                const isIncorrect = inputLetter !== undefined && !isCorrect;

                                                return (
                                                    <span key={index} className={isCorrect ? "text-green-500" : isIncorrect ? "text-red-500" : ""}>
                                                        {letter}
                                                    </span>
                                                );
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center w-full gap-4">
                                    <Input
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        className="mt-4 text-center text-2xl font-bold opacity-30"
                                        autoFocus
                                    />
                                    <Progress value={progressValue} className="max-w-xl w-full"/>
                                    </div>
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
                                    <h2 className="text-4xl font-semibold text-green-500">Good Job!</h2>
                                    <div className="space-y-4">
                                        <p className="text-xl">Your WPM: {wpm}</p>
                                        <Button
                                            onClick={() => {
                                                setGameState("ready");
                                                setInputValue("");
                                                setCurrentWordIndex(0);
                                                setWpm(0);
                                                setRemainingWords([]);
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
                            <li>Type the word as it appears on the screen</li>
                            <li>Press space to submit your answer</li>
                            <li>The game ends when you type all the 60 words</li>
                            <li>Try to achieve the highest WPM!</li>
                            <li>The bar under will show your progress across the words!</li>
                        </ul>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}