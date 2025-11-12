import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    const groups = await prisma.group.findMany();
    return NextResponse.json(groups);
}

export async function POST(request: NextRequest) {
    const data = await request.json();
    try {
        const newGroup = await prisma.group.create({ data });
        return NextResponse.json(newGroup, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create group' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        if (!data.id) {
            return NextResponse.json(
                { error: 'Group ID is required' },
                { status: 400 }
            );
        }
        const { id, ...updates } = data;
        const updatedGroup = await prisma.group.update({
            where: { id },
            data: updates,
        });
        return NextResponse.json(updatedGroup);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update group' },
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
                { error: 'Group ID is required' },
                { status: 400 }
            );
        }
        await prisma.group.delete({ where: { id } });
        return NextResponse.json({ message: 'Group deleted' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete group' },
            { status: 500 }
        );
    }
}
