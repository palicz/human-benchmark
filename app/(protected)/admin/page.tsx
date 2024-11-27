"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/app/(protected)/admin/_components/user-management";
import { ScoreboardManagement } from "@/app/(protected)/admin/_components/scoreboard-management";
import { AdminHeader } from "@/app/(protected)/admin/_components/admin-header";
import { Navbar } from "@/components/layout/navbar";
import { motion } from "framer-motion";
import {Brain, Crosshair, Timer, Eye} from 'lucide-react';

export default function AdminPage() {
  return (
    <RoleGate allowedRole={UserRole.ADMIN}>
      <div className="min-h-screen">
        <Navbar />
        <div className="h-16" />
        <div className="w-full h-px bg-border" />

        <main className="py-8 bg-gradient-to-b from-background to-secondary/20 p-6">
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
    </RoleGate>
  );
}