"use client"

import { useState } from "react"
import {
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Filter,
  Search,
  ChevronUp,
  ChevronDown,
  LineChart,
  Users,
  ArrowRight,
  Calendar,
  BarChart4,
  Zap,
  AlertTriangle,
  CheckCircle,
  ChevronDownIcon,
} from "lucide-react"
import { AddSurveyModal } from "@/components/modals/AddSurveyModal"
import { DeleteSurveyModal } from "@/components/modals/DeleteSurveyModal"
import { useNotification } from "@/context/NotificationContext"

interface Client {
  id: number
  name: string
  type: "individual" | "legal"
  phone: string
  email?: string
  registrationDate: string
  surveyId: number
  totalSpent: number
  ordersCount: number
  lastOrderDate?: string
}

interface SurveyHistory {
  date: string
  count: number
}

interface Survey {
  id: number
  name: string
  isActive: boolean
  usageCount: number
  lastUsed?: string
  createdAt: string
  updatedAt: string
  history: SurveyHistory[]
  clients: Client[]
  trend: "up" | "down" | "stable"
  prediction: {
    nextMonth: number
    nextQuarter: number
    confidence: number
    recommendation: string
  }
}

type PopularityFilter = "all" | "high" | "medium" | "low" | "unused"
type SortField = "id" | "name" | "usageCount" | "lastUsed" | "createdAt"
type SortDirection = "asc" | "desc"
type ViewMode = "table" | "analytics" | "clients"

export default function SurveyPage() {
  const { showNotification } = useNotification()
  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: 1,
      name: "Социальные сети",
      isActive: true,
      usageCount: 45,
      lastUsed: "2024-01-15T10:30:00Z",
      createdAt: "2024-01-01T09:00:00Z",
      updatedAt: new Date().toISOString(),
      history: [
        { date: "2023-08-01", count: 12 },
        { date: "2023-09-01", count: 15 },
        { date: "2023-10-01", count: 18 },
        { date: "2023-11-01", count: 25 },
        { date: "2023-12-01", count: 35 },
        { date: "2024-01-01", count: 45 },
      ],
      clients: [
        {
          id: 101,
          name: "Иванов Иван",
          type: "individual",
          phone: "+7 (999) 123-45-67",
          email: "ivanov@example.com",
          registrationDate: "2023-11-15T14:30:00Z",
          surveyId: 1,
          totalSpent: 15000,
          ordersCount: 3,
          lastOrderDate: "2024-01-10T11:20:00Z",
        },
        {
          id: 102,
          name: "Петрова Анна",
          type: "individual",
          phone: "+7 (999) 234-56-78",
          email: "petrova@example.com",
          registrationDate: "2023-12-05T10:15:00Z",
          surveyId: 1,
          totalSpent: 8500,
          ordersCount: 2,
          lastOrderDate: "2024-01-15T09:45:00Z",
        },
        {
          id: 103,
          name: 'ООО "ТехноПром"',
          type: "legal",
          phone: "+7 (495) 123-45-67",
          email: "info@technoprom.ru",
          registrationDate: "2023-10-20T11:30:00Z",
          surveyId: 1,
          totalSpent: 45000,
          ordersCount: 5,
          lastOrderDate: "2024-01-12T14:20:00Z",
        },
      ],
      trend: "up",
      prediction: {
        nextMonth: 55,
        nextQuarter: 80,
        confidence: 0.85,
        recommendation: "Увеличить активность в Instagram и Facebook для привлечения новых клиентов",
      },
    },
    {
      id: 2,
      name: "2ГИС",
      isActive: true,
      usageCount: 23,
      lastUsed: "2024-01-14T15:20:00Z",
      createdAt: "2024-01-02T10:15:00Z",
      updatedAt: new Date().toISOString(),
      history: [
        { date: "2023-08-01", count: 10 },
        { date: "2023-09-01", count: 14 },
        { date: "2023-10-01", count: 18 },
        { date: "2023-11-01", count: 22 },
        { date: "2023-12-01", count: 20 },
        { date: "2024-01-01", count: 23 },
      ],
      clients: [
        {
          id: 104,
          name: "Сидоров Алексей",
          type: "individual",
          phone: "+7 (999) 345-67-89",
          email: "sidorov@example.com",
          registrationDate: "2023-11-25T16:40:00Z",
          surveyId: 2,
          totalSpent: 12000,
          ordersCount: 2,
          lastOrderDate: "2024-01-14T13:10:00Z",
        },
        {
          id: 105,
          name: 'ИП "Козлов"',
          type: "legal",
          phone: "+7 (999) 456-78-90",
          email: "kozlov@example.com",
          registrationDate: "2023-12-10T09:20:00Z",
          surveyId: 2,
          totalSpent: 18000,
          ordersCount: 3,
          lastOrderDate: "2024-01-08T10:30:00Z",
        },
      ],
      trend: "stable",
      prediction: {
        nextMonth: 25,
        nextQuarter: 30,
        confidence: 0.7,
        recommendation: "Обновить информацию в 2ГИС, добавить акции и специальные предложения",
      },
    },
    {
      id: 3,
      name: "Рекомендация друга",
      isActive: true,
      usageCount: 67,
      lastUsed: "2024-01-16T09:45:00Z",
      createdAt: "2024-01-03T11:30:00Z",
      updatedAt: new Date().toISOString(),
      history: [
        { date: "2023-08-01", count: 20 },
        { date: "2023-09-01", count: 25 },
        { date: "2023-10-01", count: 35 },
        { date: "2023-11-01", count: 45 },
        { date: "2023-12-01", count: 55 },
        { date: "2024-01-01", count: 67 },
      ],
      clients: [
        {
          id: 106,
          name: "Кузнецова Мария",
          type: "individual",
          phone: "+7 (999) 567-89-01",
          email: "kuznetsova@example.com",
          registrationDate: "2023-10-05T13:15:00Z",
          surveyId: 3,
          totalSpent: 25000,
          ordersCount: 4,
          lastOrderDate: "2024-01-16T09:45:00Z",
        },
        {
          id: 107,
          name: "Новиков Дмитрий",
          type: "individual",
          phone: "+7 (999) 678-90-12",
          email: "novikov@example.com",
          registrationDate: "2023-11-12T11:30:00Z",
          surveyId: 3,
          totalSpent: 18500,
          ordersCount: 3,
          lastOrderDate: "2024-01-15T14:20:00Z",
        },
        {
          id: 108,
          name: 'ООО "МегаСтрой"',
          type: "legal",
          phone: "+7 (495) 234-56-78",
          email: "info@megastroy.ru",
          registrationDate: "2023-09-15T10:00:00Z",
          surveyId: 3,
          totalSpent: 120000,
          ordersCount: 8,
          lastOrderDate: "2024-01-14T16:30:00Z",
        },
        {
          id: 109,
          name: "Морозова Екатерина",
          type: "individual",
          phone: "+7 (999) 789-01-23",
          email: "morozova@example.com",
          registrationDate: "2023-12-20T15:45:00Z",
          surveyId: 3,
          totalSpent: 9500,
          ordersCount: 2,
          lastOrderDate: "2024-01-10T11:15:00Z",
        },
      ],
      trend: "up",
      prediction: {
        nextMonth: 80,
        nextQuarter: 120,
        confidence: 0.9,
        recommendation: "Внедрить программу лояльности с бонусами за приглашение друзей",
      },
    },
    {
      id: 4,
      name: "Реклама в интернете",
      isActive: true,
      usageCount: 8,
      lastUsed: "2024-01-10T14:20:00Z",
      createdAt: "2024-01-04T14:45:00Z",
      updatedAt: new Date().toISOString(),
      history: [
        { date: "2023-08-01", count: 15 },
        { date: "2023-09-01", count: 12 },
        { date: "2023-10-01", count: 10 },
        { date: "2023-11-01", count: 8 },
        { date: "2023-12-01", count: 7 },
        { date: "2024-01-01", count: 8 },
      ],
      clients: [
        {
          id: 110,
          name: "Соколов Артем",
          type: "individual",
          phone: "+7 (999) 890-12-34",
          email: "sokolov@example.com",
          registrationDate: "2023-12-15T12:30:00Z",
          surveyId: 4,
          totalSpent: 5000,
          ordersCount: 1,
          lastOrderDate: "2024-01-10T14:20:00Z",
        },
      ],
      trend: "down",
      prediction: {
        nextMonth: 6,
        nextQuarter: 4,
        confidence: 0.75,
        recommendation: "Пересмотреть рекламную стратегию, сосредоточиться на таргетированной рекламе",
      },
    },
    {
      id: 5,
      name: "Наружная реклама",
      isActive: true,
      usageCount: 0,
      createdAt: "2024-01-05T16:00:00Z",
      updatedAt: new Date().toISOString(),
      history: [
        { date: "2023-08-01", count: 0 },
        { date: "2023-09-01", count: 0 },
        { date: "2023-10-01", count: 0 },
        { date: "2023-11-01", count: 0 },
        { date: "2023-12-01", count: 0 },
        { date: "2024-01-01", count: 0 },
      ],
      clients: [],
      trend: "stable",
      prediction: {
        nextMonth: 0,
        nextQuarter: 0,
        confidence: 0.95,
        recommendation: "Рассмотреть возможность размещения рекламы в местах с высокой проходимостью",
      },
    },
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null)
  const [deletingSurvey, setDeletingSurvey] = useState<Survey | null>(null)
  const [popularityFilter, setPopularityFilter] = useState<PopularityFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("usageCount")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)
  const [expandedClientId, setExpandedClientId] = useState<number | null>(null)

  const handleAddSurvey = (name: string) => {
    const newSurvey: Survey = {
      id: Math.max(...surveys.map((s) => s.id)) + 1,
      name,
      isActive: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        { date: "2023-08-01", count: 0 },
        { date: "2023-09-01", count: 0 },
        { date: "2023-10-01", count: 0 },
        { date: "2023-11-01", count: 0 },
        { date: "2023-12-01", count: 0 },
        { date: "2024-01-01", count: 0 },
      ],
      clients: [],
      trend: "stable",
      prediction: {
        nextMonth: 0,
        nextQuarter: 0,
        confidence: 0.9,
        recommendation: "Новый источник. Рекомендуется активное продвижение для привлечения клиентов.",
      },
    }
    setSurveys([...surveys, newSurvey])
    showNotification("Опрос успешно добавлен", "success")
  }

  const handleEditSurvey = (id: number, name: string) => {
    setSurveys(
      surveys.map((survey) => (survey.id === id ? { ...survey, name, updatedAt: new Date().toISOString() } : survey)),
    )
    showNotification("Опрос успешно обновлен", "success")
  }

  const handleDeleteSurvey = (id: number) => {
    setSurveys(surveys.filter((survey) => survey.id !== id))
    showNotification("Опрос успешно удален", "success")
  }

  const openEditModal = (survey: Survey) => {
    setEditingSurvey(survey)
    setIsAddModalOpen(true)
  }

  const openDeleteModal = (survey: Survey) => {
    setDeletingSurvey(survey)
    setIsDeleteModalOpen(true)
  }

  const closeModals = () => {
    setIsAddModalOpen(false)
    setIsDeleteModalOpen(false)
    setEditingSurvey(null)
    setDeletingSurvey(null)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" /> // Пустое место для выравнивания
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="text-[#2055a4]" size={16} />
    ) : (
      <ChevronDown className="text-[#2055a4]" size={16} />
    )
  }

  const getPopularityLevel = (usageCount: number): PopularityFilter => {
    if (usageCount === 0) return "unused"
    if (usageCount >= 50) return "high"
    if (usageCount >= 20) return "medium"
    return "low"
  }

  const sortedAndFilteredSurveys = surveys
    .filter((survey) => {
      // Фильтр по популярности
      if (popularityFilter !== "all" && getPopularityLevel(survey.usageCount) !== popularityFilter) {
        return false
      }

      // Фильтр по поиску
      if (searchQuery && !survey.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "id":
          aValue = a.id
          bValue = b.id
          break
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "usageCount":
          aValue = a.usageCount
          bValue = b.usageCount
          break
        case "lastUsed":
          aValue = a.lastUsed ? new Date(a.lastUsed).getTime() : 0
          bValue = b.lastUsed ? new Date(b.lastUsed).getTime() : 0
          break
        case "createdAt":
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        default:
          return 0
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

  const formatLastUsed = (dateString?: string) => {
    if (!dateString) return "Не использовался"

    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Менее часа назад"
    if (diffInHours < 24) return `${diffInHours} ч назад`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} дн назад`

    return date.toLocaleDateString("ru-RU")
  }

  const formatCreatedAt = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${date.getFullYear()}`
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB" }).format(amount)
  }

  const getTrendIcon = (usageCount: number) => {
    if (usageCount >= 50) return <TrendingUp className="text-green-500" size={16} />
    if (usageCount >= 20) return <TrendingUp className="text-yellow-500" size={16} />
    if (usageCount > 0) return <TrendingUp className="text-orange-500" size={16} />
    return <TrendingUp className="text-gray-400" size={16} />
  }

  const getTrendIconBig = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp className="text-green-500" size={24} />
    if (trend === "down") return <TrendingUp className="text-red-500 rotate-180" size={24} />
    return <TrendingUp className="text-gray-400" size={24} />
  }

  const getPopularityBadge = (usageCount: number) => {
    const level = getPopularityLevel(usageCount)
    const badges = {
      high: { text: "Высокая", color: "bg-green-100 text-green-800" },
      medium: { text: "Средняя", color: "bg-yellow-100 text-yellow-800" },
      low: { text: "Низкая", color: "bg-orange-100 text-orange-800" },
      unused: { text: "Не используется", color: "bg-gray-100 text-gray-800" },
    }

    const badge = badges[level]
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.text}</span>
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return <span className="text-green-600 font-medium">Высокая</span>
    if (confidence >= 0.6) return <span className="text-yellow-600 font-medium">Средняя</span>
    return <span className="text-orange-600 font-medium">Низкая</span>
  }

  const totalUsage = surveys.reduce((sum, survey) => sum + survey.usageCount, 0)
  const filterCounts = {
    all: surveys.length,
    high: surveys.filter((s) => s.usageCount >= 50).length,
    medium: surveys.filter((s) => s.usageCount >= 20 && s.usageCount < 50).length,
    low: surveys.filter((s) => s.usageCount > 0 && s.usageCount < 20).length,
    unused: surveys.filter((s) => s.usageCount === 0).length,
  }

  const getSortFieldName = (field: SortField) => {
    const names = {
      id: "ID",
      name: "названию",
      usageCount: "количеству использований",
      lastUsed: "последнему использованию",
      createdAt: "дате создания",
    }
    return names[field]
  }

  const getClientTypeDistribution = (survey: Survey) => {
    const individual = survey.clients.filter((c) => c.type === "individual").length
    const legal = survey.clients.filter((c) => c.type === "legal").length
    const total = survey.clients.length

    return {
      individual,
      legal,
      individualPercent: total > 0 ? Math.round((individual / total) * 100) : 0,
      legalPercent: total > 0 ? Math.round((legal / total) * 100) : 0,
    }
  }

  const getAverageSpent = (survey: Survey) => {
    if (survey.clients.length === 0) return 0
    const total = survey.clients.reduce((sum, client) => sum + client.totalSpent, 0)
    return Math.round(total / survey.clients.length)
  }

  const getTotalRevenue = (survey: Survey) => {
    return survey.clients.reduce((sum, client) => sum + client.totalSpent, 0)
  }

  const toggleClientDetails = (clientId: number) => {
    if (expandedClientId === clientId) {
      setExpandedClientId(null)
    } else {
      setExpandedClientId(clientId)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2c2c33]">Опрос клиентов</h1>
          <p className="text-gray-600 mt-1">
            Всего использований: {totalUsage} | Показано: {sortedAndFilteredSurveys.length} из {surveys.length}
          </p>
          {viewMode === "table" && (
            <p className="text-sm text-gray-500 mt-1">
              Сортировка по {getSortFieldName(sortField)} ({sortDirection === "asc" ? "по возрастанию" : "по убыванию"})
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 flex items-center gap-2 ${
                viewMode === "table" ? "bg-[#2055a4] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BarChart4 size={18} />
              <span className="hidden md:inline">Таблица</span>
            </button>
            <button
              onClick={() => setViewMode("analytics")}
              className={`px-4 py-2 flex items-center gap-2 ${
                viewMode === "analytics" ? "bg-[#2055a4] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <LineChart size={18} />
              <span className="hidden md:inline">Аналитика</span>
            </button>
            <button
              onClick={() => setViewMode("clients")}
              className={`px-4 py-2 flex items-center gap-2 ${
                viewMode === "clients" ? "bg-[#2055a4] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Users size={18} />
              <span className="hidden md:inline">Клиенты</span>
            </button>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#2055a4] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1a4a94] transition-colors"
          >
            <Plus size={20} />
            <span className="hidden md:inline">Создать опрос</span>
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Поиск */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Поиск по названию опроса..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              />
            </div>
          </div>

          {/* Фильтр по популярности */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500" size={20} />
            <span className="text-sm font-medium text-gray-700">Популярность:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPopularityFilter("all")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  popularityFilter === "all" ? "bg-[#2055a4] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Все ({filterCounts.all})
              </button>
              <button
                onClick={() => setPopularityFilter("high")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  popularityFilter === "high"
                    ? "bg-green-500 text-white"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                Высокая ({filterCounts.high})
              </button>
              <button
                onClick={() => setPopularityFilter("medium")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  popularityFilter === "medium"
                    ? "bg-yellow-500 text-white"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                }`}
              >
                Средняя ({filterCounts.medium})
              </button>
              <button
                onClick={() => setPopularityFilter("low")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  popularityFilter === "low"
                    ? "bg-orange-500 text-white"
                    : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                }`}
              >
                Низкая ({filterCounts.low})
              </button>
              <button
                onClick={() => setPopularityFilter("unused")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  popularityFilter === "unused"
                    ? "bg-gray-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Не используется ({filterCounts.unused})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Высокая популярность</p>
              <p className="text-lg font-semibold text-green-600">{filterCounts.high}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-green-500" size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Средняя популярность</p>
              <p className="text-lg font-semibold text-yellow-600">{filterCounts.medium}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-yellow-500" size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Низкая популярность</p>
              <p className="text-lg font-semibold text-orange-600">{filterCounts.low}</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-orange-500" size={16} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Не используется</p>
              <p className="text-lg font-semibold text-gray-600">{filterCounts.unused}</p>
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-gray-500" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Таблица */}
      {viewMode === "table" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-[#2c2c33]">
                  <button
                    onClick={() => handleSort("id")}
                    className="flex items-center gap-2 hover:text-[#2055a4] transition-colors"
                  >
                    ID
                    {getSortIcon("id")}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-[#2c2c33]">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 hover:text-[#2055a4] transition-colors"
                  >
                    Наименование
                    {getSortIcon("name")}
                  </button>
                </th>
                <th className="text-center py-3 px-4 font-medium text-[#2c2c33]">
                  <button
                    onClick={() => handleSort("usageCount")}
                    className="flex items-center gap-2 hover:text-[#2055a4] transition-colors mx-auto"
                  >
                    И��пользований
                    {getSortIcon("usageCount")}
                  </button>
                </th>
                <th className="text-center py-3 px-4 font-medium text-[#2c2c33]">Уровень популярности</th>
                <th className="text-center py-3 px-4 font-medium text-[#2c2c33]">
                  <button
                    onClick={() => handleSort("lastUsed")}
                    className="flex items-center gap-2 hover:text-[#2055a4] transition-colors mx-auto"
                  >
                    Последнее использование
                    {getSortIcon("lastUsed")}
                  </button>
                </th>
                <th className="text-center py-3 px-4 font-medium text-[#2c2c33]">
                  <button
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center gap-2 hover:text-[#2055a4] transition-colors mx-auto"
                  >
                    Дата создания
                    {getSortIcon("createdAt")}
                  </button>
                </th>
                <th className="text-right py-3 px-4 font-medium text-[#2c2c33]">Действия</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredSurveys.map((survey) => (
                <tr key={survey.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-[#2c2c33]">{survey.id}</td>
                  <td className="py-3 px-4 text-[#2c2c33] font-medium">{survey.name}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[#2c2c33] font-semibold">{survey.usageCount}</span>
                      {getTrendIcon(survey.usageCount)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">{getPopularityBadge(survey.usageCount)}</td>
                  <td className="py-3 px-4 text-center text-gray-600 text-sm">{formatLastUsed(survey.lastUsed)}</td>
                  <td className="py-3 px-4 text-center text-gray-600 text-sm">{formatCreatedAt(survey.createdAt)}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedSurvey(survey)
                          setViewMode("analytics")
                        }}
                        className="p-2 text-gray-500 hover:text-[#2055a4] transition-colors"
                        title="Аналитика"
                      >
                        <LineChart size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSurvey(survey)
                          setViewMode("clients")
                        }}
                        className="p-2 text-gray-500 hover:text-[#2055a4] transition-colors"
                        title="Клиенты"
                      >
                        <Users size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(survey)}
                        className="p-2 text-gray-500 hover:text-[#2055a4] transition-colors"
                        title="Редактировать"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(survey)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedAndFilteredSurveys.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery || popularityFilter !== "all"
                ? "Опросы не найдены по заданным критериям"
                : "Опросы не найдены"}
            </div>
          )}
        </div>
      )}

      {/* Аналитика */}
      {viewMode === "analytics" && (
        <div className="space-y-6">
          {/* Выбор опроса */}
          {!selectedSurvey && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Выберите опрос для анализа</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedAndFilteredSurveys.map((survey) => (
                  <div
                    key={survey.id}
                    onClick={() => setSelectedSurvey(survey)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#2055a4] hover:shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{survey.name}</h3>
                      {getTrendIconBig(survey.trend)}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-2xl font-bold">{survey.usageCount}</span>
                      <span className="text-gray-500">использований</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Прогноз на следующий месяц: <span className="font-semibold">{survey.prediction.nextMonth}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Детальная аналитика выбранного опроса */}
          {selectedSurvey && (
            <>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className="text-[#2055a4] hover:underline flex items-center gap-1"
                >
                  <ArrowRight className="rotate-180" size={16} />
                  <span>Назад к списку</span>
                </button>
                <h2 className="text-xl font-semibold">{selectedSurvey.name}</h2>
                <div className="w-24"></div> {/* Для выравнивания */}
              </div>

              {/* Карточки с основными метриками */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Текущие использования</p>
                      <p className="text-2xl font-bold text-[#2c2c33]">{selectedSurvey.usageCount}</p>
                    </div>
                    {getTrendIconBig(selectedSurvey.trend)}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Прогноз на месяц</p>
                      <p className="text-2xl font-bold text-[#2c2c33]">{selectedSurvey.prediction.nextMonth}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {selectedSurvey.prediction.nextMonth > selectedSurvey.usageCount ? (
                        <span className="text-green-500 text-sm">
                          +{selectedSurvey.prediction.nextMonth - selectedSurvey.usageCount}
                        </span>
                      ) : selectedSurvey.prediction.nextMonth < selectedSurvey.usageCount ? (
                        <span className="text-red-500 text-sm">
                          -{selectedSurvey.usageCount - selectedSurvey.prediction.nextMonth}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">0</span>
                      )}
                      <Calendar size={20} className="text-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Прогноз на квартал</p>
                      <p className="text-2xl font-bold text-[#2c2c33]">{selectedSurvey.prediction.nextQuarter}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-green-500 text-sm">
                        +{selectedSurvey.prediction.nextQuarter - selectedSurvey.usageCount}
                      </span>
                      <Calendar size={20} className="text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* График истории и прогноза */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">История и прогноз использования</h3>
                <div className="h-64 relative">
                  {/* Здесь был бы настоящий график, но для демонстрации используем упрощенную версию */}
                  <div className="absolute inset-0 flex items-end">
                    {selectedSurvey.history.map((point, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-blue-500 rounded-t"
                          style={{
                            height: `${
                              (point.count / Math.max(...selectedSurvey.history.map((p) => p.count), 1)) * 80
                            }%`,
                          }}
                        ></div>
                        <div className="text-xs mt-1 text-gray-600">{point.date.split("-")[1]}</div>
                      </div>
                    ))}
                    {/* Прогнозы */}
                    <div className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-green-400 rounded-t border-2 border-dashed border-green-600"
                        style={{
                          height: `${
                            (selectedSurvey.prediction.nextMonth /
                              Math.max(
                                ...selectedSurvey.history.map((p) => p.count),
                                selectedSurvey.prediction.nextMonth,
                                1,
                              )) *
                            80
                          }%`,
                        }}
                      ></div>
                      <div className="text-xs mt-1 text-green-600 font-medium">+1м</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-purple-400 rounded-t border-2 border-dashed border-purple-600"
                        style={{
                          height: `${
                            (selectedSurvey.prediction.nextQuarter /
                              Math.max(
                                ...selectedSurvey.history.map((p) => p.count),
                                selectedSurvey.prediction.nextQuarter,
                                1,
                              )) *
                            80
                          }%`,
                        }}
                      ></div>
                      <div className="text-xs mt-1 text-purple-600 font-medium">+3м</div>
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 text-xs text-gray-500">
                    Макс:{" "}
                    {Math.max(...selectedSurvey.history.map((p) => p.count), selectedSurvey.prediction.nextQuarter)}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-600">Точность прогноза:</span>{" "}
                    {getConfidenceBadge(selectedSurvey.prediction.confidence)}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">История</span>
                    <div className="w-3 h-3 bg-green-400 rounded-full ml-2"></div>
                    <span className="text-sm text-gray-600">Прогноз на месяц</span>
                    <div className="w-3 h-3 bg-purple-400 rounded-full ml-2"></div>
                    <span className="text-sm text-gray-600">Прогноз на квартал</span>
                  </div>
                </div>
              </div>

              {/* Рекомендации */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="text-yellow-500" size={24} />
                  <h3 className="text-lg font-semibold">Рекомендации по оптимизации</h3>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-gray-800">{selectedSurvey.prediction.recommendation}</p>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedSurvey.trend === "down" && (
                    <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="text-red-500 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-medium text-red-700">Внимание</h4>
                        <p className="text-sm text-gray-700">
                          Наблюдается отрицательная динамика. Рекомендуется пересмотреть стратегию привлечения клиентов
                          через этот канал.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedSurvey.trend === "up" && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="text-green-500 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-medium text-green-700">Положительная динамика</h4>
                        <p className="text-sm text-gray-700">
                          Канал показывает стабильный рост. Рекомендуется увеличить инвестиции в этот источник
                          привлечения клиентов.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Zap className="text-yellow-500 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-medium text-yellow-700">Потенциал роста</h4>
                      <p className="text-sm text-gray-700">
                        {selectedSurvey.usageCount > 0
                          ? "Есть потенциал для дальнейшего роста. Рассмотрите возможность проведения акций для клиентов из этого источника."
                          : "Этот канал еще не используется. Рассмотрите возможность его активации для привлечения новых клиентов."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Клиенты */}
      {viewMode === "clients" && (
        <div className="space-y-6">
          {/* Выбор опроса */}
          {!selectedSurvey && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Выберите опрос для просмотра клиентов</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedAndFilteredSurveys.map((survey) => (
                  <div
                    key={survey.id}
                    onClick={() => setSelectedSurvey(survey)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#2055a4] hover:shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{survey.name}</h3>
                      <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {survey.clients.length} клиентов
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-2xl font-bold">{survey.usageCount}</span>
                      <span className="text-gray-500">использований</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Средний чек: <span className="font-semibold">{formatMoney(getAverageSpent(survey))}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Детальная информация о клиентах выбранного опроса */}
          {selectedSurvey && (
            <>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className="text-[#2055a4] hover:underline flex items-center gap-1"
                >
                  <ArrowRight className="rotate-180" size={16} />
                  <span>Назад к списку</span>
                </button>
                <h2 className="text-xl font-semibold">{selectedSurvey.name}</h2>
                <div className="w-24"></div> {/* Для выравнивания */}
              </div>

              {/* Карточки с основными метриками */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Всего клиентов</p>
                      <p className="text-2xl font-bold text-[#2c2c33]">{selectedSurvey.clients.length}</p>
                    </div>
                    <Users className="text-blue-500" size={24} />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Физические лица</p>
                      <p className="text-2xl font-bold text-[#2c2c33]">
                        {getClientTypeDistribution(selectedSurvey).individual}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {getClientTypeDistribution(selectedSurvey).individualPercent}%
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Юридические лица</p>
                      <p className="text-2xl font-bold text-[#2c2c33]">
                        {getClientTypeDistribution(selectedSurvey).legal}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {getClientTypeDistribution(selectedSurvey).legalPercent}%
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Общая выручка</p>
                      <p className="text-2xl font-bold text-[#2c2c33]">
                        {formatMoney(getTotalRevenue(selectedSurvey))}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">Ср. чек: {formatMoney(getAverageSpent(selectedSurvey))}</div>
                  </div>
                </div>
              </div>

              {/* Список клиентов */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold">Список клиентов</h3>
                </div>

                {selectedSurvey.clients.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">Клиенты не найдены</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {selectedSurvey.clients.map((client) => (
                      <div key={client.id} className="p-4 hover:bg-gray-50">
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleClientDetails(client.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                client.type === "individual" ? "bg-blue-500" : "bg-purple-500"
                              }`}
                            ></div>
                            <div className="font-medium">{client.name}</div>
                            <div
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                client.type === "individual"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {client.type === "individual" ? "Физ. лицо" : "Юр. лицо"}
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div>
                              <div className="text-sm text-gray-500">Сумма заказов</div>
                              <div className="font-semibold text-right">{formatMoney(client.totalSpent)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Заказов</div>
                              <div className="font-semibold text-right">{client.ordersCount}</div>
                            </div>
                            <ChevronDownIcon
                              className={`text-gray-400 transition-transform ${
                                expandedClientId === client.id ? "transform rotate-180" : ""
                              }`}
                              size={20}
                            />
                          </div>
                        </div>

                        {/* Детали клиента */}
                        {expandedClientId === client.id && (
                          <div className="mt-4 pl-5 border-l-2 border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-gray-500">Контактная информация</div>
                                <div className="mt-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-700">Телефон:</span>
                                    <span>{client.phone}</span>
                                  </div>
                                  {client.email && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-700">Email:</span>
                                      <span>{client.email}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Даты</div>
                                <div className="mt-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-700">Регистрация:</span>
                                    <span>{formatDate(client.registrationDate)}</span>
                                  </div>
                                  {client.lastOrderDate && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-700">Последний заказ:</span>
                                      <span>{formatDate(client.lastOrderDate)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 flex justify-end">
                              <button className="text-[#2055a4] hover:underline text-sm">
                                Перейти к профилю клиента
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Модальные окна */}
      <AddSurveyModal
        isOpen={isAddModalOpen}
        onClose={closeModals}
        onAdd={handleAddSurvey}
        onEdit={handleEditSurvey}
        editingSurvey={editingSurvey}
      />

      <DeleteSurveyModal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onDelete={handleDeleteSurvey}
        survey={deletingSurvey}
      />
    </div>
  )
}
