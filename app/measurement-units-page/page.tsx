"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { MeasurementUnit } from "@/types"

// Модальное окно для создания/редактирования единицы измерения
function MeasurementUnitModal({
  isOpen,
  onClose,
  unit,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  unit?: MeasurementUnit
  onSave: (unit: Omit<MeasurementUnit, "id" | "createdAt" | "updatedAt">) => void
}) {
  const [name, setName] = useState("")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (unit) {
      setName(unit.name)
      setIsActive(unit.isActive)
    } else {
      setName("")
      setIsActive(true)
    }
  }, [unit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSave({
        name: name.trim(),
        isActive,
      })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-[#2c2c33]">
          {unit ? "Редактировать единицу измерения" : "Создать единицу измерения"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#2c2c33] mb-2">Наименование</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-[#e3e3e3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              placeholder="Введите наименование"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="mr-2 h-4 w-4 text-[#2055a4] focus:ring-[#2055a4] border-[#e3e3e3] rounded"
              />
              <span className="text-sm text-[#2c2c33]">Активна</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#2c2c33] bg-[#f7f7f7] rounded-md hover:bg-[#e3e3e3] transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2055a4] text-white rounded-md hover:bg-[#1a4a94] transition-colors"
            >
              {unit ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MeasurementUnitsPage() {
  const [units, setUnits] = useState<MeasurementUnit[]>([
    {
      id: 1,
      name: "Штуки",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      name: "Литры",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: 3,
      name: "Килограммы",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<MeasurementUnit | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Пагинация
  const totalPages = Math.ceil(units.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUnits = units.slice(startIndex, endIndex)

  const handleCreateUnit = () => {
    setEditingUnit(undefined)
    setIsModalOpen(true)
  }

  const handleEditUnit = (unit: MeasurementUnit) => {
    setEditingUnit(unit)
    setIsModalOpen(true)
  }

  const handleDeleteUnit = (id: number) => {
    if (confirm("Вы уверены, что хотите удалить эту единицу измерения?")) {
      setUnits(units.filter((unit) => unit.id !== id))
    }
  }

  const handleSaveUnit = (unitData: Omit<MeasurementUnit, "id" | "createdAt" | "updatedAt">) => {
    if (editingUnit) {
      // Редактирование
      setUnits(
        units.map((unit) =>
          unit.id === editingUnit.id ? { ...unit, ...unitData, updatedAt: new Date().toISOString() } : unit,
        ),
      )
    } else {
      // Создание
      const newUnit: MeasurementUnit = {
        id: Math.max(...units.map((u) => u.id), 0) + 1,
        ...unitData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setUnits([...units, newUnit])
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#2c2c33]">Единицы измерения</h1>
        <button
          onClick={handleCreateUnit}
          className="flex items-center px-4 py-2 bg-[#2055a4] text-white rounded-md hover:bg-[#1a4a94] transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Создать единицу
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e3e3e3]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f7f7f7] border-b border-[#e3e3e3]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#979797] uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#979797] uppercase tracking-wider">
                  Наименование
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#979797] uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e3e3e3]">
              {currentUnits.map((unit) => (
                <tr key={unit.id} className="hover:bg-[#f7f7f7] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2c2c33]">{unit.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2c2c33]">{unit.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditUnit(unit)}
                        className="text-[#2055a4] hover:text-[#1a4a94] transition-colors"
                        title="Редактировать"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(unit.id)}
                        className="text-[#dc3545] hover:text-[#c82333] transition-colors"
                        title="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-[#e3e3e3] flex items-center justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-[#e3e3e3] rounded-md hover:bg-[#f7f7f7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    currentPage === page
                      ? "bg-[#2055a4] text-white border-[#2055a4]"
                      : "border-[#e3e3e3] hover:bg-[#f7f7f7]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-[#e3e3e3] rounded-md hover:bg-[#f7f7f7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      <MeasurementUnitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        unit={editingUnit}
        onSave={handleSaveUnit}
      />
    </div>
  )
}
