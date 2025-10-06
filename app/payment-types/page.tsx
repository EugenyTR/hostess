"use client"

import { useState } from "react"
import { useAppContext } from "@/context/AppContext"
import AddPaymentTypeModal from "@/components/modals/AddPaymentTypeModal"
import DeletePaymentTypeModal from "@/components/modals/DeletePaymentTypeModal"

// Simple icon components
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
    <path d="M12 5v14" />
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

const Trash = ({ size = 16, className = "" }) => (
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
    <path d="M8 6V4c0-1 1-2 2-2h4c0-1 1-2 2-2v2" />
  </svg>
)

export default function PaymentTypesPage() {
  const { paymentTypes } = useAppContext()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingPaymentType, setEditingPaymentType] = useState<any>(null)
  const [deletingPaymentType, setDeletingPaymentType] = useState<any>(null)

  const handleEdit = (paymentType: any) => {
    setEditingPaymentType(paymentType)
    setIsAddModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
    setEditingPaymentType(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Типы оплат</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Создать тип оплаты
          </button>
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
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentTypes.map((paymentType) => (
                <tr key={paymentType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paymentType.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{paymentType.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(paymentType)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Редактировать"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingPaymentType(paymentType)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Удалить"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Модальные окна */}
        <AddPaymentTypeModal isOpen={isAddModalOpen} onClose={handleCloseModal} paymentType={editingPaymentType} />

        <DeletePaymentTypeModal
          isOpen={!!deletingPaymentType}
          onClose={() => setDeletingPaymentType(null)}
          paymentType={deletingPaymentType}
        />
      </div>
    </div>
  )
}
