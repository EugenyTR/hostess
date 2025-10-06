"use client"

import { X, AlertTriangle } from "lucide-react"
import type { Point } from "@/types"

interface DeletePointModalProps {
  isOpen: boolean
  onClose: () => void
  point: Point | null
  onConfirm: () => void
}

export function DeletePointModal({ isOpen, onClose, point, onConfirm }: DeletePointModalProps) {
  if (!isOpen || !point) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#2c2c33]">Удалить точку</h2>
          <button onClick={onClose} className="text-[#8e8e8e] hover:text-[#2c2c33] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={48} className="text-[#e74c3c]" />
          <div>
            <p className="text-[#2c2c33] mb-2">
              Вы уверены, что хотите удалить точку <strong>"{point.name}"</strong>?
            </p>
            <p className="text-sm text-[#8e8e8e]">Это действие нельзя отменить.</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-[#8e8e8e] hover:text-[#2c2c33] transition-colors">
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#e74c3c] hover:bg-[#c0392b] text-white px-4 py-2 rounded-md transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  )
}
