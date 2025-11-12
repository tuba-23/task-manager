'use client';

import { authClient } from '@/lib/auth-client';
import {
    LayoutGridIcon,
    ListIcon,
    MenuIcon,
    PlusIcon,
    TableIcon,
} from '@/lib/constants';
import type { View } from '@/lib/types';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';

interface HeaderProps {
    title: string;
    onAddTask?: () => void;
    currentView?: View;
    onViewChange?: (view: View) => void;
    onToggleSidebar: () => void;
    showViewOptions?: boolean;
    showAddButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    title,
    onAddTask,
    currentView = 'kanban',
    onViewChange,
    onToggleSidebar,
    showViewOptions = false,
    showAddButton = false,
}) => {
    const router = useRouter();

    const viewOptions: { id: View; icon: React.ReactNode; name: string }[] = [
        {
            id: 'kanban',
            icon: <LayoutGridIcon className='w-5 h-5' />,
            name: 'Kanban',
        },
        { id: 'list', icon: <ListIcon className='w-5 h-5' />, name: 'List' },
        { id: 'table', icon: <TableIcon className='w-5 h-5' />, name: 'Table' },
    ];

    const handleLogout = async () => {
        await authClient.signOut();
        router.push('/login');
    };

    return (
        <header className='shrink-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between w-full'>
            <div className='flex items-center gap-4'>
                <button
                    onClick={onToggleSidebar}
                    className='md:hidden mr-4 p-1 rounded-md text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    aria-label='Open sidebar'
                >
                    <MenuIcon className='w-6 h-6' />
                </button>
                <h2 className='text-xl sm:text-2xl font-bold text-gray-900 truncate'>
                    {title}
                </h2>
                {showViewOptions && onViewChange && (
                    <div className='flex ml-4 sm:ml-6 bg-gray-100 p-1 rounded-lg items-center space-x-1'>
                        {viewOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => onViewChange(option.id)}
                                title={option.name}
                                className={`px-3 py-1.5 rounded-md transition-colors duration-200 text-sm font-medium ${
                                    currentView === option.id
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {option.icon}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className='flex items-center gap-2'>
                {showAddButton && onAddTask && (
                    <button
                        onClick={onAddTask}
                        className='flex items-center justify-center bg-indigo-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 transition-all duration-150'
                        title='Add Task (N)'
                    >
                        <PlusIcon className='w-5 h-5 sm:mr-2' />
                        <span className='hidden sm:inline'>Add Task</span>
                        <kbd className='hidden sm:inline ml-2 px-1.5 py-0.5 text-xs font-semibold text-indigo-600 bg-white rounded'>
                            N
                        </kbd>
                    </button>
                )}

                <button
                    onClick={handleLogout}
                    className='ml-4 p-2 rounded-md text-indigo-700 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100'
                    title='Logout'
                    aria-label='Logout'
                >
                    <LogOutIcon className='h-6 w-6' />
                </button>
            </div>
        </header>
    );
};

export default Header;
