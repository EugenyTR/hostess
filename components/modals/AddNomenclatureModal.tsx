"use client"

import type React from "react"

import { useState } from "react"

const X = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m18 6-12 12" />
    <path d="m6 6 12 12" />
  </svg>
)

interface NomenclatureItem {
  name: string
  article: string
  basePrice: number
  markup: number
  finalPrice: number
  warehouse: string
  defaultQuantity: number
  status: "active" | "inactive"
  category: string
}

interface AddNomenclatureModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: NomenclatureItem) => void
}

const categories = ["Химия", "Покрасочные средства", "Мех", "Домашний текстиль", "Сумки", "Прачечные услуги"]

const warehouses = ["Основной склад", "Склад №2", "Склад №3", "Временный склад"]

export default function AddNomenclatureModal({ isOpen, onClose, onSave }: AddNomenclatureModalProps) {
  const [formData, setFormData] = useState<NomenclatureItem>({
    name: "",
    article: "",
    basePrice: 0,
    markup: 0,
    finalPrice: 0,
    warehouse: warehouses[0],
    defaultQuantity: 1,
    status: "active",
    category: categories[0],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const calculateFinalPrice = (basePrice: number, markup: number) => {
    return basePrice + (basePrice * markup) / 100
  }

  const handleInputChange = (field: keyof NomenclatureItem, value: any) => {
    const updatedData = { ...formData, [field]: value }

    // Auto-calculate final price when base price or markup changes
    if (field === "basePrice" || field === "markup") {
      updatedData.finalPrice = calculateFinalPrice(
        field === "basePrice" ? value : formData.basePrice,
        field === "markup" ? value : formData.markup,
      )
    }

    setFormData(updatedData)

    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Наименование обязательно"
    }

    if (!formData.article.trim()) {
      newErrors.article = "Артикул обязателен"
    }

    if (formData.basePrice <= 0) {
      newErrors.basePrice = "Базовая цена должна быть больше 0"
    }

    if (formData.markup < 0) {
      newErrors.markup = "Наценка не может быть отрицательной"
    }

    if (formData.defaultQuantity <= 0) {
      newErrors.defaultQuantity = "Количество должно быть больше 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      article: "",
      basePrice: 0,
      markup: 0,
      finalPrice: 0,
      warehouse: warehouses[0],
      defaultQuantity: 1,
      status: "active",
      category: categories[0],
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Добавить номенклатуру</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Наименование химии *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Введите наименование"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Article */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Артикул *</label>
              <input
                type="text"
                value={formData.article}
                onChange={(e) => handleInputChange("article", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.article ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Введите артикул"
              />
              {errors.article && <p className="text-red-500 text-xs mt-1">{errors.article}</p>}
            </div>

            {/* Base Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Базовая цена (₽) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => handleInputChange("basePrice", Number.parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.basePrice ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice}</p>}
            </div>

            {/* Markup */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Наценка (%) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.markup}
                onChange={(e) => handleInputChange("markup", Number.parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.markup ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.markup && <p className="text-red-500 text-xs mt-1">{errors.markup}</p>}
            </div>

            {/* Final Price (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Стоимость с учетом наценки (₽)</label>
              <input
                type="number"
                value={formData.finalPrice.toFixed(2)}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            {/* Warehouse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Склад *</label>
              <select
                value={formData.warehouse}
                onChange={(e) => handleInputChange("warehouse", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {warehouses.map((warehouse) => (
                  <option key={warehouse} value={warehouse}>
                    {warehouse}
                  </option>
                ))}
              </select>
            </div>

            {/* Default Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Количество по умолчанию *</label>
              <input
                type="number"
                min="1"
                value={formData.defaultQuantity}
                onChange={(e) => handleInputChange("defaultQuantity", Number.parseInt(e.target.value) || 1)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.defaultQuantity ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="1"
              />
              {errors.defaultQuantity && <p className="text-red-500 text-xs mt-1">{errors.defaultQuantity}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Статус *</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value as "active" | "inactive")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Активен</option>
                <option value="inactive">Неактивен</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
