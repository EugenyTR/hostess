"use client"

import { X } from "lucide-react"

interface DeleteBrandModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  brandName: string
}

export default function DeleteBrandModal({ isOpen, onClose, onConfirm, brandName }: DeleteBrandModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#2c2c33]">Подтверждение удаления</h2>
          <button onClick={onClose} className="text-[#7f8189] hover:text-[#2c2c33] transition-colors">
            <X size={20} />
          </button>
        </div>

        <p className="text-[#2c2c33] mb-6">Вы уверены, что хотите удалить бренд "{brandName}"?</p>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="bg-[#2055a4] text-white px-4 py-2 rounded-lg hover:bg-[#1a4a94] transition-colors flex-1"
          >
            Удалить
          </button>
          <button
            onClick={onClose}
            className="border border-[#e3e3e3] text-[#2c2c33] px-4 py-2 rounded-lg hover:bg-[#f7f7f7] transition-colors flex-1"
          >
            Оставить
          </button>
        </div>
      </div>
    </div>
  )
}
