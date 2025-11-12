'use client';

import Header from '@/components/header';
import CategoryModal from '@/components/modals/category-modal';
import ConfirmModal from '@/components/modals/confirm-modal';
import GroupModal from '@/components/modals/group-modal';
import { Providers } from '@/components/providers';
import { useTaskContext } from '@/context/task-context';
import { EditIcon, TrashIcon } from '@/lib/constants';
import type { Category } from '@/lib/types';
import { useEffect, useState } from 'react';

function Category() {
    const {
        categories,
        addGroup,
        addCategory,
        updateCategory,
        deleteCategory,
        isCategoryModalOpen,
        setCategoryModalOpen,
        isGroupModalOpen,
        setGroupModalOpen,
        isSidebarOpen,
        setSidebarOpen,
    } = useTaskContext();

    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );
    const [confirmModalState, setConfirmModalState] = useState<{
        isOpen: boolean;
        categoryId: string | null;
    }>({ isOpen: false, categoryId: null });

    const showConfirmModal = (categoryId: string) => {
        setConfirmModalState({ isOpen: true, categoryId });
    };

    const handleDeleteCategory = () => {
        if (confirmModalState.categoryId) {
            deleteCategory(confirmModalState.categoryId);
            setConfirmModalState({ isOpen: false, categoryId: null });
        }
    };

    const handleOpenCategoryModal = (category: Category | null = null) => {
        setEditingCategory(category);
        setCategoryModalOpen(true);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
                return;
            }

            let handled = false;
            switch (e.key.toLowerCase()) {
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
                    title='Categories'
                    onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    showViewOptions={false}
                    showAddButton={false}
                />
                <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
                    <div className='max-w-2xl mx-auto bg-white p-6 rounded-lg shadow'>
                        <h3 className='text-xl font-bold text-gray-800 mb-4'>
                            Categories
                        </h3>
                        <div className='space-y-2'>
                            {categories.length > 0 ? (
                                categories.map(cat => (
                                    <div
                                        key={cat.id}
                                        className='flex items-center justify-between p-3 bg-white rounded-md border hover:bg-gray-50 transition-colors duration-150'
                                    >
                                        <div className='flex items-center'>
                                            <span
                                                className={`w-4 h-4 rounded-full mr-4 ${cat.color}`}
                                            ></span>
                                            <span className='font-medium text-gray-700'>
                                                {cat.name}
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-4'>
                                            <button
                                                onClick={() =>
                                                    handleOpenCategoryModal(cat)
                                                }
                                                className='text-gray-400 hover:text-indigo-500'
                                                title='Edit Category'
                                            >
                                                <EditIcon className='w-5 h-5' />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    showConfirmModal(cat.id)
                                                }
                                                className='text-gray-400 hover:text-red-500'
                                                title='Delete Category'
                                            >
                                                <TrashIcon className='w-5 h-5' />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='text-center text-gray-500 py-4'>
                                    No categories found. Add one to get started!
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
                        if (editingCategory) {
                            updateCategory(editingCategory.id, { name, color });
                        } else {
                            addCategory(name, color);
                        }
                        setCategoryModalOpen(false);
                    }}
                    category={editingCategory}
                />
            )}

            {confirmModalState.isOpen && (
                <ConfirmModal
                    isOpen={confirmModalState.isOpen}
                    onClose={() =>
                        setConfirmModalState({
                            isOpen: false,
                            categoryId: null,
                        })
                    }
                    onConfirm={handleDeleteCategory}
                    message='Are you sure you want to delete this category? Tasks using this category will not be deleted.'
                />
            )}
        </div>
    );
}

export default function CategoryPage() {
    return (
        <Providers>
            <Category />
        </Providers>
    );
}
