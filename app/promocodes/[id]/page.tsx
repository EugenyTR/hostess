"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Calendar, Tag, MapPin, Edit, Trash2 } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import type { Promocode } from "@/types"

export default function PromocodePage() {
  const router = useRouter()
  const params = useParams()
  const { showNotification } = useNotification()
  const { promocodes, deletePromocode } = useAppContext()
  const [promocode, setPromocode] = useState<Promocode | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = Number.parseInt(params.id as string)
    const foundPromocode = promocodes.find((p) => p.id === id)
    setPromocode(foundPromocode || null)
    setLoading(false)
  }, [params.id, promocodes])

  // Функция для определения статуса промокода
  const getPromocodeStatus = (promocode: Promocode): "active" | "expired" | "inactive" => {
    if (promocode.status === "inactive") return "inactive"

    const currentDate = new Date()
    const endDate = new Date(promocode.endDate)

    if (endDate < currentDate) return "expired"
    if (promocode.usedCount >= promocode.usageLimit) return "expired"

    return "active"
  }

  // Обработчик удаления промокода
  const handleDelete = () => {
    if (promocode && confirm("Вы уверены, что хотите удалить этот промокод?")) {
      deletePromocode(promocode.id)
      showNotification("Промокод успешно удален", "success")
      router.push("/promocodes")
    }
  }

  // Функция для получения цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Функция для получения текста статуса
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Активный"
      case "expired":
        return "Истёк"
      case "inactive":
        return "Отключён"
      default:
        return "Неизвестно"
    }
  }

  // Функция для получения текста типа
  const getTypeText = (type: string) => {
    switch (type) {
      case "discount":
        return "Скидка"
      case "cashback":
        return "Кэшбек"
      case "free_service":
        return "Бесплатная услуга"
      default:
        return type
    }
  }

  // Функция для получения текста аудитории
  const getAudienceText = (audience: string) => {
    switch (audience) {
      case "physical":
        return "Физические лица"
      case "legal":
        return "Юридические лица"
      case "all":
        return "Все клиенты"
      default:
        return audience
    }
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

  if (!promocode) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Tag className="mx-auto h-12 w-12 text-gray-400" />
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

  const status = getPromocodeStatus(promocode)

  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/promocodes")}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#2c2c33]">{promocode.name}</h1>
            <p className="text-gray-600">Детали промокода #{promocode.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push(`/promocodes/${promocode.id}/edit`)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Редактировать
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Удалить
          </button>
        </div>
      </div>

      {/* Основная информация */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Статус и основные данные */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
              <p className="text-sm text-gray-900">{promocode.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Код промокода</label>
              <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{promocode.code}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getTypeText(promocode.type)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
              >
                {getStatusText(status)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Размер скидки</label>
              <p className="text-sm text-gray-900">
                {promocode.discountAmount}
                {promocode.discountType === "percentage" ? "%" : "₽"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Целевая аудитория</label>
              <p className="text-sm text-gray-900">{getAudienceText(promocode.targetAudience)}</p>
            </div>
          </div>

          {promocode.description && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
              <p className="text-sm text-gray-900">{promocode.description}</p>
            </div>
          )}
        </div>

        {/* Статистика использования */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Использовано</span>
              <span className="text-sm font-medium text-gray-900">
                {promocode.usedCount} из {promocode.usageLimit}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#2055a4] h-2 rounded-full"
                style={{
                  width: `${Math.min((promocode.usedCount / promocode.usageLimit) * 100, 100)}%`,
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Процент использования</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round((promocode.usedCount / promocode.usageLimit) * 100)}%
              </span>
            </div>

            {promocode.minOrderAmount && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Мин. сумма заказа</span>
                <span className="text-sm font-medium text-gray-900">{promocode.minOrderAmount}₽</span>
              </div>
            )}

            {promocode.maxDiscountAmount && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Макс. скидка</span>
                <span className="text-sm font-medium text-gray-900">{promocode.maxDiscountAmount}₽</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Период действия и точки применения */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Период действия */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-gray-600" />
            Период действия
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата начала</label>
              <p className="text-sm text-gray-900">
                {new Date(promocode.startDate).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата окончания</label>
              <p className="text-sm text-gray-900">
                {new Date(promocode.endDate).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Продолжительность</label>
              <p className="text-sm text-gray-900">
                {Math.ceil(
                  (new Date(promocode.endDate).getTime() - new Date(promocode.startDate).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{" "}
                дней
              </p>
            </div>
          </div>
        </div>

        {/* Точки применения */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-gray-600" />
            Точки применения
          </h2>

          {promocode.applicablePoints.length > 0 ? (
            <div className="space-y-2">
              {promocode.applicablePoints.map((point, index) => (
                <div key={index} className="flex items-center text-sm text-gray-900">
                  <MapPin className="w-3 h-3 mr-2 text-gray-400" />
                  {point}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Применяется во всех точках</p>
          )}
        </div>
      </div>

      {/* Даты создания и обновления */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Системная информация</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дата создания</label>
            <p className="text-sm text-gray-900">
              {new Date(promocode.createdAt).toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Последнее обновление</label>
            <p className="text-sm text-gray-900">
              {new Date(promocode.updatedAt).toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
