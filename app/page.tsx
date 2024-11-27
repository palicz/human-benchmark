"use client";

import { motion } from "framer-motion";
import { Brain, Timer, ArrowRight, Crosshair, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";
import { Link as CustomRedirect } from "@/components/ui/link"
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Footer from "@/components/layout/footer";

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
    id: "visual-memory-test",
    name: "Visual Memory Test",
    description: "Challenge your memory with pattern recognition",
    icon: Eye,
    color: "from-purple-500 to-pink-500",
    delay: 0.4,
  },
];


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
                <CustomRedirect href="/leaderboard">View Leaderboard</CustomRedirect>
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
                      <CustomRedirect href={`/games/${game.id}`}>
                        Play Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </CustomRedirect>
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
      
      {/* Info section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                value: "item-1",
                title: "Science Behind The Tests",
                content: "The tests, including the Number Memory Test, Visual Memory Test, Aim Training Test, and Typing Test, are designed to assess and enhance cognitive functions such as memory retention, hand-eye coordination, and typing speed. Each test utilizes specific tasks to challenge and improve the user's mental agility, focus, and accuracy, providing valuable insights into their cognitive abilities and progress over time."
              },
              {
                value: "item-2",
                title: "Cognitive Benefits of Training",
                content: "Engaging in cognitive training exercises, such as those offered in our tests, can lead to significant improvements in memory, attention, and processing speed. Regular practice not only enhances these skills but also promotes overall brain health and resilience against cognitive decline."
              },
              {
                value: "item-3",
                title: "User Progress Tracking",
                content: "Our platform provides users with detailed progress tracking, allowing them to monitor their performance over time across various tests. This feature enables users to identify strengths and areas for improvement, fostering a personalized training experience that adapts to their evolving needs."
              },
              {
                value: "item-4",
                title: "Tips for Improving Performance",
                content: "To maximize your performance in our tests, consider incorporating regular practice sessions, maintaining a healthy lifestyle, and utilizing memory techniques such as visualization and chunking. Additionally, staying focused and minimizing distractions during training can significantly enhance your results and overall cognitive function."
              }
            ].map((item, index) => (
              <motion.div
                key={item.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.2 }}
              >
                <AccordionItem value={item.value}>
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-16 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6">
          <Footer />
        </div>
      </section>
    </div>
  );
}