"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Calendar, Users, MapPin, Tag, Percent, DollarSign } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import type { Promocode } from "@/types"

export default function CreatePromocodePage() {
  const router = useRouter()
  const { showNotification } = useNotification()
  const { addPromocode, points } = useAppContext()

  // Состояния формы
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "discount" as Promocode["type"],
    discountAmount: 0,
    discountType: "percentage" as Promocode["discountType"],
    startDate: "",
    endDate: "",
    targetAudience: "all" as Promocode["targetAudience"],
    applicablePoints: [] as string[],
    usageLimit: 100,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    description: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Обработчик изменения полей
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Генерация случайного кода
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    handleChange("code", result)
  }

  // Валидация формы
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Название обязательно"
    }

    if (!formData.code.trim()) {
      newErrors.code = "Код промокода обязателен"
    } else if (formData.code.length < 3) {
      newErrors.code = "Код должен содержать минимум 3 символа"
    }

    if (formData.discountAmount <= 0) {
      newErrors.discountAmount = "Размер скидки должен быть больше 0"
    }

    if (formData.discountType === "percentage" && formData.discountAmount > 100) {
      newErrors.discountAmount = "Процентная скидка не может быть больше 100%"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Дата начала обязательна"
    }

    if (!formData.endDate) {
      newErrors.endDate = "Дата окончания обязательна"
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "Дата окончания должна быть позже даты начала"
    }

    if (formData.usageLimit <= 0) {
      newErrors.usageLimit = "Лимит использования должен быть больше 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const promocodeData: Omit<Promocode, "id"> = {
        ...formData,
        code: formData.code.toUpperCase(),
        status: "active",
        usedCount: 0,
        minOrderAmount: formData.minOrderAmount || undefined,
        maxDiscountAmount: formData.maxDiscountAmount || undefined,
        description: formData.description || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const newPromocode = addPromocode(promocodeData)

      showNotification("Промокод успешно создан", "success")
      router.push("/promocodes")
    } catch (error) {
      console.error("Ошибка при создании промокода:", error)
      showNotification("Произошла ошибка при создании промокода", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#2c2c33] mb-2">Создание промокода</h1>
          <p className="text-gray-600">Заполните информацию о новом промокоде</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-8xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Основная информация */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Основная информация
            </h2>

            <div className="space-y-4">
              {/* Название */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название промокода *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Например: Скидка новичкам"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Код промокода */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Код промокода *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent font-mono ${
                      errors.code ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="PROMO2025"
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Генерировать
                  </button>
                </div>
                {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
              </div>

              {/* Тип промокода */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип промокода</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
                >
                  <option value="discount">Скидка</option>
                  <option value="cashback">Кэшбек</option>
                  <option value="free_service">Бесплатная услуга</option>
                </select>
              </div>

              {/* Описание */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
                  placeholder="Краткое описание промокода"
                />
              </div>
            </div>
          </div>

          {/* Настройки скидки */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Percent className="w-5 h-5 mr-2" />
              Настройки скидки
            </h2>

            <div className="space-y-4">
              {/* Тип скидки */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип скидки</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange("discountType", "percentage")}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      formData.discountType === "percentage"
                        ? "border-[#2055a4] bg-[#2055a4] text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Percent className="w-4 h-4 mx-auto mb-1" />
                    Процент
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("discountType", "fixed")}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      formData.discountType === "fixed"
                        ? "border-[#2055a4] bg-[#2055a4] text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <DollarSign className="w-4 h-4 mx-auto mb-1" />
                    Фиксированная
                  </button>
                </div>
              </div>

              {/* Размер скидки */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Размер скидки *</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.discountAmount}
                    onChange={(e) => handleChange("discountAmount", Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent ${
                      errors.discountAmount ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0"
                    min="0"
                    max={formData.discountType === "percentage" ? "100" : undefined}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">{formData.discountType === "percentage" ? "%" : "₽"}</span>
                  </div>
                </div>
                {errors.discountAmount && <p className="mt-1 text-sm text-red-600">{errors.discountAmount}</p>}
              </div>

              {/* Минимальная сумма заказа */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Минимальная сумма заказа</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => handleChange("minOrderAmount", Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₽</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">Оставьте 0 для отсутствия ограничений</p>
              </div>

              {/* Максимальная сумма скидки */}
              {formData.discountType === "percentage" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Максимальная сумма скидки</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => handleChange("maxDiscountAmount", Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
                      placeholder="0"
                      min="0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₽</span>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Оставьте 0 для отсутствия ограничений</p>
                </div>
              )}

              {/* Лимит использования */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Лимит использования *</label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => handleChange("usageLimit", Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent ${
                    errors.usageLimit ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="100"
                  min="1"
                />
                {errors.usageLimit && <p className="mt-1 text-sm text-red-600">{errors.usageLimit}</p>}
              </div>
            </div>
          </div>

          {/* Период действия */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Период действия
            </h2>

            <div className="space-y-4">
              {/* Дата начала */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата начала *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent ${
                    errors.startDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>

              {/* Дата окончания */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата окончания *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent ${
                    errors.endDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Целевая аудитория и точки */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Целевая аудитория
            </h2>

            <div className="space-y-4">
              {/* Тип клиентов */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Для кого предназначен</label>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "Все клиенты" },
                    { value: "physical", label: "Физические лица" },
                    { value: "legal", label: "Юридические лица" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="targetAudience"
                        value={option.value}
                        checked={formData.targetAudience === option.value}
                        onChange={(e) => handleChange("targetAudience", e.target.value)}
                        className="h-4 w-4 text-[#2055a4] focus:ring-[#2055a4] border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Применяемые точки */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Применяемые точки
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.applicablePoints.length === 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleChange("applicablePoints", [])
                        }
                      }}
                      className="h-4 w-4 text-[#2055a4] focus:ring-[#2055a4] border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 font-medium">Все точки</span>
                  </label>
                  {points.map((point) => (
                    <label key={point.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.applicablePoints.includes(point.address.fullAddress)}
                        onChange={(e) => {
                          const address = point.address.fullAddress
                          if (e.target.checked) {
                            handleChange("applicablePoints", [...formData.applicablePoints, address])
                          } else {
                            handleChange(
                              "applicablePoints",
                              formData.applicablePoints.filter((p) => p !== address),
                            )
                          }
                        }}
                        className="h-4 w-4 text-[#2055a4] focus:ring-[#2055a4] border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{point.name}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Выберите точки, где действует промокод, или оставьте "Все точки"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="mt-6 flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg text-white transition-colors flex items-center ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#2055a4] hover:bg-[#1a4a8f]"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Создание...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Создать промокод
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
