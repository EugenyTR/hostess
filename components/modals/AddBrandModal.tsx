"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import ConfirmExitModal from "./ConfirmExitModal"

interface Brand {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AddBrandModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (brandData: { name: string }) => void
  brand?: Brand | null
}

export default function AddBrandModal({ isOpen, onClose, onSave, brand }: AddBrandModalProps) {
  const [name, setName] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const [showConfirmExit, setShowConfirmExit] = useState(false)
  const [errors, setErrors] = useState<{ name?: string }>({})

  const isEditing = !!brand

  useEffect(() => {
    if (isOpen) {
      if (brand) {
        setName(brand.name)
      } else {
        setName("")
      }
      setHasChanges(false)
      setErrors({})
    }
  }, [isOpen, brand])

  useEffect(() => {
    const initialName = brand?.name || ""
    setHasChanges(name !== initialName)
  }, [name, brand])

  const validateForm = () => {
    const newErrors: { name?: string } = {}

    if (!name.trim()) {
      newErrors.name = "Название бренда обязательно"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave({ name: name.trim() })
      setHasChanges(false)
    }
  }

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

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#2c2c33]">
              {isEditing ? "Редактирование бренда" : "Добавление бренда"}
            </h2>
            <button onClick={handleClose} className="text-[#7f8189] hover:text-[#2c2c33] transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2c2c33] mb-2">
                Название бренда <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите название бренда"
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] transition-colors ${
                  errors.name ? "border-red-500" : "border-[#e3e3e3]"
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="bg-[#2055a4] text-white px-4 py-2 rounded-lg hover:bg-[#1a4a94] transition-colors flex-1"
            >
              Сохранить
            </button>
            <button
              onClick={handleClose}
              className="border border-[#e3e3e3] text-[#2c2c33] px-4 py-2 rounded-lg hover:bg-[#f7f7f7] transition-colors flex-1"
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
