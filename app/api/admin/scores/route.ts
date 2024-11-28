import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";

const prisma = new PrismaClient();

interface GameScores {
  id: string;
  name: string;
  scores: Array<{
    rank: number;
    username: string;
    score: number | string;
    date: string;
  }>;
}

async function getFormattedScores() {
  const allScores = await prisma.scoreboard.findMany({
    select: {
      id: true,
      playerName: true,
      aimScore: true,
      typeScore: true,
      stroopScore: true,
      visualScore: true,
      score: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Format aim trainer scores
  const aimScores = allScores
    .filter(s => s.aimScore !== null)
    .sort((a, b) => (b.aimScore || 0) - (a.aimScore || 0))
    .map((score, index) => ({
      rank: index + 1,
      username: score.playerName,
      score: `${score.aimScore} points`,
      date: score.createdAt.toISOString(),
    }));

  // Format number memory scores
  const memoryScores = allScores
    .filter(s => s.score !== null)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .map((score, index) => ({
      rank: index + 1,
      username: score.playerName,
      score: `${score.score} points`,
      date: score.createdAt.toISOString(),
    }));

  // Format typing test scores
  const typingScores = allScores
    .filter(s => s.typeScore !== null)
    .sort((a, b) => (b.typeScore || 0) - (a.typeScore || 0))
    .map((score, index) => ({
      rank: index + 1,
      username: score.playerName,
      score: `${score.typeScore} WPM`,
      date: score.createdAt.toISOString(),
    }));

  // Format stroop test scores
  const stroopScores = allScores
    .filter(s => s.stroopScore !== null)
    .sort((a, b) => (b.stroopScore || 0) - (a.stroopScore || 0))
    .map((score, index) => ({
      rank: index + 1,
      username: score.playerName,
      score: `${score.stroopScore} points`, 
      date: score.createdAt.toISOString(),
    }));

  // Format visual memory test scores
  const visualScores = allScores
    .filter(s => s.visualScore !== null)
    .sort((a, b) => (b.visualScore || 0) - (a.visualScore || 0))
    .map((score, index) => ({
      rank: index + 1,
      username: score.playerName,
      score: `${score.visualScore} points`,
      date: score.createdAt.toISOString(),
    }));

  return [
    {
      id: "aim-trainer",
      name: "Aim Trainer",
      scores: aimScores,
    },
    {
      id: "number-memory",
      name: "Number Memory Test",
      scores: memoryScores,
    },
    {
      id: "typing-test",
      name: "Typing Test",
      scores: typingScores,
    },
    {
      id: "stroop-test",
      name: "Stroop Test",
      scores: stroopScores,
    },
    {
      id: "visual-memory",
      name: "Visual Memory Test",
      scores: visualScores,
    }
  ];
}

export async function GET() {
  try {
    const role = await currentRole();
    
    if (role !== UserRole.ADMIN) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formattedScores = await getFormattedScores();
    return NextResponse.json(formattedScores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const role = await currentRole();

    if (role !== UserRole.ADMIN) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const gameType = searchParams.get("gameType");

    if (!username || !gameType) {
      return new NextResponse("Missing username or gameType", { status: 400 });
    }

    const updateData: { [key: string]: null } = {};
    switch (gameType) {
      case "aim-trainer":
        updateData.aimScore = null;
        break;
      case "typing-test":
        updateData.typeScore = null;
        break;
      case "number-memory":
        updateData.score = null;
        break;
      case "stroop-test":
        updateData.stroopScore = null;
        break;
      case "visual-memory":
        updateData.visualScore = null;
        break;
      default:
        return new NextResponse("Invalid game type", { status: 400 });
    }

    const updatedScore = await db.scoreboard.update({
      where: { playerName: username },
      data: updateData,
    });

    return NextResponse.json(updatedScore);
  } catch (error) {
    console.error("[SCORE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 