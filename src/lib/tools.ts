import prisma from '@/lib/db';
import { tool } from 'ai';
import { z } from 'zod';

export const taskTools = {
    addTask: tool({
        description: 'Add a new task',
        inputSchema: z.object({
            title: z.string().describe('Task title'),
            description: z.string().optional(),
            status: z.enum(['todo', 'inprogress', 'done']).optional(),
            date: z.string().optional(), // ISO string
            priority: z.enum(['low', 'medium', 'high']).optional(),
            groupId: z.string(),
            categoryId: z.string().optional(),
            userId: z.string().optional(),
        }),
        execute: async ({
            title,
            description,
            status,
            date,
            priority,
            groupId,
            categoryId,
            userId,
        }) => {
            const task = await prisma.task.create({
                data: {
                    title,
                    description,
                    status,
                    date: date ? new Date(date) : undefined,
                    priority,
                    groupId,
                    categoryId,
                    userId,
                },
            });
            return { id: task.id, title: task.title };
        },
    }),
    updateTask: tool({
        description: 'Update a task',
        inputSchema: z.object({
            id: z.string().describe('Task ID'),
            title: z.string().optional(),
            description: z.string().optional(),
            status: z.enum(['todo', 'inprogress', 'done']).optional(),
            date: z.string().optional(),
            priority: z.enum(['low', 'medium', 'high']).optional(),
            groupId: z.string().optional(),
            categoryId: z.string().optional(),
        }),
        execute: async ({
            id,
            title,
            description,
            status,
            date,
            priority,
            groupId,
            categoryId,
        }) => {
            const task = await prisma.task.update({
                where: { id },
                data: {
                    ...(title && { title }),
                    ...(description !== undefined && { description }),
                    ...(status && { status }),
                    ...(date && { date: new Date(date) }),
                    ...(priority && { priority }),
                    ...(groupId !== undefined && { groupId }),
                    ...(categoryId !== undefined && { categoryId }),
                },
            });
            return { id: task.id, title: task.title };
        },
    }),
    deleteTask: tool({
        description: 'Delete a task',
        inputSchema: z.object({ id: z.string().describe('Task ID') }),
        execute: async ({ id }) => {
            await prisma.task.delete({ where: { id } });
            return { deleted: true };
        },
    }),
    getTasksByGroupId: tool({
        description: 'Get tasks by group ID',
        inputSchema: z.object({ groupId: z.string().describe('Group ID') }),
        execute: async ({ groupId }) =>
            prisma.task.findMany({ where: { groupId } }),
    }),
    getTasks: tool({
        description: 'Get all tasks',
        inputSchema: z.object({}),
        execute: async () => prisma.task.findMany(),
    }),
};

export const groupTools = {
    addGroup: tool({
        description: 'Add a new group',
        inputSchema: z.object({ name: z.string().describe('Group name') }),
        execute: async ({ name }) => {
            const group = await prisma.group.create({ data: { name } });
            return { id: group.id, name: group.name };
        },
    }),
    updateGroup: tool({
        description: 'Update a group',
        inputSchema: z.object({
            id: z.string().describe('Group ID'),
            name: z.string().optional(),
        }),
        execute: async ({ id, name }) => {
            const group = await prisma.group.update({
                where: { id },
                data: { name },
            });
            return { id: group.id, name: group.name };
        },
    }),
    deleteGroup: tool({
        description: 'Delete a group',
        inputSchema: z.object({ id: z.string().describe('Group ID') }),
        execute: async ({ id }) => {
            await prisma.group.delete({ where: { id } });
            return { deleted: true };
        },
    }),
    getGroups: tool({
        description: 'Get all groups',
        inputSchema: z.object({}),
        execute: async () => prisma.group.findMany(),
    }),
};

export const categoryTools = {
    addCategory: tool({
        description: 'Add a new category',
        inputSchema: z.object({
            name: z.string().describe('Category name'),
            color: z.string().optional(),
        }),
        execute: async ({ name, color }) => {
            const category = await prisma.category.create({
                data: { name, color: color || 'red' },
            });
            return { id: category.id, name: category.name };
        },
    }),
    updateCategory: tool({
        description: 'Update a category',
        inputSchema: z.object({
            id: z.string().describe('Category ID'),
            name: z.string().optional(),
            color: z.string().optional(),
        }),
        execute: async ({ id, name, color }) => {
            const category = await prisma.category.update({
                where: { id },
                data: { name, color },
            });
            return { id: category.id, name: category.name };
        },
    }),
    deleteCategory: tool({
        description: 'Delete a category',
        inputSchema: z.object({ id: z.string().describe('Category ID') }),
        execute: async ({ id }) => {
            await prisma.category.delete({ where: { id } });
            return { deleted: true };
        },
    }),
    getCategories: tool({
        description: 'Get all categories',
        inputSchema: z.object({}),
        execute: async () => prisma.category.findMany(),
    }),
};
