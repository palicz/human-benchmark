"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/app/(protected)/admin/_components/user-management";
import { ScoreboardManagement } from "@/app/(protected)/admin/_components/scoreboard-management";
import { AdminHeader } from "@/app/(protected)/admin/_components/admin-header";
import { Navbar } from "@/components/layout/navbar";
import { motion } from "framer-motion";
import {Brain, Crosshair, Timer, Eye} from 'lucide-react';

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

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="h-16" />
      <div className="w-full h-px bg-border" />

      <main className="py-8 bg-gradient-to-b from-background to-secondary/20 p-6">
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
        <div className="max-w-7xl mx-auto space-y-8">
          <AdminHeader />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="scoreboards">Scoreboards</TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="mt-6">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="scoreboards" className="mt-6">
                <ScoreboardManagement />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
}