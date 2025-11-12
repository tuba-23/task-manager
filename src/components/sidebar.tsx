'use client';

import { useTaskContext } from '@/context/task-context';
import { FolderIcon, LayoutGridIcon, PlusIcon, TagIcon } from '@/lib/constants';
import { BrainIcon } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onAddGroup: () => void;
    onAddCategory: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    onAddGroup,
    onAddCategory,
}) => {
    const { groups } = useTaskContext();

    const NavItem: React.FC<{
        href: string;
        isActive: boolean;
        children: React.ReactNode;
    }> = ({ href, isActive, children }) => (
        <Link
            href={href}
            onClick={onClose}
            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-500 hover:bg-gray-200'
            }`}
        >
            {children}
        </Link>
    );

    return (
        <aside
            className={`transform transition-transform duration-300 ease-in-out flex flex-col p-4 bg-white border-r border-gray-200 absolute md:static h-full z-40 w-64 md:w-auto md:shrink-0 md:translate-x-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <div className='flex items-center mb-6'>
                <h1 className='text-xl font-bold text-gray-800'>
                    Task Manager
                </h1>
            </div>

            <nav className='flex-1 space-y-1'>
                <div className='px-2 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                    Main
                </div>
                <NavItem href='/dashboard' isActive={false}>
                    <LayoutGridIcon className='w-5 h-5 mr-3' />
                    <span>Dashboard</span>
                </NavItem>

                <div className='px-2 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                    Groups
                </div>
                {groups.map(group => (
                    <NavItem
                        key={group.id}
                        href={`/${group.id}`}
                        isActive={false}
                    >
                        <FolderIcon className='w-5 h-5 mr-3' />
                        <span>{group.name}</span>
                    </NavItem>
                ))}

                <div className='px-2 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                    Manage
                </div>
                <NavItem href='/category' isActive={false}>
                    <TagIcon className='w-5 h-5 mr-3' />
                    <span>Categories</span>
                </NavItem>
                <NavItem href='/chat' isActive={false}>
                    <BrainIcon className='w-5 h-5 mr-3' />
                    <span>AI Chats</span>
                </NavItem>
            </nav>

            <div className='mt-auto space-y-2'>
                <button
                    onClick={onAddGroup}
                    className='w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-150'
                >
                    <span className='flex items-center'>
                        <PlusIcon className='w-5 h-5 mr-2' />
                        New Group
                    </span>
                    <kbd className='px-1.5 py-0.5 text-xs font-semibold text-indigo-600 bg-white rounded'>
                        G
                    </kbd>
                </button>
                <button
                    onClick={onAddCategory}
                    className='w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-150'
                >
                    <span className='flex items-center'>
                        <TagIcon className='w-5 h-5 mr-2' />
                        New Category
                    </span>
                    <kbd className='px-1.5 py-0.5 text-xs font-semibold text-indigo-600 bg-white rounded'>
                        C
                    </kbd>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
