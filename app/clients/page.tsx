"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Download, Filter, ChevronDown, X, Users, BarChart3, History } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import RFMAnalysis from "@/components/RFMAnalysis"
import OrderHistory from "@/components/OrderHistory"
import type { Client } from "@/types"
import { exportToCSV, exportToXLS } from "@/lib/exportUtils"
import type { TabType } from "@/types" // Import TabType

export default function ClientsList() {
  const router = useRouter()
  const { clients } = useAppContext()
  const [activeTab, setActiveTab] = useState<"clients" | "rfm" | "history">("clients")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "individual" | "legal">("all")
  const [cityFilter, setcityFilter] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Фильтрация клиентов
  const filteredClients = clients.filter((client) => {
    const fullName =
        client.type === "individual" ? `${client.surname} ${client.name} ${client.patronymic}` : client.companyName || ""

    const matchesSearch =
        searchTerm === "" ||
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = typeFilter === "all" || client.type === typeFilter
    const matchesCity = cityFilter === null || client.address.cityId === cityFilter

    return matchesSearch && matchesType && matchesCity
  })

  const handleClientClick = (client: Client) => {
    if (client.type === "individual") {
      router.push(`/clients/${client.id}`)
    } else {
      router.push(`/clients/legal/${client.id}`)
    }
  }

  const handleCreateClient = () => {
    router.push("/create-order")
  }

  const handleExportToExcel = (format: "csv" | "xls" = "csv") => {
    try {
      // Подготавливаем данные для экспорта
      const exportData = filteredClients.map((client) => {
        if (client.type === "individual") {
          return {
            "Тип клиента": "Физическое лицо",
            Фамилия: client.surname,
            Имя: client.name,
            Отчество: client.patronymic || "",
            Телефон: client.phone,
            Email: client.email || "",
            "Дата рождения": client.birthDate || "",
            Город: client.address.city,
            Адрес: `${client.address.street}, ${client.address.house}${
                client.address.apartment ? `, кв. ${client.address.apartment}` : ""
            }`,
            Источник: client.referralSource || "",
            "Дата регистрации": client.registrationDate,
          }
        } else {
          return {
            "Тип клиента": "Юридическое лицо",
            "Название компании": client.companyName || "",
            "Контактное лицо": `${client.surname} ${client.name} ${client.patronymic || ""}`,
            Телефон: client.phone,
            Email: client.email || "",
            Город: client.address.city,
            Адрес: `${client.address.street}, ${client.address.house}${
                client.address.apartment ? `, оф. ${client.address.apartment}` : ""
            }`,
            ИНН: client.legalInfo?.inn || "",
            КПП: client.legalInfo?.kpp || "",
            БИК: client.legalInfo?.bik || "",
            "Расчетный счет": client.legalInfo?.settlementAccount || "",
            "Корр. счет": client.legalInfo?.corporateAccount || "",
            "Юридический адрес": client.legalInfo?.legalAddress || "",
            "Прайс-лист": client.legalInfo?.priceList || "",
            Источник: client.referralSource || "",
            "Дата регистрации": client.registrationDate,
          }
        }
      })

      const filename = `clients_export_${new Date().toISOString().split("T")[0]}`

      if (format === "csv") {
        exportToCSV(exportData, filename)
      } else {
        exportToXLS(exportData, filename)
      }

      console.log(`Экспортировано ${exportData.length} клиентов в ${format.toUpperCase()} файл`)
    } catch (error) {
      console.error("Ошибка при экспорте клиентов:", error)
      alert("Произошла ошибка при экспорте данных")
    }
  }

  // Получаем уникальные города из клиентов
  const uniqueCities = Array.from(new Set(clients.map((client) => client.address.cityId)))
      .map((cityId) => {
        const client = clients.find((c) => c.address.cityId === cityId)
        return {
          id: cityId,
          name: client ? client.address.city : "Неизвестный город",
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name))

  const tabs = [
    { id: "clients" as TabType, name: "База клиентов", icon: Users },
    { id: "rfm" as TabType, name: "RFM анализ", icon: BarChart3 },
    { id: "history" as TabType, name: "История заказов", icon: History },
  ]

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Клиенты</h1>
          {activeTab === "clients" && (
              <div className="flex space-x-2">
                <div className="relative group">
                  <button className="flex items-center px-4 py-2 bg-[#2055a4] text-white rounded-lg hover:bg-[#1a4a8f] transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Экспорт
                  </button>
                  <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button
                        onClick={() => handleExportToExcel("csv")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    >
                      CSV формат
                    </button>
                    <button
                        onClick={() => handleExportToExcel("xls")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
                    >
                      XLS формат
                    </button>
                  </div>
                </div>
                <button
                    onClick={handleCreateClient}
                    className="flex items-center px-4 py-2 bg-[#2055a4] text-white rounded-lg hover:bg-[#1a4a8f] transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить клиента
                </button>
              </div>
          )}
        </div>

        {/* Табы */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                              ? "border-[#2055a4] text-[#2055a4]"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
              )
            })}
          </nav>
        </div>

        {/* Контент табов */}
        {activeTab === "clients" && (
            <>
              {/* Фильтры */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-1 min-w-[300px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      type="text"
                      placeholder="Поиск по имени, телефону или email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                  />
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center px-4 py-2 rounded-lg border ${
                        showFilters ? "bg-[#2055a4] text-white border-[#2055a4]" : "border-gray-300 text-gray-700"
                    }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Фильтры
                </button>

                <button
                    onClick={() => {
                      setSearchTerm("")
                      setTypeFilter("all")
                      setcityFilter(null)
                    }}
                    className="bg-[#2055a4] text-white px-4 py-2 rounded-lg hover:bg-[#1a4a8f] transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>

              {/* Дополнительные фильтры */}
              {showFilters && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-wrap gap-4">
                    <div className="w-full md:w-64">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Тип клиента</label>
                      <div className="relative">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as "all" | "individual" | "legal")}
                            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white text-sm appearance-none"
                        >
                          <option value="all">Все типы</option>
                          <option value="individual">Физические лица</option>
                          <option value="legal">Юридические лица</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-64">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Город</label>
                      <div className="relative">
                        <select
                            value={cityFilter || ""}
                            onChange={(e) => setcityFilter(e.target.value ? Number(e.target.value) : null)}
                            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white text-sm appearance-none"
                        >
                          <option value="">Все города</option>
                          {uniqueCities.map((city) => (
                              <option key={city.id} value={city.id}>
                                {city.name}
                              </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {/* Активные фильтры */}
              {(typeFilter !== "all" || cityFilter !== null) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {typeFilter !== "all" && (
                        <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          <span>Тип: {typeFilter === "individual" ? "Физические лица" : "Юридические лица"}</span>
                          <button onClick={() => setTypeFilter("all")} className="ml-1 p-0.5 rounded-full hover:bg-blue-200">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                    )}
                    {cityFilter !== null && (
                        <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          <span>Город: {uniqueCities.find((city) => city.id === cityFilter)?.name || "Неизвестный город"}</span>
                          <button onClick={() => setcityFilter(null)} className="ml-1 p-0.5 rounded-full hover:bg-green-200">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                    )}
                  </div>
              )}

              {/* Таблица клиентов */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                      <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Клиент
                      </th>
                      <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Контакты
                      </th>
                      <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Адрес
                      </th>
                      <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Тип
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Действия</span>
                      </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.map((client) => (
                        <tr
                            key={client.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleClientClick(client)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {client.type === "individual"
                                  ? `${client.surname} ${client.name} ${client.patronymic || ""}`
                                  : client.companyName}
                            </div>
                            {client.type === "legal" && (
                                <div className="text-sm text-gray-500">
                                  {client.surname} {client.name} {client.patronymic}
                                </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{client.phone}</div>
                            {client.email && <div className="text-sm text-gray-500">{client.email}</div>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{client.address.city}</div>
                            <div className="text-sm text-gray-500">
                              {client.address.street}, {client.address.house}
                              {client.address.apartment &&
                              `, ${client.type === "individual" ? "кв." : "оф."} ${client.address.apartment}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                        <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                client.type === "individual" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {client.type === "individual" ? "Физ. лицо" : "Юр. лицо"}
                        </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-[#2055a4] hover:text-[#1a4a8f]">Подробнее</button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>

                {filteredClients.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Клиенты не найдены. Попробуйте изменить параметры поиска или{" "}
                      <button onClick={handleCreateClient} className="text-[#2055a4] hover:text-[#1a4a8f]">
                        добавьте нового клиента
                      </button>
                      .
                    </div>
                )}
              </div>
            </>
        )}

        {activeTab === "rfm" && <RFMAnalysis />}
        {activeTab === "history" && <OrderHistory />}
      </div>
  )
}
