"use client"

import type React from "react"
import { useState } from "react"
import Modal from "../modal"

interface GroupModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => void
}

const GroupModal: React.FC<GroupModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSave(name)
      setName("")
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Group">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Group Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            autoFocus
          />
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

export default GroupModal
