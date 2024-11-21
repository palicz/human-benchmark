// pages/api/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const body = await req.json();

    try {
        const newScore = await prisma.scoreboard.create({
            data: { playerName: body.name, score: body.score },
        });
        return NextResponse.json(newScore, { status: 201 });
    } catch (error) {
        console.error('Error saving score:', error);
        return NextResponse.json({ error: 'Error saving score' }, { status: 500 });
    }
}

export async function GET() {
        // Fetch top scores
        try {
            const topScores = await prisma.scoreboard.findMany({
                orderBy: { score: 'desc' },
                take: 10,
            });
            return NextResponse.json(topScores);

        } catch (error) {
            console.error("Error fetching scores:", error);
            return NextResponse.json({ error: 'Error fetching scores' }, { status: 500 });
    }
}
