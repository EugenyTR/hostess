"use client"

import { useState } from "react"
import { useAppContext } from "@/context/AppContext"

// Simple icon components
const Eye = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const CheckCircle = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
)

const Clock = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

const AlertTriangle = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="m12 17 .01 0" />
  </svg>
)

export default function CashShiftsPage() {
  const { cashShifts } = useAppContext()
  const [selectedShift, setSelectedShift] = useState<number | null>(null)

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

  const getStatusIcon = (status: string, emergencyClose: boolean) => {
    if (emergencyClose) {
      return <AlertTriangle size={16} className="text-red-500" />
    }
    if (status === "open") {
      return <Clock size={16} className="text-blue-500" />
    }
    return <CheckCircle size={16} className="text-green-500" />
  }

  const getStatusText = (status: string) => {
    return status === "open" ? "Открыта" : "Закрыта"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Кассовые смены</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Кассовая смена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Время открытия
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Время закрытия
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Фискальный регистратор
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Открыл смену
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Закрыл смену
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Выручка, ₽
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Количество чеков
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Место реализации
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cashShifts.map((shift) => (
                  <tr
                    key={shift.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedShift(shift.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {shift.shiftNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(shift.openTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shift.closeTime ? formatDateTime(shift.closeTime) : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.fiscalRegistrator}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.openedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.closedBy || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(shift.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.receiptsCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.salesPoint}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(shift.status, shift.emergencyClose)}
                        <span className="ml-2 text-sm text-gray-500">{getStatusText(shift.status)}</span>
                        {shift.emergencyClose && <span className="ml-2 text-xs text-red-500">(Аварийное)</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedShift(shift.id)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Модальное окно с подробной информацией */}
        {selectedShift && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  Кассовая смена №{cashShifts.find((s) => s.id === selectedShift)?.shiftNumber}
                </h2>
                <button onClick={() => setSelectedShift(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {(() => {
                const shift = cashShifts.find((s) => s.id === selectedShift)
                if (!shift) return null

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Основная информация */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Основная информация</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ID:</span>
                          <span>{shift.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Номер смены:</span>
                          <span>{shift.shiftNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Время открытия:</span>
                          <span>{formatDateTime(shift.openTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Время закрытия:</span>
                          <span>{shift.closeTime ? formatDateTime(shift.closeTime) : "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Фискальный регистратор:</span>
                          <span>{shift.fiscalRegistrator}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Открыл смену:</span>
                          <span>{shift.openedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Закрыл смену:</span>
                          <span>{shift.closedBy || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Место реализации:</span>
                          <span>{shift.salesPoint}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Номер Z-отчета:</span>
                          <span>{shift.zReportNumber || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Статус:</span>
                          <div className="flex items-center">
                            {getStatusIcon(shift.status, shift.emergencyClose)}
                            <span className="ml-2">{getStatusText(shift.status)}</span>
                            {shift.emergencyClose && (
                              <span className="ml-2 text-xs text-red-500">(Аварийное закрытие)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Финансовая информация */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Финансовая информация</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Выручка:</span>
                          <span className="font-semibold">{formatCurrency(shift.revenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Итого:</span>
                          <span className="font-semibold">{formatCurrency(shift.total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Количество чеков:</span>
                          <span>{shift.receiptsCount}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Фиск. нал.:</span>
                            <span>{formatCurrency(shift.fiscalCash)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Фиск. безнал.:</span>
                            <span>{formatCurrency(shift.fiscalCashless)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Нефиск. нал.:</span>
                            <span>{formatCurrency(shift.nonFiscalCash)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Нефиск. безнал.:</span>
                            <span>{formatCurrency(shift.nonFiscalCashless)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Нефиск. бонусы:</span>
                            <span>{formatCurrency(shift.nonFiscalBonuses)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Возвраты */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Возвраты</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Всего возвратов:</span>
                          <span className="font-semibold">{formatCurrency(shift.returns)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Возвраты фиск. нал.:</span>
                          <span>{formatCurrency(shift.returnsFiscalCash)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Возвраты фиск. безнал.:</span>
                          <span>{formatCurrency(shift.returnsFiscalCashless)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Возвраты нефиск. нал.:</span>
                          <span>{formatCurrency(shift.returnsNonFiscalCash)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Возвраты нефиск. безнал.:</span>
                          <span>{formatCurrency(shift.returnsNonFiscalCashless)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Возвраты нефиск. бонусы:</span>
                          <span>{formatCurrency(shift.returnsNonFiscalBonuses)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Возвраты списание:</span>
                          <span>{formatCurrency(shift.returnsWriteOff)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Касса */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Касса</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Сумма в кассе на начало дня:</span>
                          <span>{formatCurrency(shift.cashAtStart)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Сумма в кассе на конец дня:</span>
                          <span>{formatCurrency(shift.cashAtEnd)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Разница с прошлой сменой:</span>
                          <span
                            className={
                              shift.previousShiftDifference > 0
                                ? "text-green-600"
                                : shift.previousShiftDifference < 0
                                  ? "text-red-600"
                                  : ""
                            }
                          >
                            {formatCurrency(shift.previousShiftDifference)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Разница расчетной и внесенной суммы:</span>
                          <span
                            className={
                              shift.cashDifference > 0
                                ? "text-green-600"
                                : shift.cashDifference < 0
                                  ? "text-red-600"
                                  : ""
                            }
                          >
                            {formatCurrency(shift.cashDifference)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
