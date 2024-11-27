import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import { Inter } from 'next/font/google';
import { NavigationEvents } from "@/components/layout/navigation-events";
import { LoadingAnimation } from "@/components/layout/loading-animation";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BrainGames - Challenge Your Mind',
  description: 'Train your cognitive skills with our scientifically designed games',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Toaster />
          <NavigationEvents />
          <LoadingAnimation />
          {children}
          </SessionProvider>
      </body>
    </html>
  );
}
