"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import AddColorModal from "@/components/modals/AddColorModal"
import DeleteColorModal from "@/components/modals/DeleteColorModal"

interface Color {
  id: number
  name: string
  hexCode?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function ColorPage() {
  const { colors, addColor } = useAppContext()
  const { showNotification } = useNotification()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingColor, setEditingColor] = useState<Color | null>(null)
  const [colorToDelete, setColorToDelete] = useState<Color | null>(null)
  const [colorsList, setColorsList] = useState<Color[]>([
    { id: 1, name: "Черный", hexCode: "#000000", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    { id: 2, name: "Белый", hexCode: "#FFFFFF", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    { id: 3, name: "Красный", hexCode: "#FF0000", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  ])

  const handleAddColor = (colorData: { name: string; hexCode?: string }) => {
    const newColor: Color = {
      id: Math.max(...colorsList.map((c) => c.id), 0) + 1,
      name: colorData.name,
      hexCode: colorData.hexCode,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setColorsList((prev) => [...prev, newColor])
    addColor(colorData.name)
    showNotification("Цвет успешно добавлен", "success")
    setIsAddModalOpen(false)
  }

  const handleEditColor = (colorData: { name: string; hexCode?: string }) => {
    if (editingColor) {
      const updatedColor: Color = {
        ...editingColor,
        name: colorData.name,
        hexCode: colorData.hexCode,
        updatedAt: new Date().toISOString(),
      }

      setColorsList((prev) => prev.map((color) => (color.id === editingColor.id ? updatedColor : color)))
      showNotification("Цвет успешно обновлен", "success")
      setEditingColor(null)
      setIsAddModalOpen(false)
    }
  }

  const handleDeleteColor = () => {
    if (colorToDelete) {
      setColorsList((prev) => prev.filter((color) => color.id !== colorToDelete.id))
      showNotification("Цвет успешно удален", "success")
      setColorToDelete(null)
      setIsDeleteModalOpen(false)
    }
  }

  const openEditModal = (color: Color) => {
    setEditingColor(color)
    setIsAddModalOpen(true)
  }

  const openDeleteModal = (color: Color) => {
    setColorToDelete(color)
    setIsDeleteModalOpen(true)
  }

  const closeAddModal = () => {
    setEditingColor(null)
    setIsAddModalOpen(false)
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#2c2c33]">Цвета</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#2055a4] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1a4a94] transition-colors"
        >
          <Plus size={20} />
          Добавить цвет
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#e3e3e3] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f7f7f7] border-b border-[#e3e3e3]">
            <tr>
              <th className="text-left py-3 px-4 text-[#7f8189] font-medium">ID</th>
              <th className="text-left py-3 px-4 text-[#7f8189] font-medium">Цвет</th>
              <th className="text-left py-3 px-4 text-[#7f8189] font-medium">Наименование</th>
              <th className="text-right py-3 px-4 text-[#7f8189] font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {colorsList.map((color) => (
              <tr key={color.id} className="border-b border-[#e3e3e3] hover:bg-[#f7f7f7] transition-colors">
                <td className="py-3 px-4 text-[#2c2c33]">{color.id}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-[#e3e3e3]"
                      style={{ backgroundColor: color.hexCode || "#cccccc" }}
                    />
                    <span className="text-[#7f8189] text-sm">{color.hexCode}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-[#2c2c33]">{color.name}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(color)}
                      className="text-[#7f8189] hover:text-[#2055a4] transition-colors"
                      title="Редактировать"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(color)}
                      className="text-[#7f8189] hover:text-[#e74c3c] transition-colors"
                      title="Удалить"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddColorModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={editingColor ? handleEditColor : handleAddColor}
        color={editingColor}
      />

      <DeleteColorModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteColor}
        colorName={colorToDelete?.name || ""}
      />
    </div>
  )
}
