"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Service, ServiceCategory } from "@/types"

interface AddServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (serviceData: {
    id?: number
    name: string
    category: string
    basePrice: number
    markup: number
    description: string
    promotionId?: number
  }) => void
  categories: ServiceCategory[]
  editingService?: Service | null
}

export default function AddServiceModal({ isOpen, onClose, onSave, categories, editingService }: AddServiceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    basePrice: 0,
    markup: 0,
    description: "",
    promotionId: undefined as number | undefined,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingService) {
      setFormData({
        name: editingService.name,
        category: editingService.category,
        basePrice: editingService.basePrice || editingService.price,
        markup: editingService.markup || 0,
        description: editingService.description || "",
        promotionId: editingService.promotionId,
      })
    } else {
      setFormData({
        name: "",
        category: "",
        basePrice: 0,
        markup: 0,
        description: "",
        promotionId: undefined,
      })
    }
    setErrors({})
  }, [editingService, isOpen])

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Название услуги обязательно"
    }

    if (!formData.category) {
      newErrors.category = "Выберите категорию"
    }

    if (formData.basePrice <= 0) {
      newErrors.basePrice = "Базовая цена должна быть больше 0"
    }

    if (formData.markup < 0) {
      newErrors.markup = "Наценка не может быть отрицательной"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSave({
      ...(editingService && { id: editingService.id }),
      name: formData.name.trim(),
      category: formData.category,
      basePrice: formData.basePrice,
      markup: formData.markup,
      description: formData.description.trim(),
      promotionId: formData.promotionId,
    })
  }

  const handleClose = () => {
    setFormData({
      name: "",
      category: "",
      basePrice: 0,
      markup: 0,
      description: "",
      promotionId: undefined,
    })
    setErrors({})
    onClose()
  }

  const finalPrice = formData.basePrice * (1 + formData.markup / 100)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#2c2c33]">
            {editingService ? "Редактировать услугу" : "Создать услугу"}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Название услуги */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название услуги <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Введите название услуги"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Категория */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Выберите категорию</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Базовая цена */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Базовая цена (₽) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: Number.parseFloat(e.target.value) || 0 })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] ${
                errors.basePrice ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0.00"
            />
            {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice}</p>}
          </div>

          {/* Наценка */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Наценка (%)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.markup}
              onChange={(e) => setFormData({ ...formData, markup: Number.parseFloat(e.target.value) || 0 })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] ${
                errors.markup ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0.0"
            />
            {errors.markup && <p className="text-red-500 text-xs mt-1">{errors.markup}</p>}
          </div>

          {/* Итоговая цена */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Итоговая цена:</span>
              <span className="text-lg font-semibold text-[#2055a4]">{finalPrice.toFixed(2)} ₽</span>
            </div>
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4]"
              rows={3}
              placeholder="Введите описание услуги"
            />
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Отмена
            </button>
            <button type="submit" className="px-4 py-2 bg-[#2055a4] text-white rounded-lg hover:bg-[#1a4590]">
              {editingService ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
