// pages/api/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const body = await req.json();
    const { name, score, aimScore, typeScore } = body;

    try {
        const existingScore = await prisma.scoreboard.findUnique({
            where: { playerName: name },
        });

        if (existingScore) {
            // Only update if the new score is higher
                const updatedScore = await prisma.scoreboard.update({
                    where: { playerName: name },
                    data: {
                        score: score !== undefined && score > (existingScore.score ?? 0) ? score : existingScore.score,
                        aimScore: aimScore !== undefined && aimScore > (existingScore.aimScore ?? 0) ? aimScore : existingScore.aimScore,
                        typeScore:typeScore!==undefined&&typeScore>(existingScore.typeScore??0)?typeScore:existingScore.typeScore,
                    },
                });
                return NextResponse.json(updatedScore, { status: 200 });


            // If the score is not higher, return a message
            return NextResponse.json(
                { message: 'New score is not higher than the existing score.' },
                { status: 200 }
            );
        }
        const newScore = await prisma.scoreboard.create({
            data: { playerName: name, score, aimScore,typeScore },
        });
        return NextResponse.json(newScore, { status: 201 });
    } catch (error) {
        console.error('Error saving score:', error);
        return NextResponse.json({ error: 'Error saving score' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const scores = await prisma.scoreboard.findMany({
            orderBy: [
                {score: 'desc' },
                {aimScore:'desc'},
                {typeScore:'desc'}
            ],
            take: 10,
        });
        
        return NextResponse.json(scores);
    } catch (error) {
        console.error("Error fetching scores:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
