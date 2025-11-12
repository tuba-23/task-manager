'use client';

import { authClient } from '@/lib/auth-client';
import type { Category, Group, Task, View } from '@/lib/types';
import { useRouter } from 'next/navigation';
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

interface ConfirmModalState {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
}

interface TaskContextType {
    tasks: Task[];
    groups: Group[];
    categories: Category[];

    view: View;
    setView: (view: View) => void;

    isSidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;

    isTaskModalOpen: boolean;
    setTaskModalOpen: (open: boolean) => void;

    isGroupModalOpen: boolean;
    setGroupModalOpen: (open: boolean) => void;

    isCategoryModalOpen: boolean;
    setCategoryModalOpen: (open: boolean) => void;

    editingTask: Task | null;
    setEditingTask: (task: Task | null) => void;

    confirmModalState: ConfirmModalState;
    showConfirmModal: (message: string, onConfirm: () => void) => void;
    hideConfirmModal: () => void;

    addTask: (taskData: Omit<Task, 'id'>) => Promise<void>;
    updateTask: (
        taskId: string,
        updates: Partial<Omit<Task, 'id' | 'groupId'>>
    ) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    addGroup: (name: string) => Promise<void>;
    addCategory: (name: string, color: string) => Promise<void>;
    updateCategory: (
        categoryId: string,
        updates: Partial<Omit<Category, 'id'>>
    ) => Promise<void>;
    deleteCategory: (categoryId: string) => Promise<void>;
    isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // UI state moved to context
    const [view, setView] = useState<View>('kanban');
    const [isSidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const sidebarParam = urlParams.get('sidebar');
            if (sidebarParam === 'open') return true;
            if (sidebarParam === 'closed') return false;

            const stored = localStorage.getItem('sidebar-open');
            return stored === null ? false : stored === 'true';
        }
        return false;
    });

    // Sync sidebar open state to localStorage
    useEffect(() => {
        localStorage.setItem('sidebar-open', isSidebarOpen.toString());

        // Also sync sidebar state to URL query param
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('sidebar', isSidebarOpen ? 'open' : 'closed');
            window.history.replaceState({}, '', url.toString());
        }
    }, [isSidebarOpen]);
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const [isGroupModalOpen, setGroupModalOpen] = useState(false);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [confirmModalState, setConfirmModalState] =
        useState<ConfirmModalState>({
            isOpen: false,
            message: '',
            onConfirm: () => {},
        });

    const showConfirmModal = (message: string, onConfirm: () => void) => {
        setConfirmModalState({
            isOpen: true,
            message,
            onConfirm: () => {
                onConfirm();
                hideConfirmModal();
            },
        });
    };

    const hideConfirmModal = () => {
        setConfirmModalState({
            isOpen: false,
            message: '',
            onConfirm: () => {},
        });
    };

    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [tasksRes, groupsRes, categoriesRes] = await Promise.all([
                fetch('/api/tasks'),
                fetch('/api/groups'),
                fetch('/api/categories'),
            ]);

            if (tasksRes.ok) {
                const data = await tasksRes.json();
                setTasks(data);
            }
            if (groupsRes.ok) {
                const data = await groupsRes.json();
                setGroups(data);
            }
            if (categoriesRes.ok) {
                const data = await categoriesRes.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Error loading data from API:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isPending && !session) {
            router.push('/login');
            return;
        }

        loadData();
    }, [session, router, isPending]);

    const { toast } = require('sonner');

    const toastPromise = async (
        promise: Promise<Response>,
        successMsg: string,
        errorMsg: string
    ) => {
        try {
            const response = await promise;
            if (response.ok) {
                toast.success(successMsg);
                await loadData();
            } else {
                toast.error(errorMsg);
            }
        } catch {
            toast.error(errorMsg);
        }
    };

    const addTask = async (taskData: Omit<Task, 'id'>) => {
        await toastPromise(
            fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            }),
            'Task added successfully!',
            'Failed to add task.'
        );
    };

    const updateTask = async (
        taskId: string,
        updates: Partial<Omit<Task, 'id' | 'groupId'>>
    ) => {
        await toastPromise(
            fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            }),
            'Task updated successfully!',
            'Failed to update task.'
        );
    };

    const deleteTask = async (taskId: string) => {
        await toastPromise(
            fetch(`/api/tasks/${taskId}`, { method: 'DELETE' }),
            'Task deleted successfully!',
            'Failed to delete task.'
        );
    };

    const addGroup = async (name: string) => {
        await toastPromise(
            fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            }),
            'Group added successfully!',
            'Failed to add group.'
        );
    };

    const addCategory = async (name: string, color: string) => {
        await toastPromise(
            fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, color }),
            }),
            'Category added successfully!',
            'Failed to add category.'
        );
    };

    const updateCategory = async (
        categoryId: string,
        updates: Partial<Omit<Category, 'id'>>
    ) => {
        await toastPromise(
            fetch(`/api/categories/${categoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: categoryId, ...updates }),
            }),
            'Category updated successfully!',
            'Failed to update category.'
        );
    };

    const deleteCategory = async (categoryId: string) => {
        await toastPromise(
            fetch(`/api/categories/${categoryId}`, {
                method: 'DELETE',
            }),
            'Category deleted successfully!',
            'Failed to delete category.'
        );
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                groups,
                categories,
                view,
                setView,
                isSidebarOpen,
                setSidebarOpen,
                isTaskModalOpen,
                setTaskModalOpen,
                isGroupModalOpen,
                setGroupModalOpen,
                isCategoryModalOpen,
                setCategoryModalOpen,
                editingTask,
                setEditingTask,
                confirmModalState,
                showConfirmModal,
                hideConfirmModal,
                addTask,
                updateTask,
                deleteTask,
                addGroup,
                addCategory,
                updateCategory,
                deleteCategory,
                isLoading,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

export function useTaskContext() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
}
