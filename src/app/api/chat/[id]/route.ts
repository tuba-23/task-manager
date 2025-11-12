import prisma from '@/lib/db';
import { categoryTools, groupTools, taskTools } from '@/lib/tools';
import { google } from '@ai-sdk/google';
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { messages }: { messages: UIMessage[] } = await req.json();

    const coreMessages = convertToModelMessages(messages);

    const result = streamText({
        model: google('gemini-2.5-flash'),
        messages: convertToModelMessages(messages),
        system: `You are an AI assistant specialized in managing tasks, groups, and categories for a Task Manager application. You are NOT to provide answers or engage in topics outside of this domain.

When adding tasks, always ask the user which group the tasks belong to. If the user provides only the group name, use the 'getGroups' tool to retrieve its ID.

For updating tasks, if the user lacks task IDs, use 'getTasksByGroupId' or 'getTasks' to locate the correct tasks.

You can perform add, update, and delete operations only for tasks, groups, and categories using the provided tools.

Any queries unrelated to task management should be politely declined.

Always follow these guidelines strictly to maintain context and relevance within the task management scope.`,
        tools: { ...taskTools, ...groupTools, ...categoryTools },
        stopWhen: stepCountIs(10),
        onFinish: async ({ response }) => {
            try {
                const savedchats = await prisma.chatThread.update({
                    where: {
                        id,
                    },
                    data: {
                        thread: [...coreMessages, ...response.messages] as any,
                    },
                });
            } catch (error) {
                console.error('Failed to save chat:', error);
            }
        },
    });

    return result.toUIMessageStreamResponse({
        originalMessages: messages,
        onFinish: async ({ messages }) => {
            const savedchats = await prisma.chatThread.update({
                where: {
                    id,
                },
                data: {
                    thread: messages as any,
                },
            });
        },
    });
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const chatThread = await prisma.chatThread.findUnique({
            where: { id: id },
        });

        if (!chatThread) {
            return NextResponse.json(
                { error: 'Chat thread not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ thread: chatThread.thread });
    } catch (error) {
        console.error('Failed to fetch chat thread:', error);
        return NextResponse.json(
            { error: 'Failed to fetch chat thread' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const { title } = await req.json();
        if (!title || typeof title !== 'string') {
            return NextResponse.json(
                { error: 'Invalid or missing title' },
                { status: 400 }
            );
        }
        const updated = await prisma.chatThread.update({
            where: { id },
            data: { title },
        });
        return NextResponse.json({ data: updated });
    } catch (error) {
        console.error('Failed to update chat thread:', error);
        return NextResponse.json(
            { error: 'Failed to update chat thread' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await prisma.chatThread.delete({ where: { id } });
        return NextResponse.json({ message: 'Chat thread deleted' });
    } catch (error) {
        console.error('Failed to delete chat thread:', error);
        return NextResponse.json(
            { error: 'Failed to delete chat thread' },
            { status: 500 }
        );
    }
}
