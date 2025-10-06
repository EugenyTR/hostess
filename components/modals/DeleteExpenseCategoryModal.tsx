"use client"

import type { ExpenseCategory } from "@/types"

interface DeleteExpenseCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: ExpenseCategory | null
  onConfirm: () => void
}

const X = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m18 6-12 12" />
    <path d="m6 6 12 12" />
  </svg>
)

const AlertTriangle = ({ size = 48, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="m12 17 .01 0" />
  </svg>
)

export function DeleteExpenseCategoryModal({ isOpen, onClose, category, onConfirm }: DeleteExpenseCategoryModalProps) {
  if (!isOpen || !category) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#2c2c33]">Удаление статьи расходов</h2>
          <button onClick={onClose} className="text-[#8e8e8e] hover:text-[#2c2c33]">
            <X size={24} />
          </button>
        </div>

        <div className="text-center mb-6">
          <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
          <p className="text-[#2c2c33] mb-2">Вы уверены, что хотите удалить статью расходов?</p>
          <p className="text-[#8e8e8e] text-sm">
            <strong>"{category.name}"</strong>
          </p>
          <p className="text-red-600 text-sm mt-2">Это действие нельзя отменить.</p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#2c2c33] bg-[#f7f7f7] border border-[#e3e3e3] rounded-md hover:bg-[#ededed]"
          >
            Отменить
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Удалить
          </button>
        </div>
      </div>
    </div>
  )
}
