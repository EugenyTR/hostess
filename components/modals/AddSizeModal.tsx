"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import ConfirmExitModal from "./ConfirmExitModal"

interface Size {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AddSizeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (sizeData: { name: string }) => void
  size?: Size | null
}

export default function AddSizeModal({ isOpen, onClose, onSave, size }: AddSizeModalProps) {
  const [name, setName] = useState("")
  const [showConfirmExit, setShowConfirmExit] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const isEditing = !!size

  useEffect(() => {
    if (isOpen) {
      if (size) {
        setName(size.name)
      } else {
        setName("")
      }
      setHasChanges(false)
    }
  }, [isOpen, size])

  useEffect(() => {
    const initialName = size?.name || ""
    setHasChanges(name !== initialName)
  }, [name, size])

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirmExit(true)
    } else {
      onClose()
    }
  }

  const handleConfirmExit = () => {
    setShowConfirmExit(false)
    onClose()
  }

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        name: name.trim(),
      })
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#2c2c33]">
              {isEditing ? "Редактирование размера" : "Добавление размера"}
            </h2>
            <button onClick={handleClose} className="text-[#7f8189] hover:text-[#2c2c33] transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2c2c33] mb-2">
                На��менование <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите размер (например, XL)"
                className="w-full px-3 py-3 border border-[#e3e3e3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1 bg-[#2055a4] text-white py-3 px-4 rounded-lg hover:bg-[#1a4a94] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Сохранить
            </button>
            <button
              onClick={handleClose}
              className="flex-1 border border-[#e3e3e3] text-[#2c2c33] py-3 px-4 rounded-lg hover:bg-[#f7f7f7] transition-colors"
            >
              Отменить
            </button>
          </div>
        </div>
      </div>

      <ConfirmExitModal
        isOpen={showConfirmExit}
        onClose={() => setShowConfirmExit(false)}
        onConfirm={handleConfirmExit}
      />
    </>
  )
}
