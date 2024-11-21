import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="grid grid-cols-4 gap-6">
          <Link href="/games/number-memory">
            <Button variant="game">
              <span>Number Memory Test</span>
            </Button>
          </Link>
          <Link href="/games/aim-trainer">
            <Button variant="game">
              <span>Aim Trainer</span>
            </Button>
          </Link>
          <Link href="/games/memory-test">
            <Button variant="game">
              <span>Memory Test</span>
            </Button>
          </Link>
          <Link href="/games/typing-test">
            <Button variant="game">
              <span>Typing Test</span>
            </Button>
          </Link>
        </div>
        <Link href="/scoreboard">
          <Button variant="scoreboard">
            <span>Scoreboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
