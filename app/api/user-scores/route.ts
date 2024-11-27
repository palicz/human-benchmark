import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";

const prisma = new PrismaClient();

interface GameRanks {
    aimRank?: number;
    typeRank?: number;
    memoryRank?: number;
    stroopRank?: number;
    visualRank?: number;
}

async function calculateUserRanks(userName: string): Promise<GameRanks> {
    const allScores = await prisma.scoreboard.findMany({
        select: {
            playerName: true,
            aimScore: true,
            typeScore: true,
            score: true,
            stroopScore: true,
            visualScore: true,
        },
    });

    const ranks: GameRanks = {};

    if (allScores.length > 0) {
        // Calculate aim rank
        const aimScores = allScores
            .filter(s => s.aimScore !== null)
            .sort((a, b) => (b.aimScore || 0) - (a.aimScore || 0));
        const aimRank = aimScores.findIndex(s => s.playerName === userName) + 1;
        if (aimRank > 0) ranks.aimRank = aimRank;

        // Calculate type rank
        const typeScores = allScores
            .filter(s => s.typeScore !== null)
            .sort((a, b) => (b.typeScore || 0) - (a.typeScore || 0));
        const typeRank = typeScores.findIndex(s => s.playerName === userName) + 1;
        if (typeRank > 0) ranks.typeRank = typeRank;

        // Calculate memory rank
        const memoryScores = allScores
            .filter(s => s.score !== null)
            .sort((a, b) => (b.score || 0) - (a.score || 0));
        const memoryRank = memoryScores.findIndex(s => s.playerName === userName) + 1;
        if (memoryRank > 0) ranks.memoryRank = memoryRank;

        // Calculate stroop rank
        const stroopScores = allScores
            .filter(s => s.stroopScore !== null)
            .sort((a, b) => (b.stroopScore || 0) - (a.stroopScore || 0));
        const stroopRank = stroopScores.findIndex(s => s.playerName === userName) + 1;
        if (stroopRank > 0) ranks.stroopRank = stroopRank;

        // Calculate visual rank
        const visualScores = allScores
            .filter(s => s.visualScore !== null)
            .sort((a, b) => (b.visualScore || 0) - (a.visualScore || 0));
        const visualRank = visualScores.findIndex(s => s.playerName === userName) + 1;
        if (visualRank > 0) ranks.visualRank = visualRank;
    }

    return ranks;
}

export async function GET() {
    try {
        const session = await auth();
        
        if (!session?.user?.name) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userScores = await prisma.scoreboard.findUnique({
            where: { 
                playerName: session.user.name 
            },
            select: {
                aimScore: true,
                typeScore: true,
                score: true,
                stroopScore: true,
                visualScore: true,
            }
        });

        const ranks = await calculateUserRanks(session.user.name);

        return NextResponse.json({
            ...userScores,
            ranks
        });
    } catch (error) {
        console.error("Error fetching user scores:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
} 