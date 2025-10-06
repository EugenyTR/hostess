"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, Upload } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import AddBrandModal from "@/components/modals/AddBrandModal"
import DeleteBrandModal from "@/components/modals/DeleteBrandModal"

interface Brand {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function BrandPage() {
  const { brands, addBrand } = useAppContext()
  const { showNotification } = useNotification()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null)
  const [brandsList, setBrandsList] = useState<Brand[]>([
    { id: 1, name: "Guchi", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    { id: 2, name: "Prada", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
    { id: 3, name: "Gloria Jeans", isActive: true, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  ])

  const [isImporting, setIsImporting] = useState(false)

  const handleAddBrand = (brandData: { name: string }) => {
    const newBrand: Brand = {
      id: Math.max(...brandsList.map((b) => b.id), 0) + 1,
      name: brandData.name,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setBrandsList((prev) => [...prev, newBrand])
    addBrand(brandData.name) // Используем существующую функцию из контекста
    showNotification("Бренд успешно добавлен", "success")
    setIsAddModalOpen(false)
  }

  const handleEditBrand = (brandData: { name: string }) => {
    if (editingBrand) {
      const updatedBrand: Brand = {
        ...editingBrand,
        name: brandData.name,
        updatedAt: new Date().toISOString(),
      }

      setBrandsList((prev) => prev.map((brand) => (brand.id === editingBrand.id ? updatedBrand : brand)))
      showNotification("Бренд успешно обновлен", "success")
      setEditingBrand(null)
      setIsAddModalOpen(false)
    }
  }

  const handleDeleteBrand = () => {
    if (brandToDelete) {
      setBrandsList((prev) => prev.filter((brand) => brand.id !== brandToDelete.id))
      showNotification("Бренд успешно удален", "success")
      setBrandToDelete(null)
      setIsDeleteModalOpen(false)
    }
  }

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand)
    setIsAddModalOpen(true)
  }

  const openDeleteModal = (brand: Brand) => {
    setBrandToDelete(brand)
    setIsDeleteModalOpen(true)
  }

  const closeAddModal = () => {
    setEditingBrand(null)
    setIsAddModalOpen(false)
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)

    try {
      const text = await file.text()
      const lines = text.split("\n")
      const newBrands: Brand[] = []

      // Пропускаем заголовок, начинаем с 1
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line) {
          const columns = line.split(",")
          if (columns[0]) {
            const newBrand: Brand = {
              id: Math.max(...brandsList.map((b) => b.id), 0) + newBrands.length + 1,
              name: columns[0].trim(),
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            newBrands.push(newBrand)
          }
        }
      }

      setBrandsList((prev) => [...prev, ...newBrands])
      showNotification(`Импортировано ${newBrands.length} брендов`, "success")
    } catch (error) {
      showNotification("Ошибка при импорте файла", "error")
    } finally {
      setIsImporting(false)
      // Сбрасываем значение input
      event.target.value = ""
    }
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#2c2c33]">Бренды</h1>
        <div className="flex gap-3">
          <label className="bg-[#f7f7f7] text-[#2c2c33] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#e3e3e3] transition-colors cursor-pointer">
            <Upload size={20} />
            {isImporting ? "Импорт..." : "Импорт"}
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImport}
              className="hidden"
              disabled={isImporting}
            />
          </label>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#2055a4] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1a4a94] transition-colors"
          >
            <Plus size={20} />
            Добавить бренд
          </button>
        </div>
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
            {brandsList.map((brand) => (
              <tr key={brand.id} className="border-b border-[#e3e3e3] hover:bg-[#f7f7f7] transition-colors">
                <td className="py-3 px-4 text-[#2c2c33]">{brand.id}</td>
                <td className="py-3 px-4 text-[#2c2c33]">{brand.name}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(brand)}
                      className="text-[#7f8189] hover:text-[#2055a4] transition-colors"
                      title="Редактировать"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(brand)}
                      className="text-[#7f8189] hover:text-[#e74c3c] transition-colors"
                      title="Удалить"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {brandsList.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-[#7f8189]">
                  Нет данных для отображения
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Модальные окна */}
      <AddBrandModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={editingBrand ? handleEditBrand : handleAddBrand}
        brand={editingBrand}
      />

      <DeleteBrandModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBrand}
        brandName={brandToDelete?.name || ""}
      />
    </div>
  )
}
