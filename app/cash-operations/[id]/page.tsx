"use client"

import { useParams, useRouter } from "next/navigation"
import { useAppContext } from "@/context/AppContext"

// Simple icon components
const ArrowLeft = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
)

const Calendar = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
)

const User = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const DollarSign = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const MapPin = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const CreditCard = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" x2="23" y1="10" y2="10" />
  </svg>
)

const getOperationTypeLabel = (type: string) => {
  switch (type) {
    case "deposit":
      return "Внесение"
    case "collection":
      return "Инкассация"
    case "auto_collection":
      return "Автоматическая инкассация"
    case "failed_collection":
      return "Несостоявшаяся инкассация"
    default:
      return type
  }
}

const getOperationTypeBadge = (type: string) => {
  const baseClasses = "px-3 py-1 rounded-full text-sm font-medium"

  switch (type) {
    case "deposit":
      return `${baseClasses} bg-green-100 text-green-800`
    case "collection":
      return `${baseClasses} bg-blue-100 text-blue-800`
    case "auto_collection":
      return `${baseClasses} bg-purple-100 text-purple-800`
    case "failed_collection":
      return `${baseClasses} bg-red-100 text-red-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

const getStatusBadge = (status: string) => {
  const baseClasses = "px-3 py-1 rounded-full text-sm font-medium"

  switch (status) {
    case "completed":
      return `${baseClasses} bg-green-100 text-green-800`
    case "failed":
      return `${baseClasses} bg-red-100 text-red-800`
    case "in_progress":
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Выполнено"
    case "failed":
      return "Не выполнено"
    case "in_progress":
      return "В процессе"
    default:
      return status
  }
}

export default function CashOperationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { getCashOperationDetails } = useAppContext()

  const operationId = Number.parseInt(params.id as string)
  const operationDetails = getCashOperationDetails(operationId)

  if (!operationDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Операция не найдена</p>
            <button
              onClick={() => router.push("/cash-operations")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Вернуться к списку
            </button>
          </div>
        </div>
      </div>
    )
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/cash-operations")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Вернуться к списку операций
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Операция {operationDetails.operationNumber}</h1>
              <p className="text-gray-600">Подробная информация об операции инкассации</p>
            </div>
            <div className="text-right">
              <span className={getStatusBadge(operationDetails.status)}>{getStatusLabel(operationDetails.status)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Время открытия</p>
                      <p className="font-medium text-gray-900">{formatDateTime(operationDetails.openTime)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Сотрудник, открывший смену</p>
                      <p className="font-medium text-gray-900">{operationDetails.openedBy}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Кассир</p>
                      <p className="font-medium text-gray-900">{operationDetails.cashier}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Фискальный регистратор</p>
                      <p className="font-medium text-gray-900">{operationDetails.fiscalRegistrator}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Кассовая смена</p>
                      <p className="font-medium text-gray-900">{operationDetails.cashShiftNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Место реализации</p>
                      <p className="font-medium text-gray-900">{operationDetails.salesPoint}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Финансовая информация</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Итого, ₽</p>
                      <p className="font-medium text-gray-900 text-lg">{formatCurrency(operationDetails.total)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Выручка, ₽</p>
                      <p className="font-medium text-gray-900">{formatCurrency(operationDetails.revenue)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Себестоимость, ₽</p>
                      <p className="font-medium text-gray-900">{formatCurrency(operationDetails.costPrice)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Количество чеков</p>
                      <p className="font-medium text-gray-900">{operationDetails.receiptsCount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Сумма инкассаций, ₽</p>
                      <p className="font-medium text-gray-900">{formatCurrency(operationDetails.collectionAmount)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Счет-получатель инкассации</p>
                      <p className="font-medium text-gray-900 font-mono">{operationDetails.recipientAccount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Краткая статистика</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Статус операции</span>
                  <span className={getStatusBadge(operationDetails.status)}>
                    {getStatusLabel(operationDetails.status)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Общая сумма</span>
                  <span className="font-medium text-gray-900">{formatCurrency(operationDetails.total)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Выручка</span>
                  <span className="font-medium text-gray-900">{formatCurrency(operationDetails.revenue)}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Чеков обработано</span>
                  <span className="font-medium text-gray-900">{operationDetails.receiptsCount}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Временная шкала</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Операция создана</p>
                    <p className="text-xs text-gray-500">{formatDateTime(operationDetails.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Смена открыта</p>
                    <p className="text-xs text-gray-500">{formatDateTime(operationDetails.openTime)}</p>
                  </div>
                </div>

                {operationDetails.status === "completed" && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Операция завершена</p>
                      <p className="text-xs text-gray-500">{formatDateTime(operationDetails.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Действия</h3>

              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Печать отчета
                </button>
                <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                  Экспорт данных
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
