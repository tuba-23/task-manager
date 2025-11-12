'use client';

import { ChatThread } from '@/generated/prisma';
import { Edit2, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [threads, setThreads] = useState<ChatThread[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');

    const fetchThreads = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/chat');
            const { data } = await res.json();
            setThreads(data ?? []);
        } catch {
            setError('Failed to load chats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThreads();
    }, []);

    const createChat = async () => {
        if (!title.trim()) return setError('Title required');
        setLoading(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            });
            const { id } = await res.json();
            if (id) router.push(`/chat/${id}`);
            else setError('Create failed');
        } catch {
            setError('Create failed');
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (id: string, cur: string) => {
        setEditingId(id);
        setEditingTitle(cur);
        setError('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingTitle('');
    };

    const saveEdit = async (id: string) => {
        if (!editingTitle.trim()) return setError('Title required');
        setLoading(true);
        try {
            const res = await fetch(`/api/chat/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editingTitle }),
            });
            if (res.ok) {
                fetchThreads();
                cancelEdit();
            } else setError('Update failed');
        } catch {
            setError('Update failed');
        } finally {
            setLoading(false);
        }
    };

    const deleteThread = async (id: string) => {
        if (!confirm('Delete this chat?')) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/chat/${id}`, { method: 'DELETE' });
            if (res.ok) fetchThreads();
            else setError('Delete failed');
        } catch {
            setError('Delete failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className='mx-auto p-6'>
            <h1 className='text-3xl font-bold mb-6'>Chat Threads</h1>

            <div className='flex gap-3 mb-6'>
                <input
                    type='text'
                    placeholder='New chat title'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    disabled={loading}
                    className='flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50'
                    onKeyDown={e => e.key === 'Enter' && createChat()}
                />
                <button
                    onClick={createChat}
                    disabled={loading || !title.trim()}
                    className='bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2'
                >
                    {loading ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                        <Plus className='w-4 h-4' />
                    )}
                    Create
                </button>
            </div>

            {error && <p className='text-red-600 mb-4'>{error}</p>}

            <ul className='space-y-3'>
                {loading && threads.length === 0 ? (
                    <li className='text-center py-4 text-gray-500'>
                        Loading...
                    </li>
                ) : threads.length === 0 ? (
                    <li className='text-center py-8 text-gray-500'>
                        No chats yet.
                    </li>
                ) : (
                    threads.map(t => (
                        <li
                            key={t.id}
                            className='group flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition'
                        >
                            {editingId === t.id ? (
                                <>
                                    <input
                                        type='text'
                                        value={editingTitle}
                                        onChange={e =>
                                            setEditingTitle(e.target.value)
                                        }
                                        className='flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => saveEdit(t.id)}
                                        className='text-green-600 hover:text-green-700'
                                    >
                                        <Save className='w-4 h-4' />
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className='text-gray-600 hover:text-gray-700'
                                    >
                                        <X className='w-4 h-4' />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={`/chat/${t.id}`}
                                        className='flex-1 font-medium hover:text-indigo-600'
                                    >
                                        {t.title || 'Untitled'}
                                    </Link>
                                    <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition'>
                                        <button
                                            onClick={() =>
                                                startEdit(t.id, t.title || '')
                                            }
                                            className='text-indigo-600 hover:text-indigo-700'
                                            title='Edit'
                                        >
                                            <Edit2 className='w-4 h-4' />
                                        </button>
                                        <button
                                            onClick={() => deleteThread(t.id)}
                                            className='text-red-600 hover:text-red-700'
                                            title='Delete'
                                        >
                                            <Trash2 className='w-4 h-4' />
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </main>
    );
}
