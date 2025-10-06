"use client"

import { useAppContext } from "@/context/AppContext"
import type { PaymentType } from "@/types"

interface DeletePaymentTypeModalProps {
  isOpen: boolean
  onClose: () => void
  paymentType: PaymentType | null
}

export default function DeletePaymentTypeModal({ isOpen, onClose, paymentType }: DeletePaymentTypeModalProps) {
  const { deletePaymentType } = useAppContext()

  const handleDelete = () => {
    if (paymentType) {
      deletePaymentType(paymentType.id)
      onClose()
    }
  }

  if (!isOpen || !paymentType) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Удалить тип оплаты</h2>
        <p className="text-gray-600 mb-6">
          Вы уверены, что хотите удалить тип оплаты "{paymentType.name}"? Это действие нельзя отменить.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  )
}
