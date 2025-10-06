"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit2, Calendar, MapPin, Phone, Mail, Building, User, Save, Trash2, Plus, X } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import type { Order, OrderService } from "@/types"

export default function ClientDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getClientById, getOrdersByClientId, updateOrder, services } = useAppContext()
  const [activeTab, setActiveTab] = useState<"orders" | "services">("orders")

  const clientId = Number(params.id)
  const client = getClientById(clientId)
  const orders = getOrdersByClientId(clientId)

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { addNotification } = useNotification()
  const [isMobile, setIsMobile] = useState(false)

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsEditing(false)
  }

  const handleSaveOrder = () => {
    if (selectedOrder) {
      // Пересчитываем общую сумму и сумму со скидкой
      const totalAmount = selectedOrder.services.reduce((sum, service) => sum + service.total, 0)
      const discountedAmount = totalAmount - (totalAmount * selectedOrder.discount) / 100

      const updatedOrder = {
        ...selectedOrder,
        totalAmount,
        discountedAmount,
      }

      updateOrder(updatedOrder)
      addNotification({
        type: "success",
        title: "Заказ обновлен",
        message: `Заказ №${selectedOrder.id} успешно обновлен`,
        duration: 3000,
      })
      setIsEditing(false)
      setSelectedOrder(updatedOrder)
    }
  }

  const handleAddService = () => {
    if (selectedOrder && services.length > 0) {
      const firstService = services[0]
      const newService: OrderService = {
        id: Math.max(...selectedOrder.services.map((s) => s.id), 0) + 1,
        serviceId: firstService.id,
        serviceName: firstService.name,
        quantity: 1,
        price: firstService.price,
        total: firstService.price,
        images: [],
        readyDate: new Date().toLocaleDateString("ru-RU"),
      }

      setSelectedOrder({
        ...selectedOrder,
        services: [...selectedOrder.services, newService],
        totalAmount: selectedOrder.totalAmount + newService.total,
      })
    }
  }

  const handleRemoveService = (serviceId: number) => {
    if (selectedOrder) {
      const serviceToRemove = selectedOrder.services.find((s) => s.id === serviceId)
      if (!serviceToRemove) return

      const updatedServices = selectedOrder.services.filter((s) => s.id !== serviceId)
      setSelectedOrder({
        ...selectedOrder,
        services: updatedServices,
        totalAmount: selectedOrder.totalAmount - serviceToRemove.total,
      })
    }
  }

  const handleServiceChange = (serviceId: number, field: keyof OrderService, value: any) => {
    if (selectedOrder) {
      const updatedServices = selectedOrder.services.map((service) => {
        if (service.id === serviceId) {
          const updatedService = { ...service, [field]: value }

          // Если изменилось количество или цена, пересчитываем total
          if (field === "quantity" || field === "price") {
            updatedService.total = updatedService.quantity * updatedService.price
          }

          return updatedService
        }
        return service
      })

      setSelectedOrder({
        ...selectedOrder,
        services: updatedServices,
        totalAmount: updatedServices.reduce((sum, s) => sum + s.total, 0),
      })
    }
  }

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-medium">Клиент не найден</h2>
          <button
            onClick={() => router.push("/clients")}
            className="mt-4 bg-[#2055a4] text-white px-4 py-2 rounded-full hover:bg-[#1a4a8f] transition-colors"
          >
            Вернуться к списку клиентов
          </button>
        </div>
      </div>
    )
  }

  const getOrderStatusText = (status: string): string => {
    switch (status) {
      case "completed":
        return "Выполнен"
      case "in-progress":
        return "В работе"
      case "waiting":
        return "Ожидание"
      default:
        return "Неизвестно"
    }
  }

  const getOrderStatusClass = (status: string): string => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "waiting":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-3 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center mb-6">
        <button
          onClick={() => router.push("/clients")}
          className="flex items-center text-[#2055a4] hover:text-[#1a4a8f] mb-2 md:mb-0"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Назад к списку</span>
        </button>
        <h1 className="text-xl md:text-2xl font-bold md:ml-6">
          {client.type === "individual" ? `${client.surname} ${client.name} ${client.patronymic}` : client.companyName}
        </h1>
        <button className="mt-2 md:mt-0 md:ml-auto flex items-center text-[#2055a4] hover:text-[#1a4a8f]">
          <Edit2 className="w-4 h-4 mr-1" />
          <span>Редактировать</span>
        </button>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-6">
        <div className="md:col-span-4 bg-[#f7f7f7] rounded-lg p-4 md:p-6">
          <h2 className="text-lg font-medium mb-4">Информация о клиенте</h2>

          <div className="space-y-4">
            {client.type === "legal" && (
              <div className="flex items-start">
                <Building className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Компания</div>
                  <div className="font-medium">{client.companyName}</div>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">ФИО</div>
                <div className="font-medium">
                  {client.surname} {client.name} {client.patronymic}
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">Телефон</div>
                <div className="font-medium">{client.phone}</div>
              </div>
            </div>

            {client.email && (
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{client.email}</div>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <div className="text-sm text-gray-500">Адрес</div>
                <div className="font-medium">
                  {client.address.city}, {client.address.street}, {client.address.house}
                  {client.address.apartment && `, кв. ${client.address.apartment}`}
                </div>
              </div>
            </div>

            {client.birthDate && (
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Дата рождения</div>
                  <div className="font-medium">{client.birthDate}</div>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <div className="w-5 h-5 flex items-center justify-center text-gray-400 mr-3 mt-0.5">
                <span className="text-sm">i</span>
              </div>
              <div>
                <div className="text-sm text-gray-500">Откуда о нас узнали</div>
                <div className="font-medium">{client.referralSource || "Не указано"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 bg-[#f7f7f7] rounded-lg p-4 md:p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === "orders"
                  ? "text-[#2055a4] border-b-2 border-[#2055a4]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              История заказов
            </button>
            <button
              className={`pb-2 px-4 text-sm font-medium ${
                activeTab === "services"
                  ? "text-[#2055a4] border-b-2 border-[#2055a4]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("services")}
            >
              Услуги
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h3 className="text-lg font-medium mb-4">История заказов</h3>

              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left text-[#8e8e8e] text-sm border-b border-gray-200">
                        <th className="pb-2 font-normal">№</th>
                        <th className="pb-2 font-normal">Дата</th>
                        <th className="pb-2 font-normal hidden md:table-cell">Услуги</th>
                        <th className="pb-2 font-normal">Сумма</th>
                        <th className="pb-2 font-normal">Статус</th>
                        <th className="pb-2 font-normal"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 text-sm">{order.id}</td>
                          <td className="py-3 text-sm">{order.date}</td>
                          <td className="py-3 text-sm hidden md:table-cell">
                            {order.services.map((service) => service.serviceName).join(", ")}
                          </td>
                          <td className="py-3 text-sm">{order.totalAmount} ₽</td>
                          <td className="py-3 text-sm">
                            <span className={`px-2 py-1 ${getOrderStatusClass(order.status)} rounded-full text-xs`}>
                              {getOrderStatusText(order.status)}
                            </span>
                          </td>
                          <td className="py-3 text-sm">
                            <button
                              onClick={() => openOrderDetails(order)}
                              className="text-[#2055a4] hover:text-[#1a4a8f] text-sm"
                            >
                              Детали
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">У клиента нет заказов</div>
              )}
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Услуги клиента</h3>

              {orders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders
                    .flatMap((order) => order.services)
                    .map((service, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="font-medium">{service.serviceName}</div>
                        <div className="text-sm text-gray-500 mt-1">Цена: {service.price} ₽</div>
                        <div className="text-sm text-gray-500">Количество: {service.quantity}</div>
                        {service.readyDate && (
                          <div className="text-sm text-gray-500">Дата готовности: {service.readyDate}</div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">У клиента нет услуг</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold">Детали заказа №{selectedOrder.id}</h2>
              <div className="flex space-x-2">
                {isEditing ? (
                  <button
                    onClick={handleSaveOrder}
                    className="flex items-center text-white bg-[#2055a4] px-3 py-1 rounded-md hover:bg-[#1a4a8f]"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    <span className="hidden md:inline">Сохранить</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-[#2055a4] hover:text-[#1a4a8f]"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    <span className="hidden md:inline">Редактировать</span>
                  </button>
                )}
                <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500">Дата заказа</div>
                <div className="font-medium">{selectedOrder.date}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Тип оплаты</div>
                {isEditing ? (
                  <select
                    value={selectedOrder.isCashless ? "cashless" : "cash"}
                    onChange={(e) =>
                      setSelectedOrder({
                        ...selectedOrder,
                        isCashless: e.target.value === "cashless",
                      })
                    }
                    className="w-full border border-gray-300 rounded p-2"
                  >
                    <option value="cash">Наличный</option>
                    <option value="cashless">Безналичный</option>
                  </select>
                ) : (
                  <div className="font-medium">{selectedOrder.isCashless ? "Безналичный" : "Наличный"}</div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Услуги</h3>
                {isEditing && (
                  <button
                    onClick={handleAddService}
                    className="flex items-center text-[#2055a4] hover:text-[#1a4a8f] text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить услугу
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full mb-4">
                  <thead>
                    <tr className="text-left text-[#8e8e8e] text-sm border-b border-gray-200">
                      <th className="pb-2 font-normal">Услуга</th>
                      <th className="pb-2 font-normal">Кол-во</th>
                      <th className="pb-2 font-normal">Цена</th>
                      <th className="pb-2 font-normal">Итого</th>
                      <th className="pb-2 font-normal hidden md:table-cell">Дата готовности</th>
                      {isEditing && <th className="pb-2 font-normal"></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.services.map((service, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-2 text-sm">
                          {isEditing ? (
                            <select
                              value={service.serviceId}
                              onChange={(e) => {
                                const selectedService = services.find((s) => s.id === Number(e.target.value))
                                if (selectedService) {
                                  handleServiceChange(service.id, "serviceId", selectedService.id)
                                  handleServiceChange(service.id, "serviceName", selectedService.name)
                                  handleServiceChange(service.id, "price", selectedService.price)
                                  handleServiceChange(service.id, "total", selectedService.price * service.quantity)
                                }
                              }}
                              className="w-full border border-gray-300 rounded p-1 text-sm"
                            >
                              {services.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            service.serviceName
                          )}
                        </td>
                        <td className="py-2 text-sm">
                          {isEditing ? (
                            <input
                              type="number"
                              value={service.quantity}
                              onChange={(e) =>
                                handleServiceChange(service.id, "quantity", Number.parseInt(e.target.value) || 1)
                              }
                              className="w-16 border border-gray-300 rounded px-2 py-1"
                              min="1"
                            />
                          ) : (
                            service.quantity
                          )}
                        </td>
                        <td className="py-2 text-sm">
                          {isEditing ? (
                            <input
                              type="number"
                              value={service.price}
                              onChange={(e) =>
                                handleServiceChange(service.id, "price", Number.parseInt(e.target.value) || 0)
                              }
                              className="w-20 border border-gray-300 rounded px-2 py-1"
                              min="0"
                            />
                          ) : (
                            `${service.price} ₽`
                          )}
                        </td>
                        <td className="py-2 text-sm">{service.total} ₽</td>
                        <td className="py-2 text-sm hidden md:table-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              value={service.readyDate}
                              onChange={(e) => handleServiceChange(service.id, "readyDate", e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1"
                            />
                          ) : (
                            service.readyDate
                          )}
                        </td>
                        {isEditing && (
                          <td className="py-2 text-sm">
                            <button
                              onClick={() => handleRemoveService(service.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="py-2 text-sm font-medium text-right">
                        Итого:
                      </td>
                      <td className="py-2 text-sm font-medium">{selectedOrder.totalAmount} ₽</td>
                      <td colSpan={isEditing ? 2 : 1}></td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-2 text-sm font-medium text-right">
                        Скидка:
                      </td>
                      <td className="py-2 text-sm font-medium">
                        {isEditing ? (
                          <input
                            type="number"
                            value={selectedOrder.discount}
                            onChange={(e) =>
                              setSelectedOrder({
                                ...selectedOrder,
                                discount: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-16 border border-gray-300 rounded px-2 py-1"
                            min="0"
                            max="100"
                          />
                        ) : (
                          `${selectedOrder.discount}%`
                        )}
                      </td>
                      <td colSpan={isEditing ? 2 : 1}></td>
                    </tr>
                    {selectedOrder.discount > 0 && (
                      <tr>
                        <td colSpan={3} className="py-2 text-sm font-medium text-right">
                          К оплате:
                        </td>
                        <td className="py-2 text-sm font-medium">{selectedOrder.discountedAmount} ₽</td>
                        <td colSpan={isEditing ? 2 : 1}></td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-500">Комментарии</div>
              {isEditing ? (
                <textarea
                  value={selectedOrder.comments}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, comments: e.target.value })}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                  rows={3}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded mt-1">{selectedOrder.comments || "Нет комментариев"}</div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
