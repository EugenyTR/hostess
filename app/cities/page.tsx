"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, MapPin, Download, Upload, Users, ShoppingCart, TrendingUp } from "lucide-react"
import { AddCityModal } from "@/components/modals/AddCityModal"
import { DeleteCityModal } from "@/components/modals/DeleteCityModal"
import { CityStatisticsModal } from "@/components/modals/CityStatisticsModal"
import type { City } from "@/types"
import { ImportCitiesModal } from "@/components/modals/ImportCitiesModal"
import { useAppContext } from "@/context/AppContext"

export default function CitiesPage() {
  const { cities, addCity, updateCity, deleteCity, getCityStatistics, getCityStatisticsById } = useAppContext()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [deletingCity, setDeleteingCity] = useState<City | null>(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false)
  const [selectedCityForStats, setSelectedCityForStats] = useState<number | null>(null)

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (city.region && city.region.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && city.isActive) ||
      (statusFilter === "inactive" && !city.isActive)
    return matchesSearch && matchesStatus
  })

  const activeCities = cities.filter((city) => city.isActive).length
  const inactiveCities = cities.filter((city) => !city.isActive).length
  const totalClients = cities.reduce((sum, city) => sum + (city.clientsCount || 0), 0)
  const totalOrders = cities.reduce((sum, city) => sum + (city.ordersCount || 0), 0)
  const totalRevenue = cities.reduce((sum, city) => sum + (city.totalRevenue || 0), 0)

  const handleAddCity = (cityData: Omit<City, "id">) => {
    addCity(cityData)
    setIsAddModalOpen(false)
  }

  const handleEditCity = (cityData: Omit<City, "id">) => {
    if (editingCity) {
      updateCity({ ...editingCity, ...cityData, updatedAt: new Date().toISOString() })
      setEditingCity(null)
      setIsAddModalOpen(false)
    }
  }

  const handleDeleteCity = () => {
    if (deletingCity) {
      deleteCity(deletingCity.id)
      setDeleteingCity(null)
      setIsDeleteModalOpen(false)
    }
  }

  const toggleCityStatus = (id: number) => {
    const city = cities.find((c) => c.id === id)
    if (city) {
      updateCity({ ...city, isActive: !city.isActive, updatedAt: new Date().toISOString() })
    }
  }

  const openEditModal = (city: City) => {
    setEditingCity(city)
    setIsAddModalOpen(true)
  }

  const openDeleteModal = (city: City) => {
    setDeleteingCity(city)
    setIsDeleteModalOpen(true)
  }

  const openStatisticsModal = (cityId: number) => {
    setSelectedCityForStats(cityId)
    setIsStatisticsModalOpen(true)
  }

  const handleExportCities = () => {
    const cityStats = getCityStatistics()

    // Создаем CSV строку с расширенной статистикой
    const headers = "ID,Название,Регион,Статус,Клиенты,Заказы,Выручка,Средний чек,Дата создания,Дата обновления\n"
    const csvContent = cities.reduce((acc, city) => {
      const stats = cityStats.find((s) => s.cityId === city.id)
      return (
        acc +
        [
          city.id,
          `"${city.name}"`,
          `"${city.region || ""}"`,
          city.isActive ? "Активный" : "Неактивный",
          stats?.clientsCount || 0,
          stats?.ordersCount || 0,
          `"${(stats?.totalRevenue || 0).toLocaleString("ru-RU")} ₽"`,
          `"${(stats?.averageOrderValue || 0).toLocaleString("ru-RU")} ₽"`,
          new Date(city.createdAt).toLocaleDateString("ru-RU"),
          new Date(city.updatedAt).toLocaleDateString("ru-RU"),
        ].join(",") +
        "\n"
      )
    }, headers)

    // Создаем Blob и ссылку для скачивания
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    // Создаем временную ссылку и кликаем по ней
    const link = document.createElement("a")
    link.href = url
    link.download = `cities_statistics_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportCities = (importedCities: Omit<City, "id">[]) => {
    importedCities.forEach((cityData) => {
      addCity(cityData)
    })
    setIsImportModalOpen(false)
  }

  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#2c2c33] mb-2">Города</h1>
        <p className="text-[#8e8e8e]">Управление справочником городов с интеграцией в систему</p>
      </div>

      {/* Расширенная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-[#e3e3e3] rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-[#e8f0fe] rounded-lg mr-3">
              <MapPin className="h-5 w-5 text-[#2055a4]" />
            </div>
            <div>
              <p className="text-sm text-[#8e8e8e]">Всего городов</p>
              <p className="text-xl font-semibold text-[#2c2c33]">{cities.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e3e3e3] rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-[#e8f5e8] rounded-lg mr-3">
              <MapPin className="h-5 w-5 text-[#22c55e]" />
            </div>
            <div>
              <p className="text-sm text-[#8e8e8e]">Активные</p>
              <p className="text-xl font-semibold text-[#2c2c33]">{activeCities}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e3e3e3] rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-[#fef3c7] rounded-lg mr-3">
              <Users className="h-5 w-5 text-[#d97706]" />
            </div>
            <div>
              <p className="text-sm text-[#8e8e8e]">Всего клиентов</p>
              <p className="text-xl font-semibold text-[#2c2c33]">{totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e3e3e3] rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-[#dbeafe] rounded-lg mr-3">
              <ShoppingCart className="h-5 w-5 text-[#3b82f6]" />
            </div>
            <div>
              <p className="text-sm text-[#8e8e8e]">Всего заказов</p>
              <p className="text-xl font-semibold text-[#2c2c33]">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e3e3e3] rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-[#ecfdf5] rounded-lg mr-3">
              <TrendingUp className="h-5 w-5 text-[#10b981]" />
            </div>
            <div>
              <p className="text-sm text-[#8e8e8e]">Общая выручка</p>
              <p className="text-xl font-semibold text-[#2c2c33]">{totalRevenue.toLocaleString("ru-RU")} ₽</p>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white border border-[#e3e3e3] rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8e8e8e] h-4 w-4" />
              <input
                type="text"
                placeholder="Поиск по названию или региону..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#e3e3e3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
              className="px-4 py-2 border border-[#e3e3e3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center px-3 py-2 bg-white border border-[#e3e3e3] text-[#2c2c33] rounded-lg hover:bg-[#f8f9fa] transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Импорт
              </button>

              <button
                onClick={handleExportCities}
                className="flex items-center px-3 py-2 bg-white border border-[#e3e3e3] text-[#2c2c33] rounded-lg hover:bg-[#f8f9fa] transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-[#2055a4] text-white rounded-lg hover:bg-[#1a4a94] transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить город
          </button>
        </div>
      </div>

      {/* Таблица с расширенной информацией */}
      <div className="bg-white border border-[#e3e3e3] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e3e3e3]">
          <h3 className="text-lg font-medium text-[#2c2c33]">Список городов с статистикой</h3>
        </div>

        {filteredCities.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-[#8e8e8e] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#2c2c33] mb-2">Города не найдены</h3>
            <p className="text-[#8e8e8e] mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Попробуйте изменить параметры поиска"
                : "Добавьте первый город в справочник"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-[#2055a4] text-white rounded-lg hover:bg-[#1a4a94] transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить город
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8f9fa]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider">
                    Регион
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider">
                    Клиенты
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider">
                    Заказы
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider">
                    Выручка
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#8e8e8e] uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e3e3]">
                {filteredCities.map((city, index) => (
                  <tr key={city.id} className={index % 2 === 0 ? "bg-white" : "bg-[#f8f9fa]"}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#2c2c33]">{city.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8e8e8e]">{city.region}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#2c2c33]">{city.clientsCount || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#2c2c33]">{city.ordersCount || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#2c2c33]">{(city.totalRevenue || 0).toLocaleString("ru-RU")} ₽</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleCityStatus(city.id)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          city.isActive
                            ? "bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0]"
                            : "bg-[#fef2f2] text-[#991b1b] hover:bg-[#fecaca]"
                        } transition-colors`}
                      >
                        {city.isActive ? "Активный" : "Неактивный"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openStatisticsModal(city.id)}
                          className="text-[#10b981] hover:text-[#059669] p-1 rounded transition-colors"
                          title="Статистика"
                        >
                          <TrendingUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(city)}
                          className="text-[#2055a4] hover:text-[#1a4a94] p-1 rounded transition-colors"
                          title="Редактировать"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(city)}
                          className="text-[#ef4444] hover:text-[#dc2626] p-1 rounded transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модальные окна */}
      <AddCityModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingCity(null)
        }}
        onAdd={editingCity ? handleEditCity : handleAddCity}
        editingCity={editingCity}
      />

      <DeleteCityModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeleteingCity(null)
        }}
        onConfirm={handleDeleteCity}
        cityName={deletingCity?.name || ""}
      />

      <ImportCitiesModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportCities}
      />

      <CityStatisticsModal
        isOpen={isStatisticsModalOpen}
        onClose={() => {
          setIsStatisticsModalOpen(false)
          setSelectedCityForStats(null)
        }}
        cityId={selectedCityForStats}
      />
    </div>
  )
}
