'use client';

import {
    CalendarIcon,
    CheckCircleIcon,
    CircleIcon,
    EditIcon,
    FlagIcon,
    STATUS_MAP,
    TrashIcon,
} from '@/lib/constants';
import type { Category, Priority, Status, Task } from '@/lib/types';
import type React from 'react';

interface TaskItemProps {
    task: Task;
    categories: Category[];
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
    onDeleteTask: (taskId: string) => void;
    onEditTask: (task: Task) => void;
    isDraggable?: boolean;
    onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
    task,
    categories,
    onUpdateTask,
    onDeleteTask,
    onEditTask,
    isDraggable,
    onDragStart,
}) => {
    const category = categories.find(c => c.id === task.categoryId);

    const priorityColor: { [key in Priority]: string } = {
        high: 'text-red-600',
        medium: 'text-yellow-600',
        low: 'text-gray-500',
    };

    const StatusIcon = ({ status }: { status: Status }) => {
        switch (status) {
            case 'done':
                return <CheckCircleIcon className='w-5 h-5 text-green-500' />;
            case 'inprogress':
                return (
                    <span className='relative flex justify-center items-center w-5 h-5'>
                        <span className='animate-ping absolute inline-flex h-3 w-3 rounded-full bg-yellow-400 opacity-75'></span>
                        <span className='relative inline-flex rounded-full h-3 w-3 bg-yellow-500'></span>
                    </span>
                );
            case 'todo':
            default:
                return <CircleIcon className='w-5 h-5 text-gray-400' />;
        }
    };

    return (
        <div
            draggable={isDraggable}
            onDragStart={onDragStart}
            className={`bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg hover:border-indigo-500 transition-all duration-200 group ${
                isDraggable ? 'cursor-grab' : ''
            }`}
        >
            <div className='flex justify-between items-start'>
                <h4 className='font-semibold text-gray-800 wrap-break-word'>
                    {task.title}
                </h4>
                <div className='flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <button
                        onClick={() => onEditTask(task)}
                        className='text-gray-400 hover:text-indigo-500'
                    >
                        <EditIcon className='w-4 h-4' />
                    </button>
                    <button
                        onClick={() => onDeleteTask(task.id)}
                        className='text-gray-400 hover:text-red-500'
                    >
                        <TrashIcon className='w-4 h-4' />
                    </button>
                </div>
            </div>
            {task.description && (
                <p className='text-sm text-gray-500 mt-2'>{task.description}</p>
            )}
            <div className='flex items-center justify-between mt-4'>
                <div className='flex items-center flex-wrap gap-x-3 gap-y-2'>
                    <StatusIcon status={task.status} />
                    {task.priority && (
                        <span
                            className={`flex items-center text-xs font-semibold ${
                                priorityColor[task.priority]
                            }`}
                        >
                            <FlagIcon className='w-3.5 h-3.5 mr-1' />
                            {task.priority.charAt(0).toUpperCase() +
                                task.priority.slice(1)}
                        </span>
                    )}
                    {category && (
                        <span
                            className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${category.color.replace(
                                'bg-',
                                'bg-opacity-20 text-'
                            )}`}
                        >
                            <span
                                className={`w-2 h-2 rounded-full mr-2 ${category.color}`}
                            ></span>
                            {category.name}
                        </span>
                    )}
                    {task.date && (
                        <span className='flex items-center text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                            <CalendarIcon className='w-3 h-3 mr-1.5' />
                            {new Date(
                                task.date.replace(/-/g, '/')
                            ).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    )}
                </div>
                <select
                    value={task.status}
                    onChange={e =>
                        onUpdateTask(task.id, {
                            status: e.target.value as Status,
                        })
                    }
                    className='text-xs bg-gray-100 border-none rounded-md py-1 px-2 focus:ring-2 focus:ring-indigo-500'
                >
                    <option value='todo'>{STATUS_MAP.todo}</option>
                    <option value='inprogress'>{STATUS_MAP.inprogress}</option>
                    <option value='done'>{STATUS_MAP.done}</option>
                </select>
            </div>
        </div>
    );
};

export default TaskItem;
