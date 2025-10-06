"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Camera, Calendar, Plus, Trash2 } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import type { Client, OrderService, ServiceImage } from "@/types"
import AddImageModal from "@/components/modals/AddImageModal"
import ServiceSearchModal from "@/components/modals/ServiceSearchModal"
import DatePicker from "@/components/DatePicker"

export default function CreateLegalOrder() {
  const router = useRouter()
  const { showNotification } = useNotification()
  const { clients, services, addOrder, getClientServices, calculateServicePrice } = useAppContext()

  // Client search and selection
  const [searchTerm, setSearchTerm] = useState("")
  const [showClientSearch, setShowClientSearch] = useState(false)
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Order services state
  const [orderServices, setOrderServices] = useState<OrderService[]>([])
  const [nextServiceId, setNextServiceId] = useState(1)
  const [comments, setComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Modals state
  const [showAddImageModal, setShowAddImageModal] = useState(false)
  const [showServiceSearchModal, setShowServiceSearchModal] = useState(false)
  const [currentServiceId, setCurrentServiceId] = useState<number | null>(null)

  // Умный поиск клиентов (после 2 символов)
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setFilteredClients([])
      setShowClientSearch(false)
      return
    }

    const filtered = clients.filter((client) => {
      if (client.type !== "legal") return false

      const companyName = client.companyName?.toLowerCase() || ""
      const phone = client.phone.toLowerCase()
      const searchLower = searchTerm.toLowerCase()

      return companyName.includes(searchLower) || phone.includes(searchLower)
    })

    setFilteredClients(filtered)
    setShowClientSearch(filtered.length > 0)
  }, [searchTerm, clients])

  // Handle clicks outside search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowClientSearch(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Выбор клиента из поиска
  const handleSelectClient = (client: Client) => {
    setSelectedClient(client)
    setSearchTerm(client.companyName || "")
    setShowClientSearch(false)

    // Автоматически загружаем услуги клиента
    loadClientServices(client.id)
  }

  // Загрузка услуг клиента
  const loadClientServices = (clientId: number) => {
    const clientServices = getClientServices(clientId)
    const loadedServices: OrderService[] = clientServices.map((service, index) => {
      // Рассчитываем цену с учетом корпоративного прайса
      const priceCalculation = calculateServicePrice(service.id, 1, "legal")

      return {
        id: index + 1,
        serviceId: service.id,
        serviceName: service.name,
        quantity: 1,
        price: priceCalculation.finalPrice,
        originalPrice: priceCalculation.originalPrice,
        total: priceCalculation.finalPrice,
        originalTotal: priceCalculation.originalPrice,
        appliedPromotion: priceCalculation.appliedPromotion
          ? {
              promotionId: priceCalculation.appliedPromotion.id,
              promotionName: priceCalculation.appliedPromotion.name,
              discountAmount: priceCalculation.appliedPromotion.discountAmount,
              discountType: priceCalculation.appliedPromotion.discountType,
            }
          : undefined,
        images: [],
        readyDate: formatDate(new Date()),
      }
    })

    setOrderServices(loadedServices)
    setNextServiceId(loadedServices.length + 1)
  }

  // Handle service quantity change
  const handleQuantityChange = (id: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    const quantity = numericValue ? Number.parseInt(numericValue, 10) : 1

    setOrderServices(
      orderServices.map((service) => {
        if (service.id === id) {
          const priceCalculation = calculateServicePrice(service.serviceId, quantity, "legal")

          return {
            ...service,
            quantity,
            price: priceCalculation.finalPrice / quantity,
            originalPrice: priceCalculation.originalPrice / quantity,
            total: priceCalculation.finalPrice,
            originalTotal: priceCalculation.originalPrice,
            appliedPromotion: priceCalculation.appliedPromotion
              ? {
                  promotionId: priceCalculation.appliedPromotion.id,
                  promotionName: priceCalculation.appliedPromotion.name,
                  discountAmount: priceCalculation.appliedPromotion.discountAmount,
                  discountType: priceCalculation.appliedPromotion.discountType,
                }
              : undefined,
          }
        }
        return service
      }),
    )
  }

  // Handle service removal
  const handleRemoveService = (id: number) => {
    setOrderServices(orderServices.filter((service) => service.id !== id))
  }

  // Handle service selection from search modal
  const handleServiceSelect = (serviceId: number, serviceName: string, price: number) => {
    const priceCalculation = calculateServicePrice(serviceId, 1, "legal")

    const newService: OrderService = {
      id: nextServiceId,
      serviceId: serviceId,
      serviceName: serviceName,
      quantity: 1,
      price: priceCalculation.finalPrice,
      originalPrice: priceCalculation.originalPrice,
      total: priceCalculation.finalPrice,
      originalTotal: priceCalculation.originalPrice,
      appliedPromotion: priceCalculation.appliedPromotion
        ? {
            promotionId: priceCalculation.appliedPromotion.id,
            promotionName: priceCalculation.appliedPromotion.name,
            discountAmount: priceCalculation.appliedPromotion.discountAmount,
            discountType: priceCalculation.appliedPromotion.discountType,
          }
        : undefined,
      images: [],
      readyDate: formatDate(new Date()),
    }

    setOrderServices([...orderServices, newService])
    setNextServiceId(nextServiceId + 1)
    setShowServiceSearchModal(false)
  }

  // Handle ready date change
  const handleReadyDateChange = (serviceId: number, date: Date) => {
    setOrderServices(
      orderServices.map((service) => {
        if (service.id === serviceId) {
          return { ...service, readyDate: formatDate(date) }
        }
        return service
      }),
    )
  }

  // Handle image add
  const handleAddImage = (serviceId: number, images: ServiceImage[]) => {
    setOrderServices(
      orderServices.map((service) => {
        if (service.id === serviceId) {
          return { ...service, images: [...service.images, ...images] }
        }
        return service
      }),
    )
    setShowAddImageModal(false)
  }

  // Format date for display
  const formatDate = (date: Date): string => {
    if (!date || isNaN(date.getTime())) {
      return ""
    }

    try {
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    } catch (error) {
      console.warn("Error formatting date:", error)
      return ""
    }
  }

  // Calculate total amount
  const calculateTotal = () => {
    return orderServices.reduce((total, service) => total + service.total, 0)
  }

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedClient) {
      showNotification("Выберите клиента", "error")
      return
    }

    if (orderServices.length === 0) {
      showNotification("Добавьте хотя бы одну услугу", "error")
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        clientId: selectedClient.id,
        services: orderServices,
        totalAmount: calculateTotal(),
        discount: 0,
        discountedAmount: calculateTotal(),
        comments,
        isCashless: true, // Всегда безналичный расчет для юр. лиц
        appliedPromotions: [],
      }

      const order = addOrder(orderData)

      showNotification(`Заказ №${order.id} успешно создан для ${selectedClient.companyName}`, "success")

      // Перенаправляем на страницу заказов
      router.push("/orders")
    } catch (error) {
      console.error("Ошибка при создании заказа:", error)
      showNotification("Произошла ошибка при создании заказа", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2c2c33] mb-2">Оформление заказа для юридического лица</h1>
        <p className="text-gray-600">Выберите корпоративного клиента из базы данных</p>
      </div>

      {/* Client Search Section */}
      <div className="bg-[#f7f7f7] rounded-lg p-6 mb-6">
        <h2 className="text-[#2c2c33] text-lg mb-4">Поиск клиента</h2>

        <div className="relative mb-6" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Введите название компании или телефон (минимум 2 символа)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-[#2055a4] focus:border-[#2055a4]"
          />

          {showClientSearch && filteredClients.length > 0 && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelectClient(client)}
                >
                  <div className="font-medium text-[#2c2c33]">{client.companyName}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {client.surname} {client.name} {client.patronymic}
                  </div>
                  <div className="text-sm text-gray-500">{client.phone}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Client Information */}
        {selectedClient && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Информация о клиенте</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Наименование клиента</label>
                <div className="text-sm font-medium">{selectedClient.companyName}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Телефон</label>
                <div className="text-sm">{selectedClient.phone}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Фамилия</label>
                <div className="text-sm">{selectedClient.surname}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Имя</label>
                <div className="text-sm">{selectedClient.name}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Отчество</label>
                <div className="text-sm">{selectedClient.patronymic}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Юридическое наименование</label>
                <div className="text-sm">{selectedClient.companyName}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Services Section */}
      {selectedClient && (
        <div className="bg-[#f7f7f7] rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#2c2c33] text-lg">Услуги</h2>
            <button
              onClick={() => setShowServiceSearchModal(true)}
              className="flex items-center px-4 py-2 bg-[#2055a4] text-white rounded-lg hover:bg-[#1a4a8f] transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить услугу
            </button>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="text-left text-[#8e8e8e] text-sm border-b border-gray-200">
                  <th className="pb-3 px-4 font-normal w-16">№</th>
                  <th className="pb-3 px-4 font-normal">Наименование услуги</th>
                  <th className="pb-3 px-4 font-normal w-24">Кол-во</th>
                  <th className="pb-3 px-4 font-normal w-24">Цена</th>
                  <th className="pb-3 px-4 font-normal w-24">Итого</th>
                  <th className="pb-3 px-4 font-normal w-24">Фото</th>
                  <th className="pb-3 px-4 font-normal w-32">Дата готовности</th>
                  <th className="pb-3 px-4 font-normal w-12"></th>
                </tr>
              </thead>
              <tbody>
                {orderServices.map((service, index) => (
                  <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm">{index + 1}</td>
                    <td className="py-4 px-4 text-sm font-medium">{service.serviceName}</td>
                    <td className="py-4 px-4 text-sm">
                      <input
                        type="number"
                        min="1"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#2055a4] focus:border-[#2055a4]"
                        value={service.quantity}
                        onChange={(e) => handleQuantityChange(service.id, e.target.value)}
                      />
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <div className="flex flex-col">
                        {service.appliedPromotion && service.originalPrice ? (
                          <>
                            <span className="line-through text-gray-400 text-xs">{service.originalPrice} ₽</span>
                            <span className="text-green-600 font-medium">{service.price} ₽</span>
                          </>
                        ) : (
                          <span>{service.price} ₽</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium">
                      <div className="flex flex-col">
                        {service.appliedPromotion && service.originalTotal ? (
                          <>
                            <span className="line-through text-gray-400 text-xs">{service.originalTotal} ₽</span>
                            <span className="text-green-600 font-medium">{service.total} ₽</span>
                          </>
                        ) : (
                          <span>{service.total} ₽</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {service.images.length > 0 ? (
                        <div
                          className="w-8 h-8 bg-[#2055a4] rounded-full flex items-center justify-center text-white text-xs cursor-pointer"
                          onClick={() => {
                            setCurrentServiceId(service.id)
                            setShowAddImageModal(true)
                          }}
                        >
                          {service.images.length}
                        </div>
                      ) : (
                        <div
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                          onClick={() => {
                            setCurrentServiceId(service.id)
                            setShowAddImageModal(true)
                          }}
                        >
                          <Camera className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <DatePicker
                        value={service.readyDate}
                        onChange={(date) => handleReadyDateChange(service.id, date)}
                        className="w-full"
                        icon={<Calendar className="h-4 w-4 text-gray-400" />}
                      />
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <button
                        onClick={() => handleRemoveService(service.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td colSpan={4} className="py-4 px-4 text-sm font-medium text-right">
                    Общая стоимость:
                  </td>
                  <td className="py-4 px-4 text-lg font-bold text-[#2055a4]">{calculateTotal()} ₽</td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {orderServices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg mb-2">Услуги не добавлены</div>
              <div className="text-sm">
                {selectedClient.assignedServices && selectedClient.assignedServices.length > 0
                  ? "Услуги клиента загружены автоматически"
                  : "У данного клиента нет закрепленных услуг"}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payment and Order Section */}
      {selectedClient && (
        <div className="bg-[#f7f7f7] rounded-lg p-6">
          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-[#2c2c33] text-lg mb-4">Оплата</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="invoice"
                checked={true}
                disabled
                className="h-4 w-4 text-[#2055a4] focus:ring-[#2055a4] border-gray-300 rounded mr-3"
              />
              <label htmlFor="invoice" className="text-sm text-[#2c2c33]">
                Счет (обязательно для юридических лиц)
              </label>
            </div>
          </div>

          {/* Comments */}
          <div className="mb-6">
            <label htmlFor="comments" className="block text-sm font-medium text-[#2c2c33] mb-2">
              Комментарий к заказу
            </label>
            <textarea
              id="comments"
              placeholder="Дополнительная информация по заказу..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2055a4] focus:border-[#2055a4]"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedClient || orderServices.length === 0}
              className={`${
                isSubmitting || !selectedClient || orderServices.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2055a4] hover:bg-[#1a4a8f]"
              } text-white px-8 py-3 rounded-lg transition-colors flex items-center text-lg font-medium`}
            >
              {isSubmitting && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isSubmitting ? "Оформление заказа..." : "Оформить заказ"}
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddImageModal && currentServiceId && (
        <AddImageModal
          onClose={() => {
            setShowAddImageModal(false)
            setCurrentServiceId(null)
          }}
          onAdd={(images) => {
            if (currentServiceId) {
              handleAddImage(currentServiceId, images)
            }
            setShowAddImageModal(false)
            setCurrentServiceId(null)
          }}
        />
      )}

      {showServiceSearchModal && (
        <ServiceSearchModal
          services={services}
          onClose={() => setShowServiceSearchModal(false)}
          onSelect={handleServiceSelect}
        />
      )}
    </div>
  )
}
