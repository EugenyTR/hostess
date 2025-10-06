"use client"

import { useState } from "react"
import Link from "next/link"
import { useAppContext } from "@/context/AppContext"

// Simple SVG icons
const Plus = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const Edit = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const Trash2 = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
)

export default function WarehousesPage() {
  const { warehouses, deleteWarehouse } = useAppContext()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [warehouseToDelete, setWarehouseToDelete] = useState<number | null>(null)

  const handleDeleteClick = (id: number) => {
    setWarehouseToDelete(id)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (warehouseToDelete) {
      deleteWarehouse(warehouseToDelete)
      setDeleteModalOpen(false)
      setWarehouseToDelete(null)
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cash":
        return "Наличные"
      case "cashless":
        return "Безналичные"
      case "mixed":
        return "Смешанные"
      default:
        return method
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Склады</h1>
        <Link
          href="/warehouses/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Создать
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Наименование
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Адрес склада
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Город</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Контрагент
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Способ оплаты
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {warehouses.map((warehouse) => (
              <tr key={warehouse.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warehouse.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{warehouse.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warehouse.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warehouse.city}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warehouse.contractorName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getPaymentMethodText(warehouse.paymentMethod)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/warehouses/${warehouse.id}`}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Редактировать"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(warehouse.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
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

        {warehouses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Склады не найдены</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Подтверждение удаления</h3>
            <p className="text-gray-600 mb-6">
              Вы уверены, что хотите удалить этот склад? Это действие нельзя отменить.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Отменить
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
