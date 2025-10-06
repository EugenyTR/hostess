"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, X } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import type { Promocode } from "@/types"

export default function EditPromocodePage() {
  const router = useRouter()
  const params = useParams()
  const { showNotification } = useNotification()
  const { promocodes, updatePromocode, points } = useAppContext()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "discount" as "discount" | "cashback" | "free_service",
    discountAmount: 0,
    discountType: "percentage" as "percentage" | "fixed",
    startDate: "",
    endDate: "",
    status: "active" as "active" | "inactive",
    targetAudience: "all" as "physical" | "legal" | "all",
    applicablePoints: [] as string[],
    usageLimit: 100,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    description: "",
  })

  useEffect(() => {
    const id = Number.parseInt(params.id as string)
    const promocode = promocodes.find((p) => p.id === id)

    if (promocode) {
      setFormData({
        name: promocode.name,
        code: promocode.code,
        type: promocode.type,
        discountAmount: promocode.discountAmount,
        discountType: promocode.discountType,
        startDate: promocode.startDate,
        endDate: promocode.endDate,
        status: promocode.status === "expired" ? "active" : promocode.status,
        targetAudience: promocode.targetAudience,
        applicablePoints: promocode.applicablePoints,
        usageLimit: promocode.usageLimit,
        minOrderAmount: promocode.minOrderAmount || 0,
        maxDiscountAmount: promocode.maxDiscountAmount || 0,
        description: promocode.description || "",
      })
    }
    setLoading(false)
  }, [params.id, promocodes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const id = Number.parseInt(params.id as string)
      const originalPromocode = promocodes.find((p) => p.id === id)

      if (!originalPromocode) {
        showNotification("Промокод не найден", "error")
        return
      }

      // Валидация
      if (!formData.name.trim()) {
        showNotification("Название промокода обязательно", "error")
        return
      }

      if (!formData.code.trim()) {
        showNotification("Код промокода обязателен", "error")
        return
      }

      if (formData.discountAmount <= 0) {
        showNotification("Размер скидки должен быть больше 0", "error")
        return
      }

      if (formData.usageLimit <= 0) {
        showNotification("Лимит использования должен быть больше 0", "error")
        return
      }

      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        showNotification("Дата окончания должна быть позже даты начала", "error")
        return
      }

      // Проверяем уникальность кода (исключая текущий промокод)
      const codeExists = promocodes.some((p) => p.id !== id && p.code.toLowerCase() === formData.code.toLowerCase())
      if (codeExists) {
        showNotification("Промокод с таким кодом уже существует", "error")
        return
      }

      const updatedPromocode: Promocode = {
        ...originalPromocode,
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        type: formData.type,
        discountAmount: formData.discountAmount,
        discountType: formData.discountType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        targetAudience: formData.targetAudience,
        applicablePoints: formData.applicablePoints,
        usageLimit: formData.usageLimit,
        minOrderAmount: formData.minOrderAmount || undefined,
        maxDiscountAmount: formData.maxDiscountAmount || undefined,
        description: formData.description.trim() || undefined,
        updatedAt: new Date().toISOString(),
      }

      updatePromocode(updatedPromocode)
      showNotification("Промокод успешно обновлен", "success")
      router.push(`/promocodes/${id}`)
    } catch (error) {
      showNotification("Ошибка при обновлении промокода", "error")
    } finally {
      setSaving(false)
    }
  }

  const handlePointToggle = (pointAddress: string) => {
    setFormData((prev) => ({
      ...prev,
      applicablePoints: prev.applicablePoints.includes(pointAddress)
        ? prev.applicablePoints.filter((p) => p !== pointAddress)
        : [...prev.applicablePoints, pointAddress],
    }))
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const originalPromocode = promocodes.find((p) => p.id === Number.parseInt(params.id as string))
  if (!originalPromocode) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">Промокод не найден</h3>
          <p className="mt-1 text-sm text-gray-500">Промокод с указанным ID не существует</p>
          <div className="mt-6">
            <button
              onClick={() => router.push("/promocodes")}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#2055a4] hover:bg-[#1a4a8f]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к списку
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.push(`/promocodes/${params.id}`)}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#2c2c33]">Редактирование промокода</h1>
            <p className="text-gray-600">Изменение параметров промокода #{originalPromocode.id}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название промокода <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
                placeholder="Введите название промокода"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Код промокода <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent font-mono"
                placeholder="PROMO2025"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тип промокода</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              >
                <option value="discount">Скидка</option>
                <option value="cashback">Кэшбек</option>
                <option value="free_service">Бесплатная услуга</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              >
                <option value="active">Активный</option>
                <option value="inactive">Отключён</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              placeholder="Описание промокода (необязательно)"
            />
          </div>
        </div>

        {/* Параметры скидки */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Параметры скидки</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тип скидки</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              >
                <option value="percentage">Процент (%)</option>
                <option value="fixed">Фиксированная сумма (₽)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Размер скидки <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.discountAmount}
                onChange={(e) => setFormData({ ...formData, discountAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
                min="0"
                step={formData.discountType === "percentage" ? "1" : "0.01"}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Лимит использования <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Минимальная сумма заказа (₽)</label>
              <input
                type="number"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Максимальная скидка (₽)</label>
              <input
                type="number"
                value={formData.maxDiscountAmount}
                onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
                min="0"
                step="0.01"
                disabled={formData.discountType === "percentage" ? false : true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Целевая аудитория</label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              >
                <option value="all">Все клиенты</option>
                <option value="physical">Физические лица</option>
                <option value="legal">Юридические лица</option>
              </select>
            </div>
          </div>
        </div>

        {/* Период действия */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Период действия</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата начала <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата окончания <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Точки применения */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Точки применения</h2>
          <p className="text-sm text-gray-600 mb-4">
            Выберите точки, где будет действовать промокод. Если ничего не выбрано, промокод будет действовать во всех
            точках.
          </p>

          <div className="space-y-2">
            {points.map((point) => (
              <label key={point.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.applicablePoints.includes(point.address.fullAddress)}
                  onChange={() => handlePointToggle(point.address.fullAddress)}
                  className="rounded border-gray-300 text-[#2055a4] focus:ring-[#2055a4]"
                />
                <span className="ml-2 text-sm text-gray-900">{point.address.fullAddress}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push(`/promocodes/${params.id}`)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Отмена
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#2055a4] text-white px-4 py-2 rounded-lg hover:bg-[#1a4a8f] transition-colors flex items-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Сохранение..." : "Сохрани��ь изменения"}
          </button>
        </div>
      </form>
    </div>
  )
}
