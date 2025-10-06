"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Printer, Download, Check } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import { StatusHistory } from "@/components/StatusHistory"
import { PrintSettingsModal, type PrintSettings } from "@/components/modals/PrintSettingsModal"
import { PrintPreviewModal } from "@/components/modals/PrintPreviewModal"
import TechPassportModal from "@/components/modals/TechPassportModal"
import type { OrderStatus, TechPassport } from "@/types"

export default function OrderDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { orders, getClientById, updateOrderStatus, getOrderStatusHistory, updateOrder } = useAppContext()
  const { addNotification } = useNotification()
  const [activeTab, setActiveTab] = useState<"details" | "tech-passport" | "history">("details")

  // Состояния для модальных окон
  const [isPrintSettingsOpen, setIsPrintSettingsOpen] = useState(false)
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false)
  const [isTechPassportOpen, setIsTechPassportOpen] = useState(false)
  const [selectedTechPassport, setSelectedTechPassport] = useState<TechPassport | undefined>(undefined)
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)

  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    includeLogo: true,
    includeOrderDetails: true,
    includeClientInfo: true,
    includeServices: true,
    includeTechPassport: false,
    includeStatusHistory: false,
    includeComments: true,
    paperSize: "a4",
    orientation: "portrait",
    showPrices: true,
    showDiscount: true,
    showHeader: true,
    showFooter: true,
    footerText: "© 2023 Сервисный центр",
  })

  const orderId = Number(params.id)
  const order = orders.find((o) => o.id === orderId)
  const statusHistory = getOrderStatusHistory(orderId)

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-medium">Заказ не найден</h2>
          <button
            onClick={() => router.push("/orders")}
            className="mt-4 bg-[#2055a4] text-white px-4 py-2 rounded-full hover:bg-[#1a4a8f] transition-colors"
          >
            Вернут��ся к списку заказов
          </button>
        </div>
      </div>
    )
  }

  const client = getClientById(order.clientId)
  const clientName = client
    ? client.type === "individual"
      ? `${client.surname} ${client.name} ${client.patronymic}`
      : client.companyName || ""
    : "Неизвестный клиент"

  // Обработчик открытия технического паспорта
  const handleOpenTechPassport = (serviceId: number, techPassport?: TechPassport) => {
    setSelectedServiceId(serviceId)
    setSelectedTechPassport(techPassport)
    setIsTechPassportOpen(true)
  }

  // Обработчик сохранения технического паспорта
  const handleSaveTechPassport = (techPassport: TechPassport) => {
    if (selectedServiceId) {
      const updatedOrder = {
        ...order,
        services: order.services.map((service) =>
          service.id === selectedServiceId ? { ...service, techPassport } : service,
        ),
      }
      updateOrder(updatedOrder)
      setIsTechPassportOpen(false)
      setSelectedTechPassport(undefined)
      setSelectedServiceId(null)

      addNotification({
        type: "success",
        title: "Технический паспорт",
        message: "Технический паспорт успешно сохранен",
        duration: 3000,
      })
    }
  }

  // Обработчик открытия настроек печати
  const handleOpenPrintSettings = () => {
    setIsPrintSettingsOpen(true)
  }

  // Обработчик применения настроек печати
  const handleApplyPrintSettings = (settings: PrintSettings) => {
    setPrintSettings(settings)
    setIsPrintSettingsOpen(false)
    setIsPrintPreviewOpen(true)
  }

  // Обработчик печати
  const handlePrint = () => {
    window.print()
    setIsPrintPreviewOpen(false)
    addNotification({
      type: "success",
      title: "Печать",
      message: "Документ отправлен на печать",
      duration: 3000,
    })
  }

  // Функция для получения текста статуса
  const getOrderStatusText = (status: OrderStatus): string => {
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

  // Функция для получения класса стиля статуса
  const getOrderStatusClass = (status: OrderStatus): string => {
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

  // Обработчик изменения статуса
  const handleStatusChange = (status: OrderStatus) => {
    updateOrderStatus(order.id, status, "Елена Иванова")
  }

  // Обработчик экспорта истории изменений
  const handleExportHistory = () => {
    addNotification({
      type: "success",
      title: "Экспорт истории",
      message: "История изменений статуса экспортирована",
      duration: 3000,
    })
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center mb-2 md:mb-0">
          <button
            onClick={() => router.push("/orders")}
            className="flex items-center text-[#2055a4] hover:text-[#1a4a8f]"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Назад к списку</span>
          </button>
          <h1 className="text-2xl font-bold ml-6">Заказ №{order.id}</h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleOpenPrintSettings}
            className="flex items-center text-[#2055a4] hover:text-[#1a4a8f] border border-[#2055a4] px-4 py-2 rounded-full"
          >
            <Printer className="w-4 h-4 mr-2" />
            Печать
          </button>
          <button
            className="flex items-center bg-[#2055a4] text-white px-4 py-2 rounded-full hover:bg-[#1a4a8f]"
            onClick={() => {
              addNotification({
                type: "info",
                title: "Экспорт",
                message: "Экспорт заказа начат",
                duration: 3000,
              })
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex border-b border-gray-200 min-w-max">
          <button
            className={`pb-2 px-8 text-sm font-medium ${
              activeTab === "details"
                ? "text-[#2055a4] border-b-2 border-[#2055a4] bg-[#2055a4]/10"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Детали заказа
          </button>
          <button
            className={`pb-2 px-8 text-sm font-medium ${
              activeTab === "tech-passport"
                ? "text-[#2055a4] border-b-2 border-[#2055a4] bg-[#2055a4]/10"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("tech-passport")}
          >
            Технические паспорта
          </button>
          <button
            className={`pb-2 px-8 text-sm font-medium ${
              activeTab === "history"
                ? "text-[#2055a4] border-b-2 border-[#2055a4] bg-[#2055a4]/10"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("history")}
          >
            История изменений
          </button>
        </div>
      </div>

      {/* Order Details */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="bg-[#f7f7f7] rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Информация о заказе</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Номер заказа</div>
                  <div className="font-medium">{order.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Дата</div>
                  <div className="font-medium">{order.date}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Клиент</div>
                  <div className="font-medium">{clientName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Тип оплаты</div>
                  <div className="font-medium">{order.isCashless ? "Безналичный" : "Наличный"}</div>
                </div>
              </div>

              {order.comments && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500">Комментарии</div>
                  <div className="p-2 bg-white rounded border border-gray-200 mt-1">{order.comments}</div>
                </div>
              )}
            </div>

            <div className="bg-[#f7f7f7] rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Услуги</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-[#8e8e8e] text-sm border-b border-gray-200">
                      <th className="pb-2 font-normal">№</th>
                      <th className="pb-2 font-normal">Услуга</th>
                      <th className="pb-2 font-normal">Кол-во</th>
                      <th className="pb-2 font-normal">Цена</th>
                      <th className="pb-2 font-normal">Итого</th>
                      <th className="pb-2 font-normal">Дата готовности</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.services.map((service, index) => (
                      <tr key={service.id} className="border-b border-gray-200">
                        <td className="py-3 text-sm">{index + 1}</td>
                        <td className="py-3 text-sm">{service.serviceName}</td>
                        <td className="py-3 text-sm">{service.quantity}</td>
                        <td className="py-3 text-sm">{service.price} ₽</td>
                        <td className="py-3 text-sm">{service.total} ₽</td>
                        <td className="py-3 text-sm">{service.readyDate}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="py-3 text-sm font-medium text-right">
                        Итого:
                      </td>
                      <td className="py-3 text-sm font-medium">{order.totalAmount} ₽</td>
                      <td></td>
                    </tr>
                    {order.discount > 0 && (
                      <tr>
                        <td colSpan={4} className="py-3 text-sm font-medium text-right">
                          Скидка:
                        </td>
                        <td className="py-3 text-sm font-medium">{order.discount}%</td>
                        <td></td>
                      </tr>
                    )}
                    {order.discount > 0 && (
                      <tr>
                        <td colSpan={4} className="py-3 text-sm font-medium text-right">
                          К оплате:
                        </td>
                        <td className="py-3 text-sm font-medium">{order.discountedAmount} ₽</td>
                        <td></td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-[#f7f7f7] rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Информация о клиенте</h2>

              {client && (
                <div className="space-y-4">
                  {client.type === "legal" && client.companyName && (
                    <div>
                      <div className="text-sm text-gray-500">Компания</div>
                      <div className="font-medium">{client.companyName}</div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm text-gray-500">ФИО</div>
                    <div className="font-medium">
                      {client.surname} {client.name} {client.patronymic}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Телефон</div>
                    <div className="font-medium">{client.phone}</div>
                  </div>

                  {client.email && (
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{client.email}</div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm text-gray-500">Адрес</div>
                    <div className="font-medium">
                      {client.address.city}, {client.address.street}, {client.address.house}
                      {client.address.apartment && `, кв. ${client.address.apartment}`}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#f7f7f7] rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Статус заказа</h2>

              <div className={`p-3 ${getOrderStatusClass(order.status)} rounded-md mb-4`}>
                {getOrderStatusText(order.status)}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm">Создан:</span>
                  <span className="text-sm font-medium">{order.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Готовность:</span>
                  <span className="text-sm font-medium">
                    {order.services.length > 0 ? order.services[0].readyDate : "Не указано"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">Изменить статус:</h3>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleStatusChange("waiting")}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      order.status === "waiting" ? "bg-red-100 text-red-800" : "bg-gray-100 hover:bg-red-50"
                    }`}
                  >
                    <span>Ожидание</span>
                    {order.status === "waiting" && <Check className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleStatusChange("in-progress")}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      order.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 hover:bg-yellow-50"
                    }`}
                  >
                    <span>В работе</span>
                    {order.status === "in-progress" && <Check className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleStatusChange("completed")}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      order.status === "completed" ? "bg-green-100 text-green-800" : "bg-gray-100 hover:bg-green-50"
                    }`}
                  >
                    <span>Выполнен</span>
                    {order.status === "completed" && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tech Passports */}
      {activeTab === "tech-passport" && (
        <div className="bg-[#f7f7f7] rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Технические паспорта</h2>

          {order.services.some((s) => s.techPassport) ? (
            <div className="space-y-6">
              {order.services
                .filter((s) => s.techPassport)
                .map((service, index) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <h3 className="font-medium mb-2">{service.serviceName}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">Номер договора</div>
                        <div className="font-medium">{service.techPassport?.contractNumber || "Не указан"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Заказчик</div>
                        <div className="font-medium">{service.techPassport?.client || clientName}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">Наименование изделия</div>
                        <div className="font-medium">{service.techPassport?.itemName || "Не указано"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Материал</div>
                        <div className="font-medium">{service.techPassport?.material || "Не указан"}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">Цвет</div>
                        <div className="font-medium">{service.techPassport?.color || service.color || "Не указан"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Производитель</div>
                        <div className="font-medium">
                          {service.techPassport?.manufacturer || service.brand || "Не указан"}
                        </div>
                      </div>
                    </div>

                    <button
                      className="mt-2 text-[#2055a4] hover:text-[#1a4a8f] text-sm"
                      onClick={() => handleOpenTechPassport(service.id, service.techPassport)}
                    >
                      Просмотреть полный паспорт
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Для этого заказа нет технических паспортов</div>
          )}
        </div>
      )}

      {/* Status History */}
      {activeTab === "history" && <StatusHistory history={statusHistory} onExport={handleExportHistory} />}

      {/* Модальные окна */}
      <PrintSettingsModal
        isOpen={isPrintSettingsOpen}
        onClose={() => setIsPrintSettingsOpen(false)}
        onPrint={handleApplyPrintSettings}
        defaultSettings={printSettings}
      />

      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        order={order}
        client={client}
        statusHistory={statusHistory}
        settings={printSettings}
        onPrint={handlePrint}
      />

      {isTechPassportOpen && (
        <TechPassportModal
          initialData={selectedTechPassport}
          onClose={() => {
            setIsTechPassportOpen(false)
            setSelectedTechPassport(undefined)
            setSelectedServiceId(null)
          }}
          onSave={handleSaveTechPassport}
        />
      )}
    </div>
  )
}
