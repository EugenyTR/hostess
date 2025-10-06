"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"

interface ImportServicesModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (services: any[]) => void
}

interface ImportResult {
  success: boolean
  imported: number
  errors: string[]
  duplicates: number
}

export default function ImportServicesModal({ isOpen, onClose, onImport }: ImportServicesModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile)
      } else {
        alert("Пожалуйста, выберите файл в формате Excel (.xlsx, .xls) или CSV (.csv)")
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile)
      } else {
        alert("Пожалуйста, выберите файл в формате Excel (.xlsx, .xls) или CSV (.csv)")
      }
    }
  }

  const isValidFileType = (file: File) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ]
    return validTypes.includes(file.type) || file.name.endsWith(".csv")
  }

  const parseCSV = (text: string): any[] => {
    const lines = text.split("\n").filter((line) => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    const services = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
      if (values.length >= 3) {
        // Минимум нужно название, категория и цена
        const service = {
          name: values[0] || `Услуга ${i}`,
          category: values[1] || "Общие",
          price: Number.parseFloat(values[2]) || 0,
          description: values[3] || "",
          basePrice: Number.parseFloat(values[4]) || Number.parseFloat(values[2]) || 0,
          markup: Number.parseFloat(values[5]) || 0,
        }
        services.push(service)
      }
    }

    return services
  }

  const processFile = async () => {
    if (!file) return

    setIsProcessing(true)
    setImportResult(null)

    try {
      let services: any[] = []

      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        // Обработка CSV файла
        const text = await file.text()
        services = parseCSV(text)
      } else {
        // Для Excel файлов создаем моковые данные (в реальном приложении здесь была бы библиотека для парсинга Excel)
        // Имитируем обработку Excel файла
        await new Promise((resolve) => setTimeout(resolve, 1000))
        services = [
          {
            name: "Химчистка пальто (из Excel)",
            category: "Верхняя одежда",
            price: 2200,
            description: "Профессиональная химчистка пальто",
            basePrice: 2000,
            markup: 10,
          },
          {
            name: "Стирка постельного белья (из Excel)",
            category: "Домашний текстиль",
            price: 800,
            description: "Деликатная стирка постельного белья",
            basePrice: 700,
            markup: 14,
          },
        ]
      }

      // Валидация и обработка результатов
      const validServices = services.filter((service) => service.name && service.price > 0)
      const errors: string[] = []

      if (validServices.length === 0) {
        errors.push("Не найдено валидных услуг для импорта")
      }

      if (services.length !== validServices.length) {
        errors.push(`Пропущено ${services.length - validServices.length} записей с некорректными данными`)
      }

      const result: ImportResult = {
        success: validServices.length > 0,
        imported: validServices.length,
        errors,
        duplicates: 0,
      }

      setImportResult(result)

      if (result.success) {
        onImport(validServices)
      }
    } catch (error) {
      console.error("Ошибка при обработке файла:", error)
      setImportResult({
        success: false,
        imported: 0,
        errors: ["Ошибка при обработке файла. Проверьте формат данных."],
        duplicates: 0,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setImportResult(null)
    setIsProcessing(false)
    onClose()
  }

  const downloadTemplate = () => {
    const csvContent = [
      "Название услуги,Категория,Цена,Описание,Базовая цена,Наценка (%)",
      "Химчистка куртки,Верхняя одежда,1500,Химчистка куртки любой сложности,1300,15",
      "Глажка рубашки,Деловая одежда,300,Профессиональная глажка рубашки,250,20",
      "Химчистка платья,Вечерняя одежда,1800,Химчистка вечернего платья,1500,20",
    ].join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", "template_services.csv")
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#2c2c33]">Импорт услуг</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {!importResult ? (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Загрузите файл Excel (.xlsx, .xls) или CSV (.csv) со списком услуг
              </p>
              <button
                onClick={downloadTemplate}
                className="text-sm text-[#2055a4] hover:underline flex items-center gap-1"
              >
                <FileText size={16} />
                Скачать шаблон CSV
              </button>
            </div>

            {/* Область загрузки файла */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? "border-[#2055a4] bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {file ? (
                <div>
                  <p className="text-sm font-medium text-[#2c2c33]">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Перетащите файл сюда или нажмите для выбора</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-[#2055a4] hover:underline"
                  >
                    Выбрать файл
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Кнопки действий */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={processFile}
                disabled={!file || isProcessing}
                className="px-4 py-2 bg-[#2055a4] text-white rounded-lg hover:bg-[#1a4590] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Обработка...
                  </>
                ) : (
                  "Импортировать"
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Результат импорта */}
            <div className="text-center">
              {importResult.success ? (
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              ) : (
                <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              )}

              <h3 className="text-lg font-medium text-[#2c2c33] mb-2">
                {importResult.success ? "Импорт завершен" : "Ошибка импорта"}
              </h3>

              {importResult.success && (
                <p className="text-sm text-gray-600 mb-4">Успешно импортировано {importResult.imported} услуг</p>
              )}

              {importResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Предупреждения:</h4>
                  <ul className="text-xs text-red-700 space-y-1">
                    {importResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleClose} className="px-4 py-2 bg-[#2055a4] text-white rounded-lg hover:bg-[#1a4590]">
                Закрыть
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
