"use client"

import { X } from "lucide-react"

interface ConfirmExitModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmExitModal({ isOpen, onClose, onConfirm }: ConfirmExitModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative animate-slide-up">
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Содержимое */}
        <div className="text-center">
          <h3 className="text-lg font-medium text-[#2c2c33] mb-6">Вы уверены, что хотите выйти без сохранения?</h3>

          {/* Кнопки */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              className="bg-[#2055a4] text-white px-6 py-2 rounded-lg hover:bg-[#1a4590] transition-colors"
            >
              Нет, остаться
            </button>
            <button
              onClick={onConfirm}
              className="border border-gray-300 text-[#2c2c33] px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Да, выйти
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
