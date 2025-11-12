'use client';

import { authClient } from '@/lib/auth-client';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isPending && session) {
            router.replace('/');
        }
    }, [session, isPending, router]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        await authClient.signIn.email(
            {
                email,
                password,
                callbackURL: '/',
            },
            {
                onRequest: () => {},
                onSuccess: () => {
                    toast.success('Sign in successful!');
                    router.push('/');
                },
                onError: ctx => {
                    setLoading(false);
                    toast.error(ctx.error.message);
                },
            }
        );
    };

    if (isPending || session) {
        return (
            <div className='animate-pulse p-4 max-w-sm mx-auto'>
                <div className='h-6 bg-gray-300 rounded mb-2'></div>
                <div className='h-6 bg-gray-300 rounded mb-2'></div>
                <div className='h-6 bg-gray-300 rounded'></div>
            </div>
        );
    }

    return (
        <>
            <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                <div className='max-w-md w-full bg-white p-8 rounded-lg shadow-md'>
                    <h2 className='text-2xl font-semibold mb-6 text-center'>
                        Sign In
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <label className='block mb-2 font-medium'>Email</label>
                        <input
                            type='email'
                            placeholder='Your email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className='mb-4 p-2 border rounded w-full'
                            required
                        />
                        <label className='block mb-2 font-medium'>
                            Password
                        </label>
                        <div className='relative mb-6'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Your password'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className='p-2 border rounded w-full pr-10'
                                required
                            />
                            <button
                                type='button'
                                className='absolute inset-y-0 right-2 flex items-center'
                                tabIndex={-1}
                                onClick={() => setShowPassword(val => !val)}
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50'
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                        <p className='mt-4 text-center text-sm'>
                            Don't have an account?{' '}
                            <a
                                href='/signup'
                                className='text-blue-600 hover:underline font-medium'
                            >
                                Create one
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
