// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/db";   // where your singleton file lives


export async function POST(request: NextRequest) {
    try {
        const { email, name, password, certificateId, location } = await request.json();

        // location is mandatory
        if (!email || !password || !certificateId || !location) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 409 }
            );
        }

        const existingCertificate = await prisma.user.findUnique({ where: { certificateId } });
        if (existingCertificate) {
            return NextResponse.json(
                { error: 'Certificate already registered' },
                { status: 409 }
            );
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password,        // hash in production
                certificateId,
                location,        // <- mandatory now
            },
        });

        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
