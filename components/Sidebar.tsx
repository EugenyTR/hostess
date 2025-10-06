"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

// Simple icon components to avoid import issues
const LayoutDashboard = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

const ShoppingCart = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)

const Package = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
)

const Shirt = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z" />
  </svg>
)

const Users = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="m22 21-3-3" />
    <path d="m16 16 3 3" />
  </svg>
)

const BarChart = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" x2="12" y1="20" y2="10" />
    <line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="16" />
  </svg>
)

const FileText = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
)

const Target = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const Settings = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const Monitor = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
)

const Receipt = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <path d="M12 18V6" />
  </svg>
)

const CreditCard = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" x2="23" y1="10" y2="10" />
  </svg>
)

const ChevronDown = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const ChevronRight = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const Menu = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
)

const X = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m18 6-12 12" />
    <path d="m6 6 12 12" />
  </svg>
)

const LogOut = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
)

interface NavItem {
  title: string
  href: string
  icon?: any
  items?: { title: string; href: string }[]
}

function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Продажи: true,
    Справочник: false,
    Устройства: false,
    Маркетинг: false,
    Настройки: false,
  })
  const [currentTime, setCurrentTime] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<string>("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Определяем структуру навигации в зависимости от роли пользователя
  const getNavItems = (): NavItem[] => {
    if (user?.role === "cashier") {
      // Меню для кассира
      return [
        { title: "Рабочий стол", href: "/dashboard", icon: LayoutDashboard },
        { title: "Продажа", href: "/create-order", icon: ShoppingCart },
        { title: "Услуги", href: "/service-list", icon: Shirt },
        { title: "Чеки", href: "/receipts", icon: Receipt },
        { title: "Клиенты", href: "/clients", icon: Users },
        { title: "Внесение/инкассация", href: "/cash-operations", icon: CreditCard },
        { title: "Номенклатура", href: "/nomenclature", icon: Package },
        { title: "Настройки", href: "/settings", icon: Settings },
      ]
    }

    // Полное меню для администраторов и менеджеров
    return [
      { title: "Рабочий стол", href: "/dashboard", icon: LayoutDashboard },
      {
        title: "Продажи",
        href: "#",
        icon: ShoppingCart,
        items: [
          { title: "Создать продажу", href: "/create-order" },
          { title: "Корпоративный заказ", href: "/create-order/legal" },
          { title: "Список заказов", href: "/orders" },
          { title: "Чеки", href: "/receipts" },
          { title: "Внесения / инкассации", href: "/cash-operations" },
          { title: "Кассовые смены", href: "/cash-shifts" },
        ],
      },
      { title: "Номенклатура", href: "/nomenclature", icon: Package },
      { title: "Каталог услуг", href: "/service-list", icon: Shirt },
      { title: "Клиенты", href: "/clients", icon: Users },
      { title: "Отчеты", href: "/reports", icon: BarChart },
      {
        title: "Справочник",
        href: "#",
        icon: FileText,
        items: [
          { title: "Единицы измерения", href: "/measurement-units-page" },
          { title: "Склады", href: "/warehouses" },
          { title: "Типы оплат", href: "/payment-types" },
          { title: "Роли", href: "/role" },
          { title: "Статьи расходов", href: "/expense-categories" },
          { title: "Список точек", href: "/points" },
          { title: "Города", href: "/cities" },
        ],
      },
      {
        title: "Устройства",
        href: "#",
        icon: Monitor,
        items: [
          { title: "Фискальные регистраторы", href: "/devices/fiscal-registrators" },
          { title: "Банковские терминалы", href: "/devices/bank-terminals" },
          { title: "Принтеры", href: "/devices/printers" },
          { title: "СБП", href: "/devices/sbp" },
        ],
      },
      {
        title: "Маркетинг",
        href: "#",
        icon: Target,
        items: [
          { title: "Опросы", href: "/survey" },
          { title: "Цвета", href: "/color" },
          { title: "Бренд", href: "/brand" },
          { title: "Размер", href: "/size" },
          { title: "Акции", href: "/promotions" },
          { title: "Промокоды", href: "/promocodes" },
        ],
      },
      {
        title: "Настройки",
        href: "#",
        icon: Settings,
        items: [
          { title: "Шаблонизатор чека", href: "#" },
          { title: "Пользователи", href: "/user-managment" },
        ],
      },
    ]
  }

  const navItems = getNavItems()

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Обновляем время и дату каждую секунду
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()

      // Форматируем время в формате ЧЧ:ММ
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      setCurrentTime(`${hours}:${minutes}`)

      // Форматируем дату в формате "день месяца"
      const day = now.getDate()
      const monthNames = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
      ]
      const month = monthNames[now.getMonth()]
      setCurrentDate(`${day} ${month}`)
    }

    updateDateTime()
    const intervalId = setInterval(updateDateTime, 1000)
    return () => clearInterval(intervalId)
  }, [])

  const toggleMenu = (title: string) => {
    setExpandedMenus({
      ...expandedMenus,
      [title]: !expandedMenus[title],
    })
  }

  const isActive = (href: string) => {
    return pathname === href
  }

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon
    const hasSubItems = item.items && item.items.length > 0
    const isExpanded = hasSubItems && expandedMenus[item.title]

    return (
      <div key={item.title} className="mb-1">
        {hasSubItems ? (
          <div>
            <div
              className="flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-[#c8cadb] rounded-md transition-colors"
              onClick={() => toggleMenu(item.title)}
            >
              <div className="flex items-center">
                {Icon && <Icon size={20} className="text-[#2c2c33] mr-3" />}
                <span className="text-sm text-[#2c2c33]">{item.title}</span>
              </div>
              {isExpanded ? (
                <ChevronDown size={16} className="text-[#8e8e8e]" />
              ) : (
                <ChevronRight size={16} className="text-[#8e8e8e]" />
              )}
            </div>

            {isExpanded && (
              <div className="ml-9 mt-1 space-y-1">
                {item.items?.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.href}
                    className={`block text-xs ${
                      isActive(subItem.href) ? "text-[#2055a4] font-medium" : "text-[#2c2c33]"
                    } py-2 hover:text-[#2055a4] transition-colors`}
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Link
            href={item.href}
            className={`flex items-center py-2 px-4 ${
              isActive(item.href) ? "bg-[#c8cadb]" : "hover:bg-[#c8cadb]"
            } rounded-md transition-colors`}
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
          >
            {Icon && <Icon size={20} className="text-[#2c2c33] mr-3" />}
            <span className={`text-sm ${isActive(item.href) ? "text-[#2055a4] font-medium" : "text-[#2c2c33]"}`}>
              {item.title}
            </span>
          </Link>
        )}
      </div>
    )
  }

  // Мобильная кнопка меню
  const MobileMenuButton = () => (
    <button
      className="fixed top-4 left-4 z-50 md:hidden bg-[#2055a4] text-white p-2 rounded-full shadow-lg"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  )

  // Мобильная версия сайдбара
  if (isMobile) {
    return (
      <>
        <MobileMenuButton />

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
            <div className="w-[80%] max-w-[300px] bg-[#d9dbe7] h-screen overflow-y-auto transform transition-transform duration-300 ease-in-out">
              {/* Логотип и время */}
              <div className="p-4">
                <div className="mb-4 flex justify-center">
                  <Image src="/logo.webp" alt="Хозяюшка" width={150} height={50} className="mx-auto" />
                </div>
                <div className="text-center">
                  <div className="text-[#2c2c33] text-xl font-medium">{currentTime}</div>
                  <div className="text-[#2c2c33] mt-1">{currentDate}</div>
                </div>
              </div>

              {/* Навигация */}
              <div className="px-4 py-2 flex-1 overflow-y-auto">{navItems.map(renderNavItem)}</div>

              {/* Профиль пользователя */}
              <div className="mt-auto p-4 flex items-center justify-between border-t border-[#c8cadb]">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#2055a4] flex items-center justify-center text-white font-bold">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="ml-3">
                    <div className="text-[#2c2c33] font-medium">{user?.username || "Пользователь"}</div>
                    <div className="text-[#8e8e8e] text-xs">
                      {user?.role === "admin"
                        ? "Администратор"
                        : user?.role === "manager"
                          ? "Менеджер"
                          : user?.role === "cashier"
                            ? "Кассир"
                            : "Роль"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-[#8e8e8e] hover:text-[#2c2c33] transition-colors"
                  title="Выйти"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Мини-хедер для мобильной версии */}
        <div className="md:hidden h-16 bg-[#d9dbe7] flex items-center justify-center shadow-sm">
          <Image src="/logo.webp" alt="Хозяюшка" width={120} height={40} />
        </div>
      </>
    )
  }

  // Десктопная версия сайдбара
  return (
    <div className="w-[220px] bg-[#d9dbe7] flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Логотип и время */}
      <div className="p-4 flex-shrink-0">
        <div className="mb-4 flex justify-center">
          <Image src="/logo.webp" alt="Хозяюшка" width={180} height={60} className="mx-auto" />
        </div>
        <div className="text-center">
          <div className="text-[#2c2c33] text-xl font-medium">{currentTime}</div>
          <div className="text-[#2c2c33] mt-1">{currentDate}</div>
        </div>
      </div>

      {/* Навигация */}
      <div className="px-4 py-2 flex-1 overflow-y-auto">{navItems.map(renderNavItem)}</div>

      {/* Профиль пользователя */}
      <div className="mt-auto p-4 flex items-center justify-between border-t border-[#c8cadb] flex-shrink-0">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#2055a4] flex items-center justify-center text-white font-bold">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="ml-3">
            <div className="text-[#2c2c33] font-medium">{user?.username || "Пользователь"}</div>
            <div className="text-[#8e8e8e] text-xs">
              {user?.role === "admin"
                ? "Администратор"
                : user?.role === "manager"
                  ? "Менеджер"
                  : user?.role === "cashier"
                    ? "Кассир"
                    : "Роль"}
            </div>
          </div>
        </div>
        <button onClick={logout} className="text-[#8e8e8e] hover:text-[#2c2c33] transition-colors" title="Выйти">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  )
}

export default Sidebar
