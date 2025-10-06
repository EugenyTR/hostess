"use client"

import { useState } from "react"
import { Check, Clock, RefreshCw, Calendar, User, Filter, Download, ChevronDown } from "lucide-react"
import type { StatusHistoryItem, OrderStatus } from "@/types"

interface StatusHistoryProps {
  history: StatusHistoryItem[]
  onExport?: () => void
  className?: string
}

type SortField = "date" | "status" | "user"
type SortDirection = "asc" | "desc"

interface StatusTransition {
  from: OrderStatus | null
  to: OrderStatus
}

export function StatusHistory({ history, onExport, className = "" }: StatusHistoryProps) {
  const [filter, setFilter] = useState<OrderStatus | "all">("all")
  const [dateFilter, setDateFilter] = useState("")
  const [userFilter, setUserFilter] = useState("")
  const [periodFilter, setPeriodFilter] = useState<string>("all")
  const [transitionFilter, setTransitionFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Периоды для фильтрации
  const periodOptions = [
    { label: "Все время", value: "all" },
    { label: "Сегодня", value: "today" },
    { label: "Вчера", value: "yesterday" },
    { label: "Неделя", value: "week" },
    { label: "Месяц", value: "month" },
    { label: "Квартал", value: "quarter" },
    { label: "Год", value: "year" },
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

  // Функция для получения иконки статуса
  const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4" />
      case "in-progress":
        return <RefreshCw className="w-4 h-4" />
      case "waiting":
        return <Clock className="w-4 h-4" />
      default:
        return null
    }
  }

  // Функция для преобразования строки даты в объект Date
  const parseDate = (dateStr: string): Date => {
    const [datePart, timePart] = dateStr.split(" ")
    const [day, month, year] = datePart.split(".").map(Number)
    const [hours, minutes] = timePart ? timePart.split(":").map(Number) : [0, 0]
    return new Date(year, month - 1, day, hours, minutes)
  }

  // Функция для форматирования даты в строку
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${day}.${month}.${year} ${hours}:${minutes}`
  }

  // Фильтруем историю, оставляя только валидные элементы
  const validHistory = history.filter(
    (item) =>
      item &&
      typeof item === "object" &&
      item.timestamp &&
      typeof item.timestamp === "string" &&
      item.status &&
      item.user,
  )

  // Получаем уникальные переходы статусов
  const getStatusTransitions = (): StatusTransition[] => {
    const transitions: StatusTransition[] = []
    const transitionMap = new Map<string, boolean>()

    // Добавляем переходы из null в начальный статус
    const initialStatuses = ["waiting", "in-progress", "completed"]
    initialStatuses.forEach((status) => {
      const key = `null->${status}`
      if (!transitionMap.has(key)) {
        transitions.push({ from: null, to: status as OrderStatus })
        transitionMap.set(key, true)
      }
    })

    // Добавляем переходы между статусами из истории
    for (let i = 0; i < validHistory.length - 1; i++) {
      const from = validHistory[i].status
      const to = validHistory[i + 1].status
      const key = `${from}->${to}`
      if (!transitionMap.has(key) && from !== to) {
        transitions.push({ from, to })
        transitionMap.set(key, true)
      }
    }

    return transitions
  }

  // Функция для фильтрации истории по периоду
  const filterByPeriod = (item: StatusHistoryItem): boolean => {
    if (periodFilter === "all") return true

    const itemDate = parseDate(item.timestamp)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

    const quarterStart = new Date(today)
    quarterStart.setMonth(Math.floor(quarterStart.getMonth() / 3) * 3, 1)

    const yearStart = new Date(today.getFullYear(), 0, 1)

    switch (periodFilter) {
      case "today":
        return itemDate >= today
      case "yesterday":
        return itemDate >= yesterday && itemDate < today
      case "week":
        return itemDate >= weekStart
      case "month":
        return itemDate >= monthStart
      case "quarter":
        return itemDate >= quarterStart
      case "year":
        return itemDate >= yearStart
      default:
        return true
    }
  }

  // Функция для фильтрации истории по переходу статусов
  const filterByTransition = (items: StatusHistoryItem[]): StatusHistoryItem[] => {
    if (transitionFilter === "all") return items

    const [fromStatus, toStatus] = transitionFilter.split("->")

    // Создаем новый массив с элементами, которые соответствуют переходу
    const result: StatusHistoryItem[] = []

    for (let i = 0; i < items.length; i++) {
      const current = items[i]

      // Если это переход из null (начальный статус)
      if (fromStatus === "null" && toStatus === current.status) {
        result.push(current)
        continue
      }

      // Если это не последний элемент, проверяем переход между текущим и следующим
      if (i < items.length - 1) {
        const next = items[i + 1]
        if (current.status === fromStatus && next.status === toStatus) {
          result.push(current)
          result.push(next)
        }
      }
    }

    return result
  }

  // Фильтрация истории
  const getFilteredHistory = () => {
    let filtered = validHistory.filter((item) => {
      const matchesStatus = filter === "all" || item.status === filter
      const matchesDate = !dateFilter || item.timestamp.includes(dateFilter)
      const matchesUser = !userFilter || item.user.toLowerCase().includes(userFilter.toLowerCase())
      const matchesPeriod = filterByPeriod(item)

      return matchesStatus && matchesDate && matchesUser && matchesPeriod
    })

    // Применяем фильтр по переходу статусов
    if (transitionFilter !== "all") {
      filtered = filterByTransition(filtered)
    }

    // Сортировка
    filtered.sort((a, b) => {
      const dateA = parseDate(a.timestamp)
      const dateB = parseDate(b.timestamp)

      switch (sortField) {
        case "date":
          return sortDirection === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
        case "status":
          return sortDirection === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
        case "user":
          return sortDirection === "asc" ? a.user.localeCompare(b.user) : b.user.localeCompare(a.user)
        default:
          return 0
      }
    })

    return filtered
  }

  const filteredHistory = getFilteredHistory()

  // Группировка истории по датам
  const groupHistoryByDate = (items: StatusHistoryItem[]) => {
    const grouped: Record<string, StatusHistoryItem[]> = {}

    items.forEach((item) => {
      // Проверяем что item существует и имеет валидный timestamp
      if (!item || !item.timestamp || typeof item.timestamp !== "string") {
        return // Пропускаем элементы без валидного timestamp
      }

      const date = item.timestamp.split(" ")[0]
      if (!date) {
        return // Пропускаем если не удалось извлечь дату
      }

      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(item)
    })

    return grouped
  }

  const groupedHistory = groupHistoryByDate(filteredHistory)

  // Обработчик изменения сортировки
  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Получаем список переходов для фильтра
  const statusTransitions = getStatusTransitions()

  // Функция экспорта истории в Excel
  const handleExportHistory = () => {
    try {
      // Подготавливаем данные для экспорта
      const exportData = filteredHistory.map((item, index) => ({
        "№": index + 1,
        Дата: item.timestamp.split(" ")[0],
        Время: item.timestamp.split(" ")[1],
        Статус: getOrderStatusText(item.status),
        Пользователь: item.user,
        "Полная дата": item.timestamp,
      }))

      // Создаем CSV контент
      const headers = Object.keys(exportData[0] || {})
      const csvContent = [
        headers.join(","),
        ...exportData.map((row) =>
          headers
            .map((header) => {
              const value = row[header] || ""
              // Экранируем значения, содержащие запятые или кавычки
              return typeof value === "string" && (value.includes(",") || value.includes('"'))
                ? `"${value.replace(/"/g, '""')}"`
                : value
            })
            .join(","),
        ),
      ].join("\n")

      // Создаем и скачиваем файл
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)

      link.setAttribute("href", url)
      link.setAttribute("download", `status_history_export_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log(`Экспортировано ${exportData.length} записей истории в CSV файл`)
    } catch (error) {
      console.error("Ошибка при экспорте истории:", error)
      alert("Произошла ошибка при экспорте данных")
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">История изменений статуса</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center text-sm ${showAdvancedFilters ? "text-[#2055a4]" : "text-gray-600"}`}
          >
            <Filter className="w-4 h-4 mr-1" />
            {showAdvancedFilters ? "Скрыть фильтры" : "Расширенные фильтры"}
          </button>
          <button
            onClick={onExport || handleExportHistory}
            className="flex items-center text-[#2055a4] hover:text-[#1a4a8f] text-sm"
          >
            <Download className="w-4 h-4 mr-1" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Базовые фильтры */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Фильтры:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-2 py-1 text-xs rounded-full ${
              filter === "all" ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-2 py-1 text-xs rounded-full ${
              filter === "completed" ? "bg-green-200 text-green-800" : "bg-green-100 text-green-600"
            }`}
          >
            Выполнен
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={`px-2 py-1 text-xs rounded-full ${
              filter === "in-progress" ? "bg-yellow-200 text-yellow-800" : "bg-yellow-100 text-yellow-600"
            }`}
          >
            В работе
          </button>
          <button
            onClick={() => setFilter("waiting")}
            className={`px-2 py-1 text-xs rounded-full ${
              filter === "waiting" ? "bg-red-200 text-red-800" : "bg-red-100 text-red-600"
            }`}
          >
            Ожидание
          </button>
        </div>
      </div>

      {/* Фильтр по периоду */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Период:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriodFilter(option.value)}
              className={`px-2 py-1 text-xs rounded-full ${
                periodFilter === option.value ? "bg-[#2055a4] text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Расширенные фильтры */}
      {showAdvancedFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="��ильтр по дате"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Фильтр по пользователю"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Переход статуса:</label>
            <div className="relative">
              <select
                value={transitionFilter}
                onChange={(e) => setTransitionFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm appearance-none"
              >
                <option value="all">Все переходы</option>
                {statusTransitions.map((transition, index) => (
                  <option key={index} value={`${transition.from || "null"}->${transition.to}`}>
                    {transition.from ? getOrderStatusText(transition.from) : "Создание"} →{" "}
                    {getOrderStatusText(transition.to)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Сортировка:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleSortChange("date")}
                className={`flex items-center px-3 py-1 text-xs rounded-full ${
                  sortField === "date" ? "bg-[#2055a4] text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                Дата {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => handleSortChange("status")}
                className={`flex items-center px-3 py-1 text-xs rounded-full ${
                  sortField === "status" ? "bg-[#2055a4] text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                Статус {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => handleSortChange("user")}
                className={`flex items-center px-3 py-1 text-xs rounded-full ${
                  sortField === "user" ? "bg-[#2055a4] text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                Пользователь {sortField === "user" && (sortDirection === "asc" ? "↑" : "↓")}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setFilter("all")
                setDateFilter("")
                setUserFilter("")
                setPeriodFilter("all")
                setTransitionFilter("all")
                setSortField("date")
                setSortDirection("desc")
              }}
              className="text-sm text-[#2055a4] hover:text-[#1a4a8f]"
            >
              Сбросить все фильтры
            </button>
          </div>
        </div>
      )}

      {/* История изменений */}
      {Object.keys(groupedHistory).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedHistory).map(([date, items]) => (
            <div key={date} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="text-sm font-medium text-gray-500 mb-2">{date}</div>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getOrderStatusClass(
                        item.status,
                      )}`}
                    >
                      {getOrderStatusIcon(item.status)}
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="font-medium">{getOrderStatusText(item.status)}</span>
                        <span className="text-xs text-gray-500 ml-2">{item.timestamp.split(" ")[1]}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Изменил(а): <span className="font-medium">{item.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">История изменений не найдена</div>
      )}
    </div>
  )
}
