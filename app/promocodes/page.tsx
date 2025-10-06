"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Filter, Calendar, Tag, Users, MapPin, TrendingUp, Eye, Edit, Trash2 } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import type { Promocode } from "@/types"

type SortField = "id" | "name" | "createdAt" | "status" | "discountType" | "targetAudience"
type SortDirection = "asc" | "desc"
type StatusFilter = "all" | "active" | "inactive" | "expired"
type TypeFilter = "all" | "discount" | "cashback" | "free_service"
type AudienceFilter = "all" | "physical" | "legal"

export default function PromocodesPage() {
  const router = useRouter()
  const { showNotification } = useNotification()
  const { promocodes, deletePromocode } = useAppContext()

  // Состояния для фильтрации и сортировки
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>("all")
  const [showFilters, setShowFilters] = useState(false)

  // Функция для определения статуса промокода
  const getPromocodeStatus = (promocode: Promocode): "active" | "expired" | "inactive" => {
    if (promocode.status === "inactive") return "inactive"

    const currentDate = new Date()
    const endDate = new Date(promocode.endDate)

    if (endDate < currentDate) return "expired"
    if (promocode.usedCount >= promocode.usageLimit) return "expired"

    return "active"
  }

  // Фильтрация и сортировка промокодов
  const filteredAndSortedPromocodes = useMemo(() => {
    const filtered = promocodes.filter((promocode) => {
      // Поиск по названию и коду
      const matchesSearch =
        promocode.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promocode.code.toLowerCase().includes(searchTerm.toLowerCase())

      // Фильтр по статусу
      const actualStatus = getPromocodeStatus(promocode)
      const matchesStatus = statusFilter === "all" || actualStatus === statusFilter

      // Фильтр по типу
      const matchesType = typeFilter === "all" || promocode.type === typeFilter

      // Фильтр по аудитории
      const matchesAudience = audienceFilter === "all" || promocode.targetAudience === audienceFilter

      return matchesSearch && matchesStatus && matchesType && matchesAudience
    })

    // Сортировка
    filtered.sort((a, b) => {
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
        case "createdAt":
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case "status":
          aValue = getPromocodeStatus(a)
          bValue = getPromocodeStatus(b)
          break
        case "discountType":
          aValue = a.discountType
          bValue = b.discountType
          break
        case "targetAudience":
          aValue = a.targetAudience
          bValue = b.targetAudience
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [promocodes, searchTerm, sortField, sortDirection, statusFilter, typeFilter, audienceFilter])

  // Обработчик сортировки
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Обработчик удаления промокода
  const handleDelete = (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этот промокод?")) {
      deletePromocode(id)
      showNotification("Промокод успешно удален", "success")
    }
  }

  // Функция для получения цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Функция для получения текста статуса
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Активный"
      case "expired":
        return "Истёк"
      case "inactive":
        return "Отключён"
      default:
        return "Неизвестно"
    }
  }

  // Функция для получения текста типа
  const getTypeText = (type: string) => {
    switch (type) {
      case "discount":
        return "Скидка"
      case "cashback":
        return "Кэшбек"
      case "free_service":
        return "Бесплатная услуга"
      default:
        return type
    }
  }

  // Функция для получения текста аудитории
  const getAudienceText = (audience: string) => {
    switch (audience) {
      case "physical":
        return "Физ. лица"
      case "legal":
        return "Юр. лица"
      case "all":
        return "Все"
      default:
        return audience
    }
  }

  return (
    <div className="p-6">
      {/* Заголовок и кнопка добавления */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2c2c33] mb-2">Промокоды</h1>
          <p className="text-gray-600">Управление промокодами для клиентов</p>
        </div>
        <button
          onClick={() => router.push("/promocodes/create")}
          className="bg-[#2055a4] text-white px-4 py-2 rounded-lg hover:bg-[#1a4a8f] transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить промокод
        </button>
      </div>

      {/* Поиск и фильтры */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {/* Поиск */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Поиск по названию или коду промокода..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
            />
          </div>

          {/* Кнопка фильтров */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg flex items-center transition-colors ${
              showFilters
                ? "bg-[#2055a4] text-white border-[#2055a4]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Фильтры
          </button>
        </div>

        {/* Панель фильтров */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {/* Фильтр по статусу */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              >
                <option value="all">Все статусы</option>
                <option value="active">Активные</option>
                <option value="expired">Истёкшие</option>
                <option value="inactive">Отключённые</option>
              </select>
            </div>

            {/* Фильтр по типу */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тип промокода</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              >
                <option value="all">Все типы</option>
                <option value="discount">Скидка</option>
                <option value="cashback">Кэшбек</option>
                <option value="free_service">Бесплатная услуга</option>
              </select>
            </div>

            {/* Фильтр по аудитории */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Целевая аудитория</label>
              <select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value as AudienceFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              >
                <option value="all">Все</option>
                <option value="physical">Физ. лица</option>
                <option value="legal">Юр. лица</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Всего промокодов</p>
              <p className="text-2xl font-bold text-gray-900">{promocodes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Активных</p>
              <p className="text-2xl font-bold text-gray-900">
                {promocodes.filter((p) => getPromocodeStatus(p) === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Истёкших</p>
              <p className="text-2xl font-bold text-gray-900">
                {promocodes.filter((p) => getPromocodeStatus(p) === "expired").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Использований</p>
              <p className="text-2xl font-bold text-gray-900">{promocodes.reduce((sum, p) => sum + p.usedCount, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Таблица промокодов */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    ID
                    {sortField === "id" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Название промокода
                    {sortField === "name" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("discountType")}
                >
                  <div className="flex items-center">
                    Тип промокода
                    {sortField === "discountType" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Размер скидки
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Период действия
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Применяемые точки
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("targetAudience")}
                >
                  <div className="flex items-center">
                    Для кого предназначен
                    {sortField === "targetAudience" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Статус
                    {sortField === "status" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedPromocodes.map((promocode) => {
                const status = getPromocodeStatus(promocode)
                return (
                  <tr key={promocode.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{promocode.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{promocode.name}</div>
                        <div className="text-sm text-gray-500 font-mono">{promocode.code}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getTypeText(promocode.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {promocode.discountAmount}
                      {promocode.discountType === "percentage" ? "%" : "₽"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{new Date(promocode.startDate).toLocaleDateString("ru-RU")}</div>
                        <div className="text-gray-500">
                          до {new Date(promocode.endDate).toLocaleDateString("ru-RU")}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs">
                        {promocode.applicablePoints.length > 0 ? (
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                            <span className="truncate">
                              {promocode.applicablePoints.length === 1
                                ? promocode.applicablePoints[0]
                                : `${promocode.applicablePoints.length} точек`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Все точки</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getAudienceText(promocode.targetAudience)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
                      >
                        {getStatusText(status)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {promocode.usedCount}/{promocode.usageLimit} использований
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/promocodes/${promocode.id}`)}
                          className="text-[#2055a4] hover:text-[#1a4a8f] transition-colors"
                          title="Просмотр"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/promocodes/${promocode.id}/edit`)}
                          className="text-yellow-600 hover:text-yellow-700 transition-colors"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(promocode.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Пустое состояние */}
        {filteredAndSortedPromocodes.length === 0 && (
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Промокоды не найдены</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all" || audienceFilter !== "all"
                ? "Попробуйте изменить параметры поиска или фильтры"
                : "Начните с создания первого промокода"}
            </p>
            {!searchTerm && statusFilter === "all" && typeFilter === "all" && audienceFilter === "all" && (
              <div className="mt-6">
                <button
                  onClick={() => router.push("/promocodes/create")}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#2055a4] hover:bg-[#1a4a8f]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить промокод
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
