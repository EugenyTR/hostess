"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { City } from "@/types"

interface AddCityModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (cityData: Omit<City, "id">) => void
  editingCity: City | null
}

export function AddCityModal({ isOpen, onClose, onAdd, editingCity }: AddCityModalProps) {
  const [name, setName] = useState("")
  const [region, setRegion] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [errors, setErrors] = useState<{ name?: string }>({})

  useEffect(() => {
    if (editingCity) {
      setName(editingCity.name)
      setRegion(editingCity.region || "")
      setIsActive(editingCity.isActive)
    } else {
      setName("")
      setRegion("")
      setIsActive(true)
    }
    setErrors({})
  }, [editingCity, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Валидация
    const newErrors: { name?: string } = {}
    if (!name.trim()) {
      newErrors.name = "Название города обязательно"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onAdd({ name, region, isActive })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-[#e3e3e3]">
          <h2 className="text-lg font-medium text-[#2c2c33]">
            {editingCity ? "Редактировать город" : "Добавить город"}
          </h2>
          <button onClick={onClose} className="text-[#8e8e8e] hover:text-[#2c2c33] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-[#2c2c33] mb-1">
              Название города*
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-[#e3e3e3]"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent`}
              placeholder="Введите название города"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="region" className="block text-sm font-medium text-[#2c2c33] mb-1">
              Регион
            </label>
            <input
              type="text"
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 border border-[#e3e3e3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              placeholder="Введите регион"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 text-[#2055a4] focus:ring-[#2055a4] border-[#e3e3e3] rounded"
              />
              <span className="ml-2 text-sm text-[#2c2c33]">Активный</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#e3e3e3] text-[#2c2c33] rounded-lg hover:bg-[#f8f9fa] transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2055a4] text-white rounded-lg hover:bg-[#1a4a94] transition-colors"
            >
              {editingCity ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
