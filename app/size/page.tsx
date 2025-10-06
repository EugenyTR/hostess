"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import AddSizeModal from "@/components/modals/AddSizeModal"
import DeleteSizeModal from "@/components/modals/DeleteSizeModal"

interface Size {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function SizePage() {
  const { sizes, addSize } = useAppContext()
  const { showNotification } = useNotification()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingSize, setEditingSize] = useState<Size | null>(null)
  const [sizeToDelete, setSizeToDelete] = useState<Size | null>(null)
  const [sizesList, setSizesList] = useState<Size[]>([
    { id: 1, name: "XS", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    { id: 2, name: "S", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    { id: 3, name: "M", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    { id: 4, name: "L", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    { id: 5, name: "XL", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  ])

  const handleAddSize = (sizeData: { name: string }) => {
    const newSize: Size = {
      id: Math.max(...sizesList.map((s) => s.id), 0) + 1,
      name: sizeData.name,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setSizesList((prev) => [...prev, newSize])
    addSize(sizeData.name)
    showNotification("Размер успешно добавлен", "success")
    setIsAddModalOpen(false)
  }

  const handleEditSize = (sizeData: { name: string }) => {
    if (editingSize) {
      const updatedSize: Size = {
        ...editingSize,
        name: sizeData.name,
        updatedAt: new Date().toISOString(),
      }

      setSizesList((prev) => prev.map((size) => (size.id === editingSize.id ? updatedSize : size)))
      showNotification("Размер успешно обновлен", "success")
      setEditingSize(null)
      setIsAddModalOpen(false)
    }
  }

  const handleDeleteSize = () => {
    if (sizeToDelete) {
      setSizesList((prev) => prev.filter((size) => size.id !== sizeToDelete.id))
      showNotification("Размер успешно удален", "success")
      setSizeToDelete(null)
      setIsDeleteModalOpen(false)
    }
  }

  const openEditModal = (size: Size) => {
    setEditingSize(size)
    setIsAddModalOpen(true)
  }

  const openDeleteModal = (size: Size) => {
    setSizeToDelete(size)
    setIsDeleteModalOpen(true)
  }

  const closeAddModal = () => {
    setEditingSize(null)
    setIsAddModalOpen(false)
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#2c2c33]">Размеры</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#2055a4] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1a4a94] transition-colors"
        >
          <Plus size={20} />
          Добавить размер
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#e3e3e3] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f7f7f7] border-b border-[#e3e3e3]">
            <tr>
              <th className="text-left py-3 px-4 text-[#7f8189] font-medium">ID</th>
              <th className="text-left py-3 px-4 text-[#7f8189] font-medium">Наименование</th>
              <th className="text-right py-3 px-4 text-[#7f8189] font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {sizesList.map((size) => (
              <tr key={size.id} className="border-b border-[#e3e3e3] hover:bg-[#f7f7f7] transition-colors">
                <td className="py-3 px-4 text-[#2c2c33]">{size.id}</td>
                <td className="py-3 px-4 text-[#2c2c33]">{size.name}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(size)}
                      className="text-[#7f8189] hover:text-[#2055a4] transition-colors"
                      title="Редактировать"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(size)}
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

      <AddSizeModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={editingSize ? handleEditSize : handleAddSize}
        size={editingSize}
      />

      <DeleteSizeModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSize}
        sizeName={sizeToDelete?.name || ""}
      />
    </div>
  )
}
