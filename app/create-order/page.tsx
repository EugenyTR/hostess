"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Edit2, X, Check, Trash2, Camera, Plus, ChevronDown, Calendar, User, Tag } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import type {
  Client,
  ClientType,
  Gender,
  OrderService,
  ServiceImage,
  LegalInfo,
  OrderPromotion,
  Promotion,
  Promocode,
} from "@/types"
import AddSizeModal from "@/components/modals/AddSizeModal"
import AddImageModal from "@/components/modals/AddImageModal"
import ServiceSearchModal from "@/components/modals/ServiceSearchModal"
import TechPassportModal from "@/components/modals/TechPassportModal"
import DatePicker from "@/components/DatePicker"
import { CitySelector } from "@/components/CitySelector"
import ImageGalleryModal from "@/components/modals/ImageGalleryModal"

export default function CreateOrder() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showNotification } = useNotification()
  const {
    clients,
    services,
    sizes,
    brands,
    colors,
    referralSources,
    promotions,
    promocodes,
    addClient,
    addOrder,
    addSize,
    addService,
    calculateServicePrice,
    getServicesWithPromotions,
    getActivePromocodes,
    validatePromocode,
  } = useAppContext()

  // Получаем тип клиента из URL параметров
  const clientTypeFromUrl = searchParams.get("type") as ClientType | null

  // Client form state
  const [clientType, setClientType] = useState<ClientType>(clientTypeFromUrl === "legal" ? "legal" : "individual")
  const [surname, setSurname] = useState("")
  const [name, setName] = useState("")
  const [patronymic, setPatronymic] = useState("")
  const [gender, setGender] = useState<Gender>("M")
  const [referralSource, setReferralSource] = useState("")
  const [showReferralDropdown, setShowReferralDropdown] = useState(false)
  const [birthDate, setBirthDate] = useState("")
  const [registrationDate, setRegistrationDate] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [cityId, setCityId] = useState<number | null>(null)
  const [cityName, setCityName] = useState("")
  const [street, setStreet] = useState("")
  const [house, setHouse] = useState("")
  const [apartment, setApartment] = useState("")
  const [companyName, setCompanyName] = useState("")

  // Адрес доставки (может отличаться от адреса клиента)
  const [deliveryCityId, setDeliveryCityId] = useState<number | null>(null)
  const [deliveryCityName, setDeliveryCityName] = useState("")
  const [deliveryStreet, setDeliveryStreet] = useState("")
  const [deliveryHouse, setDeliveryHouse] = useState("")
  const [deliveryApartment, setDeliveryApartment] = useState("")
  const [useClientAddress, setUseClientAddress] = useState(true)

  // Поиск клиентов
  const [searchTerm, setSearchTerm] = useState("")
  const [showClientSearch, setShowClientSearch] = useState(false)
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Юридическое лицо
  const [legalInfo, setLegalInfo] = useState<LegalInfo>({
    inn: "",
    kpp: "",
    bik: "",
    settlementAccount: "",
    corporateAccount: "",
    legalAddress: "",
    priceList: "",
  })

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
  const referralDropdownRef = useRef<HTMLDivElement>(null)
  const promocodeDropdownRef = useRef<HTMLDivElement>(null)

  // Функция для проверки валидности даты
  const isValidDate = (date: Date): boolean => {
    return date instanceof Date && !isNaN(date.getTime())
  }

  // Устанавливаем безналичный расчет по умолчанию для юридических лиц
  useEffect(() => {
    if (clientType === "legal") {
      setIsCashless(true)
    }
  }, [clientType])

  // Синхронизация адреса доставки с адресом клиента
  useEffect(() => {
    if (useClientAddress) {
      setDeliveryCityId(cityId)
      setDeliveryCityName(cityName)
      setDeliveryStreet(street)
      setDeliveryHouse(house)
      setDeliveryApartment(apartment)
    }
  }, [useClientAddress, cityId, cityName, street, house, apartment])

  // Обработчик поиска клиентов
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients([])
      return
    }

    const filtered = clients.filter((client) => {
      const fullName =
          client.type === "individual"
              ? `${client.surname} ${client.name} ${client.patronymic}`.toLowerCase()
              : client.companyName?.toLowerCase() || ""

      return (
          fullName.includes(searchTerm.toLowerCase()) ||
          client.phone.includes(searchTerm) ||
          (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })

    setFilteredClients(filtered)
  }, [searchTerm, clients])

  // Handle clicks outside dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement

      if (referralDropdownRef.current && !referralDropdownRef.current.contains(target)) {
        setShowReferralDropdown(false)
      }
      if (promocodeDropdownRef.current && !promocodeDropdownRef.current.contains(target)) {
        setShowPromocodeDropdown(false)
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowClientSearch(false)
      }

      // Проверяем, что клик был вне любого dropdown
      if (!target.closest("[data-dropdown]") && !target.closest("[data-dropdown-menu]")) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Функция для форматирования номера телефона
  const formatPhoneNumber = (value: string): string => {
    // Удаляем все символы кроме цифр
    const digits = value.replace(/\D/g, "")

    // Если начинается с 8, заменяем на 7
    let formattedDigits = digits
    if (digits.startsWith("8")) {
      formattedDigits = "7" + digits.slice(1)
    }

    // Если не начинается с 7, добавляем 7
    if (!formattedDigits.startsWith("7")) {
      formattedDigits = "7" + formattedDigits
    }

    // Ограничиваем до 11 цифр (7 + 10)
    formattedDigits = formattedDigits.slice(0, 11)

    // Форматируем как +7 (XXX) XXX-XX-XX
    if (formattedDigits.length >= 1) {
      let formatted = "+7"
      if (formattedDigits.length > 1) {
        formatted += " (" + formattedDigits.slice(1, 4)
        if (formattedDigits.length >= 4) {
          formatted += ")"
          if (formattedDigits.length > 4) {
            formatted += " " + formattedDigits.slice(4, 7)
            if (formattedDigits.length > 7) {
              formatted += "-" + formattedDigits.slice(7, 9)
              if (formattedDigits.length > 9) {
                formatted += "-" + formattedDigits.slice(9, 11)
              }
            }
          }
        }
      }
      return formatted
    }

    return "+7"
  }

  // Выбор клиента из поиска
  const handleSelectClient = (client: Client) => {
    setClientType(client.type)
    setSurname(client.surname)
    setName(client.name)
    setPatronymic(client.patronymic)
    setGender(client.gender)
    setReferralSource(client.referralSource)
    setBirthDate(client.birthDate)
    setPhone(client.phone)
    setEmail(client.email)
    setCityId(client.address.cityId || null)
    setCityName(client.address.city)
    setStreet(client.address.street)
    setHouse(client.address.house)
    setApartment(client.address.apartment)

    if (client.type === "legal" && client.companyName) {
      setCompanyName(client.companyName)
      if (client.legalInfo) {
        setLegalInfo(client.legalInfo)
      }
      setIsCashless(true)
    }

    setSearchTerm("")
    setShowClientSearch(false)
  }

  // Handle city selection
  const handleCityChange = (selectedCityId: number | null, selectedCityName: string) => {
    setCityId(selectedCityId)
    setCityName(selectedCityName)
  }

  // Handle delivery city selection
  const handleDeliveryCityChange = (selectedCityId: number | null, selectedCityName: string) => {
    setDeliveryCityId(selectedCityId)
    setDeliveryCityName(selectedCityName)
  }

  // Handle legal info change
  const handleLegalInfoChange = (field: keyof LegalInfo, value: string) => {
    setLegalInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
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
    if (selectedPromocode) {
      const validation = validatePromocode(selectedPromocode.code, finalAmount, clientType)
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
    setErrors((prev) => ({
      ...prev,
      [`quantity-${id}`]: error,
    }))

    setTouched((prev) => ({
      ...prev,
      [`quantity-${id}`]: true,
    }))

    setOrderServices(
        orderServices.map((service) => {
          if (service.id === id) {
            // Пересчитываем цену с учетом акций
            const priceCalculation = calculateServicePrice(service.serviceId, quantity, clientType)

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
    const priceCalculation = calculateServicePrice(newServiceId, 1, clientType)

    // Проверяем, нужен ли технический паспорт для этой услуги
    const needsTechPassport = serviceName === "Биочистка"

    // Создаем дефолтный технический паспорт для биочистки
    const defaultTechPassport = needsTechPassport
        ? {
          contractNumber: "ВП № 001",
          client: "",
          executor: "",
          inn: "",
          city: "",
          street: "",
          phone: "",
          itemName: "",
          manufacturer: "",
          color: "",
          material: "",
          accessories: "",
          processingType: {
            manual: false,
            bioTechnology: true,
          },
          additionalProcessing: {
            stainRemoval: false,
            waterRepellent: false,
            atelierService: false,
          },
          lining: {
            exists: false,
            color: "",
            wear: "",
          },
          manufacturerMarking: "missing",
          contaminationDegree: "medium",
          hasHiddenDefects: false,
          hasStains: false,
          hasRoadReagentStains: false,
          wearDegree: "30%",
          colorFading: "none",
          defects: {
            textile: {
              pilling: false,
              tears: false,
              abrasion: false,
              odor: false,
            },
            fur: {
              rigidity: false,
              hairLoss: false,
              yellowness: false,
              odor: false,
            },
            leather: {
              rigidity: false,
              scratches: false,
              colorLoss: false,
              odor: false,
            },
            suede: {
              cracks: false,
              hairLoss: false,
              rigidity: false,
              odor: false,
            },
            lining: {
              heavyContamination: false,
              shine: false,
              tears: false,
              stains: false,
            },
          },
          notes: "Биочистка с использованием экологичных биотехнологий",
          clientConsent: false,
        }
        : undefined

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
      techPassport: defaultTechPassport,
    }

    setOrderServices([...orderServices, newService])
    setNextServiceId(nextServiceId + 1)
    setShowServiceSearchModal(false)
  }

  // Handle size selection
  const handleSizeSelect = (serviceId: number, size: string) => {
    setOrderServices(
        orderServices.map((service) => {
          if (service.id === serviceId) {
            return { ...service, size }
          }
          return service
        }),
    )
    setActiveDropdown(null)
  }

  // Handle brand selection
  const handleBrandSelect = (serviceId: number, brand: string) => {
    setOrderServices(
        orderServices.map((service) => {
          if (service.id === serviceId) {
            return { ...service, brand }
          }
          return service
        }),
    )
    setActiveDropdown(null)
  }

  // Handle color selection
  const handleColorSelect = (serviceId: number, color: string) => {
    setOrderServices(
        orderServices.map((service) => {
          if (service.id === serviceId) {
            return { ...service, color }
          }
          return service
        }),
    )
    setActiveDropdown(null)
  }

  // Handle tech passport toggle
  const handleTechPassportToggle = (serviceId: number, value: boolean) => {
    setOrderServices(
        orderServices.map((service) => {
          if (service.id === serviceId) {
            const defaultTechPassport = {
              contractNumber: "ВП № 001",
              client: "",
              executor: "",
              inn: "",
              city: "",
              street: "",
              phone: "",
              itemName: "",
              manufacturer: "",
              color: "",
              material: "",
              accessories: "",
              processingType: {
                manual: false,
                bioTechnology: false,
              },
              additionalProcessing: {
                stainRemoval: false,
                waterRepellent: false,
                atelierService: false,
              },
              lining: {
                exists: false,
                color: "",
                wear: "",
              },
              manufacturerMarking: "missing",
              contaminationDegree: "medium",
              hasHiddenDefects: false,
              hasStains: false,
              hasRoadReagentStains: false,
              wearDegree: "30%",
              colorFading: "none",
              defects: {
                textile: {
                  pilling: false,
                  tears: false,
                  abrasion: false,
                  odor: false,
                },
                fur: {
                  rigidity: false,
                  hairLoss: false,
                  yellowness: false,
                  odor: false,
                },
                leather: {
                  rigidity: false,
                  scratches: false,
                  colorLoss: false,
                  odor: false,
                },
                suede: {
                  cracks: false,
                  hairLoss: false,
                  rigidity: false,
                  odor: false,
                },
                lining: {
                  heavyContamination: false,
                  shine: false,
                  tears: false,
                  stains: false,
                },
              },
              notes: "",
              clientConsent: false,
            }

            return {
              ...service,
              techPassport: value ? defaultTechPassport : undefined,
            }
          }
          return service
        }),
    )
  }

  // Handle tech passport edit
  const handleEditTechPassport = (serviceId: number) => {
    setCurrentServiceId(serviceId)
    setShowTechPassportModal(true)
  }

  // Handle tech passport save
  const handleSaveTechPassport = (techPassport: any) => {
    if (currentServiceId) {
      setOrderServices(
          orderServices.map((service) => {
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
    if (!date || !isValidDate(date)) {
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

  // Handle birth date change
  const handleBirthDateChange = (date: Date) => {
    setBirthDate(formatDate(date))
  }

  // Handle registration date change
  const handleRegistrationDateChange = (date: Date) => {
    setRegistrationDate(formatDate(date))
  }

  // Функция валидации полей
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case "surname":
        return clientType === "individual" && !value.trim() ? "Фамилия обязательна" : ""
      case "name":
        return clientType === "individual" && !value.trim() ? "Имя обязательно" : ""
      case "companyName":
        return clientType === "legal" && !value.trim() ? "Название компании обязательно" : ""
      case "phone":
        if (!value.trim()) return "Телефон обязателен"
        const digits = value.replace(/\D/g, "")
        if (digits.length !== 11 || !digits.startsWith("7")) {
          return "Введите корректный номер телефона"
        }
        return ""
      case "email":
        if (!value.trim()) return "Email обязателен"
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Неверный формат email"
      case "cityId":
        return !value ? "Выберите город" : ""
      case "quantity":
        return value <= 0 ? "Количество должно быть больше 0" : ""
      default:
        return ""
    }
  }

  // Обработчик изменения полей с валидацией
  const handleFieldChange = (name: string, value: any) => {
    const error = validateField(name, value)

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))

    // Обновляем соответствующее состояние
    switch (name) {
      case "surname":
        setSurname(value)
        break
      case "name":
        setName(value)
        break
      case "patronymic":
        setPatronymic(value)
        break
      case "phone":
        setPhone(formatPhoneNumber(value))
        break
      case "email":
        setEmail(value)
        break
      case "companyName":
        setCompanyName(value)
        break
    }
  }

  // Handle form submission
  const handleSubmit = () => {
    setIsSubmitting(true)

    // Валидируем все поля
    const newErrors: Record<string, string> = {}

    if (clientType === "individual") {
      newErrors.surname = validateField("surname", surname)
      newErrors.name = validateField("name", name)
    } else {
      newErrors.companyName = validateField("companyName", companyName)
    }

    newErrors.phone = validateField("phone", phone)
    newErrors.email = validateField("email", email)
    newErrors.cityId = validateField("cityId", cityId)

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
      // Проверяем, существует ли клиент с таким телефоном
      const existingClient = clients.find((c) => c.phone === phone)

      let clientId

      if (existingClient) {
        clientId = existingClient.id
      } else {
        const newClient: Omit<Client, "id"> = {
          type: clientType,
          surname,
          name,
          patronymic,
          gender,
          referralSource,
          birthDate: clientType === "individual" ? birthDate : undefined,
          registrationDate: clientType === "legal" ? registrationDate : new Date().toISOString().split("T")[0],
          phone,
          email,
          address: {
            cityId,
            city: cityName,
            street,
            house,
            apartment,
          },
        }

        if (clientType === "legal") {
          newClient.companyName = companyName
          newClient.legalInfo = legalInfo
        }

        const client = addClient(newClient)
        clientId = client.id
      }

      // Создаем новый заказ
      const orderData = {
        clientId,
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

      const order = addOrder(orderData)

      const discountText =
          totalDiscount + promocodeDiscount > 0 ? ` со скидкой ${totalDiscount + promocodeDiscount} ₽` : ""
      const promocodeText = selectedPromocode ? ` (промокод: ${selectedPromocode.code})` : ""

      showNotification(`Заказ №${order.id} успешно создан${discountText}${promocodeText}`, "success")

      router.push("/orders")
    } catch (error) {
      console.error("Ошибка при создании заказа:", error)
      showNotification("Произошла ошибка при создании заказа", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getActivePromotions = (): Promotion[] => {
    const currentDate = new Date()
    return promotions.filter((promotion) => {
      const endDate = new Date(promotion.endDate)
      const targetAudienceMatch =
          promotion.targetAudience === "all" ||
          (promotion.targetAudience === "physical" && clientType === "individual") ||
          (promotion.targetAudience === "legal" && clientType === "legal")

      return endDate >= currentDate && targetAudienceMatch
    })
  }

  const handleOpenImageGallery = (serviceId: number, imageIndex = 0) => {
    const service = orderServices.find((s) => s.id === serviceId)
    if (service && service.images.length > 0) {
      setGalleryImages(service.images)
      setGalleryInitialIndex(imageIndex)
      setShowImageGallery(true)
    }
  }

  const handleDeleteImageFromGallery = (imageId: number) => {
    setOrderServices(
        orderServices.map((service) => {
          if (service.images.some((img) => img.id === imageId)) {
            return {
              ...service,
              images: service.images.filter((img) => img.id !== imageId),
            }
          }
          return service
        }),
    )

    // Обновляем галерею
    setGalleryImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  return (
      <div className="p-6">
        {/* Navigation Buttons */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2c2c33] mb-2">Создание заказа</h1>
            <p className="text-gray-600">Выберите тип клиента для оформления заказа</p>
          </div>
          <div className="flex space-x-4">
            <button
                onClick={() => router.push("/create-order")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                    !clientTypeFromUrl || clientTypeFromUrl === "individual"
                        ? "bg-[#2055a4] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Физическое лицо
            </button>
            <button
                onClick={() => router.push("/create-order/legal")}
                className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Юридическое лицо
            </button>
          </div>
        </div>

        <div className="bg-[#f7f7f7] rounded-lg p-6 mb-6">
          {/* Client Search */}
          <div className="flex items-center mb-6">
            <div className="relative flex-1 mr-6" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                  type="text"
                  placeholder="Поиск клиента"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowClientSearch(true)
                  }}
                  onClick={() => setShowClientSearch(true)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white text-sm"
              />

              {showClientSearch && filteredClients.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredClients.map((client) => (
                        <div
                            key={client.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => handleSelectClient(client)}
                        >
                          <div className="w-8 h-8 rounded-full bg-[#2055a4] flex items-center justify-center text-white mr-2">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {client.type === "individual"
                                  ? `${client.surname} ${client.name} ${client.patronymic}`
                                  : client.companyName}
                            </div>
                            <div className="text-xs text-gray-500">{client.phone}</div>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-[#2c2c33]">Физ.лицо</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                    type="radio"
                    className="sr-only"
                    checked={clientType === "individual"}
                    onChange={() => setClientType("individual")}
                />
                <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        clientType === "individual" ? "border-[#2055a4]" : "border-gray-300"
                    }`}
                >
                  {clientType === "individual" && <div className="w-3 h-3 rounded-full bg-[#2055a4]"></div>}
                </div>
              </label>

              <span className="text-[#2c2c33] ml-4">Юр.лицо</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                    type="radio"
                    className="sr-only"
                    checked={clientType === "legal"}
                    onChange={() => {
                      setClientType("legal")
                      setIsCashless(true)
                    }}
                />
                <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        clientType === "legal" ? "border-[#2055a4]" : "border-gray-300"
                    }`}
                >
                  {clientType === "legal" && <div className="w-3 h-3 rounded-full bg-[#2055a4]"></div>}
                </div>
              </label>
            </div>
          </div>

          {/* Client Information */}
          <h2 className="text-[#2c2c33] text-lg mb-4">Информация о клиенте</h2>

          {clientType === "legal" && (
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-6 relative">
                  <input
                      type="text"
                      placeholder="Название компании *"
                      value={companyName}
                      onChange={(e) => handleFieldChange("companyName", e.target.value)}
                      className={`w-full px-3 py-2 border ${
                          touched.companyName && errors.companyName ? "border-[#e74c3c] bg-red-50" : "border-gray-300"
                      } rounded-full text-sm ${!companyName && "ring-2 ring-red-200"}`}
                  />
                  {touched.companyName && errors.companyName && (
                      <div className="absolute -bottom-5 left-2 text-[10px] text-[#e74c3c] error-message">
                        {errors.companyName}
                      </div>
                  )}
                </div>
                <div className="col-span-6 relative">
                  <CitySelector
                      value={cityId}
                      onChange={(selectedCityId, selectedCityName) => {
                        handleCityChange(selectedCityId, selectedCityName)
                        handleFieldChange("cityId", selectedCityId)
                      }}
                      placeholder="Выберите город *"
                      className={`w-full ${touched.cityId && errors.cityId ? "border-[#e74c3c] bg-red-50 ring-2 ring-red-200" : ""} ${!cityId && "ring-2 ring-red-200"}`}
                  />
                  {touched.cityId && errors.cityId && (
                      <div className="absolute -bottom-5 left-2 text-[10px] text-[#e74c3c] error-message">
                        {errors.cityId}
                      </div>
                  )}
                </div>
              </div>
          )}

          {clientType === "legal" && (
              <>
                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-6">
                    <input
                        type="text"
                        placeholder="ИНН"
                        value={legalInfo.inn}
                        onChange={(e) => handleLegalInfoChange("inn", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm"
                    />
                  </div>
                  <div className="col-span-6">
                    <input
                        type="text"
                        placeholder="КПП"
                        value={legalInfo.kpp}
                        onChange={(e) => handleLegalInfoChange("kpp", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-6">
                    <input
                        type="text"
                        placeholder="БИК"
                        value={legalInfo.bik}
                        onChange={(e) => handleLegalInfoChange("bik", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm"
                    />
                  </div>
                  <div className="col-span-6">
                    <input
                        type="text"
                        placeholder="Расчетный счет"
                        value={legalInfo.settlementAccount}
                        onChange={(e) => handleLegalInfoChange("settlementAccount", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-6">
                    <input
                        type="text"
                        placeholder="Корп. счет"
                        value={legalInfo.corporateAccount}
                        onChange={(e) => handleLegalInfoChange("corporateAccount", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm"
                    />
                  </div>
                  <div className="col-span-6">
                    <div className="relative w-full">
                      <input
                          type="text"
                          placeholder="Прайс-лист"
                          value={legalInfo.priceList}
                          onChange={(e) => handleLegalInfoChange("priceList", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-12">
                    <input
                        type="text"
                        placeholder="Юридический адрес"
                        value={legalInfo.legalAddress}
                        onChange={(e) => handleLegalInfoChange("legalAddress", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm"
                    />
                  </div>
                </div>
              </>
          )}

          <div className="grid grid-cols-12 gap-4">
            {clientType === "individual" && (
                <>
                  <div className="col-span-3 relative">
                    <input
                        type="text"
                        placeholder="Фамилия *"
                        value={surname}
                        onChange={(e) => handleFieldChange("surname", e.target.value)}
                        className={`w-full px-3 py-2 border ${
                            touched.surname && errors.surname ? "border-[#e74c3c] bg-red-50" : "border-gray-300"
                        } rounded-full text-sm ${!surname && "ring-2 ring-red-200"}`}
                    />
                    {touched.surname && errors.surname && (
                        <div className="absolute -bottom-5 left-2 text-[10px] text-[#e74c3c] error-message">
                          {errors.surname}
                        </div>
                    )}
                  </div>
                  <div className="col-span-3 relative">
                    <input
                        type="text"
                        placeholder="Имя *"
                        value={name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className={`w-full px-3 py-2 border ${
                            touched.name && errors.name ? "border-[#e74c3c] bg-red-50" : "border-gray-300"
                        } rounded-full text-sm ${!name && "ring-2 ring-red-200"}`}
                    />
                    {touched.name && errors.name && (
                        <div className="absolute -bottom-5 left-2 text-[10px] text-[#e74c3c] error-message">
                          {errors.name}
                        </div>
                    )}
                  </div>
                  <div className="col-span-3">
                    <input
                        type="text"
                        placeholder="Отчество"
                        value={patronymic}
                        onChange={(e) => setPatronymic(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm"
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center space-x-1">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="radio" className="sr-only" checked={gender === "M"} onChange={() => setGender("M")} />
                      <div
                          className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                              gender === "M" ? "bg-[#2055a4] text-white" : "border-gray-300 text-gray-500"
                          }`}
                      >
                        М
                      </div>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="radio" className="sr-only" checked={gender === "F"} onChange={() => setGender("F")} />
                      <div
                          className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                              gender === "F" ? "bg-[#2055a4] text-white" : "border-gray-300 text-gray-500"
                          }`}
                      >
                        Ж
                      </div>
                    </label>
                  </div>
                </>
            )}
            <div className="col-span-2 relative" ref={referralDropdownRef}>
              <div
                  className="relative w-full cursor-pointer"
                  onClick={() => setShowReferralDropdown(!showReferralDropdown)}
              >
                <input
                    type="text"
                    placeholder="Откуда о нас узнали"
                    value={referralSource}
                    readOnly
                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-full text-sm cursor-pointer"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {showReferralDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                    {referralSources.map((source) => (
                        <div
                            key={source}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              setReferralSource(source)
                              setShowReferralDropdown(false)
                            }}
                        >
                          {source}
                        </div>
                    ))}
                  </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 mt-4">
            <div className="col-span-3">
              {clientType === "individual" ? (
                  <DatePicker
                      value={birthDate}
                      onChange={handleBirthDateChange}
                      placeholder="Дата рождения"
                      icon={<Calendar className="h-4 w-4 text-gray-400" />}
                  />
              ) : (
                  <DatePicker
                      value={registrationDate}
                      onChange={handleRegistrationDateChange}
                      placeholder="Дата регистрации"
                      icon={<Calendar className="h-4 w-4 text-gray-400" />}
                  />
              )}
            </div>
            <div className="col-span-3 relative">
              <input
                  type="text"
                  placeholder="Телефон *"
                  value={phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  className={`w-full px-3 py-2 border ${
                      touched.phone && errors.phone ? "border-[#e74c3c] bg-red-50" : "border-gray-300"
                  } rounded-full text-sm ${!phone && "ring-2 ring-red-200"}`}
              />
              {touched.phone && errors.phone && (
                  <div className="absolute -bottom-5 left-2 text-[10px] text-[#e74c3c] error-message">{errors.phone}</div>
              )}
            </div>
            <div className="col-span-3 relative">
              <input
                  type="text"
                  placeholder="E-mail *"
                  value={email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className={`w-full px-3 py-2 border ${
                      touched.email && errors.email ? "border-[#e74c3c] bg-red-50" : "border-gray-300"
                  } rounded-full text-sm ${!email && "ring-2 ring-red-200"}`}
              />
              {touched.email && errors.email && (
                  <div className="absolute -bottom-5 left-2 text-[10px] text-[#e74c3c] error-message">{errors.email}</div>
              )}
            </div>
          </div>

          {clientType === "individual" && (
              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-3 relative">
                  <CitySelector
                      value={cityId}
                      onChange={(selectedCityId, selectedCityName) => {
                        handleCityChange(selectedCityId, selectedCityName)
                        handleFieldChange("cityId", selectedCityId)
                      }}
                      placeholder="Выберите город *"
                      className={`w-full ${touched.cityId && errors.cityId ? "border-[#e74c3c] bg-red-50 ring-2 ring-red-200" : ""} ${!cityId && "ring-2 ring-red-200"}`}
                  />
                  {touched.cityId && errors.cityId && (
                      <div className="absolute -bottom-5 left-2 text-[10px] text-[#e74c3c] error-message">
                        {errors.cityId}
                      </div>
                  )}
                </div>
                <div className="col-span-3">
                  <input
                      type="text"
                      placeholder="Улица"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <input
                      type="text"
                      placeholder="Дом"
                      value={house}
                      onChange={(e) => setHouse(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <input
                      type="text"
                      placeholder="Кв"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm"
                  />
                </div>
              </div>
          )}

          {/* Адрес доставки */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#2c2c33] text-lg">Адрес доставки</h3>
              <label className="flex items-center">
                <input
                    type="checkbox"
                    checked={useClientAddress}
                    onChange={(e) => setUseClientAddress(e.target.checked)}
                    className="h-4 w-4 text-[#2055a4] focus:ring-[#2055a4] border-gray-300 rounded mr-2"
                />
                <span className="text-sm text-[#2c2c33]">Использовать адрес клиента</span>
              </label>
            </div>

            {!useClientAddress && (
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3">
                    <CitySelector
                        value={deliveryCityId}
                        onChange={handleDeliveryCityChange}
                        placeholder="Выберите город доставки"
                        className="w-full"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                        type="text"
                        placeholder="Улица"
                        value={deliveryStreet}
                        onChange={(e) => setDeliveryStreet(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                        type="text"
                        placeholder="Дом"
                        value={deliveryHouse}
                        onChange={(e) => setDeliveryHouse(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                        type="text"
                        placeholder="Кв"
                        value={deliveryApartment}
                        onChange={(e) => setDeliveryApartment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-full text-sm"
                    />
                  </div>
                </div>
            )}
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
              <tr className="text-left text-[#8e8e8e] text-sm">
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
                    <td className="py-3 px-4 text-sm">{index + 1}</td>
                    <td className="py-3 px-4 text-sm">
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
                    <td className="py-3 px-4 text-sm relative">
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
                    <td className="py-3 px-4 text-sm">
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
                    <td className="py-3 px-4 text-sm">
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

                    <td className="py-3 px-4 text-sm">
                      {service.images.length > 0 ? (
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
                                onClick={() => {
                                  setCurrentServiceId(service.id)
                                  setShowAddImageModal(true)
                                }}
                                className="text-[#2055a4] hover:text-[#1a4a8f] text-xs"
                            >
                              Добавить
                            </button>
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

                    <td className="py-3 px-4 text-sm relative">
                      <div
                          data-dropdown="size"
                          className="flex items-center justify-between border border-gray-300 rounded px-2 py-1 cursor-pointer bg-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveDropdown(activeDropdown === `size-${service.id}` ? null : `size-${service.id}`)
                          }}
                      >
                        <span>{service.size || "Выбрать"}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>

                      {activeDropdown === `size-${service.id}` && (
                          <div
                              data-dropdown-menu
                              className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg"
                          >
                            <div className="p-1 border-b border-gray-200 text-xs text-gray-500">Другое</div>
                            {sizes.map((size) => (
                                <div
                                    key={size.id}
                                    className="p-1 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSizeSelect(service.id, size.name)
                                    }}
                                >
                                  {size.name}
                                </div>
                            ))}
                            <div
                                className="p-1 hover:bg-gray-100 cursor-pointer text-sm flex items-center text-[#2055a4]"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowAddSizeModal(true)
                                  setCurrentServiceId(service.id)
                                  setActiveDropdown(null)
                                }}
                            >
                              <Plus className="w-3 h-3 mr-1" /> Добавить размер
                            </div>
                          </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm relative">
                      <div
                          data-dropdown="brand"
                          className="flex items-center justify-between border border-gray-300 rounded px-2 py-1 cursor-pointer bg-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveDropdown(activeDropdown === `brand-${service.id}` ? null : `brand-${service.id}`)
                          }}
                      >
                        <span>{service.brand || "Выбрать"}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>

                      {activeDropdown === `brand-${service.id}` && (
                          <div
                              data-dropdown-menu
                              className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg"
                          >
                            <div className="p-1 border-b border-gray-200 text-xs text-gray-500">Другое</div>
                            {brands.map((brand) => (
                                <div
                                    key={brand.id}
                                    className="p-1 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleBrandSelect(service.id, brand.name)
                                    }}
                                >
                                  {brand.name}
                                </div>
                            ))}
                          </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm relative">
                      <div
                          data-dropdown="color"
                          className="flex items-center justify-between border border-gray-300 rounded px-2 py-1 cursor-pointer bg-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveDropdown(activeDropdown === `color-${service.id}` ? null : `color-${service.id}`)
                          }}
                      >
                        <span>{service.color || "Выбрать"}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>

                      {activeDropdown === `color-${service.id}` && (
                          <div
                              data-dropdown-menu
                              className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg"
                          >
                            <div className="p-1 border-b border-gray-200 text-xs text-gray-500">Другое</div>
                            {colors.map((color) => (
                                <div
                                    key={color.id}
                                    className="p-1 hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleColorSelect(service.id, color.name)
                                    }}
                                >
                                  {color.name}
                                </div>
                            ))}
                          </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center">
                        {service.techPassport ? (
                            <div
                                className="w-6 h-6 bg-[#4ab577] rounded-full flex items-center justify-center text-white cursor-pointer"
                                onClick={() => handleTechPassportToggle(service.id, false)}
                            >
                              <Check className="w-4 h-4" />
                            </div>
                        ) : (
                            <div
                                className="w-6 h-6 bg-[#e74c3c] rounded-full flex items-center justify-center text-white cursor-pointer"
                                onClick={() => handleTechPassportToggle(service.id, true)}
                            >
                              <X className="w-4 h-4" />
                            </div>
                        )}
                        <Edit2
                            className="w-4 h-4 ml-2 text-gray-400 cursor-pointer"
                            onClick={() => handleEditTechPassport(service.id)}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm relative">
                      <DatePicker
                          value={service.readyDate}
                          onChange={(date) => handleReadyDateChange(service.id, date)}
                          className="w-24"
                      />
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Trash2
                          className="w-4 h-4 text-gray-400 cursor-pointer"
                          onClick={() => handleRemoveService(service.id)}
                      />
                    </td>
                  </tr>
              ))}
              </tbody>
              <tfoot>
              <tr className="border-t border-gray-200">
                <td colSpan={2} className="py-3 px-4 text-sm font-medium">
                  Итого:
                </td>
                <td colSpan={2} className="py-3 px-4 text-sm">
                  <div className="relative" ref={promocodeDropdownRef}>
                    <div
                        className="flex items-center justify-between border border-gray-300 rounded px-2 py-1 cursor-pointer bg-white"
                        onClick={() => setShowPromocodeDropdown(!showPromocodeDropdown)}
                    >
                      <span className={selectedPromocode ? "text-green-600 font-medium" : "text-gray-500"}>
                        {selectedPromocode ? selectedPromocode.code : "ПРОМОКОД"}
                      </span>
                      <div className="flex items-center">
                        {selectedPromocode && (
                            <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleClearPromocode()
                                }}
                                className="mr-2 text-gray-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                        )}
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    {showPromocodeDropdown && (
                        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {getActivePromocodes()
                              .filter((promocode) => {
                                return (
                                    promocode.targetAudience === "all" ||
                                    (promocode.targetAudience === "physical" && clientType === "individual") ||
                                    (promocode.targetAudience === "legal" && clientType === "legal")
                                )
                              })
                              .map((promocode) => (
                                  <div
                                      key={promocode.id}
                                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                      onClick={() => handlePromocodeSelect(promocode)}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <Tag className="w-4 h-4 text-blue-600 mr-2" />
                                        <span className="font-medium text-gray-900">{promocode.code}</span>
                                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    -{promocode.discountAmount}
                                          {promocode.discountType === "percentage" ? "%" : "₽"}
                                  </span>
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">{promocode.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {promocode.minOrderAmount && `Мин. заказ: ${promocode.minOrderAmount}₽`}
                                      {promocode.minOrderAmount && promocode.maxDiscountAmount && " • "}
                                      {promocode.maxDiscountAmount && `Макс. скидка: ${promocode.maxDiscountAmount}₽`}
                                    </div>
                                  </div>
                              ))}
                          {getActivePromocodes().filter((promocode) => {
                            return (
                                promocode.targetAudience === "all" ||
                                (promocode.targetAudience === "physical" && clientType === "individual") ||
                                (promocode.targetAudience === "legal" && clientType === "legal")
                            )
                          }).length === 0 && (
                              <div className="p-4 text-center text-gray-500">
                                <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>Нет доступных промокодов</p>
                              </div>
                          )}
                        </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex flex-col">
                    {(totalDiscount > 0 || promocodeDiscount > 0) && (
                        <span className="line-through text-gray-400 text-xs">{totalAmount} ₽</span>
                    )}
                    <span
                        className={`font-medium ${totalDiscount > 0 || promocodeDiscount > 0 ? "text-green-600" : ""}`}
                    >
                      {finalAmount} ₽
                    </span>
                  </div>
                </td>
                <td colSpan={6}></td>
              </tr>
              {(totalDiscount > 0 || promocodeDiscount > 0) && (
                  <tr className="border-t border-gray-200">
                    <td colSpan={4} className="py-2 px-4 text-sm font-medium text-right text-green-600">
                      Экономия:
                    </td>
                    <td className="py-2 px-4 text-sm font-medium text-green-600">
                      {totalDiscount + promocodeDiscount} ₽
                      {promocodeDiscount > 0 && (
                          <div className="text-xs text-gray-500">(промокод: {promocodeDiscount} ₽)</div>
                      )}
                    </td>
                    <td colSpan={6}></td>
                  </tr>
              )}
              </tfoot>
            </table>
          </div>

          {/* Applied Promotions */}
          {appliedPromotions.length > 0 && (
              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Примененные акции:</h3>
                {appliedPromotions.map((promotion) => (
                    <div key={promotion.promotionId} className="flex items-center text-sm">
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full flex items-center">
                        <Tag className="w-4 h-4 mr-2" />
                        <span className="font-medium">{promotion.promotionName}</span>
                        <span className="ml-2">
                    -{promotion.discountAmount}
                          {promotion.discountType === "percentage" ? "%" : "₽"}
                  </span>
                        <span className="ml-2 text-green-600">(экономия: {promotion.totalDiscount} ₽)</span>
                      </div>
                    </div>
                ))}
              </div>
          )}

          {/* Действующие акции */}
          <div className="mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Действующие акции:</h4>
              <div className="space-y-2">
                {getActivePromotions().map((promotion) => (
                    <div
                        key={promotion.id}
                        className="flex items-center justify-between bg-white rounded-md p-3 border border-blue-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="font-medium text-gray-900">{promotion.name}</span>
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        -{promotion.discountAmount}
                            {promotion.discountType === "percentage" ? "%" : "₽"}
                      </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{promotion.description}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span>
                        Для:{" "}
                        {promotion.targetAudience === "all"
                            ? "всех клиентов"
                            : promotion.targetAudience === "physical"
                                ? "физ. лиц"
                                : "юр. лиц"}
                      </span>
                          <span className="mx-2">•</span>
                          <span>До: {new Date(promotion.endDate).toLocaleDateString("ru-RU")}</span>
                        </div>
                      </div>
                    </div>
                ))}
                {getActivePromotions().length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Нет действующих акций</p>
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Type */}
          <div className="mt-6 flex items-center space-x-4">
            <span className="text-[#2c2c33]">Безнал.</span>
            <label className="inline-flex items-center cursor-pointer">
              <input type="radio" className="sr-only" checked={isCashless} onChange={() => setIsCashless(true)} />
              <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isCashless ? "border-[#2055a4]" : "border-gray-300"
                  }`}
              >
                {isCashless && <div className="w-3 h-3 rounded-full bg-[#2055a4]"></div>}
              </div>
            </label>

            <span className="text-[#2c2c33] ml-4">Нал.</span>
            <label className="inline-flex items-center cursor-pointer">
              <input type="radio" className="sr-only" checked={!isCashless} onChange={() => setIsCashless(false)} />
              <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      !isCashless ? "border-[#2055a4]" : "border-gray-300"
                  }`}
              >
                {!isCashless && <div className="w-3 h-3 rounded-full bg-[#2055a4]"></div>}
              </div>
            </label>
          </div>

          {/* Comments */}
          <div className="mt-6">
          <textarea
              placeholder="Комментарии к заказу"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
              rows={3}
          />
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`${
                    isSubmitting ? "bg-gray-400" : "bg-[#2055a4] hover:bg-[#1a4a8f]"
                } text-white px-8 py-2 rounded-full transition-colors flex items-center`}
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
              {isSubmitting ? "Оформление..." : "Оформить заказ"}
            </button>
          </div>
        </div>

        {/* Modals */}
        {showAddSizeModal && (
            <AddSizeModal
                onClose={() => setShowAddSizeModal(false)}
                onAdd={(name) => {
                  addSize(name)
                  if (currentServiceId) {
                    handleSizeSelect(currentServiceId, name)
                  }
                  setShowAddSizeModal(false)
                }}
            />
        )}

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
                services={getServicesWithPromotions()}
                onClose={() => setShowServiceSearchModal(false)}
                onSelect={handleServiceSelect}
            />
        )}

        {showTechPassportModal && currentServiceId && (
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
                onClose={() => setShowImageGallery(false)}
                onDelete={handleDeleteImageFromGallery}
            />
        )}
      </div>
  )
}
