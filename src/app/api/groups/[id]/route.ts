import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const group = await prisma.group.findUnique({ where: { id } });
        if (!group) {
            return NextResponse.json(
                { error: 'Group not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(group);
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch group' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const data = await request.json();
        const updatedGroup = await prisma.group.update({ where: { id }, data });
        return NextResponse.json(updatedGroup);
    } catch {
        return NextResponse.json(
            { error: 'Failed to update group' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await prisma.group.delete({ where: { id } });
        return NextResponse.json({ message: 'Group deleted' });
    } catch {
        return NextResponse.json(
            { error: 'Failed to delete group' },
            { status: 500 }
        );
    }
}
