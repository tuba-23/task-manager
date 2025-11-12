'use client';

import Header from '@/components/header';
import CategoryModal from '@/components/modals/category-modal';
import ConfirmModal from '@/components/modals/confirm-modal';
import GroupModal from '@/components/modals/group-modal';
import TaskModal from '@/components/modals/task-modal';
import { Providers } from '@/components/providers';
import TaskList from '@/components/task-list';
import { useTaskContext } from '@/context/task-context';
import type { Task } from '@/lib/types';
import { useParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function GroupPageContent() {
    const params = useParams();
    const groupId = params.groupId as string;
    const {
        tasks,
        groups,
        categories,
        addTask,
        updateTask,
        deleteTask,
        addGroup,
        addCategory,
        isLoading,

        // UI states from context
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
    } = useTaskContext();

    const selectedGroup = groups.find(g => g.id === groupId) || {
        id: groupId,
        name: 'loading..',
    };
    const tasksForGroup = tasks.filter(task => task.groupId === groupId);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
                return;
            }

            let handled = false;
            switch (e.key.toLowerCase()) {
                case 'n':
                    handleOpenTaskModal();
                    handled = true;
                    break;
                case 'g':
                    setGroupModalOpen(true);
                    handled = true;
                    break;
                case 'c':
                    setCategoryModalOpen(true);
                    handled = true;
                    break;
            }

            if (handled) {
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setCategoryModalOpen, setGroupModalOpen]);

    const handleDeleteTask = (taskId: string) => {
        showConfirmModal('Are you sure you want to delete this task?', () =>
            deleteTask(taskId)
        );
    };

    const handleOpenTaskModal = (task: Task | null = null) => {
        setEditingTask(task);
        setTaskModalOpen(true);
    };

    return (
        <div className='flex h-screen bg-gray-100 text-gray-900 font-sans'>
            {isSidebarOpen && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden'
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden='true'
                ></div>
            )}
            <main className='flex-1 flex flex-col overflow-hidden'>
                <Header
                    title={selectedGroup.name}
                    onAddTask={() => handleOpenTaskModal()}
                    currentView={view}
                    onViewChange={setView}
                    onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    showViewOptions={true}
                    showAddButton={true}
                />
                <TaskList
                    view={view}
                    tasks={tasksForGroup}
                    categories={categories}
                    onUpdateTask={updateTask}
                    onDeleteTask={handleDeleteTask}
                    onEditTask={handleOpenTaskModal}
                />
            </main>

            {isTaskModalOpen && (
                <TaskModal
                    isOpen={isTaskModalOpen}
                    onClose={() => setTaskModalOpen(false)}
                    onSave={taskData => {
                        if (editingTask) {
                            updateTask(editingTask.id, taskData);
                        } else {
                            addTask({ ...taskData, groupId });
                        }
                        setTaskModalOpen(false);
                    }}
                    categories={categories}
                    task={editingTask}
                />
            )}

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

            {confirmModalState.isOpen && (
                <ConfirmModal
                    isOpen={confirmModalState.isOpen}
                    onClose={hideConfirmModal}
                    onConfirm={confirmModalState.onConfirm}
                    message={confirmModalState.message}
                />
            )}
        </div>
    );
}

function Group() {
    return (
        <Suspense
            fallback={
                <div className='flex items-center justify-center h-screen'>
                    Loading...
                </div>
            }
        >
            <GroupPageContent />
        </Suspense>
    );
}

export default function GroupPage() {
    return (
        <Providers>
            <Group />
        </Providers>
    );
}
