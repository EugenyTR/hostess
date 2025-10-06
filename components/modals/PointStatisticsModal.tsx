"use client"

import { X, Building, Users, ShoppingCart, DollarSign, Calendar, TrendingUp } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { BarChart } from "@/components/charts/BarChart"
import { LineChart } from "@/components/charts/LineChart"
import type { Point } from "@/types"

interface PointStatisticsModalProps {
  isOpen: boolean
  onClose: () => void
  point: Point | null
}

export function PointStatisticsModal({ isOpen, onClose, point }: PointStatisticsModalProps) {
  const { getPointStatistics } = useAppContext()

  if (!isOpen || !point) return null

  // Генерируем детальную статистику для точки
  const generateDetailedStats = (point: Point) => {
    const baseStats = {
      pointName: point.name,
      organizationType: point.organizationType,
      clientsCount: Math.floor(Math.random() * 200) + 80,
      ordersCount: Math.floor(Math.random() * 150) + 70,
      totalRevenue: Math.floor(Math.random() * 400000) + 300000,
      employeesCount: Math.floor(Math.random() * 8) + 5,
      lastOrderDate: "2023-12-15",
    }

    const averageOrderValue = Math.floor(baseStats.totalRevenue / baseStats.ordersCount)

    const monthlyRevenue = [
      { month: "Янв", revenue: Math.floor(Math.random() * 50000) + 40000 },
      { month: "Фев", revenue: Math.floor(Math.random() * 55000) + 45000 },
      { month: "Мар", revenue: Math.floor(Math.random() * 60000) + 50000 },
      { month: "Апр", revenue: Math.floor(Math.random() * 65000) + 55000 },
      { month: "Май", revenue: Math.floor(Math.random() * 70000) + 60000 },
      { month: "Июн", revenue: Math.floor(Math.random() * 75000) + 65000 },
    ]

    const topServices = [
      { serviceName: "Химчистка куртки", count: Math.floor(Math.random() * 20) + 30 },
      { serviceName: "Химчистка костюма", count: Math.floor(Math.random() * 15) + 20 },
      { serviceName: "Глажка рубашки", count: Math.floor(Math.random() * 25) + 35 },
      { serviceName: "Стирка белья", count: Math.floor(Math.random() * 18) + 25 },
      { serviceName: "Химчистка пальто", count: Math.floor(Math.random() * 12) + 15 },
    ].sort((a, b) => b.count - a.count)

    return {
      ...baseStats,
      averageOrderValue,
      monthlyRevenue,
      topServices,
    }
  }

  const stats = getPointStatistics ? getPointStatistics(point.id) : generateDetailedStats(point)

  const getOrganizationTypeText = (type: "own" | "franchise") => {
    return type === "own" ? "Собственная сеть" : "Франчайзи"
  }

  const getOrganizationTypeColor = (type: "own" | "franchise") => {
    return type === "own" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
  }

  // Подготавливаем данные для графиков
  const revenueData = stats.monthlyRevenue.map((item) => ({
    name: item.month,
    value: item.revenue,
  }))

  const servicesData = stats.topServices.slice(0, 3).map((service) => ({
    name: service.serviceName,
    value: service.count,
  }))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#2c2c33] flex items-center gap-2">
              <Building size={24} />
              Статистика точки
            </h2>
            <p className="text-[#8e8e8e] mt-1">{stats.pointName}</p>
          </div>
          <button onClick={onClose} className="text-[#8e8e8e] hover:text-[#2c2c33] transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#f8f9fa] rounded-lg p-4">
            <h3 className="font-semibold text-[#2c2c33] mb-3">Основная информация</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8e8e8e]">Название:</span>
                <span className="text-[#2c2c33] font-medium">{point.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8e8e]">Тип:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getOrganizationTypeColor(
                    stats.organizationType,
                  )}`}
                >
                  {getOrganizationTypeText(stats.organizationType)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8e8e]">Телефон:</span>
                <span className="text-[#2c2c33]">{point.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8e8e]">Адрес:</span>
                <span className="text-[#2c2c33] text-right text-sm">{point.address.fullAddress}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#f8f9fa] rounded-lg p-4">
            <h3 className="font-semibold text-[#2c2c33] mb-3">Последняя активность</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8e8e8e]">Последний заказ:</span>
                <span className="text-[#2c2c33]">{stats.lastOrderDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8e8e]">Сотрудников:</span>
                <span className="text-[#2c2c33] font-medium">{stats.employeesCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Статистические карточки */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Клиенты</p>
                <p className="text-2xl font-bold">{stats.clientsCount}</p>
              </div>
              <Users size={32} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Заказы</p>
                <p className="text-2xl font-bold">{stats.ordersCount}</p>
              </div>
              <ShoppingCart size={32} className="text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Выручка</p>
                <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} ₽</p>
              </div>
              <DollarSign size={32} className="text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Средний чек</p>
                <p className="text-2xl font-bold">{Math.round(stats.averageOrderValue).toLocaleString()} ₽</p>
              </div>
              <TrendingUp size={32} className="text-orange-200" />
            </div>
          </div>
        </div>

        {/* Графики */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-[#e0e0e0] rounded-lg p-4">
            <h3 className="font-semibold text-[#2c2c33] mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Выручка по месяцам
            </h3>
            <div className="h-48">
              <LineChart data={revenueData} height={200} />
            </div>
          </div>

          <div className="bg-white border border-[#e0e0e0] rounded-lg p-4">
            <h3 className="font-semibold text-[#2c2c33] mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Топ услуги
            </h3>
            <div className="h-48">
              <BarChart data={servicesData} height={200} />
            </div>
          </div>
        </div>

        {/* Популярные услуги */}
        <div className="bg-[#f8f9fa] rounded-lg p-4">
          <h3 className="font-semibold text-[#2c2c33] mb-3">Популярные услуги</h3>
          <div className="space-y-2">
            {stats.topServices.map((service, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <span className="text-[#2c2c33]">{service.serviceName}</span>
                <span className="bg-[#2196f3] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {service.count}
                </span>
              </div>
            ))}
            {stats.topServices.length === 0 && <p className="text-[#8e8e8e] text-center py-4">Нет данных об услугах</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
