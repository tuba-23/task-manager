"use client"

import type React from "react"
import Modal from "../modal"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message: string
  title?: string
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title = "Confirm Deletion",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div>
        <p className="text-gray-600">{message}</p>
        <div className="flex justify-end pt-6 space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 py-2 px-4 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 py-2 px-4 rounded-md font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
