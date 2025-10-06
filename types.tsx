export interface Point {
  id: number
  name: string
  organizationType: "own" | "franchise"
  phone: string
  address: {
    cityId: number
    fullAddress: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: number
  name: string
  price: number
  category: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  basePrice?: number
  markup?: number
  promotionId?: number
  currentPromotion?: {
    promotionId: number
    promotionName: string
    discountAmount: number
    discountType: "percentage" | "fixed"
    startDate: string
    endDate: string
  }
}

export interface ServiceCategory {
  id: string
  name: string
  isActive: boolean
}

export interface Client {
  id: number
  type: "individual" | "legal"
  surname: string
  name: string
  patronymic?: string
  gender?: "M" | "F"
  phone: string
  email?: string
  birthDate?: string
  registrationDate: string
  referralSource?: string
  companyName?: string
  address: {
    cityId: number | null
    city: string
    street: string
    house: string
    apartment?: string
  }
  legalInfo?: {
    inn: string
    kpp: string
    bik: string
    settlementAccount: string
    corporateAccount: string
    legalAddress: string
    priceList: string
  }
  assignedServices?: number[]
}

export interface ServiceImage {
  id: string
  url: string
  name: string
}

export interface TechPassport {
  contractNumber: string
  client: string
  executor: string
  inn: string
  city: string
  street: string
  phone: string
  itemName: string
  manufacturer: string
  color: string
  material: string
  accessories: string
  processingType: {
    manual: boolean
    bioTechnology: boolean
  }
  additionalProcessing: {
    stainRemoval: boolean
    waterRepellent: boolean
    atelierService: boolean
  }
  lining: {
    exists: boolean
    color: string
    wear: string
  }
  manufacturerMarking: string
  contaminationDegree: string
  hasHiddenDefects: boolean
  hasStains: boolean
  hasRoadReagentStains: boolean
  wearDegree: string
  colorFading: string
  defects: {
    textile: {
      pilling: boolean
      tears: boolean
      abrasion: boolean
      odor: boolean
    }
    fur: {
      rigidity: boolean
      hairLoss: boolean
      yellowness: boolean
      odor: boolean
    }
    leather: {
      rigidity: boolean
      scratches: boolean
      colorLoss: boolean
      odor: boolean
    }
    suede: {
      cracks: boolean
      hairLoss: boolean
      rigidity: boolean
      odor: boolean
    }
    lining: {
      heavyContamination: boolean
      shine: boolean
      tears: boolean
      stains: boolean
    }
  }
  notes: string
  clientConsent: boolean
}

export interface OrderService {
  id: number
  serviceId: number
  serviceName: string
  quantity: number
  price: number
  originalPrice?: number
  total: number
  originalTotal?: number
  appliedPromotion?: {
    promotionId: number
    promotionName: string
    discountAmount: number
    discountType: "percentage" | "fixed"
  }
  images: ServiceImage[]
  readyDate: string
  size?: string
  brand?: string
  color?: string
  techPassport?: TechPassport
}

export interface AppliedPromotion {
  promotionId: number
  promotionName: string
  discountAmount: number
  discountType: "percentage" | "fixed"
  appliedToServices: number[]
  totalDiscount: number
}

export interface AppliedPromocode {
  promocodeId: number
  promocodeName: string
  promocodeCode: string
  discountAmount: number
}

export interface Order {
  id: number
  clientId: number
  date: string
  status: OrderStatus
  services: OrderService[]
  totalAmount: number
  discount?: number
  discountedAmount: number
  comments?: string
  isCashless: boolean
  appliedPromotions?: AppliedPromotion[]
  appliedPromocode?: AppliedPromocode
}

export type OrderStatus = "waiting" | "in-progress" | "completed" | "cancelled"

export interface StatusHistoryItem {
  id: string
  timestamp: string
  status: OrderStatus
  user: string
}

export interface StatusHistory {
  id: number
  orderId: number
  fromStatus: OrderStatus
  toStatus: OrderStatus
  changedBy: string
  changedAt: string
  notes?: string
}

export interface StatusStatistics {
  status: OrderStatus
  count: number
  percentage: number
  trend: "up" | "down" | "stable"
}

export interface Size {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Brand {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Color {
  id: number
  name: string
  hexCode: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Survey {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface City {
  id: number
  name: string
  region: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  clientsCount?: number
  ordersCount?: number
  totalRevenue?: number
  averageOrderValue?: number
}

export interface CityStatistics {
  cityId: number
  cityName: string
  clientsCount: number
  ordersCount: number
  totalRevenue: number
  averageOrderValue: number
  lastOrderDate: string
  topServices: {
    serviceName: string
    count: number
  }[]
}

export interface Promotion {
  id: number
  name: string
  discountAmount: number
  discountType: "percentage" | "fixed"
  description: string
  targetAudience: "all" | "physical" | "legal"
  startDate: string
  endDate: string
  status: "active" | "inactive" | "expired"
  locations: string[]
  applicableServices: number[]
}

export interface RFMSettings {
  recencyDays: number
  frequencyOrders: number
  monetaryAmount: number
}

export interface RFMSegment {
  id: string
  name: string
  description: string
  color: string
  icon: string
  clientsCount: number
  criteria: string
  aiRecommendation: string
  clients: Client[]
}

export interface RFMAnalysis {
  segments: RFMSegment[]
  settings: RFMSettings
  lastUpdated: string
}

export interface ExpenseCategory {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Promocode {
  id: number
  name: string
  code: string
  type: "discount" | "cashback" | "free_service"
  discountAmount: number
  discountType: "percentage" | "fixed"
  startDate: string
  endDate: string
  status: "active" | "inactive" | "expired"
  targetAudience: "physical" | "legal" | "all"
  applicablePoints: string[]
  usageLimit: number
  usedCount: number
  minOrderAmount?: number
  maxDiscountAmount?: number
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Warehouse {
  id: number
  name: string
  address: string
  cityId: number
  city: string
  contractorId: number
  contractorName: string
  paymentMethod: "cash" | "cashless" | "mixed"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Contractor {
  id: number
  legalName: string
  inn: string
  kpp: string
  address: string
  phone: string
  email?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PaymentType {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CashShift {
  id: number
  shiftNumber: string
  openTime: string
  closeTime?: string
  fiscalRegistrator: string
  openedBy: string
  closedBy?: string
  revenue: number
  receiptsCount: number
  salesPoint: string
  previousShiftDifference: number
  cashDifference: number
  emergencyClose: boolean
  status: "open" | "closed"
  zReportNumber?: string
  total: number
  fiscalCash: number
  fiscalCashless: number
  nonFiscalCash: number
  nonFiscalCashless: number
  nonFiscalBonuses: number
  returns: number
  returnsFiscalCash: number
  returnsFiscalCashless: number
  returnsNonFiscalCash: number
  returnsNonFiscalCashless: number
  returnsNonFiscalBonuses: number
  returnsWriteOff: number
  cashAtStart: number
  cashAtEnd: number
  createdAt: string
  updatedAt: string
}

export interface CashOperation {
  id: number
  operationNumber: string
  dateTime: string
  type: "deposit" | "collection" | "auto_collection" | "failed_collection"
  employee: string
  amount: number
  cashInRegister: number
  salesPoint: string
  fiscalRegistrator: string
  comment: string
  cashShiftNumber: string
  status: "completed" | "failed"
  createdAt: string
  updatedAt: string
}

export interface CashOperationDetails {
  id: number
  operationNumber: string
  openTime: string
  openedBy: string
  status: "completed" | "failed" | "in_progress"
  cashier: string
  fiscalRegistrator: string
  cashShiftNumber: string
  total: number
  revenue: number
  costPrice: number
  receiptsCount: number
  collectionAmount: number
  salesPoint: string
  recipientAccount: string
  createdAt: string
  updatedAt: string
}

export interface CashOperationFilters {
  dateFrom?: string
  dateTo?: string
  amountFrom?: number
  amountTo?: number
  type?: string
  employee?: string
  salesPoint?: string
  fiscalRegistrator?: string
  cashShiftNumber?: string
  status?: string
}

export type ClientType = "individual" | "legal"
export type Gender = "M" | "F"

// Добавляем интерфейс для фискальных регистраторов
export interface FiscalRegistrator {
  id: number
  name: string
  model: string
  serialNumber: string
  organization: string
  terminal: string
  status: "active" | "inactive"
  manufacturer: string
  symbolsCount: number
  createdAt: string
  updatedAt: string
}
