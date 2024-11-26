"use client";

import { motion } from "framer-motion";
import { Brain, Timer, Trophy, ArrowRight, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";
import { useState, useEffect } from "react";

const games = [
  {
    id: "aim-trainer",
    name: "Aim Trainer",
    description: "Test your reflexes with split-second timing challenges",
    icon: Crosshair,
    color: "from-yellow-500 to-orange-500",
    delay: 0.1,
  },
  {
    id: "number-memory",
    name: "Number Memory Test",
    description: "Challenge your memory with increasingly complex numbers",
    icon: Brain,
    color: "from-blue-500 to-indigo-500",
    delay: 0.2,
  },
  {
    id: "typing-test",
    name: "Typing Test",
    description: "Test your typing speed and accuracy",
    icon: Timer,
    color: "from-green-500 to-emerald-500",
    delay: 0.3,
  },
  {
    id: "memory-test",
    name: "Memory Test",
    description: "Challenge your memory with pattern recognition",
    icon: Trophy,
    color: "from-purple-500 to-pink-500",
    delay: 0.4,
  },
];

export default function Home() {
  const [highlightGames, setHighlightGames] = useState(false);

  useEffect(() => {
    if (highlightGames) {
      const timer = setTimeout(() => setHighlightGames(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightGames]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="relative h-24 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute"
              >
                <Brain className="w-20 h-20 text-primary" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
              >
                Challenge Your Brain
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Train your cognitive skills with our scientifically designed games.
              Compete with players worldwide and track your progress.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button size="lg" asChild onClick={() => setHighlightGames(true)}>
                  <a href="#games">Start Playing</a>
                </Button>
              </motion.div>
              <Button size="lg" variant="outline" asChild>
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            animate={{
              boxShadow: highlightGames
                ? "0 0 20px 10px rgba(var(--primary-rgb), 0.3)"
                : "none",
            }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-8"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12"
            >
              Choose Your Challenge
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: game.delay }}
                  viewport={{ once: true }}
                  className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${game.color} p-1`}
                >
                  <div className="bg-background rounded-lg p-6 h-full">
                    <game.icon className="w-12 h-12 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
                    <p className="text-muted-foreground mb-4">{game.description}</p>
                    <Button className="w-full" variant="secondary" asChild>
                      <Link href={`/games/${game.id}`}>
                        Play Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Active Players", value: "10K+" },
              { label: "Games Played", value: "1M+" },
              { label: "Global Rankings", value: "100K+" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Belt Section */}
      <section>

      </section>
    </div>
  );
}