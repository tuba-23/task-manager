'use client';

import { EditIcon, PRIORITY_MAP, STATUS_MAP, TrashIcon } from '@/lib/constants';
import type { Category, Priority, Status, Task, View } from '@/lib/types';
import type React from 'react';
import { useMemo, useState } from 'react';
import TaskItem from './task-item';

interface TaskListProps {
    view: View;
    tasks: Task[];
    categories: Category[];
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
    onDeleteTask: (taskId: string) => void;
    onEditTask: (task: Task) => void;
}

const KanbanView: React.FC<Omit<TaskListProps, 'view'>> = ({
    tasks,
    categories,
    onUpdateTask,
    onDeleteTask,
    onEditTask,
}) => {
    const [draggingOverStatus, setDraggingOverStatus] = useState<Status | null>(
        null
    );

    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        taskId: string
    ) => {
        e.dataTransfer.setData('taskId', taskId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            onUpdateTask(taskId, { status });
        }
        setDraggingOverStatus(null);
    };

    const statuses: Status[] = ['todo', 'inprogress', 'done'];

    return (
        <div className='flex flex-col space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:space-y-0'>
            {statuses.map(status => (
                <div
                    key={status}
                    onDragOver={handleDragOver}
                    onDrop={e => handleDrop(e, status)}
                    onDragEnter={() => setDraggingOverStatus(status)}
                    onDragLeave={() => setDraggingOverStatus(null)}
                    className={`w-full md:w-auto bg-gray-50 rounded-lg p-4 transition-colors duration-200 ${
                        draggingOverStatus === status ? 'bg-indigo-100' : ''
                    }`}
                >
                    <h3 className='font-bold text-lg mb-4 text-gray-800'>
                        {STATUS_MAP[status]}
                    </h3>
                    <div className='space-y-4'>
                        {tasks
                            .filter(task => task.status === status)
                            .map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    categories={categories}
                                    onUpdateTask={onUpdateTask}
                                    onDeleteTask={onDeleteTask}
                                    onEditTask={onEditTask}
                                    onDragStart={e =>
                                        handleDragStart(e, task.id)
                                    }
                                    isDraggable={true}
                                />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const ListView: React.FC<Omit<TaskListProps, 'view'>> = ({
    tasks,
    categories,
    onUpdateTask,
    onDeleteTask,
    onEditTask,
}) => {
    return (
        <div className='space-y-4'>
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    categories={categories}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                    onEditTask={onEditTask}
                />
            ))}
        </div>
    );
};

const TableView: React.FC<Omit<TaskListProps, 'view'>> = ({
    tasks,
    categories,
    onUpdateTask,
    onDeleteTask,
    onEditTask,
}) => {
    const getCategoryName = (categoryId?: string) => {
        return categories.find(c => c.id === categoryId)?.name || 'N/A';
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString.replace(/-/g, '/')).toLocaleDateString();
    };

    return (
        <div className='bg-white rounded-lg shadow overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50 hidden md:table-header-group'>
                    <tr>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                            Title
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                            Category
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                            Date
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                            Priority
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                            Status
                        </th>
                        <th scope='col' className='relative px-6 py-3'>
                            <span className='sr-only'>Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                    {tasks.map(task => (
                        <tr
                            key={task.id}
                            className='block md:table-row border-b md:border-b-0'
                        >
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 block md:table-cell'>
                                <span className='font-semibold md:hidden'>
                                    Title:{' '}
                                </span>
                                {task.title}
                                <p className='text-sm text-gray-500 mt-1 md:hidden'>
                                    {task.description}
                                </p>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 block md:table-cell'>
                                <span className='font-semibold md:hidden'>
                                    Category:{' '}
                                </span>
                                {getCategoryName(task.categoryId)}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 block md:table-cell'>
                                <span className='font-semibold md:hidden'>
                                    Date:{' '}
                                </span>
                                {formatDate(task.date)}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 block md:table-cell'>
                                <span className='font-semibold md:hidden'>
                                    Priority:{' '}
                                </span>
                                {PRIORITY_MAP[task.priority || 'medium']}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 block md:table-cell'>
                                <span className='font-semibold md:hidden'>
                                    Status:{' '}
                                </span>
                                {STATUS_MAP[task.status]}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium block md:table-cell'>
                                <div className='flex items-center justify-end space-x-4'>
                                    <button
                                        onClick={() => onEditTask(task)}
                                        className='text-indigo-600 hover:text-indigo-900'
                                    >
                                        <EditIcon className='w-5 h-5' />
                                    </button>
                                    <button
                                        onClick={() => onDeleteTask(task.id)}
                                        className='text-red-600 hover:text-red-900'
                                    >
                                        <TrashIcon className='w-5 h-5' />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const TaskList: React.FC<TaskListProps> = props => {
    const { tasks, categories, view } = props;

    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortBy, setSortBy] = useState<'default' | 'priority'>('default');

    const processedTasks = useMemo(() => {
        let filtered = [...tasks];

        if (categoryFilter) {
            filtered = filtered.filter(t => t.categoryId === categoryFilter);
        }
        if (statusFilter) {
            filtered = filtered.filter(t => t.status === statusFilter);
        }
        if (startDate) {
            filtered = filtered.filter(t => t.date && t.date >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(t => t.date && t.date <= endDate);
        }

        if (sortBy === 'priority') {
            const priorityOrder: { [key in Priority]: number } = {
                high: 1,
                medium: 2,
                low: 3,
            };
            filtered.sort((a, b) => {
                const priorityA = priorityOrder[a.priority || 'medium'] || 3;
                const priorityB = priorityOrder[b.priority || 'medium'] || 3;
                return priorityA - priorityB;
            });
        }

        return filtered;
    }, [tasks, categoryFilter, statusFilter, startDate, endDate, sortBy]);

    const handleClearFilters = () => {
        setCategoryFilter('');
        setStatusFilter('');
        setStartDate('');
        setEndDate('');
        setSortBy('default');
    };

    if (props.tasks.length === 0) {
        return (
            <div className='flex-1 flex items-center justify-center text-gray-500 p-4 text-center'>
                No tasks in this group. Add one to get started!
            </div>
        );
    }

    const renderView = () => {
        const viewProps = { ...props, tasks: processedTasks };
        switch (view) {
            case 'list':
                return <ListView {...viewProps} />;
            case 'table':
                return <TableView {...viewProps} />;
            case 'kanban':
            default:
                return <KanbanView {...viewProps} />;
        }
    };

    return (
        <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
            <div className='mb-6 p-4 bg-white rounded-lg shadow'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
                    <div>
                        <label className='text-sm font-medium text-gray-700'>
                            Category
                        </label>
                        <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className='mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        >
                            <option value=''>All Categories</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='text-sm font-medium text-gray-700'>
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className='mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        >
                            <option value=''>All Statuses</option>
                            {Object.entries(STATUS_MAP).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='text-sm font-medium text-gray-700'>
                            Start Date
                        </label>
                        <input
                            type='date'
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className='mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        />
                    </div>
                    <div>
                        <label className='text-sm font-medium text-gray-700'>
                            End Date
                        </label>
                        <input
                            type='date'
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className='mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-sm font-medium text-gray-700'>
                            Sort By
                        </label>
                        <select
                            value={sortBy}
                            onChange={e =>
                                setSortBy(
                                    e.target.value as 'default' | 'priority'
                                )
                            }
                            className='mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        >
                            <option value='default'>Default</option>
                            <option value='priority'>Priority</option>
                        </select>
                    </div>
                </div>
                <div className='mt-4 flex justify-end'>
                    <button
                        onClick={handleClearFilters}
                        className='text-sm text-indigo-600 hover:text-indigo-800 font-medium'
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {processedTasks.length === 0 && tasks.length > 0 && (
                <div className='flex-1 flex items-center justify-center text-gray-500 p-4 text-center'>
                    No tasks match the current filters.
                </div>
            )}

            {processedTasks.length > 0 && renderView()}
        </div>
    );
};

export default TaskList;
