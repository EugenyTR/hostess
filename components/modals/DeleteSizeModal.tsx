"use client"

import { X } from "lucide-react"

interface DeleteSizeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  sizeName: string
}

export default function DeleteSizeModal({ isOpen, onClose, onConfirm, sizeName }: DeleteSizeModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <button onClick={onClose} className="text-[#7f8189] hover:text-[#2c2c33] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-lg font-medium text-[#2c2c33] mb-2">Вы уверены, что хотите удалить размер?</h2>
          <p className="text-[#7f8189]">Размер "{sizeName}" будет удален безвозвратно.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#2055a4] text-white py-3 px-4 rounded-lg hover:bg-[#1a4a94] transition-colors"
          >
            Удалить
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-[#e3e3e3] text-[#2c2c33] py-3 px-4 rounded-lg hover:bg-[#f7f7f7] transition-colors"
          >
            Оставить
          </button>
        </div>
      </div>
    </div>
  )
}
