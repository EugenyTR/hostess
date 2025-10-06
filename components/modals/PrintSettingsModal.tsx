"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface PrintSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onPrint: (settings: PrintSettings) => void
  defaultSettings?: PrintSettings
}

export interface PrintSettings {
  includeLogo: boolean
  includeOrderDetails: boolean
  includeClientInfo: boolean
  includeServices: boolean
  includeTechPassport: boolean
  includeStatusHistory: boolean
  includeComments: boolean
  paperSize: "a4" | "a5" | "letter"
  orientation: "portrait" | "landscape"
  showPrices: boolean
  showDiscount: boolean
  showHeader: boolean
  showFooter: boolean
  footerText: string
}

const defaultPrintSettings: PrintSettings = {
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
}

export function PrintSettingsModal({
  isOpen,
  onClose,
  onPrint,
  defaultSettings = defaultPrintSettings,
}: PrintSettingsModalProps) {
  const [settings, setSettings] = useState<PrintSettings>(defaultSettings)

  if (!isOpen) return null

  const handleChange = (field: keyof PrintSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPrint(settings)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-medium">Настройки печати</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Содержимое</h3>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeLogo"
                  checked={settings.includeLogo}
                  onChange={(e) => handleChange("includeLogo", e.target.checked)}
                  className="w-4 h-4 text-[#2055a4] rounded border-gray-300 focus:ring-[#2055a4]"
                />
                <label htmlFor="includeLogo" className="ml-2 text-sm">
                  Включить логотип
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeOrderDetails"
                  checked={settings.includeOrderDetails}
                  onChange={(e) => handleChange("includeOrderDetails", e.target.checked)}
                  className="w-4 h-4 text-[#2055a4] rounded border-gray-300 focus:ring-[#2055a4]"
                />
                <label htmlFor="includeOrderDetails" className="ml-2 text-sm">
                  Информация о заказе
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeClientInfo"
                  checked={settings.includeClientInfo}
                  onChange={(e) => handleChange("includeClientInfo", e.target.checked)}
                  className="w-4 h-4 text-[#2055a4] rounded border-gray-300 focus:ring-[#2055a4]"
                />
                <label htmlFor="includeClientInfo" className="ml-2 text-sm">
                  Информация о клиенте
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeServices"
                  checked={settings.includeServices}
                  onChange={(e) => handleChange("includeServices", e.target.checked)}
                  className="w-4 h-4 text-[#2055a4] rounded border-gray-300 focus:ring-[#2055a4]"
                />
                <label htmlFor="includeServices" className="ml-2 text-sm">
                  Список услуг
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeTechPassport"
                  checked={settings.includeTechPassport}
                  onChange={(e) => handleChange("includeTechPassport", e.target.checked)}
                  className="w-4 h-4 text-[#2055a4] rounded border-gray-300 focus:ring-[#2055a4]"
                />
                <label htmlFor="includeTechPassport" className="ml-2 text-sm">
                  Технические паспорта
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeStatusHistory"
                  checked={settings.includeStatusHistory}
                  onChange={(e) => handleChange("includeStatusHistory", e.target.checked)}
                  className="w-4 h-4 text-[#2055a4] rounded border-gray-300 focus:ring-[#2055a4]"
                />
                <label htmlFor="includeStatusHistory" className="ml-2 text-sm">
                  История изменений статуса
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeComments"
                  checked={settings.includeComments}
                  onChange={(e) => handleChange("includeComments", e.target.checked)}
                  className="w-4 h-4 text-[#2055a4] rounded border-gray-300 focus:ring-[#2055a4]"
                />
                <label htmlFor="includeComments" className="ml-2 text-sm">
                  Комментарии
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-lg">Параметры страницы</h3>

              <div>
                <label htmlFor="paperSize" className="block text-sm mb-1">
                  Размер бумаги
                </label>
                <select
                  id="paperSize"
                  value={settings.paperSize}
                  onChange={(e) => handleChange("paperSize", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="a4">A4</option>
                  <option value="a5">A5</option>
                  <option value="letter">Letter</option>
                </select>
              </div>

              <div>
                <label htmlFor="orientation" className="block text-sm mb-1">
                  Ориентация
                </label>
                <select
                  id="orientation"
                  value={settings.orientation}
                  onChange={(e) => handleChange("orientation", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="portrait">Портретная</option>
                  <option value="landscape">Альбомная</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showPrices"
                  checked={settings.showPrices}
                  onChange={(e) => handleChange("showPrices", e.target.checked)}
                  className="w-4 h-4 text-[#2055a4] rounded border-gray-300 focus:ring-[#2055a4]"
                />
                <label htmlFor="showPrices" className="ml-2 text-sm">
                  Показывать цены
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showDiscount"
                  checked={settings.showDiscount}
                  onChange={(e) => handleChange("showDiscount", e.target.checked)}
                  className="w-4 h-4 text-[#2055a4] rounded border-gray-300 focus:ring-[#2055a4]"
                />
                <label htmlFor="showDiscount" className="ml-2 text-sm">
                  Показывать скидку
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showHeader"
                  checked={settings.showHeader}
                  onChange={(e) => handleChange("showHeader", e.target.checked)}
                  className="w-4 h-4 text-[#2055a4] rounded border-gray-300 focus:ring-[#2055a4]"
                />
                <label htmlFor="showHeader" className="ml-2 text-sm">
                  Показывать заголовок
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showFooter"
                  checked={settings.showFooter}
                  onChange={(e) => handleChange("showFooter", e.target.checked)}
                  className="w-4 h-4 text-[#2055a4] rounded border-gray-300 focus:ring-[#2055a4]"
                />
                <label htmlFor="showFooter" className="ml-2 text-sm">
                  Показывать нижний колонтитул
                </label>
              </div>

              {settings.showFooter && (
                <div>
                  <label htmlFor="footerText" className="block text-sm mb-1">
                    Текст нижнего колонтитула
                  </label>
                  <input
                    type="text"
                    id="footerText"
                    value={settings.footerText}
                    onChange={(e) => handleChange("footerText", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            >
              Отмена
            </button>
            <button type="submit" className="px-4 py-2 bg-[#2055a4] text-white rounded-md text-sm hover:bg-[#1a4a8f]">
              Печать
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
