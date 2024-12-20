// pages/api/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface SelectFields {
    id: boolean;
    playerName: boolean;
    createdAt: boolean;
    aimScore?: boolean;
    score?: boolean;
    typeScore?: boolean;
    stroopScore?: boolean;
    visualScore?: boolean;
    reactionScore?:boolean;
}

export async function POST(req: Request) {
    const maxIdRecord = await prisma.scoreboard.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
    });

    // Determine the new id (maxId + 1 or default to 1 if no records exist)
    const newId = (maxIdRecord?.id || 0) + 1;
    const body = await req.json();
    const { name, score, aimScore, typeScore, stroopScore, visualScore,reactionScore } = body;

    try {
        const existingScore = await prisma.scoreboard.findUnique({
            where: { playerName: name },
        });

        if (existingScore) {
            const updatedScore = await prisma.scoreboard.update({
                where: { playerName: name },
                data: {
                    score: score !== undefined && score > (existingScore.score ?? 0) ? score : existingScore.score,
                    aimScore: aimScore !== undefined && aimScore > (existingScore.aimScore ?? 0) ? aimScore : existingScore.aimScore,
                    typeScore: typeScore !== undefined && typeScore > (existingScore.typeScore ?? 0) ? typeScore : existingScore.typeScore,
                    stroopScore: stroopScore !== undefined && stroopScore > (existingScore.stroopScore ?? 0) ? stroopScore : existingScore.stroopScore,
                    visualScore: visualScore !== undefined && visualScore > (existingScore.visualScore ?? 0) ? visualScore : existingScore.visualScore,
                    reactionScore: reactionScore !== null && (existingScore.reactionScore === null || reactionScore < existingScore.reactionScore)
                        ? reactionScore
                        : existingScore.reactionScore,
                },
            });
            return NextResponse.json(updatedScore, { status: 200 });
        }

        const newScore = await prisma.scoreboard.create({
            data: { id:newId,playerName: name, score, aimScore, typeScore, stroopScore, visualScore ,reactionScore},
        });

        return NextResponse.json(newScore, { status: 201 });
    } catch (error) {
        console.error('Error saving score:', error);
        return NextResponse.json({ error: 'Error saving score' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const game = searchParams.get('game');

        let selectFields: SelectFields = {
            id: true,
            playerName: true,
            createdAt: true,
        };

        switch (game) {
            case 'aim-trainer':
                selectFields = { ...selectFields, aimScore: true };
                break;
            case 'number-memory':
                selectFields = { ...selectFields, score: true };
                break;
            case 'typing-test':
                selectFields = { ...selectFields, typeScore: true };
                break;
            case 'stroop-test':
                selectFields = { ...selectFields, stroopScore: true };
                break;
            case 'visual-memory-test':
                selectFields = { ...selectFields, visualScore: true };
                break;
            case 'reaction-time':
                selectFields={...selectFields,reactionScore:true}
            default:
                break;
        }

        const scores = await prisma.scoreboard.findMany({
            select: selectFields,
            where: {
                ...(game === 'aim-trainer' && { aimScore: { not: null } }),
                ...(game === 'number-memory' && { score: { not: null } }),
                ...(game === 'typing-test' && { typeScore: { not: null } }),
                ...(game === 'stroop-test' && { stroopScore: { not: null } }),
                ...(game === 'visual-memory-test' && { visualScore: { not: null } }),
                ...(game === 'reaction-time' && { reactionScore: { not: null } }),
            },
            orderBy: [
                ...(game === 'aim-trainer' ? [{ aimScore: Prisma.SortOrder.desc }] : []),
                ...(game === 'number-memory' ? [{ score: Prisma.SortOrder.desc }] : []),
                ...(game === 'typing-test' ? [{ typeScore: Prisma.SortOrder.desc }] : []),
                ...(game === 'stroop-test' ? [{ stroopScore: Prisma.SortOrder.desc }] : []),
                ...(game === 'visual-memory-test' ? [{ visualScore: Prisma.SortOrder.desc }] : []),
                ...(game === 'reaction-time' ? [{ reactionScore: Prisma.SortOrder.asc }] : []),
            ],
            take: 100, // Limit results for better performance
        });
        
        return NextResponse.json(scores);
    } catch (error) {
        console.error("Error fetching scores:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
