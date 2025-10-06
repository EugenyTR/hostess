"use client"

import { createContext, useState, type ReactNode, useContext } from "react"
import type {
  Client,
  Order,
  Service,
  Size,
  Brand,
  Color,
  StatusHistory,
  StatusStatistics,
  Survey,
  City,
  CityStatistics,
  OrderStatus,
  Promotion,
  Point,
  ExpenseCategory,
  Promocode,
  Warehouse,
  Contractor,
  PaymentType,
  CashShift,
  CashOperation,
  CashOperationDetails,
  CashOperationFilters,
} from "@/types"

// Add nomenclature interface
interface NomenclatureItem {
  id: number
  name: string
  article: string
  basePrice: number
  markup: number
  finalPrice: number
  warehouse: string
  defaultQuantity: number
  status: "active" | "inactive"
  category: string
}

interface AppContextType {
  // Клиенты
  clients: Client[]
  addClient: (client: Omit<Client, "id">) => Client
  updateClient: (client: Client) => void
  deleteClient: (id: number) => void
  getClientById: (id: number) => Client | null

  // Источники рефералов
  referralSources: string[]
  addReferralSource: (source: string) => void
  deleteReferralSource: (source: string) => void

  // Заказы
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => Order
  updateOrder: (order: Order) => void
  deleteOrder: (id: number) => void
  updateOrderStatus: (orderId: number, status: OrderStatus, changedBy: string) => void
  getOrderStatusHistory: (orderId: number) => StatusHistory[]
  getOrdersByClientId: (clientId: number) => Order[]

  // Услуги
  services: Service[]
  addService: (service: Omit<Service, "id" | "isActive" | "createdAt" | "updatedAt">) => Service
  updateService: (service: Service) => void
  deleteService: (id: number) => void
  getServiceById: (id: number) => Service | null
  getServicesWithPromotions: () => Service[]

  // Акции
  promotions: Promotion[]
  addPromotion: (promotion: Omit<Promotion, "id">) => Promotion
  updatePromotion: (promotion: Promotion) => void
  deletePromotion: (id: number) => void
  getActivePromotions: () => Promotion[]
  getPromotionForService: (serviceId: number, clientType?: "individual" | "legal") => Promotion | null
  calculateServicePrice: (
    serviceId: number,
    quantity: number,
    clientType?: "individual" | "legal",
  ) => {
    originalPrice: number
    finalPrice: number
    appliedPromotion?: Promotion
    discount: number
  }

  // Размеры, бренды, цвета
  sizes: Size[]
  addSize: (size: Omit<Size, "id" | "isActive" | "createdAt" | "updatedAt">) => Size
  updateSize: (size: Size) => void
  deleteSize: (id: number) => void

  brands: Brand[]
  addBrand: (brand: Brand) => void
  updateBrand: (brand: Brand) => void
  deleteBrand: (id: number) => void

  colors: Color[]
  addColor: (color: Color) => void
  updateColor: (color: Color) => void
  deleteColor: (id: number) => void

  // Cities
  cities: City[]
  addCity: (city: City) => void
  updateCity: (city: City) => void
  deleteCity: (id: number) => void
  getCityById: (id: number) => City | null
  getCityStatistics: () => CityStatistics[]
  getCityStatisticsById: (cityId: number) => CityStatistics | null

  // Точки
  points: Point[]
  addPoint: (point: Omit<Point, "id">) => void
  updatePoint: (point: Point) => void
  deletePoint: (id: number) => void
  getPointById: (id: number) => Point | null
  getPointStatistics: (pointId: number) => any

  // Услуги клиентов (только для юр. лиц)
  assignServiceToClient: (clientId: number, serviceId: number) => void
  removeServiceFromClient: (clientId: number, serviceId: number) => void
  getClientServices: (clientId: number) => Service[]

  // Статьи расходов
  expenseCategories: ExpenseCategory[]
  addExpenseCategory: (
    category: Omit<ExpenseCategory, "id" | "isActive" | "createdAt" | "updatedAt">,
  ) => ExpenseCategory
  updateExpenseCategory: (category: ExpenseCategory) => void
  deleteExpenseCategory: (id: number) => void
  getExpenseCategoryById: (id: number) => ExpenseCategory | null

  // Промокоды
  promocodes: Promocode[]
  addPromocode: (promocode: Omit<Promocode, "id">) => Promocode
  updatePromocode: (promocode: Promocode) => void
  deletePromocode: (id: number) => void
  getActivePromocodes: () => Promocode[]
  validatePromocode: (code: string, orderAmount: number, clientType: "individual" | "legal") => Promocode | null

  // Склады
  warehouses: Warehouse[]
  addWarehouse: (warehouse: Omit<Warehouse, "id" | "isActive" | "createdAt" | "updatedAt">) => Warehouse
  updateWarehouse: (warehouse: Warehouse) => void
  deleteWarehouse: (id: number) => void
  getWarehouseById: (id: number) => Warehouse | null

  // Контрагенты
  contractors: Contractor[]
  addContractor: (contractor: Omit<Contractor, "id" | "isActive" | "createdAt" | "updatedAt">) => Contractor
  updateContractor: (contractor: Contractor) => void
  deleteContractor: (id: number) => void
  getContractorById: (id: number) => Contractor | null

  // Типы оплат
  paymentTypes: PaymentType[]
  addPaymentType: (paymentType: Omit<PaymentType, "id" | "isActive" | "createdAt" | "updatedAt">) => PaymentType
  updatePaymentType: (paymentType: PaymentType) => void
  deletePaymentType: (id: number) => void
  getPaymentTypeById: (id: number) => PaymentType | null

  // Кассовые смены
  cashShifts: CashShift[]
  addCashShift: (cashShift: Omit<CashShift, "id" | "createdAt" | "updatedAt">) => CashShift
  updateCashShift: (cashShift: CashShift) => void
  deleteCashShift: (id: number) => void
  getCashShiftById: (id: number) => CashShift | null
  closeCashShift: (id: number, closedBy: string, closeData: Partial<CashShift>) => void

  // Кассовые операции
  cashOperations: CashOperation[]
  addCashOperation: (operation: CashOperation) => void
  updateCashOperation: (id: number, operation: Partial<CashOperation>) => void
  deleteCashOperation: (id: number) => void
  getCashOperationDetails: (id: number) => CashOperationDetails | null
  getFilteredCashOperations: (filters: CashOperationFilters) => CashOperation[]

  // Номенклатура
  nomenclature: NomenclatureItem[]
  setNomenclature: (nomenclature: NomenclatureItem[]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Mock data for nomenclature
const mockNomenclature: NomenclatureItem[] = [
  {
    id: 1,
    name: "Биочистка Premium",
    article: "BIO-001",
    basePrice: 1000,
    markup: 15,
    finalPrice: 1150,
    warehouse: "Основной склад",
    defaultQuantity: 1,
    status: "active",
    category: "Химия",
  },
  {
    id: 2,
    name: "Пятновыводитель универсальный",
    article: "STAIN-002",
    basePrice: 500,
    markup: 20,
    finalPrice: 600,
    warehouse: "Склад №2",
    defaultQuantity: 2,
    status: "active",
    category: "Покрасочные средства",
  },
  {
    id: 3,
    name: "Кондиционер для меха",
    article: "FUR-003",
    basePrice: 800,
    markup: 25,
    finalPrice: 1000,
    warehouse: "Основной склад",
    defaultQuantity: 1,
    status: "active",
    category: "Мех",
  },
  {
    id: 4,
    name: "Средство для деликатных тканей",
    article: "DELICATE-004",
    basePrice: 600,
    markup: 18,
    finalPrice: 708,
    warehouse: "Склад №3",
    defaultQuantity: 1,
    status: "inactive",
    category: "Домашний текстиль",
  },
  {
    id: 5,
    name: "Очиститель для кожи",
    article: "LEATHER-005",
    basePrice: 750,
    markup: 22,
    finalPrice: 915,
    warehouse: "Основной склад",
    defaultQuantity: 1,
    status: "active",
    category: "Сумки",
  },
  {
    id: 6,
    name: "Отбеливатель кислородный",
    article: "BLEACH-006",
    basePrice: 400,
    markup: 30,
    finalPrice: 520,
    warehouse: "Склад №2",
    defaultQuantity: 3,
    status: "active",
    category: "Прачечные услуги",
  },
  {
    id: 7,
    name: "Антистатик для синтетики",
    article: "ANTI-007",
    basePrice: 350,
    markup: 15,
    finalPrice: 402.5,
    warehouse: "Временный склад",
    defaultQuantity: 2,
    status: "active",
    category: "Химия",
  },
  {
    id: 8,
    name: "Краситель текстильный черный",
    article: "DYE-008",
    basePrice: 900,
    markup: 28,
    finalPrice: 1152,
    warehouse: "Основной склад",
    defaultQuantity: 1,
    status: "active",
    category: "Покрасочные средства",
  },
]

// Моковые данные для клиентов
const mockClients: Client[] = [
  {
    id: 1,
    type: "individual",
    surname: "Иванов",
    name: "Иван",
    patronymic: "Иванович",
    gender: "M",
    phone: "+7 (999) 123-45-67",
    email: "ivanov@example.com",
    birthDate: "1985-05-15",
    registrationDate: "2023-01-10",
    referralSource: "Реклама в интернете",
    address: {
      cityId: 1,
      city: "Москва",
      street: "Ленина",
      house: "10",
      apartment: "42",
    },
  },
  {
    id: 2,
    type: "legal",
    surname: "Петров",
    name: "Петр",
    patronymic: "Петрович",
    gender: "M",
    phone: "+7 (999) 765-43-21",
    email: "petrov@example.com",
    registrationDate: "2023-02-15",
    companyName: "ООО Рога и Копыта",
    referralSource: "Рекомендация",
    address: {
      cityId: 2,
      city: "Санкт-Петербург",
      street: "Невский проспект",
      house: "15",
      apartment: "301",
    },
    legalInfo: {
      inn: "1234567890",
      kpp: "123456789",
      bik: "987654321",
      settlementAccount: "40702810123456789012",
      corporateAccount: "30101810123456789012",
      legalAddress: "г. Санкт-Петербург, Невский проспект, д. 15, оф. 301",
      priceList: "Стандартный",
    },
  },
  {
    id: 3,
    type: "individual",
    surname: "Сидорова",
    name: "Мария",
    patronymic: "Александровна",
    gender: "F",
    phone: "+7 (999) 111-22-33",
    email: "sidorova@example.com",
    birthDate: "1990-10-20",
    registrationDate: "2023-03-05",
    referralSource: "Социальные сети",
    address: {
      cityId: 3,
      city: "Казань",
      street: "Баумана",
      house: "5",
      apartment: "12",
    },
  },
]

// Обновляем моковые данные акций на 2025 год
const mockPromotions: Promotion[] = [
  {
    id: 1,
    name: "Скидка новичкам",
    discountAmount: 15,
    discountType: "percentage",
    description: "Скидка 15% для новых клиентов",
    targetAudience: "physical",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "active",
    locations: ["Москва, Чертановская, 26к2", "Сочи, Красная, 15"],
    applicableServices: [1, 2],
  },
  {
    id: 2,
    name: "Корпоративная скидка",
    discountAmount: 500,
    discountType: "fixed",
    description: "Фиксированная скидка 500₽ для юридических лиц",
    targetAudience: "legal",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "active",
    locations: ["Москва, Чертановская, 26к2"],
    applicableServices: [2, 3],
  },
  {
    id: 3,
    name: "Летняя акция",
    discountAmount: 20,
    discountType: "percentage",
    description: "Летняя скидка 20% на все услуги",
    targetAudience: "all",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    status: "active",
    locations: ["Москва, Чертановская, 26к2", "Сочи, Красная, 15"],
    applicableServices: [1, 2, 3, 4],
  },
  {
    id: 4,
    name: "Универсальная скидка",
    discountAmount: 10,
    discountType: "percentage",
    description: "Скидка 10% для всех клиентов",
    targetAudience: "all",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "active",
    locations: ["Москва, Чертановская, 26к2", "Сочи, Красная, 15"],
    applicableServices: [1, 2, 3, 4],
  },
]

// Моковые данные для услуг (обновленные с учетом акций)
const mockServices: Service[] = [
  {
    id: 1,
    name: "Химчистка куртки",
    price: 1500,
    category: "Верхняя одежда",
    description: "Химчистка куртки любой сложности",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 2,
    name: "Химчистка костюма",
    price: 2500,
    category: "Деловая одежда",
    description: "Химчистка делового костюма",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 3,
    name: "Глажка рубашки",
    price: 300,
    category: "Деловая одежда",
    description: "Профессиональная глажка рубашки",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 4,
    name: "Химчистка платья",
    price: 1800,
    category: "Вечерняя одежда",
    description: "Химчистка вечернего платья",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 5,
    name: "Биочистка",
    price: 2000,
    category: "Специальная обработка",
    description: "Экологичная биочистка с использованием биотехнологий",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
]

// Моковые данные для заказов (обновленные с учетом акций)
const mockOrders: Order[] = [
  {
    id: 1,
    clientId: 1,
    date: "2023-04-15",
    status: "completed",
    services: [
      {
        id: 1,
        serviceId: 1,
        serviceName: "Химчистка куртки",
        quantity: 1,
        price: 1275,
        originalPrice: 1500,
        total: 1275,
        originalTotal: 1500,
        appliedPromotion: {
          promotionId: 1,
          promotionName: "Скидка новичкам",
          discountAmount: 15,
          discountType: "percentage",
        },
        images: [],
        readyDate: "2023-04-18",
      },
    ],
    totalAmount: 1275,
    discount: 225,
    discountedAmount: 1275,
    comments: "Срочный заказ",
    isCashless: false,
    appliedPromotions: [
      {
        promotionId: 1,
        promotionName: "Скидка новичкам",
        discountAmount: 15,
        discountType: "percentage",
        appliedToServices: [1],
        totalDiscount: 225,
      },
    ],
  },
  {
    id: 2,
    clientId: 2,
    date: "2023-04-20",
    status: "in-progress",
    services: [
      {
        id: 2,
        serviceId: 2,
        serviceName: "Химчистка костюма",
        quantity: 1,
        price: 2000,
        originalPrice: 2500,
        total: 2000,
        originalTotal: 2500,
        appliedPromotion: {
          promotionId: 2,
          promotionName: "Корпоративная скидка",
          discountAmount: 500,
          discountType: "fixed",
        },
        images: [],
        readyDate: "2023-04-25",
        size: "50",
        brand: "Brioni",
        color: "Синий",
      },
      {
        id: 3,
        serviceId: 3,
        serviceName: "Глажка рубашки",
        quantity: 5,
        price: 300,
        total: 1500,
        images: [],
        readyDate: "2023-04-23",
      },
    ],
    totalAmount: 3500,
    discount: 500,
    discountedAmount: 3500,
    comments: "Корпоративный клиент",
    isCashless: true,
    appliedPromotions: [
      {
        promotionId: 2,
        promotionName: "Корпоративная скидка",
        discountAmount: 500,
        discountType: "fixed",
        appliedToServices: [2],
        totalDiscount: 500,
      },
    ],
  },
]

// Остальные моковые данные остаются без изменений
const mockSizes: Size[] = [
  {
    id: 1,
    name: "44",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 2,
    name: "46",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 3,
    name: "48",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 4,
    name: "50",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 5,
    name: "52",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
]

const mockBrands: Brand[] = [
  {
    id: 1,
    name: "Zara",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 2,
    name: "H&M",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 3,
    name: "Brioni",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 4,
    name: "Hugo Boss",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 5,
    name: "Gucci",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
]

const mockColors: Color[] = [
  {
    id: 1,
    name: "Черный",
    hexCode: "#000000",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 2,
    name: "Белый",
    hexCode: "#FFFFFF",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 3,
    name: "Синий",
    hexCode: "#0000FF",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 4,
    name: "Красный",
    hexCode: "#FF0000",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 5,
    name: "Зеленый",
    hexCode: "#00FF00",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
]

const mockStatusHistory: StatusHistory[] = [
  {
    id: 1,
    orderId: 1,
    fromStatus: "waiting",
    toStatus: "in-progress",
    changedBy: "Оператор",
    changedAt: "2023-04-16T10:00:00",
    notes: "Заказ принят в работу",
  },
  {
    id: 2,
    orderId: 1,
    fromStatus: "in-progress",
    toStatus: "completed",
    changedBy: "Оператор",
    changedAt: "2023-04-18T15:30:00",
    notes: "Заказ выполнен",
  },
]

const mockStatusStatistics: StatusStatistics[] = [
  {
    status: "waiting",
    count: 2,
    percentage: 50,
    trend: "stable",
  },
  {
    status: "in-progress",
    count: 1,
    percentage: 25,
    trend: "up",
  },
  {
    status: "completed",
    count: 1,
    percentage: 25,
    trend: "down",
  },
]

const mockSurveys: Survey[] = [
  {
    id: 1,
    name: "Оценка качества обслуживания",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
]

const mockCities: City[] = [
  {
    id: 1,
    name: "Москва",
    region: "Московская область",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    clientsCount: 150,
    ordersCount: 320,
    totalRevenue: 480000,
    averageOrderValue: 1500,
  },
  {
    id: 2,
    name: "Санкт-Петербург",
    region: "Ленинградская область",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    clientsCount: 95,
    ordersCount: 180,
    totalRevenue: 270000,
    averageOrderValue: 1500,
  },
  {
    id: 3,
    name: "Казань",
    region: "Республика Татарстан",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    clientsCount: 45,
    ordersCount: 90,
    totalRevenue: 135000,
    averageOrderValue: 1500,
  },
  {
    id: 4,
    name: "Сочи",
    region: "Краснодарский край",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
]

const mockCityStatistics: CityStatistics[] = [
  {
    cityId: 1,
    cityName: "Москва",
    clientsCount: 150,
    ordersCount: 320,
    totalRevenue: 480000,
    averageOrderValue: 1500,
    lastOrderDate: "2023-04-25",
    topServices: [
      { serviceName: "Химчистка куртки", count: 80 },
      { serviceName: "Химчистка костюма", count: 65 },
      { serviceName: "Глажка рубашки", count: 120 },
    ],
  },
]

const mockReferralSources: string[] = [
  "Реклама в интернете",
  "Социальные сети",
  "Рекомендация",
  "Поисковые системы",
  "Наружная реклама",
  "Телевидение/Радио",
  "Печатные издания",
  "Другое",
]

const mockPoints: Point[] = [
  {
    id: 1,
    name: "Химчистка на Чертановской",
    organizationType: "own",
    phone: "+7 (495) 123-45-67",
    address: {
      cityId: 1,
      fullAddress: "г. Москва, ул. Чертановская, д. 26к2",
      coordinates: {
        lat: 55.651874,
        lng: 37.607174,
      },
    },
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 2,
    name: "Химчистка на Красной",
    organizationType: "franchise",
    phone: "+7 (862) 234-56-78",
    address: {
      cityId: 4,
      fullAddress: "г. Сочи, ул. Красная, д. 15",
      coordinates: {
        lat: 43.603104,
        lng: 39.734558,
      },
    },
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 3,
    name: "Химчистка на Невском",
    organizationType: "own",
    phone: "+7 (812) 345-67-89",
    address: {
      cityId: 2,
      fullAddress: "г. Санкт-Петербург, Невский проспект, д. 100",
      coordinates: {
        lat: 59.93428,
        lng: 30.335099,
      },
    },
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
]

const mockExpenseCategories: ExpenseCategory[] = [
  {
    id: 1,
    name: "Аквачистка",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 2,
    name: "Упаковка",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 3,
    name: "Расходы на связь",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
]

const mockPromocodes: Promocode[] = [
  {
    id: 1,
    name: "Скидка новичкам",
    code: "NEWBIE2025",
    type: "discount",
    discountAmount: 15,
    discountType: "percentage",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "active",
    targetAudience: "physical",
    applicablePoints: ["Москва, Чертановская, 26к2", "Сочи, Красная, 15"],
    usageLimit: 100,
    usedCount: 23,
    minOrderAmount: 500,
    description: "Скидка 15% для новых клиентов",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Корпоративная скидка",
    code: "CORP500",
    type: "discount",
    discountAmount: 500,
    discountType: "fixed",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "active",
    targetAudience: "legal",
    applicablePoints: ["Москва, Чертановская, 26к2"],
    usageLimit: 50,
    usedCount: 12,
    minOrderAmount: 2000,
    description: "Фиксированная скидка 500₽ для юридических лиц",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Летний кэшбек",
    code: "SUMMER2025",
    type: "cashback",
    discountAmount: 10,
    discountType: "percentage",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    status: "active",
    targetAudience: "all",
    applicablePoints: ["Москва, Чертановская, 26к2", "Сочи, Красная, 15"],
    usageLimit: 200,
    usedCount: 45,
    minOrderAmount: 1000,
    description: "Кэшбек 10% летом",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Зимняя акция",
    code: "WINTER2024",
    type: "discount",
    discountAmount: 25,
    discountType: "percentage",
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    status: "expired",
    targetAudience: "all",
    applicablePoints: ["Москва, Чертановская, 26к2"],
    usageLimit: 150,
    usedCount: 150,
    minOrderAmount: 800,
    description: "Зимняя скидка 25%",
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
]

// Моковые данные для контрагентов
const mockContractors: Contractor[] = [
  {
    id: 1,
    legalName: "ООО Рога и Копыта",
    inn: "1234567890",
    kpp: "123456789",
    address: "г. Москва, ул. Ленина, д. 1",
    phone: "+7 (495) 123-45-67",
    email: "info@roga-kopyta.ru",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 2,
    legalName: "ИП Иванов И.И.",
    inn: "987654321012",
    kpp: "",
    address: "г. Санкт-Петербург, Невский пр., д. 10",
    phone: "+7 (812) 987-65-43",
    email: "ivanov@example.com",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 3,
    legalName: "ООО ТекстильСервис",
    inn: "5555666677",
    kpp: "555566667",
    address: "г. Казань, ул. Баумана, д. 25",
    phone: "+7 (843) 555-66-77",
    email: "service@textile.ru",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
]

// Моковые данные для складов
const mockWarehouses: Warehouse[] = [
  {
    id: 1,
    name: "Центральный склад",
    address: "ул. Складская, д. 15",
    cityId: 1,
    city: "Москва",
    contractorId: 1,
    contractorName: "ООО Рога и Копыта",
    paymentMethod: "cashless",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 2,
    name: "Склад СПб",
    address: "пр. Промышленный, д. 8",
    cityId: 2,
    city: "Санкт-Петербург",
    contractorId: 2,
    contractorName: "ИП Иванов И.И.",
    paymentMethod: "mixed",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 3,
    name: "Региональный склад",
    address: "ул. Логистическая, д. 3",
    cityId: 3,
    city: "Казань",
    contractorId: 3,
    contractorName: "ООО ТекстильСервис",
    paymentMethod: "cash",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
]

const mockPaymentTypes: PaymentType[] = [
  {
    id: 1,
    name: "Наличный расчет",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
  {
    id: 2,
    name: "Безналичный расчет",
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
  },
]

// Моковые данные для кассовых смен
const mockCashShifts: CashShift[] = [
  {
    id: 1,
    shiftNumber: "001",
    openTime: "2025-01-15T09:00:00",
    closeTime: "2025-01-15T21:00:00",
    fiscalRegistrator: "ККТ-001",
    openedBy: "Иванов И.И.",
    closedBy: "Иванов И.И.",
    revenue: 45000,
    receiptsCount: 23,
    salesPoint: "Химчистка на Чертановской",
    previousShiftDifference: 0,
    cashDifference: -150,
    emergencyClose: false,
    status: "closed",
    zReportNumber: "Z001",
    total: 45000,
    fiscalCash: 15000,
    fiscalCashless: 30000,
    nonFiscalCash: 0,
    nonFiscalCashless: 0,
    nonFiscalBonuses: 0,
    returns: 2000,
    returnsFiscalCash: 1000,
    returnsFiscalCashless: 1000,
    returnsNonFiscalCash: 0,
    returnsNonFiscalCashless: 0,
    returnsNonFiscalBonuses: 0,
    returnsWriteOff: 0,
    cashAtStart: 5000,
    cashAtEnd: 19850,
    createdAt: "2025-01-15T09:00:00",
    updatedAt: "2025-01-15T21:00:00",
  },
  {
    id: 2,
    shiftNumber: "002",
    openTime: "2025-01-16T09:00:00",
    closeTime: "2025-01-16T20:30:00",
    fiscalRegistrator: "ККТ-001",
    openedBy: "Петров П.П.",
    closedBy: "Петров П.П.",
    revenue: 38500,
    receiptsCount: 19,
    salesPoint: "Химчистка на Чертановской",
    previousShiftDifference: 0,
    cashDifference: 200,
    emergencyClose: false,
    status: "closed",
    zReportNumber: "Z002",
    total: 38500,
    fiscalCash: 12000,
    fiscalCashless: 26500,
    nonFiscalCash: 0,
    nonFiscalCashless: 0,
    nonFiscalBonuses: 0,
    returns: 1500,
    returnsFiscalCash: 500,
    returnsFiscalCashless: 1000,
    returnsNonFiscalCash: 0,
    returnsNonFiscalCashless: 0,
    returnsNonFiscalBonuses: 0,
    returnsWriteOff: 0,
    cashAtStart: 19850,
    cashAtEnd: 31350,
    createdAt: "2025-01-16T09:00:00",
    updatedAt: "2025-01-16T20:30:00",
  },
  {
    id: 3,
    shiftNumber: "003",
    openTime: "2025-01-17T09:00:00",
    fiscalRegistrator: "ККТ-001",
    openedBy: "Сидорова М.А.",
    revenue: 12500,
    receiptsCount: 8,
    salesPoint: "Химчистка на Чертановской",
    previousShiftDifference: 0,
    cashDifference: 0,
    emergencyClose: false,
    status: "open",
    total: 12500,
    fiscalCash: 5000,
    fiscalCashless: 7500,
    nonFiscalCash: 0,
    nonFiscalCashless: 0,
    nonFiscalBonuses: 0,
    returns: 0,
    returnsFiscalCash: 0,
    returnsFiscalCashless: 0,
    returnsNonFiscalCash: 0,
    returnsNonFiscalCashless: 0,
    returnsNonFiscalBonuses: 0,
    returnsWriteOff: 0,
    cashAtStart: 31350,
    cashAtEnd: 0,
    createdAt: "2025-01-17T09:00:00",
    updatedAt: "2025-01-17T15:30:00",
  },
  {
    id: 4,
    shiftNumber: "001",
    openTime: "2025-01-15T10:00:00",
    closeTime: "2025-01-15T22:00:00",
    fiscalRegistrator: "ККТ-002",
    openedBy: "Козлов К.К.",
    closedBy: "Козлов К.К.",
    revenue: 52000,
    receiptsCount: 31,
    salesPoint: "Химчистка на Красной",
    previousShiftDifference: 0,
    cashDifference: 0,
    emergencyClose: false,
    status: "closed",
    zReportNumber: "Z001",
    total: 52000,
    fiscalCash: 20000,
    fiscalCashless: 32000,
    nonFiscalCash: 0,
    nonFiscalCashless: 0,
    nonFiscalBonuses: 0,
    returns: 3000,
    returnsFiscalCash: 1500,
    returnsFiscalCashless: 1500,
    returnsNonFiscalCash: 0,
    returnsNonFiscalCashless: 0,
    returnsNonFiscalBonuses: 0,
    returnsWriteOff: 0,
    cashAtStart: 8000,
    cashAtEnd: 26500,
    createdAt: "2025-01-15T10:00:00",
    updatedAt: "2025-01-15T22:00:00",
  },
]

// Mock data for cash operations
const mockCashOperations: CashOperation[] = [
  {
    id: 1,
    operationNumber: "OP-2025-001",
    dateTime: "2025-01-07T09:30:00",
    type: "deposit",
    employee: "Иванов И.И.",
    amount: 5000,
    cashInRegister: 15000,
    salesPoint: "г. Москва, Ленина 50",
    fiscalRegistrator: "ФР-001",
    comment: "Внесено на размен",
    cashShiftNumber: "CS-001",
    status: "completed",
    createdAt: "2025-01-07T09:30:00",
    updatedAt: "2025-01-07T09:30:00",
  },
  {
    id: 2,
    operationNumber: "OP-2025-002",
    dateTime: "2025-01-07T14:15:00",
    type: "collection",
    employee: "Петров П.П.",
    amount: 8000,
    cashInRegister: 7000,
    salesPoint: "г. Москва, Ленина 50",
    fiscalRegistrator: "ФР-001",
    comment: "Плановая инкассация",
    cashShiftNumber: "CS-001",
    status: "completed",
    createdAt: "2025-01-07T14:15:00",
    updatedAt: "2025-01-07T14:15:00",
  },
  {
    id: 3,
    operationNumber: "OP-2025-003",
    dateTime: "2025-01-07T18:00:00",
    type: "auto_collection",
    employee: "Система",
    amount: 7000,
    cashInRegister: 0,
    salesPoint: "г. Москва, Ленина 50",
    fiscalRegistrator: "ФР-001",
    comment: "Автоматическая инкассация",
    cashShiftNumber: "CS-001",
    status: "completed",
    createdAt: "2025-01-07T18:00:00",
    updatedAt: "2025-01-07T18:00:00",
  },
  {
    id: 4,
    operationNumber: "OP-2025-004",
    dateTime: "2025-01-07T16:30:00",
    type: "failed_collection",
    employee: "Сидоров С.С.",
    amount: 10000,
    cashInRegister: 7000,
    salesPoint: "г. Москва, Ленина 50",
    fiscalRegistrator: "ФР-001",
    comment: "Недостаточно средств в кассе",
    cashShiftNumber: "CS-001",
    status: "failed",
    createdAt: "2025-01-07T16:30:00",
    updatedAt: "2025-01-07T16:30:00",
  },
  {
    id: 5,
    operationNumber: "OP-2025-005",
    dateTime: "2025-01-08T10:00:00",
    type: "deposit",
    employee: "Козлова А.А.",
    amount: 3000,
    cashInRegister: 10000,
    salesPoint: "г. Сочи, Красная 15",
    fiscalRegistrator: "ФР-002",
    comment: "Внесение для работы",
    cashShiftNumber: "CS-002",
    status: "completed",
    createdAt: "2025-01-08T10:00:00",
    updatedAt: "2025-01-08T10:00:00",
  },
  {
    id: 6,
    operationNumber: "OP-2025-006",
    dateTime: "2025-01-08T15:45:00",
    type: "collection",
    employee: "Морозов В.В.",
    amount: 12000,
    cashInRegister: 8000,
    salesPoint: "г. Санкт-Петербург, Невский 100",
    fiscalRegistrator: "ФР-003",
    comment: "Инкассация по графику",
    cashShiftNumber: "CS-003",
    status: "completed",
    createdAt: "2025-01-08T15:45:00",
    updatedAt: "2025-01-08T15:45:00",
  },
]

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [services, setServices] = useState<Service[]>(mockServices)
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions)
  const [sizes, setSizes] = useState<Size[]>(mockSizes)
  const [brands, setBrands] = useState<Brand[]>(mockBrands)
  const [colors, setColors] = useState<Color[]>(mockColors)
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>(mockStatusHistory)
  const [surveys, setSurveys] = useState<Survey[]>(mockSurveys)
  const [cities, setCities] = useState<City[]>(mockCities)
  const [referralSources] = useState<string[]>(mockReferralSources)
  const [points, setPoints] = useState<Point[]>(mockPoints)
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(mockExpenseCategories)
  const [promocodes, setPromocodes] = useState<Promocode[]>(mockPromocodes)
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockWarehouses)
  const [contractors, setContractors] = useState<Contractor[]>(mockContractors)
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>(mockPaymentTypes)
  const [cashShifts, setCashShifts] = useState<CashShift[]>(mockCashShifts)
  const [cashOperations, setCashOperations] = useState<CashOperation[]>(mockCashOperations)
  const [nomenclature, setNomenclature] = useState<NomenclatureItem[]>(mockNomenclature)

  // Cash operations functions
  const addCashOperation = (operation: CashOperation) => {
    setCashOperations((prev) => [...prev, operation])
  }

  const updateCashOperation = (id: number, operation: Partial<CashOperation>) => {
    setCashOperations((prev) => prev.map((op) => (op.id === id ? { ...op, ...operation } : op)))
  }

  const deleteCashOperation = (id: number) => {
    setCashOperations((prev) => prev.filter((op) => op.id !== id))
  }

  const getCashOperationDetails = (id: number): CashOperationDetails | null => {
    const operation = cashOperations.find((op) => op.id === id)
    if (!operation) return null

    // Mock detailed data based on operation
    return {
      id: operation.id,
      operationNumber: operation.operationNumber,
      openTime: operation.dateTime,
      openedBy: operation.employee,
      status: operation.status === "completed" ? "completed" : "failed",
      cashier: operation.employee,
      fiscalRegistrator: operation.fiscalRegistrator,
      cashShiftNumber: operation.cashShiftNumber,
      total: operation.amount + 2000,
      revenue: operation.amount,
      costPrice: operation.amount * 0.6,
      receiptsCount: Math.floor(operation.amount / 500),
      collectionAmount: operation.type === "collection" || operation.type === "auto_collection" ? operation.amount : 0,
      salesPoint: operation.salesPoint,
      recipientAccount: "40702810000000123456",
      createdAt: operation.createdAt,
      updatedAt: operation.updatedAt,
    }
  }

  const getFilteredCashOperations = (filters: CashOperationFilters): CashOperation[] => {
    return cashOperations.filter((operation) => {
      if (filters.dateFrom && operation.dateTime < filters.dateFrom) return false
      if (filters.dateTo && operation.dateTime > filters.dateTo) return false
      if (filters.amountFrom && operation.amount < filters.amountFrom) return false
      if (filters.amountTo && operation.amount > filters.amountTo) return false
      if (filters.type && operation.type !== filters.type) return false
      if (filters.employee && !operation.employee.toLowerCase().includes(filters.employee.toLowerCase())) return false
      if (filters.salesPoint && !operation.salesPoint.toLowerCase().includes(filters.salesPoint.toLowerCase()))
        return false
      if (
        filters.fiscalRegistrator &&
        !operation.fiscalRegistrator.toLowerCase().includes(filters.fiscalRegistrator.toLowerCase())
      )
        return false
      if (
        filters.cashShiftNumber &&
        !operation.cashShiftNumber.toLowerCase().includes(filters.cashShiftNumber.toLowerCase())
      )
        return false
      if (filters.status && operation.status !== filters.status) return false
      return true
    })
  }

  // Функции для работы с клиентами
  const addClient = (client: Omit<Client, "id">) => {
    const newClient = {
      ...client,
      id: clients.length > 0 ? Math.max(...clients.map((c) => c.id)) + 1 : 1,
    }
    setClients([...clients, newClient])
    return newClient
  }

  const updateClient = (client: Client) => {
    setClients(clients.map((c) => (c.id === client.id ? client : c)))
  }

  const deleteClient = (id: number) => {
    setClients(clients.filter((c) => c.id !== id))
  }

  const getClientById = (id: number): Client | null => {
    return clients.find((client) => client.id === id) || null
  }

  // Функции для работы с источниками рефералов
  const addReferralSource = (source: string) => {
    // В реальном приложении здесь была бы логика добавления источника
    console.log("Adding referral source:", source)
  }

  const deleteReferralSource = (source: string) => {
    // В реальном приложении здесь была бы логика удаления источника
    console.log("Deleting referral source:", source)
  }

  // Функции для работы с заказами
  const addOrder = (order: Omit<Order, "id" | "date" | "status">) => {
    const newOrder = {
      ...order,
      id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
      date: new Date().toISOString().split("T")[0],
      status: "waiting" as const,
    }
    setOrders([...orders, newOrder])
    return newOrder
  }

  const updateOrder = (order: Order) => {
    setOrders(orders.map((o) => (o.id === order.id ? order : o)))
  }

  const deleteOrder = (id: number) => {
    setOrders(orders.filter((o) => o.id !== id))
  }

  const updateOrderStatus = (orderId: number, status: OrderStatus, changedBy: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      const updatedOrder = { ...order, status }
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)))

      const newHistoryEntry: StatusHistory = {
        id: statusHistory.length > 0 ? Math.max(...statusHistory.map((h) => h.id)) + 1 : 1,
        orderId,
        fromStatus: order.status,
        toStatus: status,
        changedBy,
        changedAt: new Date().toISOString(),
        notes: `Статус изменен с "${order.status}" на "${status}"`,
      }
      setStatusHistory([...statusHistory, newHistoryEntry])
    }
  }

  const getOrderStatusHistory = (orderId: number): StatusHistory[] => {
    return statusHistory.filter((history) => history.orderId === orderId)
  }

  const getOrdersByClientId = (clientId: number): Order[] => {
    return orders.filter((order) => order.clientId === clientId)
  }

  // Функции для работы с услугами
  const addService = (service: Omit<Service, "id" | "isActive" | "createdAt" | "updatedAt">) => {
    const newService = {
      ...service,
      id: services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setServices([...services, newService])
    return newService
  }

  const updateService = (service: Service) => {
    const updatedService = {
      ...service,
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setServices(services.map((s) => (s.id === service.id ? updatedService : s)))
  }

  const deleteService = (id: number) => {
    setServices(services.filter((s) => s.id !== id))
  }

  const getServiceById = (id: number): Service | null => {
    return services.find((service) => service.id === id) || null
  }

  // Функции для работы с акциями
  const addPromotion = (promotion: Omit<Promotion, "id">) => {
    const newPromotion = {
      ...promotion,
      id: promotions.length > 0 ? Math.max(...promotions.map((p) => p.id)) + 1 : 1,
    }
    setPromotions([...promotions, newPromotion])
    return newPromotion
  }

  const updatePromotion = (promotion: Promotion) => {
    setPromotions(promotions.map((p) => (p.id === promotion.id ? promotion : p)))
  }

  const deletePromotion = (id: number) => {
    setPromotions(promotions.filter((p) => p.id !== id))
  }

  const getActivePromotions = (): Promotion[] => {
    const currentDate = new Date().toISOString().split("T")[0]
    return promotions.filter(
      (promotion) =>
        promotion.status === "active" && promotion.startDate <= currentDate && promotion.endDate >= currentDate,
    )
  }

  const getPromotionForService = (serviceId: number, clientType?: "individual" | "legal"): Promotion | null => {
    const activePromotions = getActivePromotions()

    // Ищем акцию, которая применима к данной услуге и типу клиента
    const applicablePromotion = activePromotions.find((promotion) => {
      const isServiceApplicable = promotion.applicableServices.includes(serviceId)
      const isClientTypeApplicable =
        promotion.targetAudience === "all" ||
        (clientType && promotion.targetAudience === (clientType === "individual" ? "physical" : "legal"))

      return isServiceApplicable && isClientTypeApplicable
    })

    return applicablePromotion || null
  }

  const calculateServicePrice = (serviceId: number, quantity: number, clientType?: "individual" | "legal") => {
    const service = getServiceById(serviceId)
    if (!service) {
      return {
        originalPrice: 0,
        finalPrice: 0,
        discount: 0,
      }
    }

    const originalPrice = service.price * quantity
    const promotion = getPromotionForService(serviceId, clientType)

    if (!promotion) {
      return {
        originalPrice,
        finalPrice: originalPrice,
        discount: 0,
      }
    }

    let discount = 0
    if (promotion.discountType === "percentage") {
      discount = (originalPrice * promotion.discountAmount) / 100
    } else {
      discount = Math.min(promotion.discountAmount * quantity, originalPrice)
    }

    const finalPrice = originalPrice - discount

    return {
      originalPrice,
      finalPrice,
      appliedPromotion: promotion,
      discount,
    }
  }

  const getServicesWithPromotions = (): Service[] => {
    return services.map((service) => {
      const promotion = getPromotionForService(service.id)
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

  // Функции для работы с услугами клиентов
  const assignServiceToClient = (clientId: number, serviceId: number) => {
    const client = clients.find((c) => c.id === clientId)
    if (client && client.type === "legal") {
      const assignedServices = client.assignedServices || []
      if (!assignedServices.includes(serviceId)) {
        const updatedClient = {
          ...client,
          assignedServices: [...assignedServices, serviceId],
        }
        updateClient(updatedClient)
      }
    }
  }

  const removeServiceFromClient = (clientId: number, serviceId: number) => {
    const client = clients.find((c) => c.id === clientId)
    if (client && client.type === "legal") {
      const assignedServices = client.assignedServices || []
      const updatedClient = {
        ...client,
        assignedServices: assignedServices.filter((id) => id !== serviceId),
      }
      updateClient(updatedClient)
    }
  }

  const getClientServices = (clientId: number): Service[] => {
    const client = clients.find((c) => c.id === clientId)
    if (client && client.type === "legal" && client.assignedServices) {
      return services.filter((service) => client.assignedServices!.includes(service.id))
    }
    return []
  }

  // Functions for sizes, brands, colors (updated to handle objects)
  const addSize = (size: Omit<Size, "id" | "isActive" | "createdAt" | "updatedAt">) => {
    const newSize = {
      ...size,
      id: sizes.length > 0 ? Math.max(...sizes.map((s) => s.id)) + 1 : 1,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setSizes([...sizes, newSize])
    return newSize
  }

  const updateSize = (size: Size) => {
    const updatedSize = {
      ...size,
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setSizes(sizes.map((s) => (s.id === size.id ? updatedSize : s)))
  }

  const deleteSize = (id: number) => {
    setSizes(sizes.filter((s) => s.id !== id))
  }

  const addBrand = (brand: Brand) => {
    const newBrand = {
      ...brand,
      id: brands.length > 0 ? Math.max(...brands.map((b) => b.id)) + 1 : 1,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setBrands([...brands, newBrand])
  }

  const updateBrand = (brand: Brand) => {
    const updatedBrand = {
      ...brand,
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setBrands(brands.map((b) => (b.id === brand.id ? updatedBrand : b)))
  }

  const deleteBrand = (id: number) => {
    setBrands(brands.filter((b) => b.id !== id))
  }

  const addColor = (color: Color) => {
    const newColor = {
      ...color,
      id: colors.length > 0 ? Math.max(...colors.map((c) => c.id)) + 1 : 1,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setColors([...colors, newColor])
  }

  const updateColor = (color: Color) => {
    const updatedColor = {
      ...color,
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setColors(colors.map((c) => (c.id === color.id ? updatedColor : c)))
  }

  const deleteColor = (id: number) => {
    setColors(colors.filter((c) => c.id !== id))
  }

  const addCity = (city: City) => {
    const newCity = {
      ...city,
      id: cities.length > 0 ? Math.max(...cities.map((c) => c.id)) + 1 : 1,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setCities([...cities, newCity])
  }

  const updateCity = (city: City) => {
    const updatedCity = {
      ...city,
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setCities(cities.map((c) => (c.id === city.id ? updatedCity : c)))
  }

  const deleteCity = (id: number) => {
    setCities(cities.filter((c) => c.id !== id))
  }

  const getCityById = (id: number): City | null => {
    return cities.find((city) => city.id === id) || null
  }

  const getCityStatistics = (): CityStatistics[] => {
    return mockCityStatistics
  }

  const getCityStatisticsById = (cityId: number): CityStatistics | null => {
    return mockCityStatistics.find((stats) => stats.cityId === cityId) || null
  }

  const addPoint = (point: Omit<Point, "id">) => {
    const newPoint = {
      ...point,
      id: points.length > 0 ? Math.max(...points.map((p) => p.id)) + 1 : 1,
    }
    setPoints([...points, newPoint])
  }

  const updatePoint = (point: Point) => {
    setPoints(points.map((p) => (p.id === point.id ? point : p)))
  }

  const deletePoint = (id: number) => {
    setPoints(points.filter((p) => p.id !== id))
  }

  const getPointById = (id: number): Point | null => {
    return points.find((point) => point.id === id) || null
  }

  const getPointStatistics = (pointId: number) => {
    const point = points.find((p) => p.id === pointId)
    if (!point) return null

    // Моковые данные для статистики точки
    return {
      pointName: point.name,
      organizationType: point.organizationType,
      clientsCount: Math.floor(Math.random() * 100) + 20,
      ordersCount: Math.floor(Math.random() * 200) + 50,
      totalRevenue: Math.floor(Math.random() * 500000) + 100000,
      averageOrderValue: Math.floor(Math.random() * 2000) + 1000,
      employeesCount: Math.floor(Math.random() * 10) + 3,
      lastOrderDate: "2023-12-15",
      monthlyRevenue: [
        { month: "Янв", revenue: Math.floor(Math.random() * 50000) + 20000 },
        { month: "Фев", revenue: Math.floor(Math.random() * 50000) + 20000 },
        { month: "Мар", revenue: Math.floor(Math.random() * 50000) + 20000 },
        { month: "Апр", revenue: Math.floor(Math.random() * 50000) + 20000 },
        { month: "Май", revenue: Math.floor(Math.random() * 50000) + 20000 },
        { month: "Июн", revenue: Math.floor(Math.random() * 50000) + 20000 },
      ],
      topServices: [
        { serviceName: "Химчистка куртки", count: Math.floor(Math.random() * 50) + 10 },
        { serviceName: "Химчистка костюма", count: Math.floor(Math.random() * 40) + 8 },
        { serviceName: "Глажка рубашки", count: Math.floor(Math.random() * 60) + 15 },
      ],
    }
  }

  // Функции для работы со статьями расходов
  const addExpenseCategory = (category: Omit<ExpenseCategory, "id" | "isActive" | "createdAt" | "updatedAt">) => {
    const newCategory = {
      ...category,
      id: expenseCategories.length > 0 ? Math.max(...expenseCategories.map((c) => c.id)) + 1 : 1,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setExpenseCategories([...expenseCategories, newCategory])
    return newCategory
  }

  const updateExpenseCategory = (category: ExpenseCategory) => {
    setExpenseCategories(expenseCategories.map((c) => (c.id === category.id ? category : c)))
  }

  const deleteExpenseCategory = (id: number) => {
    setExpenseCategories(expenseCategories.filter((c) => c.id !== id))
  }

  const getExpenseCategoryById = (id: number): ExpenseCategory | null => {
    return expenseCategories.find((category) => category.id === id) || null
  }

  // Функции для работы с промокодами
  const addPromocode = (promocode: Omit<Promocode, "id">) => {
    const newPromocode = {
      ...promocode,
      id: promocodes.length > 0 ? Math.max(...promocodes.map((p) => p.id)) + 1 : 1,
    }
    setPromocodes([...promocodes, newPromocode])
    return newPromocode
  }

  const updatePromocode = (promocode: Promocode) => {
    setPromocodes(promocodes.map((p) => (p.id === promocode.id ? promocode : p)))
  }

  const deletePromocode = (id: number) => {
    setPromocodes(promocodes.filter((p) => p.id !== id))
  }

  const getActivePromocodes = (): Promocode[] => {
    const currentDate = new Date()
    return promocodes.filter((promocode) => {
      const endDate = new Date(promocode.endDate)
      return promocode.status === "active" && endDate >= currentDate && promocode.usedCount < promocode.usageLimit
    })
  }

  const validatePromocode = (
    code: string,
    orderAmount: number,
    clientType: "individual" | "legal",
  ): Promocode | null => {
    const promocode = promocodes.find((p) => p.code.toUpperCase() === code.toUpperCase())

    if (!promocode) return null

    // Проверяем статус и дату
    const currentDate = new Date()
    const endDate = new Date(promocode.endDate)

    if (promocode.status !== "active" || endDate < currentDate) return null

    // Проверяем лимит использования
    if (promocode.usedCount >= promocode.usageLimit) return null

    // Проверяем целевую аудиторию
    if (promocode.targetAudience !== "all") {
      const targetMatch =
        (promocode.targetAudience === "physical" && clientType === "individual") ||
        (promocode.targetAudience === "legal" && clientType === "legal")
      if (!targetMatch) return null
    }

    // Проверяем минимальную сумму заказа
    if (promocode.minOrderAmount && orderAmount < promocode.minOrderAmount) return null

    return promocode
  }

  // Функции для работы со складами
  const addWarehouse = (warehouse: Omit<Warehouse, "id" | "isActive" | "createdAt" | "updatedAt">) => {
    const contractor = contractors.find((c) => c.id === warehouse.contractorId)
    const city = cities.find((c) => c.id === warehouse.cityId)

    const newWarehouse = {
      ...warehouse,
      id: warehouses.length > 0 ? Math.max(...warehouses.map((w) => w.id)) + 1 : 1,
      contractorName: contractor?.legalName || "",
      city: city?.name || "",
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setWarehouses([...warehouses, newWarehouse])
    return newWarehouse
  }

  const updateWarehouse = (warehouse: Warehouse) => {
    const contractor = contractors.find((c) => c.id === warehouse.contractorId)
    const city = cities.find((c) => c.id === warehouse.cityId)

    const updatedWarehouse = {
      ...warehouse,
      contractorName: contractor?.legalName || "",
      city: city?.name || "",
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setWarehouses(warehouses.map((w) => (w.id === warehouse.id ? updatedWarehouse : w)))
  }

  const deleteWarehouse = (id: number) => {
    setWarehouses(warehouses.filter((w) => w.id !== id))
  }

  const getWarehouseById = (id: number): Warehouse | null => {
    return warehouses.find((warehouse) => warehouse.id === id) || null
  }

  // Функции для работы с контрагентами
  const addContractor = (contractor: Omit<Contractor, "id" | "isActive" | "createdAt" | "updatedAt">) => {
    const newContractor = {
      ...contractor,
      id: contractors.length > 0 ? Math.max(...contractors.map((c) => c.id)) + 1 : 1,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setContractors([...contractors, newContractor])
    return newContractor
  }

  const updateContractor = (contractor: Contractor) => {
    const updatedContractor = {
      ...contractor,
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setContractors(contractors.map((c) => (c.id === contractor.id ? updatedContractor : c)))
  }

  const deleteContractor = (id: number) => {
    setContractors(contractors.filter((c) => c.id !== id))
  }

  const getContractorById = (id: number): Contractor | null => {
    return contractors.find((contractor) => contractor.id === id) || null
  }

  // Функции для работы с типами оплат
  const addPaymentType = (paymentType: Omit<PaymentType, "id" | "isActive" | "createdAt" | "updatedAt">) => {
    const newPaymentType = {
      ...paymentType,
      id: paymentTypes.length > 0 ? Math.max(...paymentTypes.map((p) => p.id)) + 1 : 1,
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setPaymentTypes([...paymentTypes, newPaymentType])
    return newPaymentType
  }

  const updatePaymentType = (paymentType: PaymentType) => {
    const updatedPaymentType = {
      ...paymentType,
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setPaymentTypes(paymentTypes.map((p) => (p.id === paymentType.id ? updatedPaymentType : p)))
  }

  const deletePaymentType = (id: number) => {
    setPaymentTypes(paymentTypes.filter((p) => p.id !== id))
  }

  const getPaymentTypeById = (id: number): PaymentType | null => {
    return paymentTypes.find((paymentType) => paymentType.id === id) || null
  }

  // Функции для работы с кассовыми сменами
  const addCashShift = (cashShift: Omit<CashShift, "id" | "createdAt" | "updatedAt">) => {
    const newCashShift = {
      ...cashShift,
      id: cashShifts.length > 0 ? Math.max(...cashShifts.map((c) => c.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setCashShifts([...cashShifts, newCashShift])
    return newCashShift
  }

  const updateCashShift = (cashShift: CashShift) => {
    const updatedCashShift = {
      ...cashShift,
      updatedAt: new Date().toISOString(),
    }
    setCashShifts(cashShifts.map((c) => (c.id === cashShift.id ? updatedCashShift : c)))
  }

  const deleteCashShift = (id: number) => {
    setCashShifts(cashShifts.filter((c) => c.id !== id))
  }

  const getCashShiftById = (id: number): CashShift | null => {
    return cashShifts.find((cashShift) => cashShift.id === id) || null
  }

  const closeCashShift = (id: number, closedBy: string, closeData: Partial<CashShift>) => {
    const cashShift = cashShifts.find((c) => c.id === id)
    if (cashShift && cashShift.status === "open") {
      const updatedCashShift = {
        ...cashShift,
        ...closeData,
        closedBy,
        closeTime: new Date().toISOString(),
        status: "closed" as const,
        updatedAt: new Date().toISOString(),
      }
      setCashShifts(cashShifts.map((c) => (c.id === id ? updatedCashShift : c)))
    }
  }

  const value = {
    clients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    getOrderStatusHistory,
    getOrdersByClientId,
    services,
    addService,
    updateService,
    deleteService,
    getServiceById,
    getServicesWithPromotions,
    promotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
    getActivePromotions,
    getPromotionForService,
    calculateServicePrice,
    sizes,
    addSize,
    updateSize,
    deleteSize,
    brands,
    addBrand,
    updateBrand,
    deleteBrand,
    colors,
    addColor,
    updateColor,
    deleteColor,
    statusHistory,
    statusStatistics: mockStatusStatistics,
    surveys,
    cities,
    addCity,
    updateCity,
    deleteCity,
    getCityById,
    getCityStatistics,
    getCityStatisticsById,
    referralSources,
    addReferralSource,
    deleteReferralSource,
    points,
    addPoint,
    updatePoint,
    deletePoint,
    getPointById,
    getPointStatistics,
    assignServiceToClient,
    removeServiceFromClient,
    getClientServices,
    expenseCategories,
    addExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
    getExpenseCategoryById,
    promocodes,
    addPromocode,
    updatePromocode,
    deletePromocode,
    getActivePromocodes,
    validatePromocode,
    warehouses,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse,
    getWarehouseById,
    contractors,
    addContractor,
    updateContractor,
    deleteContractor,
    getContractorById,
    paymentTypes,
    addPaymentType,
    updatePaymentType,
    deletePaymentType,
    getPaymentTypeById,
    cashShifts,
    addCashShift,
    updateCashShift,
    deleteCashShift,
    getCashShiftById,
    closeCashShift,
    cashOperations,
    addCashOperation,
    updateCashOperation,
    deleteCashOperation,
    getCashOperationDetails,
    getFilteredCashOperations,
    nomenclature,
    setNomenclature,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
