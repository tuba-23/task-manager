export type Status = 'todo' | 'inprogress' | 'done';
export type View = 'kanban' | 'list' | 'table';
export type Page = 'dashboard' | 'tasks' | 'categories';
export type Priority = 'low' | 'medium' | 'high';

export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: Status;
    categoryId?: string;
    groupId: string;
    date?: string;
    priority?: Priority;
}

export interface Group {
    id: string;
    name: string;
}
