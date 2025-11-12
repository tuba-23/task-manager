'use client';

import Header from '@/components/header';
import CategoryModal from '@/components/modals/category-modal';
import GroupModal from '@/components/modals/group-modal';
import { Providers } from '@/components/providers';
import { useTaskContext } from '@/context/task-context';
import { CheckCircleIcon, CircleIcon, FolderIcon } from '@/lib/constants';
import type React from 'react';

const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}> = ({ title, value, icon, color }) => (
    <div
        className={`bg-white p-6 rounded-lg shadow flex items-center border-l-4 ${color}`}
    >
        <div className='mr-4'>{icon}</div>
        <div>
            <p className='text-sm font-medium text-gray-500'>{title}</p>
            <p className='text-3xl font-bold text-gray-900'>{value}</p>
        </div>
    </div>
);

function Dashboard() {
    const {
        tasks,
        categories,
        addGroup,
        addCategory,
        isLoading,
        setSidebarOpen,
        isSidebarOpen,
        isCategoryModalOpen,
        setCategoryModalOpen,
        isGroupModalOpen,
        setGroupModalOpen,
    } = useTaskContext();

    if (isLoading) {
        return (
            <div className='animate-pulse p-4 max-w-sm mx-auto'>
                <div className='h-6 bg-gray-300 rounded mb-2'></div>
                <div className='h-6 bg-gray-300 rounded mb-2'></div>
                <div className='h-6 bg-gray-300 rounded'></div>
            </div>
        );
    }
    console.log(tasks);

    const totalTasks = tasks.length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
    const doneTasks = tasks.filter(t => t.status === 'done').length;

    const tasksByCategory = categories
        .map(category => ({
            ...category,
            count: tasks.filter(task => task.categoryId === category.id).length,
        }))
        .sort((a, b) => b.count - a.count);

    return (
        <div className='flex h-screen bg-gray-100 text-gray-900 font-sans'>
            <main className='flex-1 flex flex-col overflow-hidden'>
                <Header
                    title='Dashboard'
                    onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    showViewOptions={false}
                    showAddButton={false}
                />
                <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
                    <div className='max-w-7xl mx-auto'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
                            <StatCard
                                title='Total Tasks'
                                value={totalTasks}
                                icon={
                                    <FolderIcon className='w-8 h-8 text-blue-500' />
                                }
                                color='border-blue-500'
                            />
                            <StatCard
                                title='To Do'
                                value={todoTasks}
                                icon={
                                    <CircleIcon className='w-8 h-8 text-gray-500' />
                                }
                                color='border-gray-500'
                            />
                            <StatCard
                                title='In Progress'
                                value={inProgressTasks}
                                icon={
                                    <span className='relative flex justify-center items-center w-8 h-8'>
                                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75'></span>
                                        <span className='relative inline-flex rounded-full h-3/4 w-3/4 bg-yellow-500'></span>
                                    </span>
                                }
                                color='border-yellow-500'
                            />
                            <StatCard
                                title='Done'
                                value={doneTasks}
                                icon={
                                    <CheckCircleIcon className='w-8 h-8 text-green-500' />
                                }
                                color='border-green-500'
                            />
                        </div>

                        <div className='bg-white p-6 rounded-lg shadow'>
                            <h3 className='text-xl font-bold text-gray-800 mb-4'>
                                Tasks by Category
                            </h3>
                            {categories.length > 0 ? (
                                <ul className='space-y-3'>
                                    {tasksByCategory.map(cat => (
                                        <li
                                            key={cat.id}
                                            className='flex items-center justify-between p-3 bg-gray-50 rounded-md'
                                        >
                                            <div className='flex items-center'>
                                                <span
                                                    className={`w-3 h-3 rounded-full mr-3 ${cat.color}`}
                                                ></span>
                                                <span className='font-medium text-gray-700'>
                                                    {cat.name}
                                                </span>
                                            </div>
                                            <span className='font-bold text-gray-800 bg-gray-200 px-2 py-0.5 rounded-full text-sm'>
                                                {cat.count}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className='text-center text-gray-500 py-4'>
                                    No categories created yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {isGroupModalOpen && (
                <GroupModal
                    isOpen={isGroupModalOpen}
                    onClose={() => setGroupModalOpen(false)}
                    onSave={name => {
                        addGroup(name);
                        setGroupModalOpen(false);
                    }}
                />
            )}

            {isCategoryModalOpen && (
                <CategoryModal
                    isOpen={isCategoryModalOpen}
                    onClose={() => setCategoryModalOpen(false)}
                    onSave={(name, color) => {
                        addCategory(name, color);
                        setCategoryModalOpen(false);
                    }}
                    category={null}
                />
            )}
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Providers>
            <Dashboard />
        </Providers>
    );
}
