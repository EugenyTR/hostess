"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Plus, X, Tag } from "lucide-react"
import { useAppContext } from "@/context/AppContext"

export default function LegalClientDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const {
    getClientById,
    getOrdersByClientId,
    services,
    assignServiceToClient,
    removeServiceFromClient,
    getClientServices,
    calculateServicePrice,
  } = useAppContext()
  const [activeTab, setActiveTab] = useState<"data" | "orders" | "services">("data")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const clientId = Number(params.id)
  const client = getClientById(clientId)
  const orders = getOrdersByClientId(clientId)
  const clientServices = getClientServices(clientId)

  if (!client || client.type !== "legal") {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-medium">Юридическое лицо не найдено</h2>
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

  // Фильтрация услуг для добавления
  const availableServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    const notAssigned = !clientServices.some((cs) => cs.id === service.id)
    return matchesSearch && matchesCategory && notAssigned && service.isActive
  })

  // Получение уникальных категорий
  const categories = ["all", ...Array.from(new Set(services.map((s) => s.category)))]

  const handleAssignService = (serviceId: number) => {
    assignServiceToClient(clientId, serviceId)
  }

  const handleRemoveService = (serviceId: number) => {
    removeServiceFromClient(clientId, serviceId)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push("/clients")}
          className="flex items-center text-[#2055a4] hover:text-[#1a4a8f]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Назад к списку</span>
        </button>
        <h1 className="text-2xl font-bold ml-6">Клиенты / Юр. лицо: {client.companyName}</h1>
        <div className="ml-auto">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            value={client.companyName}
            onChange={() => {}} // Добавляем пустой обработчик для контролируемого компонента
          >
            <option value="">Выбрать юр. лицо</option>
            <option value={client.companyName}>{client.companyName}</option>
          </select>
        </div>
        <button className="ml-2 bg-[#2055a4] text-white w-8 h-8 rounded-full flex items-center justify-center">
          <span>+</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`pb-2 px-8 text-sm font-medium ${
              activeTab === "data"
                ? "text-[#2055a4] border-b-2 border-[#2055a4] bg-[#2055a4]/10"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("data")}
          >
            Данные клиента
          </button>
          <button
            className={`pb-2 px-8 text-sm font-medium ${
              activeTab === "orders"
                ? "text-[#2055a4] border-b-2 border-[#2055a4] bg-[#2055a4]/10"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            История заказов
          </button>
          <button
            className={`pb-2 px-8 text-sm font-medium ${
              activeTab === "services"
                ? "text-[#2055a4] border-b-2 border-[#2055a4] bg-[#2055a4]/10"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("services")}
          >
            Услуги
          </button>
        </div>
      </div>

      {/* Client Data Tab */}
      {activeTab === "data" && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="bg-[#f7f7f7] rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">Название компании</div>
                  <input
                    type="text"
                    value={client.companyName}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">Город</div>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={client.address.city}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      readOnly
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">Фамилия</div>
                  <input
                    type="text"
                    value={client.surname}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">ИНН</div>
                  <input
                    type="text"
                    value={client.legalInfo?.inn || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">Имя</div>
                  <input
                    type="text"
                    value={client.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">КПП</div>
                  <input
                    type="text"
                    value={client.legalInfo?.kpp || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">Отчество</div>
                  <input
                    type="text"
                    value={client.patronymic}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">БИК</div>
                  <input
                    type="text"
                    value={client.legalInfo?.bik || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">Телефон</div>
                  <input
                    type="text"
                    value={client.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">Рас. счет</div>
                  <input
                    type="text"
                    value={client.legalInfo?.settlementAccount || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">Email</div>
                  <input
                    type="text"
                    value={client.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">Корп. счет</div>
                  <input
                    type="text"
                    value={client.legalInfo?.corporateAccount || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    readOnly
                  />
                </div>
                <div className="col-span-2 mb-4">
                  <div className="text-sm font-medium mb-1">Юридический адрес</div>
                  <input
                    type="text"
                    value={client.legalInfo?.legalAddress || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    readOnly
                  />
                </div>
                <div className="col-span-2 mb-4">
                  <div className="text-sm font-medium mb-1">Прайс лист</div>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={client.legalInfo?.priceList || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      readOnly
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button className="bg-[#2055a4] text-white px-6 py-2 rounded-full hover:bg-[#1a4a8f] transition-colors">
                  Сохранить
                </button>
                <button
                  className="border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => router.push("/clients")}
                >
                  К списку клиентов
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-[#2055a4] rounded-lg p-6 text-white">
              <h3 className="text-xl font-medium mb-4">Данные:</h3>

              <div className="flex justify-between mb-3">
                <div>Средний объем:</div>
                <div className="font-bold">150 кг</div>
              </div>

              <div className="flex justify-between mb-3">
                <div>Кол-во визитов:</div>
                <div className="font-bold">23</div>
              </div>

              <div className="flex justify-between">
                <div>Общая сумма:</div>
                <div className="font-bold">36 789 ₽</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="bg-[#f7f7f7] rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">История заказов</h3>

          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-[#8e8e8e] text-sm border-b border-gray-200">
                    <th className="pb-2 font-normal">№</th>
                    <th className="pb-2 font-normal">Дата</th>
                    <th className="pb-2 font-normal">Услуги</th>
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
                      <td className="py-3 text-sm">
                        {order.services.map((service) => service.serviceName).join(", ")}
                      </td>
                      <td className="py-3 text-sm">{order.totalAmount} ₽</td>
                      <td className="py-3 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Выполнен</span>
                      </td>
                      <td className="py-3 text-sm">
                        <button className="text-[#2055a4] hover:text-[#1a4a8f] text-sm">Подробнее</button>
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
        <div className="space-y-6">
          {/* Assigned Services */}
          <div className="bg-[#f7f7f7] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Назначенные услуги ({clientServices.length})</h3>

            {clientServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientServices.map((service) => {
                  const priceInfo = calculateServicePrice(service.id, 1, "legal")
                  return (
                    <div key={service.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{service.name}</h4>
                        <button
                          onClick={() => handleRemoveService(service.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{service.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {priceInfo.appliedPromotion && (
                            <>
                              <span className="text-xs text-gray-500 line-through">{priceInfo.originalPrice} ₽</span>
                              <span className="text-sm font-medium text-green-600">{priceInfo.finalPrice} ₽</span>
                              <Tag className="w-3 h-3 text-green-600" />
                            </>
                          )}
                          {!priceInfo.appliedPromotion && (
                            <span className="text-sm font-medium">{service.price} ₽</span>
                          )}
                        </div>
                      </div>
                      {service.description && <p className="text-xs text-gray-500 mt-2">{service.description}</p>}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>У клиента нет назначенных услуг</p>
                <p className="text-sm">Добавьте услуги из списка ниже</p>
              </div>
            )}
          </div>

          {/* Add Services */}
          <div className="bg-[#f7f7f7] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Добавить услуги</h3>

            {/* Search and Filters */}
            <div className="mb-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Поиск услуг..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category
                        ? "bg-[#2055a4] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {category === "all" ? "Все категории" : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Services */}
            {availableServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableServices.map((service) => {
                  const priceInfo = calculateServicePrice(service.id, 1, "legal")
                  return (
                    <div
                      key={service.id}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#2055a4] transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{service.name}</h4>
                        <button
                          onClick={() => handleAssignService(service.id)}
                          className="text-[#2055a4] hover:text-[#1a4a8f] p-1"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{service.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {priceInfo.appliedPromotion && (
                            <>
                              <span className="text-xs text-gray-500 line-through">{priceInfo.originalPrice} ₽</span>
                              <span className="text-sm font-medium text-green-600">{priceInfo.finalPrice} ₽</span>
                              <Tag className="w-3 h-3 text-green-600" />
                            </>
                          )}
                          {!priceInfo.appliedPromotion && (
                            <span className="text-sm font-medium">{service.price} ₽</span>
                          )}
                        </div>
                      </div>
                      {service.description && <p className="text-xs text-gray-500 mt-2">{service.description}</p>}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Нет доступных услуг для добавления</p>
                {searchTerm && <p className="text-sm">Попробуйте изменить поисковый запрос</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
