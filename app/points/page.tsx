"use client"

import { useState } from "react"
import { Plus, Download, Edit, Trash2, BarChart3, MapPin, Phone, Building, Filter, X, Upload, Map } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { AddPointModal } from "@/components/modals/AddPointModal"
import { DeletePointModal } from "@/components/modals/DeletePointModal"
import { PointStatisticsModal } from "@/components/modals/PointStatisticsModal"
import { ImportPointsModal } from "@/components/modals/ImportPointsModal"
import PointsMapModal from "@/components/modals/PointsMapModal"
import type { Point } from "@/types"

export default function PointsPage() {
  const { points, deletePoint, cities, addPoint, updatePoint } = useAppContext()

  // Инициализируем тестовые данные если их нет
  const [mockPoints, setMockPoints] = useState<Point[]>([
    {
      id: 1,
      name: "Химчистка на Чертановской",
      organizationType: "own",
      phone: "+7 (495) 123-45-67",
      address: {
        cityId: 1,
        city: "Москва",
        street: "Чертановская",
        house: "26к2",
        apartment: "",
        fullAddress: "г. Москва, ул. Чертановская, д. 26к2",
      },
      coordinates: {
        lat: 55.641312,
        lng: 37.607618,
      },
      isActive: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Химчистка на Красной",
      organizationType: "franchise",
      phone: "+7 (862) 234-56-78",
      address: {
        cityId: 2,
        city: "Сочи",
        street: "Красная",
        house: "15",
        apartment: "",
        fullAddress: "г. Сочи, ул. Красная, д. 15",
      },
      coordinates: {
        lat: 43.603104,
        lng: 39.734558,
      },
      isActive: true,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10",
    },
    {
      id: 3,
      name: "Химчистка на Невском",
      organizationType: "own",
      phone: "+7 (812) 345-67-89",
      address: {
        cityId: 3,
        city: "Санкт-Петербург",
        street: "Невский проспект",
        house: "100",
        apartment: "",
        fullAddress: "г. Санкт-Петербург, Невский проспект, д. 100",
      },
      coordinates: {
        lat: 59.93428,
        lng: 30.335099,
      },
      isActive: true,
      createdAt: "2024-01-05",
      updatedAt: "2024-01-05",
    },
  ])

  // Используем данные из контекста или моковые данные
  const safePoints = points && points.length > 0 ? points : mockPoints
  const safeCities = cities || [
    { id: 1, name: "Москва", isActive: true },
    { id: 2, name: "Сочи", isActive: true },
    { id: 3, name: "Санкт-Петербург", isActive: true },
  ]

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Состояния фильтров
  const [filters, setFilters] = useState({
    organizationType: "" as "" | "own" | "franchise",
    cityId: "",
    searchTerm: "",
    showFilters: false,
  })

  // Применение фильтров
  const filteredPoints = safePoints.filter((point) => {
    // Фильтр по типу организации
    if (filters.organizationType && point.organizationType !== filters.organizationType) {
      return false
    }

    // Фильтр по городу
    if (filters.cityId && point.address.cityId !== Number(filters.cityId)) {
      return false
    }

    // Поиск по названию, телефону или адресу
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      return (
        point.name.toLowerCase().includes(searchLower) ||
        point.phone.toLowerCase().includes(searchLower) ||
        point.address.fullAddress.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  // Пагинация для отфильтрованных данных
  const totalPages = Math.ceil(filteredPoints.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPoints = filteredPoints.slice(startIndex, endIndex)

  // Сброс пагинации при изменении фильтров
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters })
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      organizationType: "",
      cityId: "",
      searchTerm: "",
      showFilters: false,
    })
    setCurrentPage(1)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.organizationType) count++
    if (filters.cityId) count++
    if (filters.searchTerm) count++
    return count
  }

  const handleEdit = (point: Point) => {
    setSelectedPoint(point)
    setIsAddModalOpen(true)
  }

  const handleDelete = (point: Point) => {
    setSelectedPoint(point)
    setIsDeleteModalOpen(true)
  }

  const handleShowStats = (point: Point) => {
    setSelectedPoint(point)
    setIsStatsModalOpen(true)
  }

  // Функция экспорта в Excel (CSV формат)
  const handleExportToExcel = () => {
    try {
      // Подготавливаем данные для экспорта
      const exportData = filteredPoints.map((point, index) => ({
        "№": index + 1,
        Название: point.name,
        "Тип организации": point.organizationType === "own" ? "Собственная сеть" : "Франчайзи",
        Телефон: point.phone,
        Адрес: point.address.fullAddress,
        Город: safeCities.find((c) => c.id === point.address.cityId)?.name || "Не указан",
        Статус: point.isActive ? "Активна" : "Неактивна",
        "Дата создания": point.createdAt,
        "Дата обновления": point.updatedAt,
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
      link.setAttribute("download", `points_export_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log(`Экспортировано ${exportData.length} точек в CSV файл`)
    } catch (error) {
      console.error("Ошибка при экспорте:", error)
      alert("Произошла ошибка при экспорте данных")
    }
  }

  const getOrganizationTypeText = (type: "own" | "franchise") => {
    return type === "own" ? "Собственная сеть" : "Франчайзи"
  }

  const getOrganizationTypeColor = (type: "own" | "franchise") => {
    return type === "own" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
  }

  // Функция для добавления/обновления точки
  const handleAddPoint = (data: any) => {
    if (selectedPoint) {
      // Редактирование существующей точки
      const updatedPoint = { ...data, id: selectedPoint.id }
      if (updatePoint) {
        updatePoint(updatedPoint)
      } else {
        // Если updatePoint не доступен, обновляем в моковых данных
        setMockPoints((prev) => prev.map((p) => (p.id === selectedPoint.id ? updatedPoint : p)))
      }
    } else {
      // Добавление новой точки
      const newPoint = { ...data, id: Date.now() }
      if (addPoint) {
        addPoint(newPoint)
      } else {
        // Если addPoint не доступен, добавляем в моковые данные
        setMockPoints((prev) => [...prev, newPoint])
      }
    }
    setIsAddModalOpen(false)
    setSelectedPoint(null)
  }

  const handleConfirmDelete = () => {
    if (selectedPoint) {
      if (deletePoint) {
        deletePoint(selectedPoint.id)
      } else {
        // Если deletePoint не доступен, удаляем из моковых данных
        setMockPoints((prev) => prev.filter((p) => p.id !== selectedPoint.id))
      }
      setIsDeleteModalOpen(false)
      setSelectedPoint(null)
    }
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="w-full">
        {/* Заголовок и кнопки */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#2c2c33]">Точки</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#2196f3] hover:bg-[#1976d2] text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Добавить
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="bg-[#ff9800] hover:bg-[#f57c00] text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <Upload size={20} />
              Импорт
            </button>
            <button
              onClick={handleExportToExcel}
              className="bg-[#8e44ad] hover:bg-[#7d3c98] text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <Download size={20} />
              Экспорт в Excel
            </button>
            <button
              onClick={() => setIsMapModalOpen(true)}
              className="bg-[#009688] hover:bg-[#00796b] text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <Map size={20} />
              Карта точек
            </button>
          </div>
        </div>

        {/* Панель поиска и фильтров */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] mb-6 p-4">
          <div className="flex items-center gap-4 mb-4">
            {/* Поиск */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Поиск по названию, телефону или адресу..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
                className="w-full border border-[#e0e0e0] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2196f3] focus:border-transparent"
              />
            </div>

            {/* Кнопка фильтров */}
            <button
              onClick={() => handleFilterChange({ showFilters: !filters.showFilters })}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                filters.showFilters || getActiveFiltersCount() > 0
                  ? "bg-[#2196f3] text-white border-[#2196f3]"
                  : "bg-white text-[#2c2c33] border-[#e0e0e0] hover:bg-[#f5f5f5]"
              }`}
            >
              <Filter size={18} />
              Фильтры
              {getActiveFiltersCount() > 0 && (
                <span className="bg-white text-[#2196f3] rounded-full px-2 py-0.5 text-xs font-medium">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>

            {/* Кнопка сброса фильтров */}
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearFilters}
                className="text-[#8e8e8e] hover:text-[#2c2c33] transition-colors"
                title="Очистить фильтры"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Развернутые фильтры */}
          {filters.showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-[#e0e0e0]">
              {/* Фильтр по типу организации */}
              <div>
                <label className="block text-sm font-medium text-[#2c2c33] mb-2">Тип организации</label>
                <select
                  value={filters.organizationType}
                  onChange={(e) => handleFilterChange({ organizationType: e.target.value as "" | "own" | "franchise" })}
                  className="w-full border border-[#e0e0e0] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2196f3] focus:border-transparent"
                >
                  <option value="">Все типы</option>
                  <option value="own">Собственная сеть</option>
                  <option value="franchise">Франчайзи</option>
                </select>
              </div>

              {/* Фильтр по городу */}
              <div>
                <label className="block text-sm font-medium text-[#2c2c33] mb-2">Город</label>
                <select
                  value={filters.cityId}
                  onChange={(e) => handleFilterChange({ cityId: e.target.value })}
                  className="w-full border border-[#e0e0e0] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2196f3] focus:border-transparent"
                >
                  <option value="">Все города</option>
                  {safeCities
                    .filter((city) => city.isActive)
                    .map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Статистика по фильтрам */}
              <div className="flex items-end">
                <div className="text-sm text-[#8e8e8e]">
                  <div>
                    Найдено точек: <span className="font-medium text-[#2c2c33]">{filteredPoints.length}</span>
                  </div>
                  <div>
                    Всего точек: <span className="font-medium text-[#2c2c33]">{safePoints.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Активные фильтры */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.organizationType && (
              <div className="flex items-center gap-2 bg-[#e3f2fd] text-[#1976d2] px-3 py-1 rounded-full text-sm">
                <span>Тип: {getOrganizationTypeText(filters.organizationType)}</span>
                <button
                  onClick={() => handleFilterChange({ organizationType: "" })}
                  className="hover:bg-[#bbdefb] rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {filters.cityId && (
              <div className="flex items-center gap-2 bg-[#e8f5e8] text-[#2e7d32] px-3 py-1 rounded-full text-sm">
                <span>Город: {safeCities.find((c) => c.id === Number(filters.cityId))?.name}</span>
                <button
                  onClick={() => handleFilterChange({ cityId: "" })}
                  className="hover:bg-[#c8e6c9] rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {filters.searchTerm && (
              <div className="flex items-center gap-2 bg-[#fff3e0] text-[#f57c00] px-3 py-1 rounded-full text-sm">
                <span>Поиск: "{filters.searchTerm}"</span>
                <button
                  onClick={() => handleFilterChange({ searchTerm: "" })}
                  className="hover:bg-[#ffe0b2] rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Таблица */}
        <div className="bg-white rounded-lg border border-[#e0e0e0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full table-fixed">
              <thead className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c33] w-16">№</th>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c33] w-1/4">Организация</th>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c33] w-32">Тип связи</th>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c33] w-40">Номер телефона</th>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c33] flex-1">Адрес</th>
                  <th className="text-left py-3 px-4 font-medium text-[#2c2c33] w-32">Действия</th>
                </tr>
              </thead>
              <tbody>
                {currentPoints.length > 0 ? (
                  currentPoints.map((point, index) => (
                    <tr key={point.id} className="border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors">
                      <td className="py-3 px-4 text-[#2c2c33]">{startIndex + index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Building size={16} className="text-[#8e8e8e]" />
                          <span className="text-[#2c2c33] font-medium">{point.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getOrganizationTypeColor(
                            point.organizationType,
                          )}`}
                        >
                          {getOrganizationTypeText(point.organizationType)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-[#8e8e8e]" />
                          <span className="text-[#2c2c33]">{point.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-[#8e8e8e] flex-shrink-0" />
                          <span className="text-[#2c2c33] break-words" title={point.address.fullAddress}>
                            {point.address.fullAddress}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleShowStats(point)}
                            className="text-[#2196f3] hover:text-[#1976d2] transition-colors"
                            title="Статистика"
                          >
                            <BarChart3 size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(point)}
                            className="text-[#2ecc71] hover:text-[#27ae60] transition-colors"
                            title="Редактировать"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(point)}
                            className="text-[#e74c3c] hover:text-[#c0392b] transition-colors"
                            title="Удалить"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#8e8e8e]">
                      {getActiveFiltersCount() > 0 ? (
                        <div>
                          <div className="mb-2">По заданным фильтрам точки не найдены</div>
                          <button
                            onClick={clearFilters}
                            className="text-[#2196f3] hover:text-[#1976d2] transition-colors"
                          >
                            Сбросить фильтры
                          </button>
                        </div>
                      ) : (
                        "Нет точек для отображения"
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Пагинация */}
          {filteredPoints.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#e0e0e0] bg-[#fafafa]">
              <div className="flex items-center gap-2 text-sm text-[#8e8e8e]">
                <span>Страницы</span>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-1 rounded ${
                      currentPage === page
                        ? "bg-[#2196f3] text-white"
                        : "text-[#8e8e8e] hover:bg-[#e0e0e0] transition-colors"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#8e8e8e]">
                <span>Показано на странице</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="border border-[#e0e0e0] rounded px-2 py-1 text-[#2c2c33]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальные окна */}
      <AddPointModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setSelectedPoint(null)
        }}
        point={selectedPoint}
        onSubmit={handleAddPoint}
      />

      <DeletePointModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedPoint(null)
        }}
        point={selectedPoint}
        onConfirm={handleConfirmDelete}
      />

      <PointStatisticsModal
        isOpen={isStatsModalOpen}
        onClose={() => {
          setIsStatsModalOpen(false)
          setSelectedPoint(null)
        }}
        point={selectedPoint}
      />

      <ImportPointsModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />

      <PointsMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        points={safePoints}
        onPointStatistics={(point) => {
          setSelectedPoint(point)
          setIsStatsModalOpen(true)
        }}
      />
    </div>
  )
}
