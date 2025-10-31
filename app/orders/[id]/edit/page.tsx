"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Trash2, Camera, Plus, ChevronDown, Tag, ArrowLeft } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import type { OrderService, ServiceImage, OrderPromotion, Promocode } from "@/types"
import AddSizeModal from "@/components/modals/AddSizeModal"
import AddImageModal from "@/components/modals/AddImageModal"
import ServiceSearchModal from "@/components/modals/ServiceSearchModal"
import TechPassportModal from "@/components/modals/TechPassportModal"
import DatePicker from "@/components/DatePicker"
import ImageGalleryModal from "@/components/modals/ImageGalleryModal"

export default function EditOrder({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { showNotification } = useNotification()
    const {
        clients,
        orders,
        services,
        sizes,
        brands,
        colors,
        referralSources,
        promotions,
        promocodes,
        addSize,
        addService,
        updateOrder,
        getClientById,
        calculateServicePrice,
        getServicesWithPromotions,
        getActivePromocodes,
        validatePromocode,
    } = useAppContext()

    const orderId = Number(params.id)
    const order = orders.find((o) => o.id === orderId)
    const client = order ? getClientById(order.clientId) : null

    // Order services state
    const [orderServices, setOrderServices] = useState<OrderService[]>([])
    const [nextServiceId, setNextServiceId] = useState(1)
    const [selectedPromocode, setSelectedPromocode] = useState<Promocode | null>(null)
    const [showPromocodeDropdown, setShowPromocodeDropdown] = useState(false)
    const [isCashless, setIsCashless] = useState(false)
    const [comments, setComments] = useState("")

    // Состояния для валидации
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Modals state
    const [showAddSizeModal, setShowAddSizeModal] = useState(false)
    const [showAddImageModal, setShowAddImageModal] = useState(false)
    const [showServiceSearchModal, setShowServiceSearchModal] = useState(false)
    const [showTechPassportModal, setShowTechPassportModal] = useState(false)
    const [currentServiceId, setCurrentServiceId] = useState<number | null>(null)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

    const [showImageGallery, setShowImageGallery] = useState(false)
    const [galleryImages, setGalleryImages] = useState<ServiceImage[]>([])
    const [galleryInitialIndex, setGalleryInitialIndex] = useState(0)

    // Refs for dropdown handling
    const promocodeDropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (order) {
            setOrderServices(order.services)
            setNextServiceId(Math.max(...order.services.map((s) => s.id), 0) + 1)
            setIsCashless(order.isCashless || false)
            setComments(order.comments || "")

            // Load applied promocode if exists
            if (order.appliedPromocode) {
                const promocode = promocodes.find((p) => p.id === order.appliedPromocode?.promocodeId)
                if (promocode) {
                    setSelectedPromocode(promocode)
                }
            }
        }
    }, [order, promocodes])

    // Функция для проверки валидности даты
    const isValidDate = (date: Date): boolean => {
        return date instanceof Date && !isNaN(date.getTime())
    }

    // Format date helper
    const formatDate = (date: Date): string => {
        if (!isValidDate(date)) {
            return new Date().toISOString().split("T")[0]
        }
        return date.toISOString().split("T")[0]
    }

    // Validation function
    const validateField = (field: string, value: any): string => {
        switch (field) {
            case "quantity":
                if (!value || value <= 0) return "Количество должно быть больше 0"
                return ""
            default:
                return ""
        }
    }

    // Handle promocode selection
    const handlePromocodeSelect = (promocode: Promocode) => {
        setSelectedPromocode(promocode)
        setShowPromocodeDropdown(false)
    }

    // Clear promocode
    const handleClearPromocode = () => {
        setSelectedPromocode(null)
    }

    // Calculate totals with promotions and promocodes
    const calculateTotals = () => {
        let totalAmount = 0
        let totalDiscount = 0
        const appliedPromotions: OrderPromotion[] = []

        // Сначала считаем базовую сумму и скидки от акций
        orderServices.forEach((service) => {
            totalAmount += service.originalTotal || service.total
            if (service.appliedPromotion) {
                const serviceDiscount = (service.originalTotal || service.total) - service.total
                totalDiscount += serviceDiscount

                // Добавляем или обновляем информацию об акции
                const existingPromotion = appliedPromotions.find((p) => p.promotionId === service.appliedPromotion!.promotionId)
                if (existingPromotion) {
                    existingPromotion.appliedToServices.push(service.id)
                    existingPromotion.totalDiscount += serviceDiscount
                } else {
                    appliedPromotions.push({
                        promotionId: service.appliedPromotion.promotionId,
                        promotionName: service.appliedPromotion.promotionName,
                        discountAmount: service.appliedPromotion.discountAmount,
                        discountType: service.appliedPromotion.discountType,
                        appliedToServices: [service.id],
                        totalDiscount: serviceDiscount,
                    })
                }
            }
        })

        let promocodeDiscount = 0
        let finalAmount = totalAmount - totalDiscount

        // Применяем промокод если он выбран и валиден
        if (selectedPromocode && client) {
            const validation = validatePromocode(selectedPromocode.code, finalAmount, client.type)
            if (validation) {
                if (selectedPromocode.discountType === "percentage") {
                    promocodeDiscount = (finalAmount * selectedPromocode.discountAmount) / 100
                    if (selectedPromocode.maxDiscountAmount) {
                        promocodeDiscount = Math.min(promocodeDiscount, selectedPromocode.maxDiscountAmount)
                    }
                } else {
                    promocodeDiscount = Math.min(selectedPromocode.discountAmount, finalAmount)
                }
            }
        }

        finalAmount = finalAmount - promocodeDiscount

        return {
            totalAmount,
            totalDiscount: totalDiscount + promocodeDiscount,
            finalAmount,
            appliedPromotions,
            promocodeDiscount,
        }
    }

    const { totalAmount, totalDiscount, finalAmount, appliedPromotions, promocodeDiscount } = calculateTotals()

    // Handle service quantity change
    const handleQuantityChange = (id: number, value: string) => {
        const numericValue = value.replace(/[^0-9]/g, "")
        const quantity = numericValue ? Number.parseInt(numericValue, 10) : 0

        // Валидация количества
        const error = validateField("quantity", quantity)
        setErrors((prev) => ({ ...prev, [`quantity-${id}`]: error }))
        setTouched((prev) => ({ ...prev, [`quantity-${id}`]: true }))

        setOrderServices((prevServices) =>
            prevServices.map((service) => {
                if (service.id === id) {
                    const total = service.price * quantity
                    const originalTotal = service.originalPrice ? service.originalPrice * quantity : total
                    return { ...service, quantity, total, originalTotal }
                }
                return service
            }),
        )
    }

    // Handle service selection from search
    const handleServiceSelect = (serviceId: number, serviceName: string, price: number) => {
        // Check if this is a new service
        let newServiceId = serviceId
        if (serviceId < 0) {
            // This is a new service, add it to the context
            const newService = addService({
                name: serviceName,
                price: price,
                category: "Другое",
            })
            newServiceId = newService.id
        }

        // Рассчитываем цену с учетом акций
        const priceCalculation = client
            ? calculateServicePrice(newServiceId, 1, client.type)
            : { finalPrice: price, originalPrice: price, appliedPromotion: undefined }

        const newService: OrderService = {
            id: nextServiceId,
            serviceId: newServiceId,
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

    // Handle service removal
    const handleRemoveService = (id: number) => {
        setOrderServices(orderServices.filter((service) => service.id !== id))
    }

    // Handle add image
    const handleAddImage = (serviceId: number) => {
        setCurrentServiceId(serviceId)
        setShowAddImageModal(true)
    }

    // Handle image save
    const handleImageSave = (images: ServiceImage[]) => {
        if (currentServiceId !== null) {
            setOrderServices((prevServices) =>
                prevServices.map((service) => {
                    if (service.id === currentServiceId) {
                        return { ...service, images: [...(service.images || []), ...images] }
                    }
                    return service
                }),
            )
        }
        setShowAddImageModal(false)
        setCurrentServiceId(null)
    }

    // Handle image removal
    const handleRemoveImage = (serviceId: number, imageIndex: number) => {
        setOrderServices((prevServices) =>
            prevServices.map((service) => {
                if (service.id === serviceId) {
                    return {
                        ...service,
                        images: service.images.filter((_, index) => index !== imageIndex),
                    }
                }
                return service
            }),
        )
    }

    // Handle open image gallery
    const handleOpenImageGallery = (serviceId: number, imageIndex: number) => {
        const service = orderServices.find((s) => s.id === serviceId)
        if (service && service.images) {
            setGalleryImages(service.images)
            setGalleryInitialIndex(imageIndex)
            setShowImageGallery(true)
        }
    }

    // Handle close image gallery
    const handleCloseImageGallery = () => {
        setShowImageGallery(false)
        setGalleryImages([])
        setGalleryInitialIndex(0)
    }

    // Handle delete image from gallery
    const handleDeleteImageFromGallery = (imageIndex: number) => {
        if (currentServiceId !== null) {
            handleRemoveImage(currentServiceId, imageIndex)
        }
    }

    // Handle dropdown change
    const handleDropdownChange = (serviceId: number, field: string, value: string) => {
        setOrderServices((prevServices) =>
            prevServices.map((service) => {
                if (service.id === serviceId) {
                    return { ...service, [field]: value }
                }
                return service
            }),
        )
    }

    // Handle ready date change
    const handleReadyDateChange = (serviceId: number, date: Date | string) => {
        const dateString = date instanceof Date ? date.toISOString().split("T")[0] : date

        setOrderServices((prevServices) =>
            prevServices.map((service) => {
                if (service.id === serviceId) {
                    return { ...service, readyDate: dateString }
                }
                return service
            }),
        )
    }

    // Handle tech passport
    const handleOpenTechPassport = (serviceId: number) => {
        setCurrentServiceId(serviceId)
        setShowTechPassportModal(true)
    }

    const handleSaveTechPassport = (techPassport: any) => {
        if (currentServiceId !== null) {
            setOrderServices((prevServices) =>
                prevServices.map((service) => {
                    if (service.id === currentServiceId) {
                        return { ...service, techPassport }
                    }
                    return service
                }),
            )
        }
        setShowTechPassportModal(false)
        setCurrentServiceId(null)
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Валидируем все поля
        const newErrors: Record<string, string> = {}

        // Проверяем наличие услуг
        if (orderServices.length === 0) {
            newErrors.services = "Добавьте хотя бы одну услугу"
        }

        // Проверяем количество для каждой услуги
        orderServices.forEach((service) => {
            if (service.quantity <= 0) {
                newErrors[`quantity-${service.id}`] = "Количество должно быть больше 0"
            }
        })

        setErrors(newErrors)
        setTouched(Object.keys(newErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {}))

        // Если есть ошибки, прерываем отправку
        if (Object.values(newErrors).some((error) => error)) {
            setIsSubmitting(false)

            // Прокручиваем к первой ошибке
            const firstErrorElement = document.querySelector(".error-message")
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" })
            }

            return
        }

        try {
            if (!order) {
                showNotification("Заказ не найден", "error")
                setIsSubmitting(false)
                return
            }

            // Обновляем заказ
            const updatedOrder = {
                ...order,
                services: orderServices,
                totalAmount: finalAmount,
                discount: totalDiscount + promocodeDiscount,
                discountedAmount: finalAmount,
                comments,
                isCashless,
                appliedPromotions,
                appliedPromocode: selectedPromocode
                    ? {
                        promocodeId: selectedPromocode.id,
                        promocodeName: selectedPromocode.name,
                        promocodeCode: selectedPromocode.code,
                        discountAmount: promocodeDiscount,
                    }
                    : undefined,
            }

            updateOrder(updatedOrder)

            const discountText =
                totalDiscount + promocodeDiscount > 0 ? ` со скидкой ${totalDiscount + promocodeDiscount} ₽` : ""
            const promocodeText = selectedPromocode ? ` (промокод: ${selectedPromocode.code})` : ""

            showNotification(`Заказ №${order.id} успешно обновлен${discountText}${promocodeText}`, "success")

            router.push(`/orders/${order.id}`)
        } catch (error) {
            console.error("Error updating order:", error)
            showNotification("Ошибка при обновлении заказа", "error")
            setIsSubmitting(false)
        }
    }

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (promocodeDropdownRef.current && !promocodeDropdownRef.current.contains(event.target as Node)) {
                setShowPromocodeDropdown(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    if (!order || !client) {
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

    const clientName =
        client.type === "individual" ? `${client.surname} ${client.name} ${client.patronymic}` : client.companyName || ""

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Назад
                    </button>
                    <h1 className="text-2xl font-bold">Редактирование заказа №{order.id}</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Client Info (Read-only) */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-4">Информация о клиенте</h2>
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
                </div>

                {/* Services Section */}
                <div className="bg-[#f7f7f7] rounded-lg p-6">
                    {/* Service Search */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Поиск услуги *"
                            className={`block w-full pl-10 pr-3 py-2 border ${
                                touched.services && errors.services ? "border-[#e74c3c] bg-red-50" : "border-gray-300"
                            } rounded-full bg-white text-sm ${orderServices.length === 0 && "ring-2 ring-red-200"}`}
                            onClick={() => setShowServiceSearchModal(true)}
                            readOnly
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    {touched.services && errors.services && (
                        <div className="mb-4 p-2 bg-[#e74c3c]/10 text-[#e74c3c] rounded-md error-message">{errors.services}</div>
                    )}

                    {/* Services Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                            <tr className="text-left text-[#8e8e8e] text-xs">
                                <th className="pb-2 font-normal w-10">№</th>
                                <th className="pb-2 font-normal">Услуга</th>
                                <th className="pb-2 font-normal w-20">Кол-во *</th>
                                <th className="pb-2 font-normal w-24">Цена</th>
                                <th className="pb-2 font-normal w-24">Итого</th>
                                <th className="pb-2 font-normal w-24">Фото</th>
                                <th className="pb-2 font-normal w-24">Размер</th>
                                <th className="pb-2 font-normal w-24">Бренд</th>
                                <th className="pb-2 font-normal w-24">Цвет</th>
                                <th className="pb-2 font-normal w-28">Тех.паспорт</th>
                                <th className="pb-2 font-normal w-28">Дата готовности</th>
                                <th className="pb-2 font-normal w-10"></th>
                            </tr>
                            </thead>
                            <tbody className="bg-gray-100">
                            {orderServices.map((service, index) => (
                                <tr key={service.id} className="border-t border-gray-200">
                                    <td className="py-2 px-2 text-xs">{index + 1}</td>
                                    <td className="py-2 px-2 text-xs">
                                        <div className="flex items-center">
                                            <span>{service.serviceName}</span>
                                            {service.appliedPromotion && (
                                                <div className="ml-2 flex items-center">
                                                    <Tag className="w-3 h-3 text-green-600 mr-1" />
                                                    <span className="text-xs text-green-600 font-medium">
                              -{service.appliedPromotion.discountAmount}
                                                        {service.appliedPromotion.discountType === "percentage" ? "%" : "₽"}
                            </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 text-sm relative">
                                        <input
                                            type="text"
                                            className={`w-full px-2 py-1 border ${
                                                touched[`quantity-${service.id}`] && errors[`quantity-${service.id}`]
                                                    ? "border-[#e74c3c] bg-red-50"
                                                    : "border-gray-300"
                                            } rounded text-sm ${service.quantity <= 0 && "ring-2 ring-red-200"}`}
                                            value={service.quantity}
                                            onChange={(e) => handleQuantityChange(service.id, e.target.value)}
                                        />
                                        {touched[`quantity-${service.id}`] && errors[`quantity-${service.id}`] && (
                                            <div className="absolute -bottom-5 left-2 text-[10px] text-[#e74c3c] error-message">
                                                {errors[`quantity-${service.id}`]}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-2 px-2 text-xs">
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
                                    <td className="py-2 px-2 text-xs">
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

                                    <td className="py-2 px-2 text-xs">
                                        {service.images && service.images.length > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="relative w-10 h-10 rounded-lg overflow-hidden cursor-pointer border-2 border-[#2055a4] hover:border-[#1a4a8f] transition-colors"
                                                    onClick={() => handleOpenImageGallery(service.id, 0)}
                                                >
                                                    <img
                                                        src={service.images[0].url || "/placeholder.svg"}
                                                        alt={service.images[0].name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {service.images.length > 1 && (
                                                    <span className="text-xs text-gray-500">+{service.images.length - 1}</span>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddImage(service.id)}
                                                    className="text-[#2055a4] hover:text-[#1a4a8f] text-xs"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleAddImage(service.id)}
                                                className="flex items-center gap-1 text-[#2055a4] hover:text-[#1a4a8f] text-xs"
                                            >
                                                <Camera className="w-4 h-4" />
                                                +
                                            </button>
                                        )}
                                    </td>

                                    <td className="py-2 px-2 text-xs">
                                        <select
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                                            value={service.size || ""}
                                            onChange={(e) => handleDropdownChange(service.id, "size", e.target.value)}
                                        >
                                            <option value="">Выбрать</option>
                                            {sizes.map((size) => (
                                                <option key={size.id} value={size.name}>
                                                    {size.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td className="py-2 px-2 text-xs">
                                        <select
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                                            value={service.brand || ""}
                                            onChange={(e) => handleDropdownChange(service.id, "brand", e.target.value)}
                                        >
                                            <option value="">Выбрать</option>
                                            {brands.map((brand) => (
                                                <option key={brand.id} value={brand.name}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td className="py-2 px-2 text-xs">
                                        <select
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                                            value={service.color || ""}
                                            onChange={(e) => handleDropdownChange(service.id, "color", e.target.value)}
                                        >
                                            <option value="">Выбрать</option>
                                            {colors.map((color) => (
                                                <option key={color.id} value={color.name}>
                                                    {color.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td className="py-2 px-2 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenTechPassport(service.id)}
                                            className={`px-3 py-1 rounded-full text-xs ${
                                                service.techPassport
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        >
                                            {service.techPassport ? "Редактировать" : "Добавить"}
                                        </button>
                                    </td>

                                    <td className="py-2 px-2 text-xs">
                                        <DatePicker
                                            value={service.readyDate}
                                            onChange={(date) => handleReadyDateChange(service.id, date)}
                                            className="w-full px-2 py-1 text-sm"
                                        />
                                    </td>

                                    <td className="py-2 px-2 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveService(service.id)}
                                            className="text-[#e74c3c] hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment and Comments */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="space-y-4">
                        {/* Promocode */}
                        <div className="relative" ref={promocodeDropdownRef}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Промокод</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Выберите промокод"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-full bg-white text-sm cursor-pointer"
                                    value={
                                        selectedPromocode
                                            ? `${selectedPromocode.code} (-${selectedPromocode.discountAmount}${selectedPromocode.discountType === "percentage" ? "%" : "₽"})`
                                            : ""
                                    }
                                    onClick={() => setShowPromocodeDropdown(!showPromocodeDropdown)}
                                    readOnly
                                />
                                {selectedPromocode && (
                                    <button
                                        type="button"
                                        onClick={handleClearPromocode}
                                        className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            {showPromocodeDropdown && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {getActivePromocodes().length > 0 ? (
                                        getActivePromocodes().map((promocode) => (
                                            <button
                                                key={promocode.id}
                                                type="button"
                                                onClick={() => handlePromocodeSelect(promocode)}
                                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center"
                                            >
                                                <div>
                                                    <div className="font-medium">{promocode.code}</div>
                                                    <div className="text-xs text-gray-500">{promocode.name}</div>
                                                </div>
                                                <div className="text-sm text-green-600">
                                                    -{promocode.discountAmount}
                                                    {promocode.discountType === "percentage" ? "%" : "₽"}
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-sm text-gray-500">Нет доступных промокодов</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Payment Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Тип оплаты</label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input type="radio" checked={!isCashless} onChange={() => setIsCashless(false)} className="mr-2" />
                                    <span className="text-sm">Наличный</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" checked={isCashless} onChange={() => setIsCashless(true)} className="mr-2" />
                                    <span className="text-sm">Безналичный</span>
                                </label>
                            </div>
                        </div>

                        {/* Comments */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Комментарии</label>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                rows={3}
                                placeholder="Дополнительная информация о заказе"
                            />
                        </div>
                    </div>
                </div>

                {/* Totals */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-4">Итоги</h2>
                    <div className="space-y-2 max-w-md ml-auto">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Подытог:</span>
                            <span className="font-medium">{totalAmount.toFixed(2)} ₽</span>
                        </div>

                        {appliedPromotions.length > 0 && (
                            <div className="border-t pt-2">
                                <div className="text-sm font-medium text-gray-700 mb-2">Примененные акции:</div>
                                {appliedPromotions.map((promotion, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                    <span className="text-green-600">
                      {promotion.promotionName} (
                        {promotion.discountType === "percentage"
                            ? `${promotion.discountAmount}%`
                            : `${promotion.discountAmount} ₽`}
                        ):
                    </span>
                                        <span className="text-green-600 font-medium">-{promotion.totalDiscount.toFixed(2)} ₽</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedPromocode && promocodeDiscount > 0 && (
                            <div className="flex justify-between text-sm">
                <span className="text-purple-600">
                  Промокод "{selectedPromocode.code}" (
                    {selectedPromocode.discountType === "percentage"
                        ? `${selectedPromocode.discountAmount}%`
                        : `${selectedPromocode.discountAmount} ₽`}
                    ):
                </span>
                                <span className="text-purple-600 font-medium">-{promocodeDiscount.toFixed(2)} ₽</span>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-2">
                            <div className="flex justify-between">
                                <span className="text-lg font-semibold">Итого к оплате:</span>
                                <span className="text-lg font-bold text-green-600">{finalAmount.toFixed(2)} ₽</span>
                            </div>
                        </div>

                        {totalDiscount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Вы экономите:</span>
                                <span className="font-medium">{totalDiscount.toFixed(2)} ₽</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-[#2055a4] text-white rounded-full hover:bg-[#1a4a8f] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                    </button>
                </div>
            </form>

            {/* Modals */}
            {showAddSizeModal && (
                <AddSizeModal
                    onClose={() => setShowAddSizeModal(false)}
                    onSave={(sizeName) => {
                        addSize(sizeName)
                        setShowAddSizeModal(false)
                    }}
                />
            )}

            {showAddImageModal && currentServiceId !== null && (
                <AddImageModal onClose={() => setShowAddImageModal(false)} onAdd={handleImageSave} />
            )}

            {showServiceSearchModal && (
                <ServiceSearchModal
                    onClose={() => setShowServiceSearchModal(false)}
                    onSelect={handleServiceSelect}
                    services={services}
                />
            )}

            {showTechPassportModal && currentServiceId !== null && (
                <TechPassportModal
                    initialData={orderServices.find((s) => s.id === currentServiceId)?.techPassport}
                    onClose={() => {
                        setShowTechPassportModal(false)
                        setCurrentServiceId(null)
                    }}
                    onSave={handleSaveTechPassport}
                />
            )}

            {showImageGallery && (
                <ImageGalleryModal
                    images={galleryImages}
                    initialIndex={galleryInitialIndex}
                    onClose={handleCloseImageGallery}
                    onDelete={handleDeleteImageFromGallery}
                />
            )}
        </div>
    )
}
