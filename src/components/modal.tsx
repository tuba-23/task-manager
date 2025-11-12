'use client';

import type React from 'react';
import { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className='fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4'
            onClick={onClose}
        >
            <div
                className='bg-white rounded-lg shadow-xl w-full max-w-md'
                onClick={e => e.stopPropagation()}
            >
                <div className='p-6 border-b border-gray-200'>
                    <h3 className='text-xl font-semibold text-gray-900'>
                        {title}
                    </h3>
                </div>
                <div className='p-6'>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
