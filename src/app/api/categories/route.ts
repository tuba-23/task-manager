import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
    const data = await request.json();
    try {
        const newCategory = await prisma.category.create({ data });
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        if (!data.id) {
            return NextResponse.json(
                { error: 'Category ID is required' },
                { status: 400 }
            );
        }
        const { id, ...updates } = data;
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: updates,
        });
        return NextResponse.json(updatedCategory);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update category' },
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
                { error: 'Category ID is required' },
                { status: 400 }
            );
        }
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ message: 'Category deleted' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
