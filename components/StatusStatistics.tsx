"use client"

import { useState, useEffect } from "react"
import { Calendar, ArrowUp, ArrowDown, BarChartIcon, PieChartIcon, LineChartIcon } from "lucide-react"
import { LineChart } from "./charts/LineChart"
import { BarChart } from "./charts/BarChart"
import { PieChart } from "./charts/PieChart"
import type { Order, OrderStatus } from "@/types"

interface StatusStatisticsProps {
  orders: Order[]
  className?: string
}

interface StatusCount {
  status: OrderStatus
  count: number
  percentage: number
}

interface DateRange {
  start: string
  end: string
}

interface PeriodOption {
  label: string
  value: string
  days: number
}

export function StatusStatistics({ orders, className = "" }: StatusStatisticsProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: "",
    end: "",
  })
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders)
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([])
  const [comparisonData, setComparisonData] = useState<{
    completed: { count: number; change: number }
    inProgress: { count: number; change: number }
    waiting: { count: number; change: number }
  }>({
    completed: { count: 0, change: 0 },
    inProgress: { count: 0, change: 0 },
    waiting: { count: 0, change: 0 },
  })
  const [activeChart, setActiveChart] = useState<"line" | "bar" | "pie">("line")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30")
  const [historicalData, setHistoricalData] = useState<any[]>([])

  // Периоды для фильтрации
  const periodOptions: PeriodOption[] = [
    { label: "7 дней", value: "7", days: 7 },
    { label: "30 дней", value: "30", days: 30 },
    { label: "90 дней", value: "90", days: 90 },
    { label: "Год", value: "365", days: 365 },
    { label: "Все время", value: "all", days: 9999 },
  ]

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

  // Функция для получения цвета статуса
  const getOrderStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case "completed":
        return "#10b981" // green-500
      case "in-progress":
        return "#f59e0b" // yellow-500
      case "waiting":
        return "#ef4444" // red-500
      default:
        return "#9ca3af" // gray-400
    }
  }

  // Функция для фильтрации заказов по дате
  const filterOrdersByDate = () => {
    if (!dateRange.start && !dateRange.end) {
      setFilteredOrders(orders)
      return
    }

    const filtered = orders.filter((order) => {
      const orderDate = parseDate(order.date)
      const startDate = dateRange.start ? parseDate(dateRange.start) : null
      const endDate = dateRange.end ? parseDate(dateRange.end) : null

      if (startDate && endDate) {
        return orderDate >= startDate && orderDate <= endDate
      } else if (startDate) {
        return orderDate >= startDate
      } else if (endDate) {
        return orderDate <= endDate
      }
      return true
    })

    setFilteredOrders(filtered)
  }

  // Функция для фильтрации заказов по периоду
  const filterOrdersByPeriod = (periodValue: string) => {
    if (periodValue === "all") {
      setFilteredOrders(orders)
      return
    }

    const days = Number.parseInt(periodValue)
    const today = new Date()
    const startDate = new Date()
    startDate.setDate(today.getDate() - days)

    const filtered = orders.filter((order) => {
      const orderDate = parseDate(order.date)
      return orderDate >= startDate
    })

    setFilteredOrders(filtered)
  }

  // Функция для преобразования строки даты в объект Date
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split(".").map(Number)
    return new Date(year, month - 1, day)
  }

  // Функция для форматирования даты в строку
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  // Функция для расчета статистики
  const calculateStatistics = () => {
    const total = filteredOrders.length
    const completed = filteredOrders.filter((order) => order.status === "completed").length
    const inProgress = filteredOrders.filter((order) => order.status === "in-progress").length
    const waiting = filteredOrders.filter((order) => order.status === "waiting").length

    const stats: StatusCount[] = [
      {
        status: "completed",
        count: completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
      {
        status: "in-progress",
        count: inProgress,
        percentage: total > 0 ? Math.round((inProgress / total) * 100) : 0,
      },
      {
        status: "waiting",
        count: waiting,
        percentage: total > 0 ? Math.round((waiting / total) * 100) : 0,
      },
    ]

    setStatusCounts(stats)

    // Расчет изменений по сравнению с предыду��им периодом
    // В реальном приложении здесь должна быть логика сравнения с предыдущим периодом
    // Для демонстрации используем случайные значения
    setComparisonData({
      completed: { count: completed, change: Math.floor(Math.random() * 20) - 10 },
      inProgress: { count: inProgress, change: Math.floor(Math.random() * 20) - 10 },
      waiting: { count: waiting, change: Math.floor(Math.random() * 20) - 10 },
    })
  }

  // Функция для генерации исторических данных
  const generateHistoricalData = () => {
    // Группируем заказы по дате
    const ordersByDate: Record<string, Order[]> = {}

    filteredOrders.forEach((order) => {
      if (!ordersByDate[order.date]) {
        ordersByDate[order.date] = []
      }
      ordersByDate[order.date].push(order)
    })

    // Сортируем даты
    const sortedDates = Object.keys(ordersByDate).sort((a, b) => {
      const dateA = parseDate(a)
      const dateB = parseDate(b)
      return dateA.getTime() - dateB.getTime()
    })

    // Если дат слишком много, группируем их по неделям или месяцам
    let groupedDates: string[] = sortedDates
    let groupedOrdersByDate: Record<string, Order[]> = ordersByDate

    if (sortedDates.length > 10) {
      // Группируем по неделям или месяцам в зависимости от диапазона
      const firstDate = parseDate(sortedDates[0])
      const lastDate = parseDate(sortedDates[sortedDates.length - 1])
      const daysDiff = Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))

      const groupedData: Record<string, Order[]> = {}

      if (daysDiff > 90) {
        // Группируем по месяцам
        sortedDates.forEach((dateStr) => {
          const date = parseDate(dateStr)
          const monthYear = `${date.getMonth() + 1}.${date.getFullYear()}`

          if (!groupedData[monthYear]) {
            groupedData[monthYear] = []
          }

          groupedData[monthYear].push(...ordersByDate[dateStr])
        })
      } else {
        // Группируем по неделям
        sortedDates.forEach((dateStr) => {
          const date = parseDate(dateStr)
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          const weekKey = formatDate(weekStart)

          if (!groupedData[weekKey]) {
            groupedData[weekKey] = []
          }

          groupedData[weekKey].push(...ordersByDate[dateStr])
        })
      }

      groupedOrdersByDate = groupedData
      groupedDates = Object.keys(groupedData).sort((a, b) => {
        if (daysDiff > 90) {
          // Сортировка для месяцев
          const [monthA, yearA] = a.split(".").map(Number)
          const [monthB, yearB] = b.split(".").map(Number)
          return yearA !== yearB ? yearA - yearB : monthA - monthB
        } else {
          // Сортировка для недель
          const dateA = parseDate(a)
          const dateB = parseDate(b)
          return dateA.getTime() - dateB.getTime()
        }
      })
    }

    // Ограничиваем количество точек на графике
    const maxPoints = 10
    let displayDates = groupedDates
    let displayOrdersByDate = groupedOrdersByDate

    if (groupedDates.length > maxPoints) {
      const step = Math.ceil(groupedDates.length / maxPoints)
      displayDates = groupedDates.filter((_, i) => i % step === 0)

      // Если последняя дата не попала в выборку, добавляем ее
      if (displayDates[displayDates.length - 1] !== groupedDates[groupedDates.length - 1]) {
        displayDates.push(groupedDates[groupedDates.length - 1])
      }

      // Создаем новый объект только с выбранными датами
      const filteredOrdersByDate: Record<string, Order[]> = {}
      displayDates.forEach((date) => {
        filteredOrdersByDate[date] = groupedOrdersByDate[date]
      })

      displayOrdersByDate = filteredOrdersByDate
    }

    // Форматируем метки для графика
    const labels = displayDates.map((dateStr) => {
      if (dateStr.includes(".")) {
        const parts = dateStr.split(".")
        if (parts.length === 3) {
          // Формат DD.MM.YYYY
          return `${parts[0]}.${parts[1]}`
        } else if (parts.length === 2) {
          // Формат MM.YYYY
          const monthNames = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
          return `${monthNames[Number.parseInt(parts[0]) - 1]} ${parts[1]}`
        }
      }
      return dateStr
    })

    // Подготавливаем данные для линейного графика
    const completedSeries = displayDates.map((dateStr) => {
      const orders = displayOrdersByDate[dateStr]
      const count = orders.filter((order) => order.status === "completed").length
      return { label: dateStr, value: count, color: getOrderStatusColor("completed") }
    })

    const inProgressSeries = displayDates.map((dateStr) => {
      const orders = displayOrdersByDate[dateStr]
      const count = orders.filter((order) => order.status === "in-progress").length
      return { label: dateStr, value: count, color: getOrderStatusColor("in-progress") }
    })

    const waitingSeries = displayDates.map((dateStr) => {
      const orders = displayOrdersByDate[dateStr]
      const count = orders.filter((order) => order.status === "waiting").length
      return { label: dateStr, value: count, color: getOrderStatusColor("waiting") }
    })

    // Подготавливаем данные для столбчатой диаграммы
    const barData = [
      { label: "Выполнен", value: comparisonData.completed.count, color: getOrderStatusColor("completed") },
      { label: "В работе", value: comparisonData.inProgress.count, color: getOrderStatusColor("in-progress") },
      { label: "Ожидание", value: comparisonData.waiting.count, color: getOrderStatusColor("waiting") },
    ]

    // Подготавливаем данные для круговой диаграммы
    const pieData = statusCounts.map((item) => ({
      label: getOrderStatusText(item.status),
      value: item.count,
      color: getOrderStatusColor(item.status),
    }))

    setHistoricalData({
      labels,
      lineSeries: [completedSeries, inProgressSeries, waitingSeries],
      barData,
      pieData,
    })
  }

  // Эффект для фильтрации заказов при изменении диапазона дат
  useEffect(() => {
    filterOrdersByDate()
  }, [dateRange, orders])

  // Эффект для фильтрации заказов при изменении периода
  useEffect(() => {
    filterOrdersByPeriod(selectedPeriod)
  }, [selectedPeriod, orders])

  // Эффект для расчета статистики при изменении отфильтрованных заказов
  useEffect(() => {
    calculateStatistics()
    generateHistoricalData()
  }, [filteredOrders])

  return (
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <h2 className="text-lg font-medium mb-4">Статистика по статусам</h2>

        {/* Фильтр по периоду */}
        <div className="flex flex-wrap gap-2 mb-6">
          {periodOptions.map((option) => (
              <button
                  key={option.value}
                  onClick={() => setSelectedPeriod(option.value)}
                  className={`px-3 py-1 text-sm rounded-full ${
                      selectedPeriod === option.value
                          ? "bg-[#2055a4] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {option.label}
              </button>
          ))}
        </div>

        {/* Фильтр по дате */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Начальная дата"
                value={dateRange.start}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Конечная дата"
                value={dateRange.end}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        {/* Карточки со статистикой */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">Выполнено</div>
                <div className="text-2xl font-bold mt-1">{comparisonData.completed.count}</div>
              </div>
              <div
                  className={`flex items-center text-xs ${
                      comparisonData.completed.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
              >
                {comparisonData.completed.change >= 0 ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                )}
                {Math.abs(comparisonData.completed.change)}%
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">В работе</div>
                <div className="text-2xl font-bold mt-1">{comparisonData.inProgress.count}</div>
              </div>
              <div
                  className={`flex items-center text-xs ${
                      comparisonData.inProgress.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
              >
                {comparisonData.inProgress.change >= 0 ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                )}
                {Math.abs(comparisonData.inProgress.change)}%
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">Ожидание</div>
                <div className="text-2xl font-bold mt-1">{comparisonData.waiting.count}</div>
              </div>
              <div
                  className={`flex items-center text-xs ${
                      comparisonData.waiting.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
              >
                {comparisonData.waiting.change >= 0 ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                )}
                {Math.abs(comparisonData.waiting.change)}%
              </div>
            </div>
          </div>
        </div>

        {/* Переключатель типа графика */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-md shadow-sm">
            <button
                onClick={() => setActiveChart("line")}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    activeChart === "line"
                        ? "bg-[#2055a4] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
            >
              <LineChartIcon className="w-4 h-4 inline-block mr-1" />
              Линейный
            </button>
            <button
                onClick={() => setActiveChart("bar")}
                className={`px-4 py-2 text-sm font-medium ${
                    activeChart === "bar"
                        ? "bg-[#2055a4] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-gray-300"
                }`}
            >
              <BarChartIcon className="w-4 h-4 inline-block mr-1" />
              Столбчатый
            </button>
            <button
                onClick={() => setActiveChart("pie")}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    activeChart === "pie"
                        ? "bg-[#2055a4] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
            >
              <PieChartIcon className="w-4 h-4 inline-block mr-1" />
              Круговой
            </button>
          </div>
        </div>

        {/* Графики */}
        {historicalData.labels && (
            <div className="mb-6">
              {activeChart === "line" && (
                  <LineChart
                      data={historicalData.lineSeries}
                      labels={historicalData.labels}
                      title="Динамика статусов заказов"
                      height={300}
                      colors={["#10b981", "#f59e0b", "#ef4444"]}
                  />
              )}

              {activeChart === "bar" && (
                  <BarChart data={historicalData.barData} title="Количество заказов по статусам" height={300} />
              )}

              {activeChart === "pie" && (
                  <PieChart data={historicalData.pieData} title="Распределение статусов" size={300} />
              )}
            </div>
        )}

        {/* Визуализация процентного соотношения */}
        <div className="mb-6">
          <div className="text-sm font-medium mb-2">Распределение статусов</div>
          <div className="h-6 flex rounded-full overflow-hidden">
            {statusCounts.map((item) => (
                <div
                    key={item.status}
                    className={`${
                        item.status === "completed"
                            ? "bg-green-500"
                            : item.status === "in-progress"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                    }`}
                    style={{ width: `${item.percentage}%` }}
                    title={`${getOrderStatusText(item.status)}: ${item.percentage}%`}
                ></div>
            ))}
          </div>
          <div className="flex flex-wrap justify-between mt-2">
            {statusCounts.map((item) => (
                <div key={item.status} className="flex items-center">
                  <div
                      className={`w-3 h-3 rounded-full mr-1 ${
                          item.status === "completed"
                              ? "bg-green-500"
                              : item.status === "in-progress"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      }`}
                  ></div>
                  <span className="text-xs text-gray-500">
                {getOrderStatusText(item.status)}: {item.percentage}%
              </span>
                </div>
            ))}
          </div>
        </div>

        {/* Таблица с детальной статистикой */}
        <div>
          <div className="text-sm font-medium mb-2">Детальная статистика</div>
          <table className="min-w-full">
            <thead>
            <tr className="text-left text-xs text-gray-500 border-b">
              <th className="pb-2 font-medium">Статус</th>
              <th className="pb-2 font-medium">Количество</th>
              <th className="pb-2 font-medium">Процент</th>
            </tr>
            </thead>
            <tbody>
            {statusCounts.map((item) => (
                <tr key={item.status} className="border-b last:border-b-0">
                  <td className="py-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getOrderStatusClass(item.status)}`}>
                    {getOrderStatusText(item.status)}
                  </span>
                  </td>
                  <td className="py-2">{item.count}</td>
                  <td className="py-2">{item.percentage}%</td>
                </tr>
            ))}
            <tr className="font-medium">
              <td className="py-2">Всего</td>
              <td className="py-2">{filteredOrders.length}</td>
              <td className="py-2">100%</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
  )
}
