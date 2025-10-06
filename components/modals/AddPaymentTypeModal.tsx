"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAppContext } from "@/context/AppContext"
import type { PaymentType } from "@/types"

interface AddPaymentTypeModalProps {
  isOpen: boolean
  onClose: () => void
  paymentType?: PaymentType | null
}

export default function AddPaymentTypeModal({ isOpen, onClose, paymentType }: AddPaymentTypeModalProps) {
  const { addPaymentType, updatePaymentType } = useAppContext()
  const [formData, setFormData] = useState({
    name: "",
  })

  const isEditing = !!paymentType

  useEffect(() => {
    if (paymentType) {
      setFormData({
        name: paymentType.name,
      })
    } else {
      setFormData({
        name: "",
      })
    }
  }, [paymentType])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing && paymentType) {
      updatePaymentType({
        ...paymentType,
        ...formData,
      })
    } else {
      addPaymentType(formData)
    }

    setFormData({ name: "" })
    onClose()
  }

  const handleClose = () => {
    setFormData({ name: "" })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{isEditing ? "Редактировать тип оплаты" : "Добавить тип оплаты"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Наименование *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isEditing ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
