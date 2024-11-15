"use client";

import * as React from "react"
import Link from "next/link"
import { LogIn } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button"
import { UserButton } from "@/components/auth/user-button"

export default function SimpleNavbar() {
  const { status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="h-6 w-6 rounded-full bg-primary" />
            <span className="font-bold">Human Benchmark</span>
          </Link>
          {status === "authenticated" ? (
            <UserButton />
          ) : (
            <LoginButton>
              <Button variant="default">
                <LogIn className="mr-2 h-4 w-4" /> Bejelentkezés
              </Button>
            </LoginButton>
          )}
        </div>
      </div>
    </header>
  )
}