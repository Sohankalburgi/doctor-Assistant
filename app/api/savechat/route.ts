// app/api/chats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/db";   // where your singleton file lives

export async function POST(request: NextRequest) {
    try {
        const { userId, chats, patientName, patientAge, patientGender } = await request.json();

        if (!userId || !chats) {
            return NextResponse.json(
                { error: 'userId and chats are required' },
                { status: 400 }
            );
        }

        // Verify user exists
        const userExists = await prisma.user.findUnique({
            where: { id: Number(userId) }
        });

        if (!userExists) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const chatRecord = await prisma.chat.create({
            data: {
                userId: Number(userId),
                chats,
                patientName,
                patientAge: patientAge ? Number(patientAge) : undefined,
                patientGender,
            },
        });

        return NextResponse.json(
            { chat: chatRecord },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Chat save error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
