"use client"

import type React from "react"

import { useState } from "react"
import { Filter, Pencil, Trash2, Plus, X } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import type { Promotion, Location, Service } from "@/types"

export default function PromotionsPage() {
  const { promotions, addPromotion, updatePromotion, deletePromotion, services } = useAppContext()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Состояние фильтров
  const [filters, setFilters] = useState({
    locations: [],
    status: "all" as "all" | "active" | "inactive",
    targetAudience: "all" as "all" | "physical" | "legal",
    dateRange: {
      start: "",
      end: "",
    },
    dateFilterType: "active_during" as "active_during" | "starts_in" | "ends_in" | "created_in",
  })

  // Моковые данные для локаций
  const mockLocations: Location[] = [
    { id: 1, city: "Москва", address: "Чертановская, 26к2", isActive: true },
    { id: 2, city: "Сочи", address: "Красная, 15", isActive: true },
    { id: 3, city: "Санкт-Петербург", address: "Невский проспект, 28", isActive: true },
    { id: 4, city: "Екатеринбург", address: "Ленина, 41", isActive: true },
    { id: 5, city: "Казань", address: "Баумана, 12", isActive: true },
  ]

  // Моковые данные для акций
  const mockPromotions: Promotion[] = [
    {
      id: 1,
      name: "Скидка новичкам",
      discountAmount: 15,
      discountType: "percentage",
      description: "Скидка 15% для новых клиентов",
      targetAudience: "physical",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      status: "active",
      locations: ["Москва, Чертановская, 26к2", "Сочи, Красная, 15"],
      applicableServices: [1, 2],
    },
    {
      id: 2,
      name: "Корпоративная скидка",
      discountAmount: 500,
      discountType: "fixed",
      description: "Фиксированная скидка 500₽ для юридических лиц",
      targetAudience: "legal",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      status: "active",
      locations: ["Москва, Чертановская, 26к2"],
      applicableServices: [2, 3],
    },
    {
      id: 3,
      name: "Летняя акция",
      discountAmount: 20,
      discountType: "percentage",
      description: "Летняя скидка 20% на все услуги",
      targetAudience: "all",
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      status: "active",
      locations: ["Москва, Чертановская, 26к2", "Сочи, Красная, 15"],
      applicableServices: [1, 2, 3, 4],
    },
    {
      id: 4,
      name: "Универсальная скидка",
      discountAmount: 10,
      discountType: "percentage",
      description: "Скидка 10% для всех клиентов",
      targetAudience: "all",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      status: "active",
      locations: ["Москва, Чертановская, 26к2", "Сочи, Красная, 15"],
      applicableServices: [1, 2, 3, 4],
    },
  ]

  // Функция для открытия модального окна создания акции
  const openCreateModal = () => {
    setCurrentPromotion({
      id: 0,
      name: "",
      discountAmount: 0,
      discountType: "percentage",
      description: "",
      targetAudience: "all",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      status: "active",
      locations: [],
      applicableServices: [],
    })
    setIsCreateModalOpen(true)
  }

  // Функция для открытия модального окна редактирования акции
  const openEditModal = (promotion: Promotion) => {
    setCurrentPromotion(promotion)
    setIsEditModalOpen(true)
  }

  // Функция для открытия модального окна удаления акции
  const openDeleteModal = (promotion: Promotion) => {
    setCurrentPromotion(promotion)
    setIsDeleteModalOpen(true)
  }

  // Функция для сохранения акции (создание или редактирование)
  const savePromotion = (promotion: Promotion) => {
    if (promotion.id === 0) {
      // Создание новой акции
      addPromotion(promotion)
    } else {
      // Редактирование существующей акции
      updatePromotion(promotion)
    }
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
  }

  // Функция для удаления акции
  const handleDeletePromotion = () => {
    if (currentPromotion) {
      deletePromotion(currentPromotion.id)
      setIsDeleteModalOpen(false)
    }
  }

  // Функция фильтрации акций
  const getFilteredPromotions = () => {
    return promotions.filter((promotion) => {
      // Фильтр по локациям
      if (filters.locations.length > 0) {
        const hasMatchingLocation = promotion.locations.some((location) => filters.locations.includes(location))
        if (!hasMatchingLocation) return false
      }

      // Фильтр по статусу
      if (filters.status !== "all" && promotion.status !== filters.status) {
        return false
      }

      // Фильтр по целевой аудитории
      if (filters.targetAudience !== "all" && promotion.targetAudience !== filters.targetAudience) {
        return false
      }

      // Фильтр по дате
      if (filters.dateRange.start && filters.dateRange.end) {
        const filterStartDate = new Date(filters.dateRange.start)
        const filterEndDate = new Date(filters.dateRange.end)
        const promotionStartDate = new Date(promotion.startDate)
        const promotionEndDate = new Date(promotion.endDate)

        switch (filters.dateFilterType) {
          case "active_during":
            return promotionStartDate <= filterEndDate && promotionEndDate >= filterStartDate
          case "starts_in":
            return promotionStartDate >= filterStartDate && promotionStartDate <= filterEndDate
          case "ends_in":
            return promotionEndDate >= filterStartDate && promotionEndDate <= filterEndDate
          case "created_in":
            return promotionStartDate >= filterStartDate && promotionStartDate <= filterEndDate
          default:
            return true
        }
      }

      return true
    })
  }

  // Получаем отфильтрованные акции
  const filteredPromotions = getFilteredPromotions()

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentPromotions = filteredPromotions.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage)

  // Проверка, применены ли фильтры
  const hasActiveFilters =
    filters.locations.length > 0 ||
    filters.status !== "all" ||
    filters.targetAudience !== "all" ||
    filters.dateRange.start ||
    filters.dateRange.end

  // Функция для получения названий услуг по ID
  const getServiceNames = (serviceIds: number[]): string => {
    const serviceNames = serviceIds.map((id) => services.find((service) => service.id === id)?.name).filter(Boolean)
    return serviceNames.length > 0 ? serviceNames.join(", ") : "Не указаны"
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Акции</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`p-2 rounded-md transition-colors ${
              hasActiveFilters ? "bg-[#2055a4] text-white" : "bg-[#d9dbe7] hover:bg-[#c8cadb] text-[#2c2c33]"
            }`}
          >
            <Filter size={20} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center px-4 py-2 bg-[#2055a4] text-white rounded-md hover:bg-[#1a4a8f] transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Создать акцию
          </button>
        </div>
      </div>

      {/* Индикатор активных фильтров */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-800">Применены фильтры:</span>
              <div className="flex flex-wrap gap-2">
                {filters.locations.length > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    Локации: {filters.locations.length}
                  </span>
                )}
                {filters.status !== "all" && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    Статус: {filters.status === "active" ? "Активные" : "Неактивные"}
                  </span>
                )}
                {filters.targetAudience !== "all" && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    Аудитория:{" "}
                    {filters.targetAudience === "physical"
                      ? "Физ. лица"
                      : filters.targetAudience === "legal"
                        ? "Юр. лица"
                        : "Все"}
                  </span>
                )}
                {(filters.dateRange.start || filters.dateRange.end) && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    Период: {filters.dateRange.start} - {filters.dateRange.end}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() =>
                setFilters({
                  locations: [],
                  status: "all",
                  targetAudience: "all",
                  dateRange: { start: "", end: "" },
                  dateFilterType: "active_during",
                })
              }
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Сбросить все
            </button>
          </div>
        </div>
      )}

      {/* Информация о результатах */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Показано {currentPromotions.length} из {filteredPromotions.length} акций
          {filteredPromotions.length !== promotions.length && ` (всего: ${promotions.length})`}
        </p>
      </div>

      {/* Таблица акций */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Наименование акции
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Скидка</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Применимые услуги
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Период действия
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPromotions.length > 0 ? (
              currentPromotions.map((promotion) => (
                <tr key={promotion.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{promotion.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{promotion.name}</div>
                    <div className="text-sm text-gray-500">{promotion.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {promotion.discountAmount}
                    {promotion.discountType === "percentage" ? "%" : "₽"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    <div className="truncate" title={getServiceNames(promotion.applicableServices)}>
                      {getServiceNames(promotion.applicableServices)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(promotion.startDate).toLocaleDateString("ru-RU")} -{" "}
                    {new Date(promotion.endDate).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        promotion.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {promotion.status === "active" ? "Активен" : "Деактивирован"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEditModal(promotion)} className="text-gray-600 hover:text-gray-900 mr-3">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => openDeleteModal(promotion)} className="text-gray-600 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  {hasActiveFilters ? "Акции не найдены по заданным критериям" : "Нет доступных акций"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 mx-1 rounded-md ${
                  currentPage === page ? "bg-[#2055a4] text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              &gt;
            </button>
          </nav>
        </div>
      )}

      {/* Модальные окна */}
      {isCreateModalOpen && currentPromotion && (
        <PromotionModal
          promotion={currentPromotion}
          locations={mockLocations}
          services={services}
          onSave={savePromotion}
          onCancel={() => setIsCreateModalOpen(false)}
          title="Добавление акции"
        />
      )}

      {isEditModalOpen && currentPromotion && (
        <PromotionModal
          promotion={currentPromotion}
          locations={mockLocations}
          services={services}
          onSave={savePromotion}
          onCancel={() => setIsEditModalOpen(false)}
          title="Редактирование акции"
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h2 className="text-xl font-semibold mb-4 text-center">Вы уверены, что хотите удалить акцию?</h2>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleDeletePromotion}
                className="px-4 py-2 bg-[#2055a4] text-white rounded-md hover:bg-[#1a4a8f] transition-colors"
              >
                Удалить
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Оставить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Компонент модального окна для создания/редактирования акции
interface PromotionModalProps {
  promotion: Promotion
  locations: Location[]
  services: Service[]
  onSave: (promotion: Promotion) => void
  onCancel: () => void
  title: string
}

function PromotionModal({ promotion, locations, services, onSave, onCancel, title }: PromotionModalProps) {
  const [formData, setFormData] = useState<Promotion>(promotion)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    formData.startDate ? new Date(formData.startDate) : null,
  )
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    formData.endDate ? new Date(formData.endDate) : null,
  )
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Обработчик изменения типа скидки
  const handleDiscountTypeChange = (discountType: "percentage" | "fixed") => {
    setFormData({ ...formData, discountType })
  }

  // Обработчик изменения целевой аудитории
  const handleTargetAudienceChange = (audience: "physical" | "legal" | "all") => {
    setFormData({ ...formData, targetAudience: audience })
  }

  // Обработчик изменения статуса
  const handleStatusChange = (status: "active" | "inactive") => {
    setFormData({ ...formData, status: status })
  }

  // Обработчик выбора локации
  const handleLocationSelect = (locationString: string) => {
    const updatedLocations = formData.locations.includes(locationString)
      ? formData.locations.filter((loc) => loc !== locationString)
      : [...formData.locations, locationString]

    setFormData({ ...formData, locations: updatedLocations })
  }

  // Обработчик выбора услуги
  const handleServiceSelect = (serviceId: number) => {
    const updatedServices = formData.applicableServices.includes(serviceId)
      ? formData.applicableServices.filter((id) => id !== serviceId)
      : [...formData.applicableServices, serviceId]

    setFormData({ ...formData, applicableServices: updatedServices })
  }

  // Обработчик выбора даты
  const handleDateSelect = (date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date)
      setSelectedEndDate(null)
    } else {
      if (date < selectedStartDate) {
        setSelectedEndDate(selectedStartDate)
        setSelectedStartDate(date)
      } else {
        setSelectedEndDate(date)
      }
    }
  }

  // Применение выбранных дат
  const applyDateRange = () => {
    if (selectedStartDate && selectedEndDate) {
      setFormData({
        ...formData,
        startDate: selectedStartDate.toISOString().split("T")[0],
        endDate: selectedEndDate.toISOString().split("T")[0],
      })
    }
    setShowCalendar(false)
  }

  // Форматирование диапазона дат для отображения
  const formatDateRange = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      return `${start.getDate().toString().padStart(2, "0")} ${getMonthName(start.getMonth())} ${start.getFullYear()} - ${end.getDate().toString().padStart(2, "0")} ${getMonthName(end.getMonth())} ${end.getFullYear()}`
    }
    return "Выберите п��риод"
  }

  // Получение названия месяца
  const getMonthName = (monthIndex: number) => {
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ]
    return months[monthIndex]
  }

  // Генерация календаря
  const generateCalendar = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    const days = []
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  // Проверка, выбрана ли дата
  const isDateSelected = (date: Date) => {
    if (!date) return false
    if (selectedStartDate && selectedEndDate) {
      return date >= selectedStartDate && date <= selectedEndDate
    }
    return selectedStartDate?.toDateString() === date.toDateString()
  }

  // Проверка, является ли дата начальной или конечной
  const isStartOrEndDate = (date: Date) => {
    if (!date) return false
    return (
      selectedStartDate?.toDateString() === date.toDateString() ||
      selectedEndDate?.toDateString() === date.toDateString()
    )
  }

  // Обработчик сохранения формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {/* Левая колонка */}
            <div>
              {/* Наименование акции */}
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Наименование акции"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2055a4]"
                  required
                />
              </div>

              {/* Сумма скидки и тип */}
              <div className="mb-4 flex gap-2">
                <input
                  type="number"
                  name="discountAmount"
                  value={formData.discountAmount}
                  onChange={handleChange}
                  placeholder="Размер скидки"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2055a4]"
                  required
                />
                <select
                  value={formData.discountType}
                  onChange={(e) => handleDiscountTypeChange(e.target.value as "percentage" | "fixed")}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2055a4]"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">₽</option>
                </select>
              </div>

              {/* Срок акции */}
              <div className="mb-4 relative">
                <div
                  className="w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer flex items-center"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <span className="mr-2">{formatDateRange()}</span>
                </div>

                {/* Календарь */}
                {showCalendar && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))
                        }
                        className="text-gray-600 hover:text-gray-900"
                      >
                        &lt;
                      </button>
                      <div>
                        {getMonthName(selectedMonth.getMonth())} {selectedMonth.getFullYear()}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))
                        }
                        className="text-gray-600 hover:text-gray-900"
                      >
                        &gt;
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-600">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendar(selectedMonth).map((date, index) => (
                        <div
                          key={index}
                          className={`text-center py-1 ${
                            !date
                              ? "text-gray-300"
                              : isDateSelected(date)
                                ? isStartOrEndDate(date)
                                  ? "bg-[#2055a4] text-white rounded-md"
                                  : "bg-[#d9dbe7] text-[#2055a4]"
                                : "hover:bg-gray-100 cursor-pointer"
                          }`}
                          onClick={() => date && handleDateSelect(date)}
                        >
                          {date ? date.getDate() : ""}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={applyDateRange}
                        className="px-4 py-2 bg-[#2055a4] text-white rounded-md hover:bg-[#1a4a8f] transition-colors"
                      >
                        Применить
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Правая колонка */}
            <div>
              {/* Точки, в которых действует акция */}
              <div className="mb-4 relative">
                <div
                  className="w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer flex items-center"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                >
                  <span className="truncate">
                    {formData.locations.length > 0 ? formData.locations.join(", ") : "Точки, в которых действует акция"}
                  </span>
                </div>

                {/* Выпадающий список локаций */}
                {showLocationDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-full max-h-60 overflow-y-auto">
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleLocationSelect(`${location.city}, ${location.address}`)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.locations.includes(`${location.city}, ${location.address}`)}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        <span>
                          {location.city}, {location.address}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Применимые услуги */}
              <div className="mb-4 relative">
                <div
                  className="w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer flex items-center"
                  onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                >
                  <span className="truncate">
                    {formData.applicableServices.length > 0
                      ? `Выбрано услуг: ${formData.applicableServices.length}`
                      : "Выберите применимые услуги"}
                  </span>
                </div>

                {/* Выпадающий список услуг */}
                {showServiceDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-full max-h-60 overflow-y-auto">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleServiceSelect(service.id)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.applicableServices.includes(service.id)}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-gray-500">{service.price} ₽</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Описание */}
              <div className="mb-4">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Описание"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2055a4] resize-none h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* На кого распространяется акция */}
          <div className="mb-6">
            <p className="mb-2 text-sm text-gray-600">На кого распространяется:</p>
            <div className="flex space-x-4">
              <div
                className={`flex items-center cursor-pointer ${
                  formData.targetAudience === "physical" ? "text-[#2055a4]" : "text-gray-600"
                }`}
                onClick={() => handleTargetAudienceChange("physical")}
              >
                <div
                  className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
                    formData.targetAudience === "physical" ? "border-[#2055a4]" : "border-gray-400"
                  }`}
                >
                  {formData.targetAudience === "physical" && <div className="w-2 h-2 rounded-full bg-[#2055a4]"></div>}
                </div>
                <span>Физ. лица</span>
              </div>

              <div
                className={`flex items-center cursor-pointer ${
                  formData.targetAudience === "legal" ? "text-[#2055a4]" : "text-gray-600"
                }`}
                onClick={() => handleTargetAudienceChange("legal")}
              >
                <div
                  className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
                    formData.targetAudience === "legal" ? "border-[#2055a4]" : "border-gray-400"
                  }`}
                >
                  {formData.targetAudience === "legal" && <div className="w-2 h-2 rounded-full bg-[#2055a4]"></div>}
                </div>
                <span>Юр. лица</span>
              </div>

              <div
                className={`flex items-center cursor-pointer ${
                  formData.targetAudience === "all" ? "text-[#2055a4]" : "text-gray-600"
                }`}
                onClick={() => handleTargetAudienceChange("all")}
              >
                <div
                  className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
                    formData.targetAudience === "all" ? "border-[#2055a4]" : "border-gray-400"
                  }`}
                >
                  {formData.targetAudience === "all" && <div className="w-2 h-2 rounded-full bg-[#2055a4]"></div>}
                </div>
                <span>Все</span>
              </div>
            </div>
          </div>

          {/* Статус */}
          <div className="mb-6">
            <div className="flex space-x-4">
              <div
                className={`flex items-center cursor-pointer ${
                  formData.status === "active" ? "text-[#2055a4]" : "text-gray-600"
                }`}
                onClick={() => handleStatusChange("active")}
              >
                <div
                  className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
                    formData.status === "active" ? "border-[#2055a4]" : "border-gray-400"
                  }`}
                >
                  {formData.status === "active" && <div className="w-2 h-2 rounded-full bg-[#2055a4]"></div>}
                </div>
                <span>Активна</span>
              </div>

              <div
                className={`flex items-center cursor-pointer ${
                  formData.status === "inactive" ? "text-[#2055a4]" : "text-gray-600"
                }`}
                onClick={() => handleStatusChange("inactive")}
              >
                <div
                  className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
                    formData.status === "inactive" ? "border-[#2055a4]" : "border-gray-400"
                  }`}
                >
                  {formData.status === "inactive" && <div className="w-2 h-2 rounded-full bg-[#2055a4]"></div>}
                </div>
                <span>Деактивирована</span>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#2055a4] text-white rounded-md hover:bg-[#1a4a8f] transition-colors"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Отменить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
