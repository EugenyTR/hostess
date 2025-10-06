"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Printer, Edit, Trash2, Palette, Settings } from "lucide-react"
import { generateReceiptPDF } from "@/utils/pdfGenerator"
import { TemplateSelector } from "@/components/TemplateSelector"
import { ReceiptTemplateEditor } from "@/components/ReceiptTemplateEditor"

interface ReceiptItem {
  id: string
  name: string
  quantity: number
  price: number
  total: number
  category: string
}

interface Receipt {
  id: string
  number: string
  date: string
  time: string
  cashier: string
  client: {
    name: string
    phone: string
    email?: string
  }
  items: ReceiptItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  status: "completed" | "refunded" | "cancelled"
  notes?: string
}

export type ReceiptTemplate = "classic" | "modern" | "minimal" | "corporate" | "colorful"

// Тестовые данные
const mockReceipt: Receipt = {
  id: "1",
  number: "000001",
  date: "2024-01-15",
  time: "14:30",
  cashier: "Иванов И.И.",
  client: {
    name: "Петров Петр Петрович",
    phone: "+7 (999) 123-45-67",
    email: "petrov@example.com",
  },
  items: [
    {
      id: "1",
      name: "Химчистка пальто",
      quantity: 1,
      price: 1500,
      total: 1500,
      category: "Химчистка",
    },
    {
      id: "2",
      name: "Стирка рубашки",
      quantity: 3,
      price: 200,
      total: 600,
      category: "Стирка",
    },
    {
      id: "3",
      name: "Глажка брюк",
      quantity: 2,
      price: 150,
      total: 300,
      category: "Глажка",
    },
  ],
  subtotal: 2400,
  tax: 240,
  discount: 100,
  total: 2540,
  paymentMethod: "Наличные",
  status: "completed",
  notes: "Клиент просил особое внимание к пятну на пальто",
}

export default function ReceiptDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ReceiptTemplate>("classic")
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setReceipt(mockReceipt)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const handleDownloadPDF = async () => {
    if (!receipt) return

    setIsDownloading(true)
    try {
      await generateReceiptPDF(receipt, selectedTemplate)
    } catch (error) {
      console.error("Ошибка при генерации PDF:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "refunded":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Завершен"
      case "refunded":
        return "Возврат"
      case "cancelled":
        return "Отменен"
      default:
        return "Неизвестно"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка чека...</p>
        </div>
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Чек не найден</p>
          <button onClick={() => router.back()} className="text-blue-600 hover:text-blue-800">
            Вернуться назад
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto p-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Назад
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Чек №{receipt.number}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(receipt.status)}`}>
              {getStatusText(receipt.status)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplateEditor(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Настроить шаблон
            </button>
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Palette className="w-4 h-4" />
              Шаблон
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Скачивание..." : "Скачать PDF"}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Печать
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Edit className="w-4 h-4" />
              Изменить
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <Trash2 className="w-4 h-4" />
              Удалить
            </button>
          </div>
        </div>

        {/* Выбранный шаблон */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Текущий шаблон</h3>
              <p className="text-sm text-gray-600">
                {selectedTemplate === "classic" && "Классический - традиционный стиль оформления"}
                {selectedTemplate === "modern" && "Современный - минималистичный дизайн с акцентами"}
                {selectedTemplate === "minimal" && "Минимальный - простой и чистый стиль"}
                {selectedTemplate === "corporate" && "Корпоративный - официальный деловой стиль"}
                {selectedTemplate === "colorful" && "Яркий - красочный дизайн с градиентами"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTemplateEditor(true)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Настроить
              </button>
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Изменить
              </button>
            </div>
          </div>
        </div>

        {/* Основная информация */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о чеке</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Номер:</span>
                  <span className="font-medium">№{receipt.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Дата:</span>
                  <span className="font-medium">{receipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Время:</span>
                  <span className="font-medium">{receipt.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Кассир:</span>
                  <span className="font-medium">{receipt.cashier}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Клиент</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Имя:</span>
                  <span className="font-medium">{receipt.client.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Телефон:</span>
                  <span className="font-medium">{receipt.client.phone}</span>
                </div>
                {receipt.client.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{receipt.client.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Оплата</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Способ оплаты:</span>
                  <span className="font-medium">{receipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Статус:</span>
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(receipt.status)}`}>
                    {getStatusText(receipt.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Товары/услуги */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Товары и услуги</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Наименование</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Категория</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Кол-во</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Цена</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4 text-gray-600">{item.category}</td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">{item.price.toLocaleString()} ₽</td>
                    <td className="py-3 px-4 text-right font-medium">{item.total.toLocaleString()} ₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Итоги */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Итоги</h3>
          <div className="space-y-2 max-w-md ml-auto">
            <div className="flex justify-between">
              <span className="text-gray-600">Подытог:</span>
              <span className="font-medium">{receipt.subtotal.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Налог:</span>
              <span className="font-medium">{receipt.tax.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Скидка:</span>
              <span className="font-medium text-red-600">-{receipt.discount.toLocaleString()} ₽</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Итого:</span>
                <span className="text-lg font-bold">{receipt.total.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>
        </div>

        {/* Примечания */}
        {receipt.notes && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Примечания</h3>
            <p className="text-gray-700">{receipt.notes}</p>
          </div>
        )}

        {/* Модальные окна */}
        {showTemplateSelector && (
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
            onClose={() => setShowTemplateSelector(false)}
          />
        )}

        {showTemplateEditor && (
          <ReceiptTemplateEditor template={selectedTemplate} onClose={() => setShowTemplateEditor(false)} />
        )}
      </div>
    </div>
  )
}
