"use client"

import { useState } from "react"
import { Search, Plus, Trash2, Power, PowerOff, MoreHorizontal } from 'lucide-react'
import type { FiscalRegistrator } from "@/types"

export default function FiscalRegistratorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDevice, setSelectedDevice] = useState<FiscalRegistrator | null>(null)

  // Моковые данные фискальных регистраторов
  const [fiscalRegistrators] = useState<FiscalRegistrator[]>([
    {
      id: 1,
      name: "ФР Хозяюшка Водный Стадион",
      model: "Atol FPrint-22TTK",
      serialNumber: "64",
      organization: "ИП Голикова Мария Вячеславовна",
      terminal: "Москва Водный Стадион",
      status: "inactive",
      manufacturer: "Atol",
      symbolsCount: 64,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
    {
      id: 2,
      name: "Виртуальный ФР Авиапарк",
      model: "QR Virtual Device",
      serialNumber: "",
      organization: "ИП Голикова Мария Вячеславовна",
      terminal: "Авиапарк",
      status: "active",
      manufacturer: "QR Virtual Device",
      symbolsCount: 0,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
    {
      id: 3,
      name: "Виртуальный ФР Лермонтова",
      model: "QR Virtual Device",
      serialNumber: "",
      organization: "ИП Голикова Мария Вячеславовна",
      terminal: "Лермонтова",
      status: "active",
      manufacturer: "QR Virtual Device",
      symbolsCount: 0,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
    {
      id: 4,
      name: "Виртуальный ФР Партизанская",
      model: "QR Virtual Device",
      serialNumber: "",
      organization: "ИП Голикова Мария Вячеславовна",
      terminal: "Партизанская",
      status: "active",
      manufacturer: "QR Virtual Device",
      symbolsCount: 0,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
    {
      id: 5,
      name: "Виртуальный ФР Водный",
      model: "QR Virtual Device",
      serialNumber: "",
      organization: "",
      terminal: "Водный стадион",
      status: "inactive",
      manufacturer: "QR Virtual Device",
      symbolsCount: 0,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
    {
      id: 6,
      name: "ФР 5",
      model: "Атол АТОЛ FPrint-22ТТК",
      serialNumber: "",
      organization: "ИП Голикова Мария Вячеславовна",
      terminal: "Партизанская",
      status: "active",
      manufacturer: "Атол",
      symbolsCount: 0,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
    {
      id: 7,
      name: "ФР 6",
      model: "Атол АТОЛ FPrint-22ТТК",
      serialNumber: "",
      organization: "ИП Голикова Мария Вячеславовна",
      terminal: "Лермонтова",
      status: "active",
      manufacturer: "Атол",
      symbolsCount: 0,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
    {
      id: 8,
      name: "ФР 7",
      model: "Атол АТОЛ FPrint-22ТТК",
      serialNumber: "",
      organization: "ИП Голикова Мария Вячеславовна",
      terminal: "Волжская",
      status: "active",
      manufacturer: "Атол",
      symbolsCount: 0,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
    {
      id: 9,
      name: "Водный стадион",
      model: "Атол АТОЛ FPrint-22ТТК",
      serialNumber: "",
      organization: "ИП Голикова Мария Вячеславовна",
      terminal: "Водный стадион",
      status: "active",
      manufacturer: "Атол",
      symbolsCount: 0,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
    {
      id: 10,
      name: "Виртуальный ФР Волжская",
      model: "QR Virtual Device",
      serialNumber: "",
      organization: "ИП Голикова Мария Вячеславовна",
      terminal: "Волжская",
      status: "active",
      manufacturer: "QR Virtual Device",
      symbolsCount: 0,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
    {
      id: 11,
      name: "Виртуальный ФР Лосиноостровская",
      model: "QR Virtual Device",
      serialNumber: "",
      organization: "ИП Голикова Мария Вячеславовна",
      terminal: "Лосиноостровская",
      status: "active",
      manufacturer: "QR Virtual Device",
      symbolsCount: 0,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
  ])

  // Фильтрация устройств по поисковому запросу
  const filteredDevices = fiscalRegistrators.filter((device) =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.terminal.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeviceSelect = (device: FiscalRegistrator) => {
    setSelectedDevice(device)
  }

  const getStatusText = (status: string) => {
    return status === "active" ? "Активирован" : "Неактивен"
  }

  const getStatusClass = (status: string) => {
    return status === "active" ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Фискальные регистраторы</h1>
        <button className="bg-[#2055a4] text-white px-4 py-2 rounded-lg hover:bg-[#1a4a8f] transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Создать виртуальный ФР
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Search */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Поиск устройств..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
            />
          </div>

          {/* Devices Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Наименование
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Модель
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Серийный номер
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Организация
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Терминал
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Состояние
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDevices.map((device) => (
                    <tr
                      key={device.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedDevice?.id === device.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleDeviceSelect(device)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{device.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{device.model}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{device.serialNumber || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{device.organization || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{device.terminal}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getStatusClass(device.status)}`}>
                          {getStatusText(device.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            className={`p-1 rounded ${
                              device.status === "active"
                                ? "text-red-600 hover:text-red-800"
                                : "text-green-600 hover:text-green-800"
                            }`}
                            title={device.status === "active" ? "Деактивировать" : "Активировать"}
                          >
                            {device.status === "active" ? (
                              <PowerOff className="w-4 h-4" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 p-1 rounded"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-800 p-1 rounded"
                            title="Дополнительные действия"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDevices.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Устройства не найдены
              </div>
            )}
          </div>
        </div>

        {/* Device Details Sidebar */}
        <div className="lg:col-span-1">
          {selectedDevice ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#2055a4] rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedDevice.status === "active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {getStatusText(selectedDevice.status)}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">ID</div>
                  <div className="font-medium">{selectedDevice.id}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Производитель</div>
                  <div className="font-medium">{selectedDevice.manufacturer}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Модель</div>
                  <div className="font-medium">{selectedDevice.model}</div>
                </div>

                {selectedDevice.serialNumber && (
                  <div>
                    <div className="text-sm text-gray-500">Серийный номер</div>
                    <div className="font-medium">{selectedDevice.serialNumber}</div>
                  </div>
                )}

                {selectedDevice.symbolsCount > 0 && (
                  <div>
                    <div className="text-sm text-gray-500">Символов в строке</div>
                    <div className="font-medium">{selectedDevice.symbolsCount}</div>
                  </div>
                )}

                <div>
                  <div className="text-sm text-gray-500">Терминал</div>
                  <div className="font-medium">{selectedDevice.terminal}</div>
                </div>

                {selectedDevice.organization && (
                  <div>
                    <div className="text-sm text-gray-500">Организация</div>
                    <div className="font-medium">{selectedDevice.organization}</div>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <button className="w-full bg-[#2055a4] text-white py-2 px-4 rounded-lg hover:bg-[#1a4a8f] transition-colors">
                  Редактировать
                </button>
                <button className={`w-full py-2 px-4 rounded-lg transition-colors ${
                  selectedDevice.status === "active"
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}>
                  {selectedDevice.status === "active" ? "Деактивировать" : "Активировать"}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>Выберите устройство для просмотра деталей</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
