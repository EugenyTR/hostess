"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import type { ReceiptTemplate } from "@/app/receipts/[id]/page"

interface TemplateSelectorProps {
  selectedTemplate: ReceiptTemplate
  onSelectTemplate: (template: ReceiptTemplate) => void
  onClose: () => void
}

interface TemplateOption {
  id: ReceiptTemplate
  name: string
  description: string
  preview: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}

const templates: TemplateOption[] = [
  {
    id: "classic",
    name: "Классический",
    description: "Традиционный стиль оформления с четкими линиями и стандартной типографикой",
    preview: "Простой черно-белый дизайн с таблицами и разделителями",
    colors: {
      primary: "#000000",
      secondary: "#666666",
      accent: "#333333",
    },
  },
  {
    id: "modern",
    name: "Современный",
    description: "Минималистичный дизайн с акцентными цветами и современной типографикой",
    preview: "Чистый дизайн с синими акцентами и улучшенной читаемостью",
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#1e40af",
    },
  },
  {
    id: "minimal",
    name: "Минимальный",
    description: "Простой и чистый стиль с минимумом декоративных элементов",
    preview: "Максимально упрощенный дизайн с фокусом на содержании",
    colors: {
      primary: "#374151",
      secondary: "#9ca3af",
      accent: "#6b7280",
    },
  },
  {
    id: "corporate",
    name: "Корпоративный",
    description: "Официальный деловой стиль с логотипом и фирменными цветами",
    preview: "Профессиональный дизайн с заголовком компании и структурированной подачей",
    colors: {
      primary: "#1f2937",
      secondary: "#4b5563",
      accent: "#059669",
    },
  },
  {
    id: "colorful",
    name: "Яркий",
    description: "Красочный дизайн с градиентами и яркими акцентами",
    preview: "Привлекательный дизайн с цветными элементами и градиентными заголовками",
    colors: {
      primary: "#7c3aed",
      secondary: "#a855f7",
      accent: "#ec4899",
    },
  },
]

export function TemplateSelector({ selectedTemplate, onSelectTemplate, onClose }: TemplateSelectorProps) {
  const [previewTemplate, setPreviewTemplate] = useState<ReceiptTemplate>(selectedTemplate)

  const handleSelect = () => {
    onSelectTemplate(previewTemplate)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Выбор шаблона чека</h2>
            <p className="text-sm text-gray-600 mt-1">Выберите стиль оформления для PDF чека</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Содержимое */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  previewTemplate === template.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPreviewTemplate(template.id)}
              >
                {/* Индикатор выбора */}
                {previewTemplate === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Превью цветов */}
                <div className="flex gap-2 mb-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.colors.primary }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.colors.secondary }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.colors.accent }} />
                </div>

                {/* Название и описание */}
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                {/* Превью */}
                <div className="bg-gray-50 rounded p-3 text-xs">
                  <div className="font-medium mb-1">Превью:</div>
                  <div className="text-gray-600">{template.preview}</div>
                </div>

                {/* Мини-превью чека */}
                <div className="mt-3 bg-white border rounded p-2 text-xs">
                  <div className="font-bold text-center mb-1" style={{ color: template.colors.primary }}>
                    ЧЕК №000001
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span style={{ color: template.colors.secondary }}>Товар 1</span>
                      <span style={{ color: template.colors.primary }}>1000 ₽</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: template.colors.secondary }}>Товар 2</span>
                      <span style={{ color: template.colors.primary }}>500 ₽</span>
                    </div>
                    <hr style={{ borderColor: template.colors.secondary }} />
                    <div className="flex justify-between font-bold">
                      <span style={{ color: template.colors.accent }}>Итого:</span>
                      <span style={{ color: template.colors.accent }}>1500 ₽</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSelect}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Применить шаблон
          </button>
        </div>
      </div>
    </div>
  )
}
