"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, Plus, Trash2, Save, RotateCcw } from "lucide-react"
import type { ReceiptTemplate } from "@/app/receipts/[id]/page"

interface ReceiptField {
  id: string
  name: string
  label: string
  type: "text" | "number" | "date" | "email" | "phone" | "currency"
  required: boolean
  visible: boolean
  position: number
  width?: "full" | "half" | "third"
  format?: string
}

interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  website?: string
  inn?: string
  logo?: string
}

interface ReceiptTemplateEditorProps {
  template: ReceiptTemplate
  onClose: () => void
}

const defaultFields: ReceiptField[] = [
  {
    id: "receiptNumber",
    name: "receiptNumber",
    label: "Номер чека",
    type: "text",
    required: true,
    visible: true,
    position: 1,
    width: "half",
  },
  { id: "date", name: "date", label: "Дата", type: "date", required: true, visible: true, position: 2, width: "half" },
  { id: "time", name: "time", label: "Время", type: "text", required: true, visible: true, position: 3, width: "half" },
  {
    id: "cashier",
    name: "cashier",
    label: "Кассир",
    type: "text",
    required: true,
    visible: true,
    position: 4,
    width: "half",
  },
  {
    id: "clientName",
    name: "clientName",
    label: "Имя клиента",
    type: "text",
    required: true,
    visible: true,
    position: 5,
    width: "full",
  },
  {
    id: "clientPhone",
    name: "clientPhone",
    label: "Телефон клиента",
    type: "phone",
    required: true,
    visible: true,
    position: 6,
    width: "half",
  },
  {
    id: "clientEmail",
    name: "clientEmail",
    label: "Email клиента",
    type: "email",
    required: false,
    visible: true,
    position: 7,
    width: "half",
  },
  {
    id: "paymentMethod",
    name: "paymentMethod",
    label: "Способ оплаты",
    type: "text",
    required: true,
    visible: true,
    position: 8,
    width: "half",
  },
  {
    id: "status",
    name: "status",
    label: "Статус",
    type: "text",
    required: true,
    visible: true,
    position: 9,
    width: "half",
  },
  {
    id: "subtotal",
    name: "subtotal",
    label: "Подытог",
    type: "currency",
    required: true,
    visible: true,
    position: 10,
    width: "third",
  },
  {
    id: "tax",
    name: "tax",
    label: "Налог",
    type: "currency",
    required: true,
    visible: true,
    position: 11,
    width: "third",
  },
  {
    id: "discount",
    name: "discount",
    label: "Скидка",
    type: "currency",
    required: false,
    visible: true,
    position: 12,
    width: "third",
  },
  {
    id: "total",
    name: "total",
    label: "Итого",
    type: "currency",
    required: true,
    visible: true,
    position: 13,
    width: "full",
  },
  {
    id: "notes",
    name: "notes",
    label: "Примечания",
    type: "text",
    required: false,
    visible: true,
    position: 14,
    width: "full",
  },
]

const defaultCompanyInfo: CompanyInfo = {
  name: "Химчистка 'Хозяюшка'",
  address: "г. Москва, ул. Примерная, д. 123",
  phone: "+7 (999) 123-45-67",
  email: "info@hozyaushka.ru",
  website: "www.hozyaushka.ru",
  inn: "1234567890",
}

export function ReceiptTemplateEditor({ template, onClose }: ReceiptTemplateEditorProps) {
  const [fields, setFields] = useState<ReceiptField[]>(defaultFields)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(defaultCompanyInfo)
  const [activeTab, setActiveTab] = useState<"fields" | "company" | "preview">("fields")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFieldUpdate = (fieldId: string, updates: Partial<ReceiptField>) => {
    setFields(fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)))
  }

  const handleAddField = () => {
    const newField: ReceiptField = {
      id: `custom_${Date.now()}`,
      name: `customField${fields.length + 1}`,
      label: "Новое поле",
      type: "text",
      required: false,
      visible: true,
      position: fields.length + 1,
      width: "full",
    }
    setFields([...fields, newField])
  }

  const handleDeleteField = (fieldId: string) => {
    setFields(fields.filter((field) => field.id !== fieldId))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // Сохранение настроек шаблона
    const templateConfig = {
      template,
      fields: fields.sort((a, b) => a.position - b.position),
      companyInfo,
      logo: logoPreview,
    }

    localStorage.setItem(`receiptTemplate_${template}`, JSON.stringify(templateConfig))
    alert("Шаблон сохранен!")
    onClose()
  }

  const handleReset = () => {
    setFields(defaultFields)
    setCompanyInfo(defaultCompanyInfo)
    setLogoFile(null)
    setLogoPreview("")
  }

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case "currency":
        return "₽"
      case "date":
        return "📅"
      case "email":
        return "📧"
      case "phone":
        return "📞"
      default:
        return "📝"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Редактор шаблона чека</h2>
            <p className="text-sm text-gray-600 mt-1">
              Настройте поля, информацию о компании и логотип для шаблона "{template}"
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Вкладки */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("fields")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "fields"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Поля чека
          </button>
          <button
            onClick={() => setActiveTab("company")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "company"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Информация о компании
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "preview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Предварительный просмотр
          </button>
        </div>

        {/* Содержимое */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Вкладка полей */}
          {activeTab === "fields" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Поля чека</h3>
                <button
                  onClick={handleAddField}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Добавить поле
                </button>
              </div>

              <div className="grid gap-4">
                {fields.map((field) => (
                  <div key={field.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название поля</label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => handleFieldUpdate(field.id, { label: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Тип поля</label>
                        <select
                          value={field.type}
                          onChange={(e) => handleFieldUpdate(field.id, { type: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="text">Текст</option>
                          <option value="number">Число</option>
                          <option value="date">Дата</option>
                          <option value="email">Email</option>
                          <option value="phone">Телефон</option>
                          <option value="currency">Валюта</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ширина</label>
                        <select
                          value={field.width}
                          onChange={(e) => handleFieldUpdate(field.id, { width: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="full">Полная</option>
                          <option value="half">Половина</option>
                          <option value="third">Треть</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={field.visible}
                              onChange={(e) => handleFieldUpdate(field.id, { visible: e.target.checked })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Видимое</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => handleFieldUpdate(field.id, { required: e.target.checked })}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Обязательное</span>
                          </label>
                        </div>
                        <button
                          onClick={() => handleDeleteField(field.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <span>{getFieldTypeIcon(field.type)}</span>
                      <span>Позиция: {field.position}</span>
                      <span>•</span>
                      <span>ID: {field.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Вкладка информации о компании */}
          {activeTab === "company" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Информация о компании</h3>

              {/* Логотип */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-md font-medium text-gray-900 mb-4">Логотип компании</h4>
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Загрузить логотип
                    </button>
                    <p className="text-sm text-gray-600 mt-2">
                      Рекомендуемый размер: 200x100px, форматы: PNG, JPG, SVG
                    </p>
                  </div>
                  {logoPreview && (
                    <div className="w-32 h-16 border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Логотип"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Основная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Название компании</label>
                  <input
                    type="text"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ИНН</label>
                  <input
                    type="text"
                    value={companyInfo.inn}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, inn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Адрес</label>
                  <input
                    type="text"
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                  <input
                    type="text"
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Веб-сайт</label>
                  <input
                    type="text"
                    value={companyInfo.website}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Вкладка предварительного просмотра */}
          {activeTab === "preview" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Предварительный просмотр</h3>

              <div className="bg-white border border-gray-300 rounded-lg p-6 max-w-md mx-auto shadow-sm">
                {/* Логотип и заголовок */}
                {logoPreview && (
                  <div className="text-center mb-4">
                    <img src={logoPreview || "/placeholder.svg"} alt="Логотип" className="h-12 mx-auto mb-2" />
                  </div>
                )}

                <div className="text-center mb-6">
                  <h4 className="text-lg font-bold text-gray-900">{companyInfo.name}</h4>
                  <p className="text-sm text-gray-600">{companyInfo.address}</p>
                  <p className="text-sm text-gray-600">
                    {companyInfo.phone} | {companyInfo.email}
                  </p>
                  {companyInfo.website && <p className="text-sm text-gray-600">{companyInfo.website}</p>}
                  {companyInfo.inn && <p className="text-sm text-gray-600">ИНН: {companyInfo.inn}</p>}
                </div>

                <div className="text-center mb-4">
                  <h5 className="text-xl font-bold">ЧЕК</h5>
                  <p className="text-sm text-gray-600">№ 000001</p>
                </div>

                {/* Поля чека */}
                <div className="space-y-2 text-sm">
                  {fields
                    .filter((field) => field.visible)
                    .sort((a, b) => a.position - b.position)
                    .map((field) => (
                      <div key={field.id} className="flex justify-between">
                        <span className="text-gray-600">{field.label}:</span>
                        <span className="font-medium">{field.type === "currency" ? "1000 ₽" : "Пример"}</span>
                      </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between font-bold">
                    <span>ИТОГО:</span>
                    <span>2540 ₽</span>
                  </div>
                </div>

                <div className="text-center mt-4 text-xs text-gray-500">Спасибо за покупку!</div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Сбросить
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Сохранить шаблон
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
