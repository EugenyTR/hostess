"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, AlertCircle, CheckCircle, Download } from "lucide-react"
import type { City } from "@/types"

interface ImportCitiesModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (cities: Omit<City, "id">[]) => void
}

interface ImportedCity {
  name: string
  region: string
  isActive: boolean
  error?: string
}

export function ImportCitiesModal({ isOpen, onClose, onImport }: ImportCitiesModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [importedData, setImportedData] = useState<ImportedCity[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<"upload" | "preview" | "complete">("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".txt")) {
      alert("Пожалуйста, выберите CSV файл")
      return
    }

    setIsProcessing(true)

    try {
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())

      // Пропускаем заголовок если он есть
      const dataLines =
        lines[0].toLowerCase().includes("название") || lines[0].toLowerCase().includes("name") ? lines.slice(1) : lines

      const parsed: ImportedCity[] = dataLines
        .map((line, index) => {
          const columns = line.split(",").map((col) => col.trim().replace(/"/g, ""))

          if (columns.length < 2) {
            return {
              name: columns[0] || `Строка ${index + 1}`,
              region: "",
              isActive: true,
              error: "Недостаточно данных в строке",
            }
          }

          const name = columns[0]
          const region = columns[1] || ""
          const status = columns[2]?.toLowerCase()
          const isActive =
            !status || status === "активный" || status === "active" || status === "true" || status === "1"

          if (!name || name.trim() === "") {
            return {
              name: `Строка ${index + 1}`,
              region,
              isActive,
              error: "Название города не может быть пустым",
            }
          }

          return {
            name: name.trim(),
            region: region.trim(),
            isActive,
          }
        })
        .filter((city) => city.name !== `Строка ${dataLines.length + 1}`) // Убираем пустые строки

      setImportedData(parsed)
      setStep("preview")
    } catch (error) {
      alert("Ошибка при чтении файла")
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImport = () => {
    const validCities = importedData.filter((city) => !city.error)
    onImport(validCities)
    setStep("complete")

    setTimeout(() => {
      handleClose()
    }, 2000)
  }

  const handleClose = () => {
    setStep("upload")
    setImportedData([])
    setIsProcessing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onClose()
  }

  const downloadTemplate = () => {
    const template =
      "Название,Регион,Статус\nМосква,Московская область,Активный\nСанкт-Петербург,Ленинградская область,Активный\nНовосибирск,Новосибирская область,Неактивный"
    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "cities_template.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const validCities = importedData.filter((city) => !city.error)
  const errorCities = importedData.filter((city) => city.error)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#e3e3e3]">
          <h2 className="text-xl font-semibold text-[#2c2c33]">Импорт городов</h2>
          <button onClick={handleClose} className="text-[#8e8e8e] hover:text-[#2c2c33] transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {step === "upload" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-[#2c2c33] mb-2">Загрузите файл с городами</h3>
                <p className="text-[#8e8e8e] mb-4">
                  Поддерживаются файлы в формате CSV. Файл должен содержать колонки: Название, Регион, Статус
                </p>
              </div>

              {/* Область загрузки файла */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-[#2055a4] bg-[#f0f7ff]"
                    : "border-[#e3e3e3] hover:border-[#2055a4] hover:bg-[#f8f9fa]"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-[#8e8e8e] mx-auto mb-4" />
                <p className="text-lg font-medium text-[#2c2c33] mb-2">Перетащите файл сюда или нажмите для выбора</p>
                <p className="text-[#8e8e8e] mb-4">CSV файлы до 10MB</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-[#2055a4] text-white rounded-lg hover:bg-[#1a4a94] transition-colors"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Обработка..." : "Выбрать файл"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* Шаблон файла */}
              <div className="bg-[#f8f9fa] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#2c2c33] mb-1">Нужен шаблон?</h4>
                    <p className="text-sm text-[#8e8e8e]">Скачайте пример файла с правильной структурой</p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center px-3 py-2 bg-white border border-[#e3e3e3] text-[#2c2c33] rounded-lg hover:bg-[#f8f9fa] transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Скачать шаблон
                  </button>
                </div>
              </div>

              {/* Инструкции */}
              <div className="bg-[#e8f0fe] rounded-lg p-4">
                <h4 className="font-medium text-[#2c2c33] mb-2">Формат файла:</h4>
                <ul className="text-sm text-[#8e8e8e] space-y-1">
                  <li>• Первая колонка: Название города (обязательно)</li>
                  <li>• Вторая колонка: Регион (необязательно)</li>
                  <li>• Третья колонка: Статус (Активный/Неактивный, по умолчанию Активный)</li>
                  <li>• Разделитель: запятая (,)</li>
                  <li>• Кодировка: UTF-8</li>
                </ul>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-[#2c2c33]">Предварительный просмотр</h3>
                  <p className="text-[#8e8e8e]">
                    Найдено {importedData.length} записей, из них {validCities.length} корректных
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep("upload")}
                    className="px-4 py-2 border border-[#e3e3e3] text-[#2c2c33] rounded-lg hover:bg-[#f8f9fa] transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={validCities.length === 0}
                    className="px-4 py-2 bg-[#2055a4] text-white rounded-lg hover:bg-[#1a4a94] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Импортировать {validCities.length} городов
                  </button>
                </div>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#e8f5e8] rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#22c55e] mr-2" />
                    <div>
                      <p className="font-medium text-[#166534]">Корректные записи</p>
                      <p className="text-sm text-[#166534]">{validCities.length} городов</p>
                    </div>
                  </div>
                </div>

                {errorCities.length > 0 && (
                  <div className="bg-[#fef2f2] rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-[#ef4444] mr-2" />
                      <div>
                        <p className="font-medium text-[#991b1b]">Ошибки</p>
                        <p className="text-sm text-[#991b1b]">{errorCities.length} записей с ошибками</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Таблица предварительного просмотра */}
              <div className="border border-[#e3e3e3] rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-[#f8f9fa] sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase">Статус</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase">Название</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase">Регион</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase">Активность</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase">Ошибка</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e3e3]">
                    {importedData.map((city, index) => (
                      <tr key={index} className={city.error ? "bg-[#fef2f2]" : "bg-white"}>
                        <td className="px-4 py-3">
                          {city.error ? (
                            <AlertCircle className="h-4 w-4 text-[#ef4444]" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-[#22c55e]" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-[#2c2c33]">{city.name}</td>
                        <td className="px-4 py-3 text-sm text-[#8e8e8e]">{city.region || "—"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              city.isActive ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fef2f2] text-[#991b1b]"
                            }`}
                          >
                            {city.isActive ? "Активный" : "Неактивный"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#ef4444]">{city.error || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-[#22c55e] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#2c2c33] mb-2">Импорт завершен!</h3>
              <p className="text-[#8e8e8e]">Успешно импортировано {validCities.length} городов</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
