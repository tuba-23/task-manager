import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { title } = await req.json();

        if (!title || typeof title !== 'string') {
            return NextResponse.json(
                { error: 'Invalid or missing title' },
                { status: 400 }
            );
        }

        // Create new chat thread in DB with title and empty thread
        const newChatThread = await prisma.chatThread.create({
            data: {
                title: title,
                thread: [],
            },
        });

        return NextResponse.json({ id: newChatThread.id });
    } catch (error) {
        console.error('Failed to create chat thread:', error);
        return NextResponse.json(
            { error: 'Failed to create chat thread' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const chatThreads = await prisma.chatThread.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ data: chatThreads });
    } catch (error) {
        console.error('Failed to fetch chat threads:', error);
        return NextResponse.json(
            { error: 'Failed to fetch chat threads' },
            { status: 500 }
        );
    }
}
