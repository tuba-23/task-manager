"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Modal from "../modal"
import type { Task, Category, Status, Priority } from "@/lib/types"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (taskData: Omit<Task, "id" | "groupId">) => void
  categories: Category[]
  task: Task | null
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, categories, task }) => {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [status, setStatus] = useState<Status>(task?.status || "todo")
  const [categoryId, setCategoryId] = useState(task?.categoryId || "")
  const [date, setDate] = useState(task?.date || "")
  const [priority, setPriority] = useState<Priority>(task?.priority || "medium")

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) {
        return
      }

      const statusOrder: Status[] = ["todo", "inprogress", "done"]
      const priorityOrder: Priority[] = ["high", "medium", "low"]

      let handled = false
      switch (e.key.toLowerCase()) {
        case "s":
          setStatus((currentStatus) => {
            const currentIndex = statusOrder.indexOf(currentStatus)
            const nextIndex = (currentIndex + 1) % statusOrder.length
            return statusOrder[nextIndex]
          })
          handled = true
          break
        case "p":
          setPriority((currentPriority) => {
            const currentIndex = priorityOrder.indexOf(currentPriority)
            const nextIndex = (currentIndex + 1) % priorityOrder.length
            return priorityOrder[nextIndex]
          })
          handled = true
          break
      }

      if (handled) {
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSave({ title, description, status, categoryId: categoryId || undefined, date: date || undefined, priority })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? "Edit Task" : "Add Task"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-500">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-500">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-500">
              Status <span className="text-xs text-gray-400">(s)</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-500">
              Priority <span className="text-xs text-gray-400">(p)</span>
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-900 py-2 px-4 rounded-md mr-2">
            Cancel
          </button>
          <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-md">
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default TaskModal
