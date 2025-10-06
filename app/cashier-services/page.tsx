"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Minus, Check } from "lucide-react"

interface Service {
  id: number
  name: string
  price: number
  category: string
  description: string
  isActive: boolean
}

interface SelectedService {
  id: number
  name: string
  price: number
  quantity: number
}

const mockServices: Service[] = [
  {
    id: 1,
    name: "Название услуги",
    price: 1290,
    category: "cleaning",
    description: "Описание услуги",
    isActive: true,
  },
  {
    id: 2,
    name: "Название услуги",
    price: 1290,
    category: "cleaning",
    description: "Описание услуги",
    isActive: true,
  },
  {
    id: 3,
    name: "Название услуги",
    price: 1290,
    category: "cleaning",
    description: "Описание услуги",
    isActive: true,
  },
  {
    id: 4,
    name: "Название услуги",
    price: 1290,
    category: "cleaning",
    description: "Описание услуги",
    isActive: true,
  },
  {
    id: 5,
    name: "Название услуги",
    price: 1290,
    category: "cleaning",
    description: "Описание услуги",
    isActive: true,
  },
  {
    id: 6,
    name: "Название услуги",
    price: 1290,
    category: "cleaning",
    description: "Описание услуги",
    isActive: true,
  },
  {
    id: 7,
    name: "Название услуги",
    price: 1290,
    category: "washing",
    description: "Описание услуги",
    isActive: true,
  },
  {
    id: 8,
    name: "Название услуги",
    price: 1290,
    category: "washing",
    description: "Описание услуги",
    isActive: true,
  },
]

const categories = [
  { id: "all", name: "Все категории" },
  { id: "cleaning", name: "Химчистка" },
  { id: "washing", name: "Стирка" },
  { id: "ironing", name: "Глажка" },
  { id: "repair", name: "Ремонт" },
]

export default function CashierServicesPage() {
  const router = useRouter()
  const [services] = useState<Service[]>(mockServices)
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    return matchesSearch && matchesCategory && service.isActive
  })

  const handleServiceSelect = (service: Service) => {
    const existingService = selectedServices.find((s) => s.id === service.id)
    if (existingService) {
      // Если услуга уже выбрана, увеличиваем количество
      setSelectedServices(selectedServices.map((s) => (s.id === service.id ? { ...s, quantity: s.quantity + 1 } : s)))
    } else {
      // Добавляем новую услугу
      setSelectedServices([
        ...selectedServices,
        {
          id: service.id,
          name: service.name,
          price: service.price,
          quantity: 1,
        },
      ])
    }
  }

  const handleQuantityChange = (serviceId: number, change: number) => {
    setSelectedServices((prev) => {
      return prev
        .map((service) => {
          if (service.id === serviceId) {
            const newQuantity = service.quantity + change
            return newQuantity > 0 ? { ...service, quantity: newQuantity } : null
          }
          return service
        })
        .filter(Boolean) as SelectedService[]
    })
  }

  const getServiceQuantity = (serviceId: number) => {
    const service = selectedServices.find((s) => s.id === serviceId)
    return service ? service.quantity : 0
  }

  const isServiceSelected = (serviceId: number) => {
    return selectedServices.some((s) => s.id === serviceId)
  }

  const getTotalAmount = () => {
    return selectedServices.reduce((total, service) => total + service.price * service.quantity, 0)
  }

  const handleProceedToCheckout = () => {
    // Сохраняем выбранные услуги в localStorage или передаем через состояние
    localStorage.setItem("selectedServices", JSON.stringify(selectedServices))
    router.push("/create-order")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Услуги</h1>
          </div>
          <button className="bg-[#2055a4] text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#1a4590] transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Создать услугу
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск по каталогу и категориям"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
          />
        </div>

        {/* Help text */}
        <p className="text-gray-500 text-center mb-8">
          Для начала работы добавьте товары в каталог, отсканировав штрих-код или по поиску
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {filteredServices.map((service) => {
            const quantity = getServiceQuantity(service.id)
            const isSelected = isServiceSelected(service.id)

            return (
              <div
                key={service.id}
                className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#2055a4] bg-[#2055a4] text-white"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => handleServiceSelect(service)}
              >
                {/* Service content */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-medium ${isSelected ? "text-white" : "text-gray-900"}`}>{service.name}</h3>
                  {isSelected && (
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-lg font-bold ${isSelected ? "text-white" : "text-[#2055a4]"}`}>
                    {service.price.toLocaleString()} ₽
                  </span>

                  {quantity > 0 && (
                    <div
                      className="flex items-center bg-white rounded-full px-3 py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleQuantityChange(service.id, -1)}
                        className="text-[#2055a4] hover:bg-gray-100 rounded-full p-1 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="mx-2 font-medium text-[#2055a4] min-w-[20px] text-center">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(service.id, 1)}
                        className="text-[#2055a4] hover:bg-gray-100 rounded-full p-1 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Checkout Button */}
        {selectedServices.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
            <button
              onClick={handleProceedToCheckout}
              className="bg-[#2055a4] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#1a4590] transition-colors shadow-lg"
            >
              Перейти к оформлению ({getTotalAmount().toLocaleString()} ₽)
            </button>
          </div>
        )}

        {/* Empty state */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Услуги не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
