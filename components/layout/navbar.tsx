"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Menu, X, User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSession } from "next-auth/react";
import { UserButton } from "@/components/auth/user-button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      return null;
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Games", href: "/#games" },
    { name: "Leaderboard", href: "/leaderboard" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl">BrainGames</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors" 
              >
                {item.name}
              </Link>
            ))}
            {status === "loading" ? (
              <Button disabled>
                <span className="animate-pulse">Loading...</span>
              </Button>
            ) : status === "authenticated" ? (
              <UserButton />
            ) : (
              <Link href={`/auth/login`}>
                <Button>
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
                {status === "loading" ? (
                  <Button disabled>
                    <span className="animate-pulse">Loading...</span>
                  </Button>
                ) : status === "authenticated" ? (
                  <UserButton />
                ) : (
                  <Button className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}