"use client"

import { X, Users, ShoppingCart, TrendingUp, Calendar, Award } from "lucide-react"
import { useAppContext } from "@/context/AppContext"

interface CityStatisticsModalProps {
  isOpen: boolean
  onClose: () => void
  cityId: number | null
}

export function CityStatisticsModal({ isOpen, onClose, cityId }: CityStatisticsModalProps) {
  const { getCityById, getCityStatisticsById } = useAppContext()

  if (!isOpen || !cityId) return null

  const city = getCityById(cityId)
  const statistics = getCityStatisticsById(cityId)

  if (!city || !statistics) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#e3e3e3]">
          <h2 className="text-xl font-semibold text-[#2c2c33]">Статистика по городу: {city.name}</h2>
          <button onClick={onClose} className="text-[#8e8e8e] hover:text-[#2c2c33] transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Основная статистика */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#f8f9fa] border border-[#e3e3e3] rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-[#fef3c7] rounded-lg mr-3">
                  <Users className="h-5 w-5 text-[#d97706]" />
                </div>
                <div>
                  <p className="text-sm text-[#8e8e8e]">Клиенты</p>
                  <p className="text-xl font-semibold text-[#2c2c33]">{statistics.clientsCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#f8f9fa] border border-[#e3e3e3] rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-[#dbeafe] rounded-lg mr-3">
                  <ShoppingCart className="h-5 w-5 text-[#3b82f6]" />
                </div>
                <div>
                  <p className="text-sm text-[#8e8e8e]">Заказы</p>
                  <p className="text-xl font-semibold text-[#2c2c33]">{statistics.ordersCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#f8f9fa] border border-[#e3e3e3] rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-[#ecfdf5] rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 text-[#10b981]" />
                </div>
                <div>
                  <p className="text-sm text-[#8e8e8e]">Выручка</p>
                  <p className="text-xl font-semibold text-[#2c2c33]">
                    {statistics.totalRevenue.toLocaleString("ru-RU")} ₽
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#f8f9fa] border border-[#e3e3e3] rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-[#fef2f2] rounded-lg mr-3">
                  <Award className="h-5 w-5 text-[#ef4444]" />
                </div>
                <div>
                  <p className="text-sm text-[#8e8e8e]">Средний чек</p>
                  <p className="text-xl font-semibold text-[#2c2c33]">
                    {Math.round(statistics.averageOrderValue).toLocaleString("ru-RU")} ₽
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Информация о городе */}
            <div className="bg-[#f8f9fa] border border-[#e3e3e3] rounded-lg p-4">
              <h3 className="text-lg font-medium text-[#2c2c33] mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Информация о городе
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[#8e8e8e]">Регион:</span>
                  <span className="text-sm font-medium text-[#2c2c33]">{city.region || "Не указан"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#8e8e8e]">Статус:</span>
                  <span className={`text-sm font-medium ${city.isActive ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                    {city.isActive ? "Активный" : "Неактивный"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#8e8e8e]">Дата создания:</span>
                  <span className="text-sm font-medium text-[#2c2c33]">
                    {new Date(city.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                {statistics.lastOrderDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-[#8e8e8e]">Последний заказ:</span>
                    <span className="text-sm font-medium text-[#2c2c33]">{statistics.lastOrderDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Топ услуги */}
            <div className="bg-[#f8f9fa] border border-[#e3e3e3] rounded-lg p-4">
              <h3 className="text-lg font-medium text-[#2c2c33] mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Популярные услуги
              </h3>
              {statistics.topServices.length > 0 ? (
                <div className="space-y-3">
                  {statistics.topServices.map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-[#2055a4] text-white flex items-center justify-center text-xs mr-3">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-[#2c2c33]">{service.serviceName}</span>
                      </div>
                      <span className="text-sm text-[#8e8e8e]">{service.count} заказов</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-[#8e8e8e]">
                  <p className="text-sm">Нет данных о заказах</p>
                </div>
              )}
            </div>
          </div>

          {/* Показатели эффективности */}
          <div className="mt-6 bg-[#f8f9fa] border border-[#e3e3e3] rounded-lg p-4">
            <h3 className="text-lg font-medium text-[#2c2c33] mb-4">Показатели эффективности</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2055a4]">
                  {statistics.clientsCount > 0
                    ? Math.round((statistics.ordersCount / statistics.clientsCount) * 100) / 100
                    : 0}
                </div>
                <div className="text-sm text-[#8e8e8e]">Заказов на клиента</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10b981]">
                  {statistics.clientsCount > 0 ? Math.round(statistics.totalRevenue / statistics.clientsCount) : 0} ₽
                </div>
                <div className="text-sm text-[#8e8e8e]">Выручка на клиента</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#f59e0b]">
                  {statistics.ordersCount > 0 ? Math.round(statistics.totalRevenue / statistics.ordersCount) : 0} ₽
                </div>
                <div className="text-sm text-[#8e8e8e]">Средний чек</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-[#e3e3e3]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2055a4] text-white rounded-lg hover:bg-[#1a4a94] transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}
