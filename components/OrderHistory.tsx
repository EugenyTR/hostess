"use client"

import { useState } from "react"
import { Search, Calendar, Package, User, DollarSign } from "lucide-react"
import { useAppContext } from "@/context/AppContext"

export default function OrderHistory() {
  const { orders, clients, getClientById } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  // Фильтрация заказов
  const filteredOrders = orders.filter((order) => {
    const client = getClientById(order.clientId)
    const clientName = client
      ? client.type === "individual"
        ? `${client.surname} ${client.name} ${client.patronymic || ""}`
        : client.companyName || ""
      : ""

    const matchesSearch =
      searchTerm === "" ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    const matchesDate =
      dateFilter === "all" ||
      (() => {
        const orderDate = new Date(order.date)
        const now = new Date()

        switch (dateFilter) {
          case "today":
            return orderDate.toDateString() === now.toDateString()
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return orderDate >= weekAgo
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return orderDate >= monthAgo
          default:
            return true
        }
      })()

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "waiting":
        return "Ожидает"
      case "in-progress":
        return "В работе"
      case "completed":
        return "Выполнен"
      case "cancelled":
        return "Отменен"
      default:
        return status
    }
  }

  // Статистика
  const totalOrders = filteredOrders.length
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.discountedAmount, 0)
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const completedOrders = filteredOrders.filter((order) => order.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-[#2055a4]" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Всего заказов</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Общая выручка</p>
              <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()} ₽</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Средний чек</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(averageOrderValue).toLocaleString()} ₽</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <User className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Выполнено</p>
              <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Поиск по клиенту или номеру заказа"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              />
            </div>
          </div>

          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
            >
              <option value="all">Все статусы</option>
              <option value="waiting">Ожидает</option>
              <option value="in-progress">В работе</option>
              <option value="completed">Выполнен</option>
              <option value="cancelled">Отменен</option>
            </select>
          </div>

          <div className="w-48">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
            >
              <option value="all">Все даты</option>
              <option value="today">Сегодня</option>
              <option value="week">За неделю</option>
              <option value="month">За месяц</option>
            </select>
          </div>
        </div>
      </div>

      {/* Таблица заказов */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Заказ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Услуги
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const client = getClientById(order.clientId)
                const clientName = client
                  ? client.type === "individual"
                    ? `${client.surname} ${client.name} ${client.patronymic || ""}`
                    : client.companyName || ""
                  : "Неизвестный клиент"

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{clientName}</div>
                      {client?.phone && <div className="text-sm text-gray-500">{client.phone}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(order.date).toLocaleDateString("ru-RU")}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.services.map((service) => service.serviceName).join(", ")}
                      </div>
                      <div className="text-sm text-gray-500">{order.services.length} услуг(и)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.discountedAmount.toLocaleString()} ₽
                      </div>
                      {order.discount && order.discount > 0 && (
                        <div className="text-sm text-green-600">Скидка: {order.discount.toLocaleString()} ₽</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">Заказы не найдены. Попробуйте изменить параметры поиска.</div>
        )}
      </div>
    </div>
  )
}
