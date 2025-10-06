"use client"

import { useState, useMemo } from "react"

// Simple icon components
const Search = ({ size = 20, className = "" }) => (
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

const ChevronLeft = ({ size = 20, className = "" }) => (
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

const ChevronRight = ({ size = 20, className = "" }) => (
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

const Filter = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
  </svg>
)

const Download = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

// Интерфейс для чека
interface Receipt {
  id: number
  receiptNumber: string
  barcode: string // Добавляем штрих-код
  orderId?: number
  openDate: string
  closeDate?: string
  isReturn: boolean
  cashierName: string
  totalAmount: number
  clientName?: string
  fiscalRegistrator: string
  amountBeforeDiscounts: number
  cashlessAmount: number
  paymentType: "cash" | "cashless" | "account"
  salesPoint: string
  items: ReceiptItem[]
}

interface ReceiptItem {
  id: number
  serviceName: string
  price: number
  discount: number
  quantity: number
  totalCost: number
  salesPoint: string
  fiscalRegistrator: string
}

// Моковые данные для чеков
const mockReceipts: Receipt[] = [
  {
    id: 1,
    receiptNumber: "000001",
    barcode: "2024011500001",
    orderId: 1,
    openDate: "2024-01-15T10:30:00",
    closeDate: "2024-01-15T10:35:00",
    isReturn: false,
    cashierName: "Иванова А.С.",
    totalAmount: 2500,
    clientName: "Петров И.И.",
    fiscalRegistrator: "ФР-001",
    amountBeforeDiscounts: 2800,
    cashlessAmount: 2500,
    paymentType: "cashless",
    salesPoint: "Точка 1",
    items: [
      {
        id: 1,
        serviceName: "Химчистка пальто",
        price: 1500,
        discount: 10,
        quantity: 1,
        totalCost: 1350,
        salesPoint: "Точка 1",
        fiscalRegistrator: "ФР-001",
      },
      {
        id: 2,
        serviceName: "Стирка рубашки",
        price: 300,
        discount: 0,
        quantity: 4,
        totalCost: 1200,
        salesPoint: "Точка 1",
        fiscalRegistrator: "ФР-001",
      },
    ],
  },
  {
    id: 2,
    receiptNumber: "000002",
    barcode: "2024011500002",
    orderId: 2,
    openDate: "2024-01-15T14:20:00",
    closeDate: "2024-01-15T14:25:00",
    isReturn: true,
    cashierName: "Сидоров П.П.",
    totalAmount: -800,
    clientName: "Смирнова О.В.",
    fiscalRegistrator: "ФР-002",
    amountBeforeDiscounts: 800,
    cashlessAmount: 0,
    paymentType: "cash",
    salesPoint: "Т����чка 2",
    items: [
      {
        id: 3,
        serviceName: "Глажка брюк",
        price: 400,
        discount: 0,
        quantity: 2,
        totalCost: -800,
        salesPoint: "Точка 2",
        fiscalRegistrator: "ФР-002",
      },
    ],
  },
  {
    id: 3,
    receiptNumber: "000003",
    barcode: "2024011600003",
    openDate: "2024-01-16T09:15:00",
    closeDate: "2024-01-16T09:20:00",
    isReturn: false,
    cashierName: "Козлова М.А.",
    totalAmount: 4200,
    clientName: "ООО Рога и Копыта",
    fiscalRegistrator: "ФР-001",
    amountBeforeDiscounts: 4500,
    cashlessAmount: 4200,
    paymentType: "account",
    salesPoint: "Точка 1",
    items: [
      {
        id: 4,
        serviceName: "Химчистка костюма",
        price: 2000,
        discount: 5,
        quantity: 2,
        totalCost: 3800,
        salesPoint: "Точка 1",
        fiscalRegistrator: "ФР-001",
      },
      {
        id: 5,
        serviceName: "Стирка галстука",
        price: 200,
        discount: 0,
        quantity: 2,
        totalCost: 400,
        salesPoint: "Точка 1",
        fiscalRegistrator: "ФР-001",
      },
    ],
  },
  {
    id: 4,
    receiptNumber: "000004",
    barcode: "2024011600004",
    openDate: "2024-01-16T11:45:00",
    closeDate: "2024-01-16T11:50:00",
    isReturn: false,
    cashierName: "Иванова А.С.",
    totalAmount: 1800,
    clientName: "Федоров С.М.",
    fiscalRegistrator: "ФР-001",
    amountBeforeDiscounts: 1800,
    cashlessAmount: 0,
    paymentType: "cash",
    salesPoint: "Точка 1",
    items: [
      {
        id: 6,
        serviceName: "Химчистка платья",
        price: 1800,
        discount: 0,
        quantity: 1,
        totalCost: 1800,
        salesPoint: "Точка 1",
        fiscalRegistrator: "ФР-001",
      },
    ],
  },
  {
    id: 5,
    receiptNumber: "000005",
    barcode: "2024011600005",
    openDate: "2024-01-16T15:30:00",
    closeDate: "2024-01-16T15:35:00",
    isReturn: false,
    cashierName: "Козлова М.А.",
    totalAmount: 900,
    clientName: "Николаева Е.П.",
    fiscalRegistrator: "ФР-002",
    amountBeforeDiscounts: 1000,
    cashlessAmount: 900,
    paymentType: "cashless",
    salesPoint: "Точка 2",
    items: [
      {
        id: 7,
        serviceName: "Глажка рубашки",
        price: 250,
        discount: 10,
        quantity: 4,
        totalCost: 900,
        salesPoint: "Точка 2",
        fiscalRegistrator: "ФР-002",
      },
    ],
  },
  {
    id: 6,
    receiptNumber: "000006",
    barcode: "2024011700006",
    openDate: "2024-01-17T08:20:00",
    closeDate: "2024-01-17T08:25:00",
    isReturn: false,
    cashierName: "Сидоров П.П.",
    totalAmount: 3200,
    clientName: "ИП Морозов А.В.",
    fiscalRegistrator: "ФР-001",
    amountBeforeDiscounts: 3200,
    cashlessAmount: 3200,
    paymentType: "account",
    salesPoint: "Точка 1",
    items: [
      {
        id: 8,
        serviceName: "Химчистка куртки",
        price: 1600,
        discount: 0,
        quantity: 2,
        totalCost: 3200,
        salesPoint: "Точка 1",
        fiscalRegistrator: "ФР-001",
      },
    ],
  },
  {
    id: 7,
    receiptNumber: "000007",
    barcode: "2024011700007",
    openDate: "2024-01-17T12:10:00",
    closeDate: "2024-01-17T12:15:00",
    isReturn: false,
    cashierName: "Иванова А.С.",
    totalAmount: 1500,
    clientName: "Волкова Т.И.",
    fiscalRegistrator: "ФР-002",
    amountBeforeDiscounts: 1500,
    cashlessAmount: 0,
    paymentType: "cash",
    salesPoint: "Точка 2",
    items: [
      {
        id: 9,
        serviceName: "Химчистка блузки",
        price: 750,
        discount: 0,
        quantity: 2,
        totalCost: 1500,
        salesPoint: "Точка 2",
        fiscalRegistrator: "ФР-002",
      },
    ],
  },
  {
    id: 8,
    receiptNumber: "000008",
    barcode: "2024011700008",
    openDate: "2024-01-17T16:40:00",
    closeDate: "2024-01-17T16:45:00",
    isReturn: true,
    cashierName: "Козлова М.А.",
    totalAmount: -1200,
    clientName: "Орлов Д.С.",
    fiscalRegistrator: "ФР-001",
    amountBeforeDiscounts: 1200,
    cashlessAmount: -1200,
    paymentType: "cashless",
    salesPoint: "Точка 1",
    items: [
      {
        id: 10,
        serviceName: "Стирка постельного белья",
        price: 600,
        discount: 0,
        quantity: 2,
        totalCost: -1200,
        salesPoint: "Точка 1",
        fiscalRegistrator: "ФР-001",
      },
    ],
  },
]

export default function ReceiptsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterReturn, setFilterReturn] = useState<"all" | "yes" | "no">("all")
  const [filterPaymentType, setFilterPaymentType] = useState<"all" | "cash" | "cashless" | "account">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  // Фильтрация чеков
  const filteredReceipts = useMemo(() => {
    return mockReceipts.filter((receipt) => {
      const matchesSearch =
        receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.cashierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.fiscalRegistrator.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesReturn =
        filterReturn === "all" ||
        (filterReturn === "yes" && receipt.isReturn) ||
        (filterReturn === "no" && !receipt.isReturn)

      const matchesPaymentType = filterPaymentType === "all" || receipt.paymentType === filterPaymentType

      const matchesDateFrom = !dateFrom || new Date(receipt.openDate) >= new Date(dateFrom)
      const matchesDateTo = !dateTo || new Date(receipt.openDate) <= new Date(dateTo + "T23:59:59")

      return matchesSearch && matchesReturn && matchesPaymentType && matchesDateFrom && matchesDateTo
    })
  }, [searchTerm, filterReturn, filterPaymentType, dateFrom, dateTo])

  // Пагинация
  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentReceipts = filteredReceipts.slice(startIndex, endIndex)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("ru-RU", {
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

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case "cash":
        return "Наличные"
      case "cashless":
        return "Безналичные"
      case "account":
        return "Расчетный счет"
      default:
        return type
    }
  }

  const exportToExcel = () => {
    const headers = [
      "№ чека",
      "Штрих-код",
      "Открыт",
      "Закрыт",
      "Возврат",
      "Кассир",
      "Сумма по чеку",
      "Клиент",
      "Фискальный регистратор",
      "Тип оплаты",
    ]

    const csvData = [
      headers.join(","),
      ...filteredReceipts.map((receipt) =>
        [
          receipt.receiptNumber,
          receipt.barcode,
          formatDate(receipt.openDate),
          receipt.closeDate ? formatDate(receipt.closeDate) : "",
          receipt.isReturn ? "Да" : "Нет",
          `"${receipt.cashierName}"`,
          receipt.totalAmount,
          `"${receipt.clientName || ""}"`,
          receipt.fiscalRegistrator,
          getPaymentTypeLabel(receipt.paymentType),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob(["\uFEFF" + csvData], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `receipts_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="p-6">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#2c2c33] mb-2">Чеки</h1>
          <p className="text-[#8e8e8e]">Управление чеками и просмотр истории операций</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-[#8e8e8e]">Всего чеков</p>
                <p className="text-2xl font-bold text-[#2c2c33]">{filteredReceipts.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-[#8e8e8e]">Общая сумма</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(filteredReceipts.reduce((sum, r) => sum + r.totalAmount, 0))}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-[#8e8e8e]">Возвраты</p>
                <p className="text-2xl font-bold text-red-600">{filteredReceipts.filter((r) => r.isReturn).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-[#8e8e8e]">Средний чек</p>
                <p className="text-2xl font-bold text-[#2c2c33]">
                  {formatCurrency(
                    filteredReceipts.length > 0
                      ? filteredReceipts.reduce((sum, r) => sum + r.totalAmount, 0) / filteredReceipts.length
                      : 0,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Поиск */}
            <div className="relative flex-1 min-w-[300px]">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8e8e8e]" />
              <input
                type="text"
                placeholder="Поиск по номеру чека, штрих-коду, клиенту, кассиру..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              />
            </div>

            {/* Фильтр по дате от */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#8e8e8e]">С:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              />
            </div>

            {/* Фильтр по дате до */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#8e8e8e]">По:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              />
            </div>

            {/* Фильтр по возврату */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[#8e8e8e]" />
              <select
                value={filterReturn}
                onChange={(e) => setFilterReturn(e.target.value as "all" | "yes" | "no")}
                className="px-3 py-2 border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              >
                <option value="all">Все чеки</option>
                <option value="no">Обычные</option>
                <option value="yes">Возвраты</option>
              </select>
            </div>

            {/* Фильтр по типу оплаты */}
            <div className="flex items-center gap-2">
              <select
                value={filterPaymentType}
                onChange={(e) => setFilterPaymentType(e.target.value as "all" | "cash" | "cashless" | "account")}
                className="px-3 py-2 border border-[#e5e7eb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              >
                <option value="all">Все типы оплаты</option>
                <option value="cash">Наличные</option>
                <option value="cashless">Безналичные</option>
                <option value="account">Расчетный счет</option>
              </select>
            </div>

            {/* Кнопка экспорта */}
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Экспорт
            </button>
          </div>
        </div>

        {/* Таблица чеков */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8f9fa] border-b border-[#e5e7eb]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    № чека
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Штрих-код
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Открыт
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Закрыт
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Возврат
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Кассир
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Сумма по чеку
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Клиент
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Фискальный регистратор
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Итого
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#e5e7eb]">
                {currentReceipts.map((receipt) => (
                  <tr
                    key={receipt.id}
                    className="hover:bg-[#f8f9fa] cursor-pointer transition-colors"
                    onClick={() => (window.location.href = `/receipts/${receipt.id}`)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#2c2c33]">{receipt.receiptNumber}</div>
                      {receipt.orderId && <div className="text-xs text-[#8e8e8e]">Заказ #{receipt.orderId}</div>}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#2c2c33] font-mono">{receipt.barcode}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#2c2c33]">{formatDate(receipt.openDate)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#2c2c33]">
                        {receipt.closeDate ? formatDate(receipt.closeDate) : "—"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          receipt.isReturn ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {receipt.isReturn ? "Да" : "Нет"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#2c2c33]">{receipt.cashierName}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${receipt.totalAmount < 0 ? "text-red-600" : "text-[#2c2c33]"}`}
                      >
                        {formatCurrency(receipt.totalAmount)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#2c2c33]">{receipt.clientName || "—"}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#2c2c33]">{receipt.fiscalRegistrator}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#2c2c33]">{getPaymentTypeLabel(receipt.paymentType)}</div>
                      <div className="text-xs text-[#8e8e8e]">Безнал: {formatCurrency(receipt.cashlessAmount)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-[#e5e7eb] flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-[#e5e7eb] text-sm font-medium rounded-md text-[#6b7280] bg-white hover:bg-[#f8f9fa] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Предыдущая
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-[#e5e7eb] text-sm font-medium rounded-md text-[#6b7280] bg-white hover:bg-[#f8f9fa] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Следующая
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-[#6b7280]">
                    Показано <span className="font-medium">{startIndex + 1}</span> до{" "}
                    <span className="font-medium">{Math.min(endIndex, filteredReceipts.length)}</span> из{" "}
                    <span className="font-medium">{filteredReceipts.length}</span> результатов
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[#e5e7eb] bg-white text-sm font-medium text-[#6b7280] hover:bg-[#f8f9fa] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? "z-10 bg-[#2055a4] border-[#2055a4] text-white"
                            : "bg-white border-[#e5e7eb] text-[#6b7280] hover:bg-[#f8f9fa]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[#e5e7eb] bg-white text-sm font-medium text-[#6b7280] hover:bg-[#f8f9fa] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Пустое состояние */}
        {filteredReceipts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] p-8 text-center">
            <div className="text-[#8e8e8e] mb-4">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-[#2c2c33] mb-2">Чеки не найдены</h3>
              <p>Попробуйте изменить параметры поиска или фильтры</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
