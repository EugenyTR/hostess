"use client"

import { useState } from "react"
import { X, Search, Plus } from "lucide-react"
import type { Service } from "@/types"

interface ServiceSearchModalProps {
  services: Service[]
  onClose: () => void
  onSelect: (serviceId: number, serviceName: string, price: number) => void
}

export default function ServiceSearchModal({ services, onClose, onSelect }: ServiceSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newServiceName, setNewServiceName] = useState("")
  const [newServicePrice, setNewServicePrice] = useState("")
  const [newServiceCategory, setNewServiceCategory] = useState("Повседневная одежда")

  // Group services by category
  const groupedServices = services.reduce<Record<string, Service[]>>((acc, service) => {
    const category = service.category || "Другое"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(service)
    return acc
  }, {})

  // Filter services based on search term
  const filteredGroups = Object.entries(groupedServices).reduce<Record<string, Service[]>>(
    (acc, [category, categoryServices]) => {
      const filtered = categoryServices.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      if (filtered.length > 0) {
        acc[category] = filtered
      }
      return acc
    },
    {},
  )

  const handleAddNewService = () => {
    if (!newServiceName || !newServicePrice) {
      alert("Пожалуйста, заполните название и цену услуги")
      return
    }

    const price = Number.parseInt(newServicePrice.replace(/[^0-9]/g, ""), 10)
    if (isNaN(price) || price <= 0) {
      alert("Пожалуйста, введите корректную цену")
      return
    }

    // Generate a temporary ID (will be replaced by the context)
    const tempId = -Date.now()
    onSelect(tempId, newServiceName, price)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[80vh] overflow-hidden flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-medium mb-6">Поиск услуги</h2>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Поиск"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white text-sm"
          />
        </div>

        {!showAddForm ? (
          <>
            <div className="overflow-y-auto flex-1">
              {Object.keys(filteredGroups).length > 0 ? (
                Object.entries(filteredGroups).map(([category, categoryServices]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-medium mb-2 bg-gray-100 p-2">{category}</h3>
                    <div className="space-y-2">
                      {categoryServices.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => onSelect(service.id, service.name, service.price)}
                        >
                          <div className="w-4 h-4 border border-gray-300 rounded-full mr-2"></div>
                          <span>{service.name}</span>
                          <span className="ml-auto">{service.price} ₽</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">Услуги не найдены</div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center text-[#2055a4] hover:text-[#1a4a8f]"
              >
                <Plus className="w-4 h-4 mr-1" /> Добавить новую услугу
              </button>
            </div>
          </>
        ) : (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-4">Добавить новую услугу</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название услуги</label>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Введите название услуги"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (₽)</label>
                <input
                  type="text"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Введите цену"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="Повседневная одежда">Повседневная одежда</option>
                  <option value="Верхняя одежда">Верхняя одежда</option>
                  <option value="Текстиль">Текстиль</option>
                  <option value="Услуги глажки">Услуги глажки</option>
                  <option value="Ремонт">Ремонт</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddNewService}
                  className="bg-[#2055a4] text-white px-4 py-2 rounded hover:bg-[#1a4a8f] transition-colors"
                >
                  Добавить
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
