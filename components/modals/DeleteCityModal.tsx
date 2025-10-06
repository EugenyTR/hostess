"use client"

import { X } from "lucide-react"

interface DeleteCityModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  cityName: string
}

export function DeleteCityModal({ isOpen, onClose, onConfirm, cityName }: DeleteCityModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-[#e3e3e3]">
          <h2 className="text-lg font-medium text-[#2c2c33]">Удаление города</h2>
          <button onClick={onClose} className="text-[#8e8e8e] hover:text-[#2c2c33] transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-[#2c2c33] mb-6">
            Вы уверены, что хотите удалить город <span className="font-medium">{cityName}</span>? Это действие нельзя
            будет отменить.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#e3e3e3] text-[#2c2c33] rounded-lg hover:bg-[#f8f9fa] transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-[#ef4444] text-white rounded-lg hover:bg-[#dc2626] transition-colors"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
