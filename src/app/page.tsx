'use client';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const page = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending) {
            if (session) {
                router.push('/dashboard');
            } else {
                router.push('/login');
            }
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className='animate-pulse p-4 max-w-sm mx-auto'>
                <div className='h-6 bg-gray-300 rounded mb-2'></div>
                <div className='h-6 bg-gray-300 rounded mb-2'></div>
                <div className='h-6 bg-gray-300 rounded'></div>
            </div>
        );
    }

    return <div>page</div>;
};

export default page;
