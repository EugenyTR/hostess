"use client"

import { useState } from "react"
import { useNotification } from "@/context/NotificationContext"

// Простые иконки
const Calendar = ({ size = 20, className = "" }) => (
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

const Download = ({ size = 20, className = "" }) => (
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

interface ReportData {
  id: number
  dateTime: string
  checksCount: number
  cashier: string
  salesAmount: number
  clientGroup: string
  paymentMethod: string
  city: string
  clients: string
  salesCount: number
  tradingPoint: string
  cashSales: number
  cashlessSales: number
  discountAmount: number
  services: string
  averageCheck: number
  units: string
  nomenclature: string
  serviceCategory: string
}

const mockReportData: ReportData[] = [
  {
    id: 1,
    dateTime: "30.09.2020 22:31",
    checksCount: 1,
    cashier: "Иванов И.И.",
    salesAmount: 1000,
    clientGroup: "Физ. лицо",
    paymentMethod: "Наличные",
    city: "Москва",
    clients: "Петров П.П.",
    salesCount: 1,
    tradingPoint: "Точка №1",
    cashSales: 1000,
    cashlessSales: 0,
    discountAmount: 0,
    services: "Химчистка куртки",
    averageCheck: 1000,
    units: "шт",
    nomenclature: "Куртка зимняя",
    serviceCategory: "Верхняя одежда",
  },
  {
    id: 2,
    dateTime: "30.09.2020 22:32",
    checksCount: 1,
    cashier: "Иванов И.И.",
    salesAmount: 1000,
    clientGroup: "Физ. лицо",
    paymentMethod: "Безналичные",
    city: "Иркутск",
    clients: "Сидоров С.С.",
    salesCount: 1,
    tradingPoint: "Точка №2",
    cashSales: 0,
    cashlessSales: 1000,
    discountAmount: 100,
    services: "Химчистка костюма",
    averageCheck: 1000,
    units: "шт",
    nomenclature: "Костюм деловой",
    serviceCategory: "Деловая одежда",
  },
  {
    id: 3,
    dateTime: "30.09.2020 22:33",
    checksCount: 2,
    cashier: "Иванов И.И.",
    salesAmount: 1000,
    clientGroup: "Физ. лицо",
    paymentMethod: "Наличные",
    city: "Сочи",
    clients: "Козлов К.К.",
    salesCount: 2,
    tradingPoint: "Точка №3",
    cashSales: 1000,
    cashlessSales: 0,
    discountAmount: 50,
    services: "Глажка рубашки",
    averageCheck: 500,
    units: "шт",
    nomenclature: "Рубашка хлопок",
    serviceCategory: "Деловая одежда",
  },
]

export default function ReportsPage() {
  const { showNotification } = useNotification()
  const [selectedOptions, setSelectedOptions] = useState<string[]>([
    "city",
    "checksCount",
    "cashier",
    "salesAmount",
    "legalEntities",
    "individualClients",
    "checksTotal",
  ])
  const [dateRange, setDateRange] = useState("12 декабря 2024 - 12 января 2025")
  const [reportData, setReportData] = useState<ReportData[]>([])
  const [isReportGenerated, setIsReportGenerated] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const reportOptions = [
    { id: "clients", label: "Клиенты", field: "clients" },
    { id: "salesCount", label: "Количество продаж", field: "salesCount" },
    { id: "city", label: "Город", field: "city" },
    { id: "checksCount", label: "Количество чеков", field: "checksCount" },
    { id: "salesDateTime", label: "Дата и время продажи", field: "dateTime" },
    { id: "tradingPoint", label: "Торговая точка", field: "tradingPoint" },
    { id: "cashier", label: "Кассир", field: "cashier" },
    { id: "cashSales", label: "Сумма продаж наличные", field: "cashSales" },
    { id: "cashlessSales", label: "Сумма продаж безналичные", field: "cashlessSales" },
    { id: "salesAmount", label: "Сумма продажи", field: "salesAmount" },
    { id: "legalEntities", label: "Юридические лица", field: "clientGroup" },
    { id: "individualClients", label: "Физические лица", field: "clientGroup" },
    { id: "discountAmount", label: "Сумма скидки", field: "discountAmount" },
    { id: "checksTotal", label: "Чеков итого", field: "checksCount" },
    { id: "services", label: "Услуги", field: "services" },
    { id: "averageCheck", label: "Средний чек", field: "averageCheck" },
    { id: "units", label: "Ед измерения", field: "units" },
    { id: "nomenclature", label: "Номенклатура", field: "nomenclature" },
    { id: "serviceCategory", label: "Категория услуги", field: "serviceCategory" },
  ]

  const handleOptionChange = (optionId: string) => {
    setSelectedOptions((prev) => (prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]))
  }

  const generateReport = () => {
    if (selectedOptions.length === 0) {
      showNotification("Выберите хотя бы один параметр для отчета", "error")
      return
    }

    // Имитация генерации отчета
    setReportData(mockReportData)
    setIsReportGenerated(true)
    setCurrentPage(1)
    showNotification("Отчет успешно сгенерирован", "success")
  }

  const exportToExcel = () => {
    if (!isReportGenerated || reportData.length === 0) {
      showNotification("Сначала сгенерируйте отчет", "error")
      return
    }

    // Получаем выбранные колонки
    const selectedColumns = reportOptions.filter((option) => selectedOptions.includes(option.id))

    // Создаем заголовки
    const headers = selectedColumns.map((col) => col.label)

    // Создаем данные
    const csvData = [
      headers.join(","),
      ...reportData.map((row) =>
        selectedColumns
          .map((col) => {
            const value = row[col.field as keyof ReportData]
            return typeof value === "string" ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    // Создаем и скачиваем файл
    const blob = new Blob(["\uFEFF" + csvData], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `report_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showNotification("Отчет экспортирован в Excel", "success")
  }

  const totalPages = Math.ceil(reportData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = reportData.slice(startIndex, endIndex)

  // Получаем выбранные колонки для отображения
  const selectedColumns = reportOptions.filter((option) => selectedOptions.includes(option.id))

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Кнопка "Назад"
    pages.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded border border-[#e3e3e3] bg-white text-[#2c2c33] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f7f7f7] transition-colors"
      >
        <ChevronLeft size={16} />
      </button>,
    )

    // Номера страниц
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
            currentPage === i
              ? "bg-[#2055a4] text-white"
              : "border border-[#e3e3e3] bg-white text-[#2c2c33] hover:bg-[#f7f7f7]"
          }`}
        >
          {i}
        </button>,
      )
    }

    // Кнопка "Вперед"
    pages.push(
      <button
        key="next"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded border border-[#e3e3e3] bg-white text-[#2c2c33] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f7f7f7] transition-colors"
      >
        <ChevronRight size={16} />
      </button>,
    )

    return pages
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-[#2c2c33] mb-6">Генерация отчетов</h1>

          {/* Опции отчета */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            {reportOptions.map((option) => (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleOptionChange(option.id)}
                  className="w-4 h-4 text-[#2055a4] border-[#d9d9d9] focus:ring-[#2055a4] focus:ring-2 rounded"
                />
                <span className="text-sm text-[#2c2c33]">{option.label}</span>
              </label>
            ))}
          </div>

          {/* Кнопка генерации */}
          <button
            onClick={generateReport}
            className="bg-[#2055a4] text-white px-6 py-2 rounded-md hover:bg-[#1a4a94] transition-colors font-medium mb-6"
          >
            Сгенерировать отчет
          </button>

          {/* Селектор даты */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-[#2c2c33]">
              <Calendar size={20} className="text-[#8e8e8e]" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-[#d9d9d9] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              >
                <option value="12 декабря 2024 - 12 января 2025">12 декабря 2024 - 12 января 2025</option>
                <option value="1 января 2025 - 31 января 2025">1 января 2025 - 31 января 2025</option>
                <option value="1 февраля 2025 - 28 февраля 2025">1 февраля 2025 - 28 февраля 2025</option>
              </select>
            </div>
          </div>

          {/* Таблица отчета */}
          {isReportGenerated && (
            <div className="mb-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#e3e3e3]">
                      {selectedColumns.map((column) => (
                        <th key={column.id} className="text-left py-3 px-4 text-sm font-medium text-[#8e8e8e]">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((row) => (
                      <tr key={row.id} className="border-b border-[#f0f0f0] hover:bg-[#f9f9f9]">
                        {selectedColumns.map((column) => (
                          <td key={column.id} className="py-3 px-4 text-sm text-[#2c2c33]">
                            {column.field === "salesAmount" ||
                            column.field === "cashSales" ||
                            column.field === "cashlessSales" ||
                            column.field === "discountAmount" ||
                            column.field === "averageCheck"
                              ? `${(row[column.field as keyof ReportData] as number).toLocaleString()} ₽`
                              : row[column.field as keyof ReportData]}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Итоговая строка */}
                    <tr className="border-t-2 border-[#2c2c33] bg-[#f9f9f9]">
                      {selectedColumns.map((column, index) => (
                        <td key={column.id} className="py-3 px-4 text-sm font-semibold text-[#2c2c33]">
                          {index === 0
                            ? "Итого:"
                            : column.field === "salesAmount" ||
                                column.field === "cashSales" ||
                                column.field === "cashlessSales" ||
                                column.field === "discountAmount"
                              ? `${reportData.reduce((sum, row) => sum + (row[column.field as keyof ReportData] as number), 0).toLocaleString()} ₽`
                              : column.field === "checksCount" || column.field === "salesCount"
                                ? reportData.reduce(
                                    (sum, row) => sum + (row[column.field as keyof ReportData] as number),
                                    0,
                                  )
                                : ""}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Кнопка экспорта */}
              <div className="mt-6">
                <button
                  onClick={exportToExcel}
                  className="bg-[#2055a4] text-white px-6 py-2 rounded-md hover:bg-[#1a4a94] transition-colors font-medium flex items-center space-x-2"
                >
                  <Download size={20} />
                  <span>Экспорт в Excel</span>
                </button>
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">{renderPagination()}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
