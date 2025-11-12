import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
    const data = await request.json();
    if (data.date) {
        data.date = new Date(data.date).toISOString();
    }
    try {
        const newTask = await prisma.task.create({ data });
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: 'Failed to create task' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        if (data.date) {
            data.date = new Date(data.date).toISOString();
        }
        if (!data.id) {
            return NextResponse.json(
                { error: 'Task ID is required' },
                { status: 400 }
            );
        }
        const { id, ...updates } = data;
        const updatedTask = await prisma.task.update({
            where: { id },
            data: updates,
        });
        return NextResponse.json(updatedTask);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update task' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json(
                { error: 'Task ID is required' },
                { status: 400 }
            );
        }
        await prisma.task.delete({ where: { id } });
        return NextResponse.json({ message: 'Task deleted' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete task' },
            { status: 500 }
        );
    }
}
