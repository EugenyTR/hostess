"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import type { ExpenseCategory } from "@/types"

interface AddExpenseCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: ExpenseCategory | null
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

export function AddExpenseCategoryModal({ isOpen, onClose, category }: AddExpenseCategoryModalProps) {
  const { addExpenseCategory, updateExpenseCategory } = useAppContext()
  const { showNotification } = useNotification()

  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!category

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setName(category.name)
      } else {
        setName("")
      }
    }
  }, [isOpen, category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      showNotification("Введите наименование статьи расходов", "error")
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditing && category) {
        const updatedCategory: ExpenseCategory = {
          ...category,
          name: name.trim(),
          updatedAt: new Date().toISOString().split("T")[0],
        }
        updateExpenseCategory(updatedCategory)
        showNotification("Статья расходов обновлена", "success")
      } else {
        addExpenseCategory({
          name: name.trim(),
        })
        showNotification("Статья расходов создана", "success")
      }

      onClose()
    } catch (error) {
      showNotification("Произошла ошибка", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#2c2c33]">
            {isEditing ? "Редактирование статьи расходов" : "Создание статьи расходов"}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-[#8e8e8e] hover:text-[#2c2c33] disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-[#2c2c33] mb-2">
              Наименование *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-[#e3e3e3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
              placeholder="Введите наименование статьи расходов"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-[#2c2c33] bg-[#f7f7f7] border border-[#e3e3e3] rounded-md hover:bg-[#ededed] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отменить
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-4 py-2 bg-[#2055a4] text-white rounded-md hover:bg-[#1a4a94] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Сохранение..." : isEditing ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
