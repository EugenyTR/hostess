"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, FileText, Check, AlertCircle, Download } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import type { Point } from "@/types"

interface ImportPointsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ImportPointsModal({ isOpen, onClose }: ImportPointsModalProps) {
  const { addPoint, cities } = useAppContext()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    imported: number
    errors: string[]
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
      setResult(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const downloadTemplate = () => {
    const csvContent = `name,organizationType,phone,city,street,house,apartment
Химчистка на Ленина,own,+7 (495) 123-45-67,Москва,Ленина,15,
Химчистка на Невском,franchise,+7 (812) 765-43-21,Санкт-Петербург,Невский проспект,28,
`
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "points_template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const processFile = async () => {
    if (!file) return

    setIsProcessing(true)
    setResult(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const importedPoints: Point[] = []
      const errors: string[] = []

      // Имитация импорта данных
      for (let i = 0; i < 5; i++) {
        const cityId = Math.floor(Math.random() * 5) + 1
        const city = cities.find((c) => c.id === cityId)
        const organizationType = Math.random() > 0.5 ? "own" : "franchise"
        const street = ["Ленина", "Мира", "Гагарина", "Пушкина", "Советская"][Math.floor(Math.random() * 5)]
        const house = String(Math.floor(Math.random() * 100) + 1)

        if (i === 3) {
          errors.push(`Строка ${i + 1}: Неверный формат телефона`)
          continue
        }

        const point: Point = {
          id: Date.now() + i,
          name: `Химчистка на ${street}`,
          organizationType: organizationType as "own" | "franchise",
          phone: `+7 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${
            Math.floor(Math.random() * 90) + 10
          }-${Math.floor(Math.random() * 90) + 10}`,
          address: {
            cityId: cityId,
            city: city?.name || "Неизвестный город",
            street: street,
            house: house,
            apartment: "",
            fullAddress: `г. ${city?.name || "Неизвестный город"}, ул. ${street}, д. ${house}`,
          },
          coordinates: {
            lat: 55 + Math.random() * 5,
            lng: 37 + Math.random() * 5,
          },
          isActive: true,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        }

        importedPoints.push(point)
        addPoint(point)
      }

      setResult({
        success: true,
        message: "Импорт успешно завершен",
        imported: importedPoints.length,
        errors: errors,
      })
    } catch (error) {
      setResult({
        success: false,
        message: "Ошибка при импорте файла",
        imported: 0,
        errors: ["Неподдерживаемый формат файла или ошибка в структуре данных"],
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b border-[#e0e0e0]">
          <h2 className="text-xl font-semibold text-[#2c2c33]">Импорт точек</h2>
          <button onClick={onClose} className="text-[#8e8e8e] hover:text-[#2c2c33] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {!result ? (
            <>
              <div className="mb-6">
                <p className="text-[#2c2c33] mb-2">
                  Загрузите файл CSV или Excel с данными о точках. Файл должен содержать следующие столбцы:
                </p>
                <ul className="list-disc list-inside text-[#8e8e8e] mb-4 pl-4">
                  <li>name - название точки</li>
                  <li>organizationType - тип организации (own или franchise)</li>
                  <li>phone - номер телефона</li>
                  <li>city - город</li>
                  <li>street - улица</li>
                  <li>house - номер дома</li>
                  <li>apartment - номер помещения (необязательно)</li>
                </ul>

                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 text-[#2196f3] hover:text-[#1976d2] transition-colors"
                >
                  <Download size={18} />
                  <span>Скачать шаблон CSV</span>
                </button>
              </div>

              <div
                className="border-2 border-dashed border-[#e0e0e0] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#2196f3] transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv,.xls,.xlsx"
                  className="hidden"
                />
                <Upload size={48} className="text-[#8e8e8e] mb-4" />
                {file ? (
                  <div className="flex items-center gap-2 text-[#2c2c33]">
                    <FileText size={20} className="text-[#2196f3]" />
                    <span>{file.name}</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-[#2c2c33] font-medium mb-2">Перетащите файл сюда или нажмите для выбора</p>
                    <p className="text-[#8e8e8e] text-sm">Поддерживаемые форматы: CSV, XLS, XLSX</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-4">
              <div
                className={`flex items-center gap-3 p-4 rounded-lg mb-6 ${
                  result.success ? "bg-[#e8f5e9] text-[#2e7d32]" : "bg-[#ffebee] text-[#c62828]"
                }`}
              >
                {result.success ? <Check size={24} /> : <AlertCircle size={24} />}
                <span className="font-medium">{result.message}</span>
              </div>

              <div className="mb-6">
                <p className="text-[#2c2c33] mb-2">Результаты импорта:</p>
                <ul className="list-disc list-inside text-[#8e8e8e] pl-4">
                  <li>Успешно импортировано точек: {result.imported}</li>
                  <li>Ошибок при импорте: {result.errors.length}</li>
                </ul>
              </div>

              {result.errors.length > 0 && (
                <div className="mb-6">
                  <p className="text-[#2c2c33] mb-2">Ошибки при импорте:</p>
                  <div className="max-h-40 overflow-y-auto border border-[#e0e0e0] rounded-lg p-3">
                    <ul className="list-disc list-inside text-[#e74c3c] pl-4">
                      {result.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-[#e0e0e0] bg-[#fafafa]">
          {!result ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-[#e0e0e0] rounded-md text-[#8e8e8e] hover:bg-[#f5f5f5] transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={processFile}
                disabled={!file || isProcessing}
                className={`px-4 py-2 rounded-md text-white ${
                  !file || isProcessing
                    ? "bg-[#90caf9] cursor-not-allowed"
                    : "bg-[#2196f3] hover:bg-[#1976d2] transition-colors"
                }`}
              >
                {isProcessing ? "Обработка..." : "Импортировать"}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#2196f3] hover:bg-[#1976d2] text-white rounded-md transition-colors"
            >
              Закрыть
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
