'use client';

import { Providers } from '@/components/providers';
import Sidebar from '@/components/sidebar';
import { useTaskContext } from '@/context/task-context';
import { usePathname } from 'next/navigation';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Providers>
            <InnerLayout>{children}</InnerLayout>
        </Providers>
    );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const {
        isSidebarOpen,
        setSidebarOpen,
        setGroupModalOpen,
        setCategoryModalOpen,
    } = useTaskContext();

    return (
        <div className='flex h-screen bg-gray-100 text-gray-900 font-sans'>
            {isSidebarOpen && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden'
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden='true'
                ></div>
            )}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onAddGroup={() => setGroupModalOpen(true)}
                onAddCategory={() => setCategoryModalOpen(true)}
            />
            <main className='flex-1 flex flex-col overflow-hidden'>
                {children}
            </main>
        </div>
    );
}
