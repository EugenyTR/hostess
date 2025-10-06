"use client"

import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { ChevronDown, Settings, Plus, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

// Типы данных для локаций
interface LocationData {
  id: string
  name: string
  stats: {
    orderCount: number
    averageCheck: number
    averageVolume: number
    shiftsCount: number
    individualClients: number
    legalClients: number
    profit: {
      total: number
      monthly: {
        sep: number
        oct: number
        nov: number
        dec: number
        jan: number
        feb: number
      }
    }
  }
  orders: Array<{
    id: number
    client: string
    phone: string
    dateReceived: string
    dateReady: string
    hasAlert: boolean
  }>
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedLocationId, setSelectedLocationId] = useState("moscow1")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [currentData, setCurrentData] = useState<LocationData | null>(null)

  // Данные по локациям (оставляем как есть)
  const locationsData: LocationData[] = [
    {
      id: "moscow1",
      name: "г. Москва, Ленина 50",
      stats: {
        orderCount: 18,
        averageCheck: 1500,
        averageVolume: 1000,
        shiftsCount: 15,
        individualClients: 10,
        legalClients: 4,
        profit: {
          total: 442,
          monthly: {
            sep: 340,
            oct: 460,
            nov: 179,
            dec: 134,
            jan: 89,
            feb: 0,
          },
        },
      },
      orders: [
        {
          id: 123,
          client: "Иванов И.И.",
          phone: "8 900 000 00 00",
          dateReceived: "01.01.25",
          dateReady: "01.01.25",
          hasAlert: false,
        },
        {
          id: 12,
          client: "Иванов И.И.",
          phone: "8 900 000 00 00",
          dateReceived: "01.01.25",
          dateReady: "01.01.25",
          hasAlert: true,
        },
        {
          id: 134,
          client: "Иванов И.И.",
          phone: "8 900 000 00 00",
          dateReceived: "01.01.25",
          dateReady: "01.01.25",
          hasAlert: false,
        },
        {
          id: 43,
          client: "Иванов И.И.",
          phone: "8 900 000 00 00",
          dateReceived: "01.01.25",
          dateReady: "01.01.25",
          hasAlert: false,
        },
        {
          id: 5,
          client: "Иванов И.И.",
          phone: "8 900 000 00 00",
          dateReceived: "01.01.25",
          dateReady: "01.01.25",
          hasAlert: true,
        },
        {
          id: 6,
          client: "Иванов И.И.",
          phone: "8 900 000 00 00",
          dateReceived: "01.01.25",
          dateReady: "01.01.25",
          hasAlert: false,
        },
      ],
    },
    {
      id: "moscow2",
      name: "г. Москва, Тверская 25",
      stats: {
        orderCount: 24,
        averageCheck: 1800,
        averageVolume: 1200,
        shiftsCount: 18,
        individualClients: 15,
        legalClients: 7,
        profit: {
          total: 580,
          monthly: {
            sep: 420,
            oct: 510,
            nov: 230,
            dec: 180,
            jan: 120,
            feb: 40,
          },
        },
      },
      orders: [
        {
          id: 223,
          client: "Петров П.П.",
          phone: "8 900 111 11 11",
          dateReceived: "02.01.25",
          dateReady: "03.01.25",
          hasAlert: true,
        },
        {
          id: 224,
          client: "Сидоров С.С.",
          phone: "8 900 222 22 22",
          dateReceived: "02.01.25",
          dateReady: "04.01.25",
          hasAlert: false,
        },
        {
          id: 225,
          client: "Кузнецов К.К.",
          phone: "8 900 333 33 33",
          dateReceived: "03.01.25",
          dateReady: "05.01.25",
          hasAlert: true,
        },
      ],
    },
    {
      id: "spb1",
      name: "г. Санкт-Петербург, Невский 78",
      stats: {
        orderCount: 32,
        averageCheck: 2100,
        averageVolume: 1500,
        shiftsCount: 22,
        individualClients: 18,
        legalClients: 12,
        profit: {
          total: 720,
          monthly: {
            sep: 480,
            oct: 590,
            nov: 320,
            dec: 270,
            jan: 180,
            feb: 90,
          },
        },
      },
      orders: [
        {
          id: 323,
          client: "Смирнов С.С.",
          phone: "8 911 111 11 11",
          dateReceived: "05.01.25",
          dateReady: "07.01.25",
          hasAlert: false,
        },
        {
          id: 324,
          client: "Васильев В.В.",
          phone: "8 911 222 22 22",
          dateReceived: "06.01.25",
          dateReady: "08.01.25",
          hasAlert: true,
        },
      ],
    },
  ]

  // Обновление данных при изменении локации
  useEffect(() => {
    const selectedLocation = locationsData.find((loc) => loc.id === selectedLocationId)
    if (selectedLocation) {
      setCurrentData(selectedLocation)
    }
  }, [selectedLocationId])

  // Инициализация данных
  useEffect(() => {
    if (locationsData.length > 0 && !currentData) {
      setCurrentData(locationsData[0])
    }
  }, [locationsData, currentData])

  // ИСПРАВЛЕННЫЙ обработчик перехода на страницу создания заказа
  const handleCreateOrder = (clientType: "individual" | "legal") => {
    // Используем правильный путь без query параметров
    if (clientType === "individual") {
      router.push("/create-order") // Переход на страницу создания заказа для физ.лица
    } else {
      router.push("/create-order") // Переход на страницу создания заказа для юр.лица
    }

    // Можно также использовать sessionStorage для передачи типа клиента
    sessionStorage.setItem("selectedClientType", clientType)
  }

  // Обработчик выбора даты
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setShowDatePicker(false)
    console.log("Выбрана дата:", format(date, "dd.MM.yyyy", { locale: ru }))
  }

  // Генерация календаря
  const generateCalendar = () => {
    const today = new Date()
    const currentMonth = selectedDate.getMonth()
    const currentYear = selectedDate.getFullYear()

    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return days
  }

  // Если данные еще не загружены
  if (!currentData) {
    return (
      <div className="flex-1 bg-[#f7f7f7] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2055a4] mx-auto mb-4"></div>
          <p className="text-[#979797]">Загрузка данных...</p>
        </div>
      </div>
    )
  }

  // Данные для графика прибыли
  const profitData = [
    { month: "СЕН", value: currentData.stats.profit.monthly.sep },
    { month: "ОКТ", value: currentData.stats.profit.monthly.oct },
    { month: "НОЯ", value: currentData.stats.profit.monthly.nov },
    { month: "ДЕК", value: currentData.stats.profit.monthly.dec },
    { month: "ЯНВ", value: currentData.stats.profit.monthly.jan },
    { month: "ФЕВ", value: currentData.stats.profit.monthly.feb },
  ]

  const maxValue = Math.max(...profitData.map((d) => d.value))

  // Расчет процентов для круговой диаграммы
  const totalClients = currentData.stats.individualClients + currentData.stats.legalClients
  const individualPercentage = (currentData.stats.individualClients / totalClients) * 100
  const legalPercentage = (currentData.stats.legalClients / totalClients) * 100

  const calendarDays = generateCalendar()
  const today = new Date()

  return (
    <div className="flex-1 bg-[#f7f7f7] min-h-screen">
      {/* Верхняя панель */}
      <div className="bg-[#ffffff] px-6 py-4 border-b border-[#e3e3e3]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Кнопка настроек */}
            <button className="w-12 h-12 bg-[#2055a4] rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </button>

            {/* Селектор локации */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 text-[#979797]">📍</div>
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="bg-transparent text-[#2c2c33] text-sm border-none outline-none cursor-pointer"
              >
                {locationsData.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#979797]" />
            </div>

            {/* DatePicker */}
            <div className="relative">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#979797]" />
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="bg-transparent text-[#2c2c33] text-sm border-none outline-none cursor-pointer flex items-center space-x-1"
                >
                  <span>{format(selectedDate, "dd MMMM yyyy", { locale: ru })}</span>
                  <ChevronDown className="w-4 h-4 text-[#979797]" />
                </button>
              </div>

              {/* Календарь */}
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-[#e3e3e3] rounded-lg shadow-lg z-50 p-4 w-80">
                  {/* Заголовок календаря */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() =>
                        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))
                      }
                      className="p-1 hover:bg-[#f7f7f7] rounded"
                    >
                      <ChevronDown className="w-4 h-4 rotate-90 text-[#979797]" />
                    </button>
                    <h3 className="text-sm font-medium text-[#2c2c33]">
                      {format(selectedDate, "LLLL yyyy", { locale: ru })}
                    </h3>
                    <button
                      onClick={() =>
                        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))
                      }
                      className="p-1 hover:bg-[#f7f7f7] rounded"
                    >
                      <ChevronDown className="w-4 h-4 -rotate-90 text-[#979797]" />
                    </button>
                  </div>

                  {/* Дни недели */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map((day) => (
                      <div key={day} className="text-xs text-[#979797] text-center py-2 font-medium">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Календарная сетка */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      const isCurrentMonth = day.getMonth() === selectedDate.getMonth()
                      const isToday = format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
                      const isSelected = format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")

                      return (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(day)}
                          className={`
                            text-xs py-2 px-1 rounded hover:bg-[#f7f7f7] transition-colors
                            ${!isCurrentMonth ? "text-[#c5c5c5]" : "text-[#2c2c33]"}
                            ${isToday ? "bg-[#2055a4] text-white hover:bg-[#2055a4]" : ""}
                            ${isSelected && !isToday ? "bg-[#d9dbe7] text-[#2c2c33]" : ""}
                          `}
                        >
                          {day.getDate()}
                        </button>
                      )
                    })}
                  </div>

                  {/* Кнопка "Сегодня" */}
                  <div className="mt-4 pt-3 border-t border-[#e3e3e3]">
                    <button
                      onClick={() => handleDateSelect(new Date())}
                      className="w-full text-sm text-[#2055a4] hover:bg-[#f7f7f7] py-2 rounded transition-colors"
                    >
                      Сегодня
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Закрытие календаря при ��лике вне его */}
      {showDatePicker && <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />}

      <div className="flex">
        {/* Основной контент */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Таблица заказов */}
            <div className="col-span-8">
              <div className="bg-[#ffffff] rounded-lg shadow-sm">
                <div className="p-4 border-b border-[#e3e3e3]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-[#2c2c33]">Заказы, шт</h2>
                      <div className="text-4xl font-bold text-[#2c2c33] mt-2">{currentData.stats.orderCount}</div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#f7f7f7]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#979797] uppercase">№</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#979797] uppercase">Клиент</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#979797] uppercase">Телефон</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#979797] uppercase">
                          Дата приема
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#979797] uppercase">
                          Дата готовности
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e3e3e3]">
                      {currentData.orders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#f7f7f7]">
                          <td className="px-4 py-3 text-sm text-[#2c2c33] font-medium">
                            <div className="flex items-center space-x-2">
                              {order.hasAlert && <div className="w-2 h-2 bg-[#ee8db6] rounded-full"></div>}
                              <span>{order.id}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-[#2c2c33]">{order.client}</td>
                          <td className="px-4 py-3 text-sm text-[#979797]">{order.phone}</td>
                          <td className="px-4 py-3 text-sm text-[#979797]">{order.dateReceived}</td>
                          <td className="px-4 py-3 text-sm text-[#979797]">{order.dateReady}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* График прибыли */}
              <div className="bg-[#ffffff] rounded-lg shadow-sm mt-6">
                <div className="p-4 border-b border-[#e3e3e3]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#2c2c33]">Общая прибыль, ₽</h3>
                    <select className="bg-transparent text-[#979797] text-sm border border-[#e3e3e3] rounded px-2 py-1">
                      <option>сен.- фев. 2024</option>
                    </select>
                  </div>
                  <div className="text-2xl font-bold text-[#2c2c33] mt-2">{currentData.stats.profit.total} т.</div>
                </div>

                <div className="p-6">
                  <div className="flex items-end justify-between h-32 space-x-4">
                    {profitData.map((item) => (
                      <div key={item.month} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-[#d9dbe7] rounded-t"
                          style={{
                            height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                            minHeight: item.value > 0 ? "20px" : "4px",
                          }}
                        ></div>
                        <div className="text-xs text-[#979797] mt-2 font-medium">{item.month}</div>
                        {item.value > 0 && <div className="text-xs text-[#2c2c33] font-semibold">{item.value} т.</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Правая панель */}
            <div className="col-span-4 space-y-6">
              {/* Статистика */}
              <div className="bg-[#ffffff] rounded-lg shadow-sm p-4">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-[#979797]">Средний чек, ₽</div>
                    <div className="text-3xl font-bold text-[#2c2c33]">{currentData.stats.averageCheck}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#979797]">Средний объем, кг</div>
                    <div className="text-3xl font-bold text-[#2c2c33]">{currentData.stats.averageVolume}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#979797]">Кол-во отработанных смен</div>
                    <div className="text-3xl font-bold text-[#2c2c33]">{currentData.stats.shiftsCount}</div>
                  </div>
                </div>
              </div>

              {/* Круговая диаграмма */}
              <div className="bg-[#ffffff] rounded-lg shadow-sm p-4">
                <div className="text-sm text-[#979797] mb-4">Типы клиентов:</div>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      {/* Фон */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e3e3e3"
                        strokeWidth="2"
                      />
                      {/* Юр. лица (синий) */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#2055a4"
                        strokeWidth="2"
                        strokeDasharray={`${legalPercentage}, ${100 - legalPercentage}`}
                        strokeDashoffset="0"
                      />
                      {/* Физ. лица (розовый) */}
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#ee8db6"
                        strokeWidth="2"
                        strokeDasharray={`${individualPercentage}, ${100 - individualPercentage}`}
                        strokeDashoffset={`-${legalPercentage}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#2c2c33]">{totalClients}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#ee8db6] rounded-full"></div>
                      <span className="text-sm text-[#979797]">Физ. лицо</span>
                    </div>
                    <span className="text-sm font-medium text-[#2c2c33]">{currentData.stats.individualClients}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#2055a4] rounded-full"></div>
                      <span className="text-sm text-[#979797]">Юр. лицо</span>
                    </div>
                    <span className="text-sm font-medium text-[#2c2c33]">{currentData.stats.legalClients}</span>
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="space-y-3">
                <button className="w-full bg-[#d9dbe7] text-[#2c2c33] py-3 px-4 rounded-lg text-sm font-medium hover:bg-[#c5c5c5] transition-colors">
                  Заявка на химию
                </button>
                <button className="w-full bg-[#d9dbe7] text-[#2c2c33] py-3 px-4 rounded-lg text-sm font-medium hover:bg-[#c5c5c5] transition-colors">
                  Кассовые смены
                </button>
                <button
                  onClick={() => handleCreateOrder("individual")}
                  className="w-full bg-[#2055a4] text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Создать заказ физ.лицо</span>
                </button>
                <button
                  onClick={() => handleCreateOrder("legal")}
                  className="w-full bg-[#2055a4] text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Создать заказ юр.лицо</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
