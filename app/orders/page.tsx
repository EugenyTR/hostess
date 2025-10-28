"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronDown, Calendar, Download, Filter } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { StatusStatistics } from "@/components/StatusStatistics"
import type { OrderStatus } from "@/types"
import { exportToCSV, exportToXLS } from "@/lib/exportUtils"

export default function OrdersList() {
  const router = useRouter()
  const { orders, clients, getClientById } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null)
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [clientFilter, setClientFilter] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showStatistics, setShowStatistics] = useState(false)

  // Фильтрация заказов
  const filteredOrders = orders.filter((order) => {
    const client = getClientById(order.clientId)
    const clientName = client
        ? client.type === "individual"
            ? `${client.surname} ${client.name} ${client.patronymic}`
            : client.companyName || ""
        : ""

    const matchesSearch =
        searchTerm === "" ||
        order.id.toString().includes(searchTerm) ||
        clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.services.some((s) => s.serviceName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === null || order.status === statusFilter
    const matchesDate = dateFilter === null || order.date.includes(dateFilter)
    const matchesClient = clientFilter === null || order.clientId === clientFilter

    return matchesSearch && matchesStatus && matchesDate && matchesClient
  })

  // Функция для получения текста статуса
  const getOrderStatusText = (status: OrderStatus): string => {
    switch (status) {
      case "completed":
        return "Выполнен"
      case "in-progress":
        return "В работе"
      case "waiting":
        return "Ожидание"
      default:
        return "Неизвестно"
    }
  }

  // Функция для получения класса стиля статуса
  const getOrderStatusClass = (status: OrderStatus): string => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "waiting":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleOrderClick = (orderId: number) => {
    router.push(`/orders/${orderId}`)
  }

  // Получаем статистику по статусам
  const statusStats = {
    all: orders.length,
    completed: orders.filter((order) => order.status === "completed").length,
    inProgress: orders.filter((order) => order.status === "in-progress").length,
    waiting: orders.filter((order) => order.status === "waiting").length,
  }

  const handleExportToExcel = (format: "csv" | "xls" = "csv") => {
    try {
      // Подготавливаем данные для экспорта
      const exportData = filteredOrders.map((order) => {
        const client = getClientById(order.clientId)
        const clientName = client
            ? client.type === "individual"
                ? `${client.surname} ${client.name} ${client.patronymic}`
                : client.companyName || ""
            : "Неизвестный клиент"

        return {
          "№ заказа": order.id,
          Дата: order.date,
          Клиент: clientName,
          Услуги: order.services.map((s) => s.serviceName).join(", "),
          "Сумма (₽)": order.totalAmount,
          Статус: getOrderStatusText(order.status),
          "Тип оплаты": order.isCashless ? "Безналичный" : "Наличный",
          Комментарии: order.comments || "",
        }
      })

      const filename = `orders_export_${new Date().toISOString().split("T")[0]}`

      if (format === "csv") {
        exportToCSV(exportData, filename)
      } else {
        exportToXLS(exportData, filename)
      }

      console.log(`Экспортировано ${exportData.length} заказов в ${format.toUpperCase()} файл`)
    } catch (error) {
      console.error("Ошибка при экспорте заказов:", error)
      alert("Произошла ошибка при экспорте данных")
    }
  }

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Список заказов</h1>
          <button
              onClick={() => setShowStatistics(!showStatistics)}
              className={`px-4 py-2 rounded-full text-sm ${
                  showStatistics
                      ? "bg-[#2055a4] text-white"
                      : "border border-[#2055a4] text-[#2055a4] hover:bg-[#2055a4] hover:text-white"
              } transition-colors`}
          >
            {showStatistics ? "Скрыть статистику" : "Показать статистику"}
          </button>
        </div>

        {/* Статистика */}
        {showStatistics && <StatusStatistics orders={orders} className="mb-6" />}

        {/* Статистика по статусам */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                  statusFilter === null ? "bg-[#2055a4] text-white" : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setStatusFilter(null)}
          >
            Все ({statusStats.all})
          </div>
          <div
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                  statusFilter === "completed" ? "bg-green-500 text-white" : "bg-green-100 text-green-800"
              }`}
              onClick={() => setStatusFilter("completed")}
          >
            Выполнены ({statusStats.completed})
          </div>
          <div
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                  statusFilter === "in-progress" ? "bg-yellow-500 text-white" : "bg-yellow-100 text-yellow-800"
              }`}
              onClick={() => setStatusFilter("in-progress")}
          >
            В работе ({statusStats.inProgress})
          </div>
          <div
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                  statusFilter === "waiting" ? "bg-red-500 text-white" : "bg-red-100 text-red-800"
              }`}
              onClick={() => setStatusFilter("waiting")}
          >
            Ожидание ({statusStats.waiting})
          </div>
        </div>

        {/* Фильтры */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Поиск по номеру, клиенту или услуге"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white text-sm"
            />
          </div>

          <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 rounded-full border ${
                  showFilters ? "bg-[#2055a4] text-white border-[#2055a4]" : "border-gray-300 text-gray-700"
              }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Фильтры
          </button>

          <button
              onClick={() => {
                setSearchTerm("")
                setStatusFilter(null)
                setDateFilter(null)
                setClientFilter(null)
              }}
              className="bg-[#2055a4] text-white px-4 py-2 rounded-full hover:bg-[#1a4a8f] transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>

        {/* Дополнительные фильтры */}
        {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-wrap gap-4">
              <div className="relative w-full md:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Дата"
                    value={dateFilter || ""}
                    onChange={(e) => setDateFilter(e.target.value || null)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white text-sm"
                />
              </div>

              <div className="relative w-full md:w-64">
                <select
                    value={clientFilter || ""}
                    onChange={(e) => setClientFilter(e.target.value ? Number(e.target.value) : null)}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-full bg-white text-sm appearance-none"
                >
                  <option value="">Все клиенты</option>
                  {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.type === "individual"
                            ? `${client.surname} ${client.name} ${client.patronymic}`
                            : client.companyName}
                      </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
        )}

        {/* Таблица заказов */}
        <div className="bg-[#f7f7f7] rounded-lg p-6 overflow-x-auto">
          <table className="min-w-full">
            <thead>
            <tr className="text-left text-[#8e8e8e] text-sm border-b border-gray-200">
              <th className="pb-2 font-normal">№</th>
              <th className="pb-2 font-normal">Дата</th>
              <th className="pb-2 font-normal">Клиент</th>
              <th className="pb-2 font-normal hidden md:table-cell">Услуги</th>
              <th className="pb-2 font-normal">Сумма</th>
              <th className="pb-2 font-normal">Статус</th>
              <th className="pb-2 font-normal hidden md:table-cell">Тип оплаты</th>
              <th className="pb-2 font-normal"></th>
            </tr>
            </thead>
            <tbody>
            {filteredOrders.map((order) => {
              const client = getClientById(order.clientId)
              const clientName = client
                  ? client.type === "individual"
                      ? `${client.surname} ${client.name} ${client.patronymic}`
                      : client.companyName || ""
                  : "Неизвестный клиент"

              const statusText = getOrderStatusText(order.status)
              const statusClass = getOrderStatusClass(order.status)

              return (
                  <tr
                      key={order.id}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleOrderClick(order.id)}
                  >
                    <td className="py-3 text-sm">{order.id}</td>
                    <td className="py-3 text-sm">{order.date}</td>
                    <td className="py-3 text-sm">{clientName}</td>
                    <td className="py-3 text-sm hidden md:table-cell">
                      {order.services.map((s) => s.serviceName).join(", ")}
                    </td>
                    <td className="py-3 text-sm">{order.totalAmount} ₽</td>
                    <td className="py-3 text-sm">
                      <span className={`px-2 py-1 ${statusClass} rounded-full text-xs`}>{statusText}</span>
                    </td>
                    <td className="py-3 text-sm hidden md:table-cell">{order.isCashless ? "Безналичный" : "Наличный"}</td>
                    <td className="py-3 text-sm">
                      <button className="text-[#2055a4] hover:text-[#1a4a8f] text-sm">Подробнее</button>
                    </td>
                  </tr>
              )
            })}
            </tbody>
          </table>

          {filteredOrders.length === 0 && <div className="text-center py-8 text-gray-500">Заказы не найдены</div>}
        </div>

        {/* Экспорт */}
        <div className="mt-6">
          <div className="relative group inline-block">
            <button className="bg-[#2055a4] text-white px-6 py-2 rounded-full hover:bg-[#1a4a8f] transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Экспорт в Excel
            </button>
            <div className="absolute left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                  onClick={() => handleExportToExcel("csv")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
              >
                CSV формат
              </button>
              <button
                  onClick={() => handleExportToExcel("xls")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
              >
                XLS формат
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}
