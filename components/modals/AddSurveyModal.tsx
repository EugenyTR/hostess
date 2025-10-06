"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface Survey {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AddSurveyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => void
  editingSurvey?: Survey | null
}

export function AddSurveyModal({ isOpen, onClose, onSave, editingSurvey }: AddSurveyModalProps) {
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<{ name?: string }>({})

  useEffect(() => {
    if (editingSurvey) {
      setName(editingSurvey.name)
    } else {
      setName("")
    }
    setErrors({})
  }, [editingSurvey, isOpen])

  const validateForm = () => {
    const newErrors: { name?: string } = {}

    if (!name.trim()) {
      newErrors.name = "Название опроса обязательно"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(name.trim())
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#2c2c33]">
            {editingSurvey ? "Редактирование опроса" : "Добавление опроса"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#2c2c33] mb-1">
              Название опроса *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Введите название опроса"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[#2055a4] text-white py-2 px-4 rounded-lg hover:bg-[#1a4a94] transition-colors"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-[#2c2c33] py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отменить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
