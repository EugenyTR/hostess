"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Download, Edit, Trash2, Tag, Upload } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useAuth } from "@/context/AuthContext"
import type { Service, ServiceCategory } from "@/types"
import DeleteServiceModal from "@/components/modals/DeleteServiceModal"
import AddServiceModal from "@/components/modals/AddServiceModal"
import ImportServicesModal from "@/components/modals/ImportServicesModal"

// Моковые данные для категорий
const mockCategories: ServiceCategory[] = [
  { id: "leather", name: "Кожа", isActive: true },
  { id: "casual", name: "Повседневная одежда", isActive: true },
  { id: "fur", name: "Мех", isActive: true },
  { id: "home", name: "Домашний текстиль", isActive: true },
  { id: "bags", name: "Сумки", isActive: true },
  { id: "laundry", name: "Прачечные услуги", isActive: true },
  { id: "chemistry1", name: "Химия 1", isActive: true },
  { id: "chemistry2", name: "Химия 2", isActive: true },
  { id: "chemistry3", name: "Химия 3", isActive: true },
  { id: "chemistry4", name: "Химия 4", isActive: true },
  { id: "chemistry5", name: "Химия 5", isActive: true },
]

export default function ServiceListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { services, addService, updateService, deleteService, promotions, getActivePromotions } = useAppContext()
  const [categories] = useState<ServiceCategory[]>(mockCategories)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const itemsPerPage = 10

  // Redirect cashiers to the cashier-specific service selection page
  useEffect(() => {
    if (user?.role === "cashier") {
      router.push("/cashier-services")
    }
  }, [user, router])

  // If user is cashier, show loading while redirecting
  if (user?.role === "cashier") {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const activePromotions = getActivePromotions()

  // Получаем услуги с информацией об акциях
  const getServicesWithPromotions = () => {
    return services.map((service) => {
      // Сначала проверяем прямую связь через promotionId
      let promotion = activePromotions.find((p) => p.id === service.promotionId)

      // Если нет прямой связи, ищем по applicableServices
      if (!promotion) {
        promotion = activePromotions.find((p) => p.applicableServices.includes(service.id))
      }

      if (promotion) {
        return {
          ...service,
          currentPromotion: {
            promotionId: promotion.id,
            promotionName: promotion.name,
            discountAmount: promotion.discountAmount,
            discountType: promotion.discountType,
            startDate: promotion.startDate,
            endDate: promotion.endDate,
          },
        }
      }
      return service
    })
  }

  const servicesWithPromotions = getServicesWithPromotions()

  // Фильтрация услуг по категории и поиску
  const filteredServices = servicesWithPromotions.filter((service) => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Пагинация
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage)

  const handleDeleteClick = (id: number) => {
    setServiceToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleEditClick = (service: Service) => {
    setEditingService(service)
    setIsAddModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (serviceToDelete !== null) {
      deleteService(serviceToDelete)
      setIsDeleteModalOpen(false)
      setServiceToDelete(null)
    }
  }

  const handleToggleStatus = (id: number) => {
    const service = services.find((s) => s.id === id)
    if (service) {
      updateService({ ...service, isActive: !service.isActive })
    }
  }

  const handleSaveService = (serviceData: {
    id?: number
    name: string
    category: string
    basePrice: number
    markup: number
    description: string
    promotionId?: number
  }) => {
    if (serviceData.id) {
      // Редактирование существующей услуги
      const existingService = services.find((s) => s.id === serviceData.id)
      if (existingService) {
        updateService({
          ...existingService,
          name: serviceData.name,
          category: serviceData.category,
          price: serviceData.basePrice * (1 + serviceData.markup / 100),
          basePrice: serviceData.basePrice,
          markup: serviceData.markup,
          description: serviceData.description,
          promotionId: serviceData.promotionId,
          updatedAt: new Date().toISOString(),
        })
      }
    } else {
      // Добавление новой услуги
      addService({
        name: serviceData.name,
        category: serviceData.category,
        price: serviceData.basePrice * (1 + serviceData.markup / 100),
        basePrice: serviceData.basePrice,
        markup: serviceData.markup,
        description: serviceData.description,
        promotionId: serviceData.promotionId,
      })
    }

    setIsAddModalOpen(false)
    setEditingService(null)
  }

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
    setEditingService(null)
  }

  const handleImportServices = (importedServices: any[]) => {
    // Добавляем импортированные услуги
    importedServices.forEach((serviceData) => {
      addService({
        name: serviceData.name,
        category: serviceData.category,
        price: serviceData.price,
        basePrice: serviceData.basePrice || serviceData.price,
        markup: serviceData.markup || 0,
        description: serviceData.description || "",
      })
    })

    console.log(`Импортировано ${importedServices.length} услуг`)
  }

  // Функция экспорта услуг в Excel
  const handleExportToExcel = () => {
    try {
      // Подготавливаем данные для экспорта
      const exportData = filteredServices.map((service) => ({
        "Название услуги": service.name,
        Категория: service.category,
        "Цена (₽)": service.price,
        "Цена со скидкой (₽)": service.currentPromotion
          ? service.currentPromotion.discountType === "percentage"
            ? Math.round(service.price * (1 - service.currentPromotion.discountAmount / 100))
            : service.price - service.currentPromotion.discountAmount
          : service.price,
        "Активная акция": service.currentPromotion ? service.currentPromotion.promotionName : "Нет",
        "Размер скидки": service.currentPromotion
          ? `${service.currentPromotion.discountAmount}${service.currentPromotion.discountType === "percentage" ? "%" : "₽"}`
          : "Нет",
        Описание: service.description,
        Статус: service.isActive ? "Активна" : "Неактивна",
        "Дата создания": service.createdAt,
        "Дата обновления": service.updatedAt,
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
      link.setAttribute("download", `services_export_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log(`Экспортировано ${exportData.length} услуг в CSV файл`)
    } catch (error) {
      console.error("Ошибка при экспорте услуг:", error)
      alert("Произошла ошибка при экспорте данных")
    }
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Заголовок и кнопки */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#2c2c33]">Услуги</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Импорт
          </button>
          <button
            onClick={handleExportToExcel}
            className="flex items-center px-4 py-2 bg-[#2055a4] text-white rounded-lg hover:bg-[#1a4590] transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#2055a4] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1a4590] transition-colors"
          >
            <Plus size={20} />
            Создать услугу
          </button>
        </div>
      </div>

      {/* Категории */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => {
            setSelectedCategory("all")
            setCurrentPage(1)
          }}
          className={`px-4 py-2 rounded-full border transition-colors ${
            selectedCategory === "all"
              ? "bg-[#2055a4] text-white border-[#2055a4]"
              : "bg-white text-[#2c2c33] border-gray-300 hover:border-[#2055a4] hover:text-[#2055a4]"
          }`}
        >
          Все категории
        </button>
        {categories
          .filter((cat) => ["leather", "casual", "fur", "home", "bags", "laundry"].includes(cat.id))
          .map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedCategory === category.id
                  ? "bg-[#2055a4] text-white border-[#2055a4]"
                  : "bg-white text-[#2c2c33] border-gray-300 hover:border-[#2055a4] hover:text-[#2055a4]"
              }`}
            >
              {category.name}
            </button>
          ))}
      </div>

      {/* Поиск */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Поиск услуги"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
        />
      </div>

      {/* Таблица услуг */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Наименование услуги
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Акция</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedServices.map((service) => {
              const hasPromotion = !!service.currentPromotion
              const discountedPrice = hasPromotion
                ? service.currentPromotion.discountType === "percentage"
                  ? Math.round(service.price * (1 - service.currentPromotion.discountAmount / 100))
                  : service.price - service.currentPromotion.discountAmount
                : service.price

              return (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2c2c33]">{service.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#2c2c33]">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2c2c33]">
                    <div className="flex items-center space-x-2">
                      {hasPromotion ? (
                        <>
                          <span className="line-through text-gray-400">{service.price} ₽</span>
                          <span className="font-medium text-green-600">{discountedPrice} ₽</span>
                        </>
                      ) : (
                        <span>{service.price} ₽</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {hasPromotion ? (
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-green-600 mr-1" />
                        <div>
                          <div className="text-sm font-medium text-green-600">
                            {service.currentPromotion.promotionName}
                          </div>
                          <div className="text-xs text-gray-500">
                            -{service.currentPromotion.discountAmount}
                            {service.currentPromotion.discountType === "percentage" ? "%" : "₽"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Нет акций</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(service.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        service.isActive
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {service.isActive ? "Активен" : "Деактивирован"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleEditClick(service)}
                        className="text-gray-400 hover:text-[#2055a4] transition-colors"
                        title="Редактировать"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(service.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ←
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === pageNum
                    ? "bg-[#2055a4] text-white"
                    : "border border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            )
          })}

          {totalPages > 5 && (
            <>
              <span className="px-2 text-gray-500">...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-[#2055a4] text-white"
                    : "border border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>
      )}

      {/* Модальные окна */}
      <DeleteServiceModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveService}
        categories={categories}
        editingService={editingService}
      />

      <ImportServicesModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportServices}
      />
    </div>
  )
}
