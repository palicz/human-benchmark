import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";

const prisma = new PrismaClient();

interface GameRanks {
    aimRank?: number;
    typeRank?: number;
    memoryRank?: number;
}

async function calculateUserRanks(userName: string): Promise<GameRanks> {
    const allScores = await prisma.scoreboard.findMany({
        select: {
            playerName: true,
            aimScore: true,
            typeScore: true,
            score: true,
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