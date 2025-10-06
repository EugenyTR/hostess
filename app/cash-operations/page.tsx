"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/AppContext"
import type { CashOperationFilters } from "@/types"

// Simple icon components
const Search = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const Download = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
)

const RotateCcw = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)

const ChevronLeft = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRight = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m9 18 6-6-6-6" />
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
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"

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
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"

  switch (status) {
    case "completed":
      return `${baseClasses} bg-green-100 text-green-800`
    case "failed":
      return `${baseClasses} bg-red-100 text-red-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

export default function CashOperationsPage() {
  const router = useRouter()
  const { cashOperations, getFilteredCashOperations } = useAppContext()

  const [filters, setFilters] = useState<CashOperationFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const itemsPerPage = 10

  // Apply filters and search
  const filteredOperations = useMemo(() => {
    let operations = getFilteredCashOperations(filters)

    if (searchTerm) {
      operations = operations.filter(
        (op) =>
          op.operationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.salesPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.comment.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return operations.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
  }, [filters, searchTerm, getFilteredCashOperations])

  // Pagination
  const totalPages = Math.ceil(filteredOperations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOperations = filteredOperations.slice(startIndex, startIndex + itemsPerPage)

  const handleFilterChange = (key: keyof CashOperationFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setFilters({})
    setSearchTerm("")
    setCurrentPage(1)
  }

  const exportToExcel = () => {
    // Mock export functionality
    alert("Экспорт в Excel будет реализован")
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Внесения / Инкассации</h1>
          <p className="text-gray-600">Управление операциями внесения и инкассации денежных средств</p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Поиск по номеру, сотруднику..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата с</label>
              <input
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата по</label>
              <input
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Operation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Тип операции</label>
              <select
                value={filters.type || ""}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Все типы</option>
                <option value="deposit">Внесение</option>
                <option value="collection">Инкассация</option>
                <option value="auto_collection">Автоматическая инкассация</option>
                <option value="failed_collection">Несостоявшаяся инкассация</option>
              </select>
            </div>

            {/* Amount From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Сумма от</label>
              <input
                type="number"
                placeholder="0"
                value={filters.amountFrom || ""}
                onChange={(e) => handleFilterChange("amountFrom", e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Amount To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Сумма до</label>
              <input
                type="number"
                placeholder="0"
                value={filters.amountTo || ""}
                onChange={(e) => handleFilterChange("amountTo", e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Employee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Сотрудник</label>
              <input
                type="text"
                placeholder="ФИО сотрудника"
                value={filters.employee || ""}
                onChange={(e) => handleFilterChange("employee", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
              <select
                value={filters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Все статусы</option>
                <option value="completed">Выполнено</option>
                <option value="failed">Не выполнено</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              Экспорт в Excel
            </button>
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <RotateCcw size={16} />
              Сбросить фильтры
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Найдено операций: <span className="font-medium">{filteredOperations.length}</span>
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    № операции
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата и время
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип операции
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сотрудник
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Наличных в кассе
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Место реализации
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedOperations.map((operation) => (
                  <tr
                    key={operation.id}
                    onClick={() => router.push(`/cash-operations/${operation.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{operation.operationNumber}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDateTime(operation.dateTime)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={getOperationTypeBadge(operation.type)}>
                        {getOperationTypeLabel(operation.type)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{operation.employee}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(operation.amount)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(operation.cashInRegister)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{operation.salesPoint}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(operation.status)}>
                        {operation.status === "completed" ? "Выполнено" : "Не выполнено"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedOperations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Операции не найдены</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Показано {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOperations.length)} из{" "}
              {filteredOperations.length} операций
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                Назад
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Вперед
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
