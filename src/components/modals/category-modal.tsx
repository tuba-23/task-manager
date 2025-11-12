"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Modal from "../modal"
import type { Category } from "@/lib/types"
import { CategoryColors } from "@/lib/constants"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, color: string) => void
  category: Category | null
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave, category }) => {
  const [name, setName] = useState(category?.name || "")
  const [selectedColor, setSelectedColor] = useState(category?.color || CategoryColors[0])

  useEffect(() => {
    if (isOpen) {
      setName(category?.name || "")
      setSelectedColor(category?.color || CategoryColors[0])
    }
  }, [isOpen, category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSave(name, selectedColor)
      setName("")
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? "Edit Category" : "Add Category"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Color</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {CategoryColors.map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full ${color} ${selectedColor === color ? "ring-2 ring-offset-2 ring-offset-gray-100 ring-indigo-500" : ""}`}
              ></button>
            ))}
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-900 py-2 px-4 rounded-md mr-2">
            Cancel
          </button>
          <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-md">
            {category ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CategoryModal
