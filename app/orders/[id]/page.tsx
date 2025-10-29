"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import { ArrowLeft, Printer, Settings, Edit, Trash2 } from "lucide-react"
import PrintSettingsModal from "@/components/modals/PrintSettingsModal"
import type { PrintSettings } from "@/components/modals/PrintSettingsModal"
import { PrintPreview } from "@/components/PrintPreview"
import TechPassportModal from "@/components/modals/TechPassportModal"
import { StatusHistory } from "@/components/StatusHistory"
import type { TechPassport } from "@/types"

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
                        className="mt-4 bg-[#2055a4] text-white px-4 py-2 rounded-full hover:bg-[#1a4a8f]"
                    >
                        Вернуться к списку заказов
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

    const handlePrintSettings = () => {
        setIsPrintSettingsOpen(true)
    }

    const handlePrint = (settings: PrintSettings) => {
        setPrintSettings(settings)
        setIsPrintSettingsOpen(false)
        setIsPrintPreviewOpen(true)
    }

    const handleActualPrint = () => {
        window.print()
        setIsPrintPreviewOpen(false)
    }

    const handleEditTechPassport = (serviceId: number) => {
        const service = order.services.find((s) => s.id === serviceId)
        if (service) {
            setSelectedServiceId(serviceId)
            setSelectedTechPassport(service.techPassport)
            setIsTechPassportOpen(true)
        }
    }

    const handleSaveTechPassport = (techPassport: TechPassport) => {
        if (selectedServiceId !== null) {
            const updatedServices = order.services.map((service) =>
                service.id === selectedServiceId ? { ...service, techPassport } : service,
            )

            const updatedOrder = {
                ...order,
                services: updatedServices,
            }

            updateOrder(updatedOrder)
            addNotification("Технический паспорт сохранен", "success")
            setIsTechPassportOpen(false)
            setSelectedServiceId(null)
            setSelectedTechPassport(undefined)
        }
    }

    const handleDeleteOrder = () => {
        if (confirm("Вы уверены, что хотите удалить этот заказ?")) {
            // Здесь должна быть логика удаления заказа
            addNotification("Заказ удален", "success")
            router.push("/orders")
        }
    }

    const calculatePromotionDiscount = (price: number, promotion: any) => {
        if (!promotion) return 0
        if (promotion.discountType === "percentage") {
            return (price * promotion.discountAmount) / 100
        }
        return promotion.discountAmount
    }

    const calculatePromocodeDiscount = (totalAmount: number, promocode: any) => {
        if (!promocode) return 0
        if (promocode.discountType === "percentage") {
            return (totalAmount * promocode.discountAmount) / 100
        }
        return promocode.discountAmount
    }

    return (
        <div className="p-6">
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/orders")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Назад
                    </button>
                    <h1 className="text-2xl font-bold">Заказ №{order.id}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusClass(order.status)}`}>
            {getOrderStatusText(order.status)}
          </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrintSettings}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        <Settings className="w-4 h-4" />
                        Настройки печати
                    </button>
                    <button
                        onClick={() => router.push(`/orders/${order.id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                        <Edit className="w-4 h-4" />
                        Изменить
                    </button>
                    <button
                        onClick={handleDeleteOrder}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                        Удалить
                    </button>
                </div>
            </div>

            {/* Табы */}
            <div className="flex gap-4 mb-6 border-b">
                <button
                    onClick={() => setActiveTab("details")}
                    className={`pb-2 px-4 ${
                        activeTab === "details" ? "border-b-2 border-[#2055a4] text-[#2055a4] font-medium" : "text-gray-600"
                    }`}
                >
                    Детали заказа
                </button>
                <button
                    onClick={() => setActiveTab("tech-passport")}
                    className={`pb-2 px-4 ${
                        activeTab === "tech-passport" ? "border-b-2 border-[#2055a4] text-[#2055a4] font-medium" : "text-gray-600"
                    }`}
                >
                    Технические паспорта
                </button>
                <button
                    onClick={() => setActiveTab("history")}
                    className={`pb-2 px-4 ${
                        activeTab === "history" ? "border-b-2 border-[#2055a4] text-[#2055a4] font-medium" : "text-gray-600"
                    }`}
                >
                    История изменений
                </button>
            </div>

            {/* Контент табов */}
            {activeTab === "details" && (
                <div className="space-y-6">
                    {/* Информация о клиенте */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-medium mb-4">Информация о клиенте</h2>
                        {client ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600">Имя</div>
                                    <div className="font-medium">{clientName}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Телефон</div>
                                    <div className="font-medium">{client.phone}</div>
                                </div>
                                {client.email && (
                                    <div>
                                        <div className="text-sm text-gray-600">Email</div>
                                        <div className="font-medium">{client.email}</div>
                                    </div>
                                )}
                                <div>
                                    <div className="text-sm text-gray-600">Адрес</div>
                                    <div className="font-medium">
                                        {client.address.city}, {client.address.street}, {client.address.house}
                                        {client.address.apartment && `, кв. ${client.address.apartment}`}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500">Информация о клиенте не найдена</div>
                        )}
                    </div>

                    {/* Информация о заказе */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-medium mb-4">Информация о заказе</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-600">Дата создания</div>
                                <div className="font-medium">{order.date}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Статус</div>
                                <div className="font-medium">{getOrderStatusText(order.status)}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Тип оплаты</div>
                                <div className="font-medium">{order.isCashless ? "Безналичный" : "Наличный"}</div>
                            </div>
                            {order.comments && (
                                <div className="col-span-2">
                                    <div className="text-sm text-gray-600">Комментарии</div>
                                    <div className="font-medium">{order.comments}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Услуги */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-medium mb-4">Услуги</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">№</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Услуга</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-700">Кол-во</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-700">Цена</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-700">Акция</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-700">Итого</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Дата готовности</th>
                                </tr>
                                </thead>
                                <tbody>
                                {order.services.map((service, index) => {
                                    const promotionDiscount = service.appliedPromotion
                                        ? calculatePromotionDiscount(service.price, service.appliedPromotion)
                                        : 0
                                    const discountedPrice = service.price - promotionDiscount

                                    return (
                                        <tr key={service.id} className="border-b border-gray-100">
                                            <td className="py-3 px-4">{index + 1}</td>
                                            <td className="py-3 px-4">{service.serviceName}</td>
                                            <td className="py-3 px-4 text-center">{service.quantity}</td>
                                            <td className="py-3 px-4 text-right">
                                                {service.appliedPromotion ? (
                                                    <div>
                                                        <div className="line-through text-gray-400 text-sm">{service.price} ₽</div>
                                                        <div className="text-green-600 font-medium">{discountedPrice.toFixed(2)} ₽</div>
                                                    </div>
                                                ) : (
                                                    <div>{service.price} ₽</div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {service.appliedPromotion ? (
                                                    <div className="text-sm">
                                                        <div className="text-green-600 font-medium">{service.appliedPromotion.name}</div>
                                                        <div className="text-gray-500">
                                                            {service.appliedPromotion.discountType === "percentage"
                                                                ? `-${service.appliedPromotion.discountAmount}%`
                                                                : `-${service.appliedPromotion.discountAmount} ₽`}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-400 text-sm">—</div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right font-medium">
                                                {(discountedPrice * service.quantity).toFixed(2)} ₽
                                            </td>
                                            <td className="py-3 px-4">{service.readyDate}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Итоги */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-medium mb-4">Итоги</h2>
                        <div className="space-y-2 max-w-md ml-auto">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Подытог:</span>
                                <span className="font-medium">{order.totalAmount.toFixed(2)} ₽</span>
                            </div>

                            {order.appliedPromotions && order.appliedPromotions.length > 0 && (
                                <div className="border-t pt-2">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Примененные акции:</div>
                                    {order.appliedPromotions.map((promotion, index) => {
                                        // Рассчитываем экономию по этой акции
                                        const servicesWithThisPromotion = order.services.filter(
                                            (s) => s.appliedPromotion && s.appliedPromotion.id === promotion.id,
                                        )
                                        const totalSavings = servicesWithThisPromotion.reduce((sum, service) => {
                                            const discount = calculatePromotionDiscount(service.price, promotion)
                                            return sum + discount * service.quantity
                                        }, 0)

                                        return (
                                            <div key={index} className="flex justify-between text-sm">
                        <span className="text-green-600">
                          {promotion.name} (
                            {promotion.discountType === "percentage"
                                ? `${promotion.discountAmount}%`
                                : `${promotion.discountAmount} ₽`}
                            ):
                        </span>
                                                <span className="text-green-600 font-medium">-{totalSavings.toFixed(2)} ₽</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {order.appliedPromocode && (
                                <div className="flex justify-between text-sm">
                  <span className="text-purple-600">
                    Промокод "{order.appliedPromocode.code}" (
                      {order.appliedPromocode.discountType === "percentage"
                          ? `${order.appliedPromocode.discountAmount}%`
                          : `${order.appliedPromocode.discountAmount} ₽`}
                      ):
                  </span>
                                    <span className="text-purple-600 font-medium">
                    -{calculatePromocodeDiscount(order.totalAmount, order.appliedPromocode).toFixed(2)} ₽
                  </span>
                                </div>
                            )}

                            <div className="border-t border-gray-200 pt-2">
                                <div className="flex justify-between">
                                    <span className="text-lg font-semibold">Итого к оплате:</span>
                                    <span className="text-lg font-bold text-green-600">{order.discountedAmount.toFixed(2)} ₽</span>
                                </div>
                            </div>

                            {order.totalAmount > order.discountedAmount && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Вы экономите:</span>
                                    <span className="font-medium">{(order.totalAmount - order.discountedAmount).toFixed(2)} ₽</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "tech-passport" && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-4">Технические паспорта</h2>
                    {order.services.some((s) => s.techPassport) ? (
                        <div className="space-y-4">
                            {order.services
                                .filter((s) => s.techPassport)
                                .map((service) => (
                                    <div key={service.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-medium">{service.serviceName}</h3>
                                            <button
                                                onClick={() => handleEditTechPassport(service.id)}
                                                className="text-[#2055a4] hover:text-[#1a4a8f] text-sm"
                                            >
                                                Редактировать
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <div className="text-gray-600">Номер договора</div>
                                                <div className="font-medium">{service.techPassport?.contractNumber || "Не указан"}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-600">Наименование изделия</div>
                                                <div className="font-medium">{service.techPassport?.itemName || "Не указано"}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-600">Материал</div>
                                                <div className="font-medium">{service.techPassport?.material || "Не указан"}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-600">Цвет</div>
                                                <div className="font-medium">{service.techPassport?.color || service.color || "Не указан"}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>Технические паспорта не добавлены</p>
                            <button
                                onClick={() => {
                                    if (order.services.length > 0) {
                                        handleEditTechPassport(order.services[0].id)
                                    }
                                }}
                                className="mt-4 text-[#2055a4] hover:text-[#1a4a8f]"
                            >
                                Добавить технический паспорт
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "history" && <StatusHistory history={statusHistory} />}

            {/* Модальные окна */}
            {isPrintSettingsOpen && (
                <PrintSettingsModal
                    isOpen={isPrintSettingsOpen}
                    onClose={() => setIsPrintSettingsOpen(false)}
                    onPrint={handlePrint}
                    defaultSettings={printSettings}
                />
            )}

            {isPrintPreviewOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-medium">Предпросмотр печати</h2>
                            <button onClick={() => setIsPrintPreviewOpen(false)} className="text-gray-500 hover:text-gray-700">
                                ✕
                            </button>
                        </div>
                        <div className="p-4">
                            <PrintPreview order={order} client={client} statusHistory={statusHistory} settings={printSettings} />
                        </div>
                        <div className="flex justify-end gap-2 p-4 border-t">
                            <button
                                onClick={() => setIsPrintPreviewOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleActualPrint}
                                className="px-4 py-2 bg-[#2055a4] text-white rounded-md hover:bg-[#1a4a8f]"
                            >
                                <Printer className="w-4 h-4 inline mr-2" />
                                Печать
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isTechPassportOpen && (
                <TechPassportModal
                    initialData={selectedTechPassport}
                    onClose={() => {
                        setIsTechPassportOpen(false)
                        setSelectedServiceId(null)
                        setSelectedTechPassport(undefined)
                    }}
                    onSave={handleSaveTechPassport}
                />
            )}
        </div>
    )
}
