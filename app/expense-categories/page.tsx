"use client"

import { useState } from "react"
import { useAppContext } from "@/context/AppContext"
import { useNotification } from "@/context/NotificationContext"
import { AddExpenseCategoryModal } from "@/components/modals/AddExpenseCategoryModal"
import { DeleteExpenseCategoryModal } from "@/components/modals/DeleteExpenseCategoryModal"
import type { ExpenseCategory } from "@/types"

// Иконки
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
    <path d="M12 5v14M5 12h14" />
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
    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const Trash2 = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3,6 5,6 21,6" />
    <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
)

const ChevronLeft = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRight = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export default function ExpenseCategoriesPage() {
  const { expenseCategories, deleteExpenseCategory } = useAppContext()
  const { showNotification } = useNotification()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10
  const totalPages = Math.ceil(expenseCategories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCategories = expenseCategories.slice(startIndex, endIndex)

  const handleEdit = (category: ExpenseCategory) => {
    setSelectedCategory(category)
    setIsAddModalOpen(true)
  }

  const handleDelete = (category: ExpenseCategory) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedCategory) {
      deleteExpenseCategory(selectedCategory.id)
      showNotification("Статья расходов удалена", "success")
      setIsDeleteModalOpen(false)
      setSelectedCategory(null)
    }
  }

  const handleAddNew = () => {
    setSelectedCategory(null)
    setIsAddModalOpen(true)
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Кнопка "Назад"
    pages.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-md text-sm font-medium text-[#2c2c33] bg-white border border-[#e3e3e3] hover:bg-[#f7f7f7] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>,
    )

    // Номера страниц
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            currentPage === i
              ? "bg-[#2055a4] text-white"
              : "text-[#2c2c33] bg-white border border-[#e3e3e3] hover:bg-[#f7f7f7]"
          }`}
        >
          {i}
        </button>,
      )
    }

    // Кнопка "Вперед"
    pages.push(
      <button
        key="next"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-md text-sm font-medium text-[#2c2c33] bg-white border border-[#e3e3e3] hover:bg-[#f7f7f7] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>,
    )

    return <div className="flex items-center justify-center space-x-2 mt-6">{pages}</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2c2c33]">Статьи расходов</h1>
        <button
          onClick={handleAddNew}
          className="bg-[#2055a4] text-white px-4 py-2 rounded-lg hover:bg-[#1a4a94] transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Создать статью
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e3e3e3]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f7f7f7] border-b border-[#e3e3e3]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#8e8e8e] uppercase tracking-wider">
                  Наименование
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#8e8e8e] uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e3e3e3]">
              {currentCategories.map((category) => (
                <tr key={category.id} className="hover:bg-[#f7f7f7]">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2c2c33]">{category.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2c2c33]">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-[#2055a4] hover:text-[#1a4a94] p-1"
                        title="Редактировать"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {expenseCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#8e8e8e] text-lg">Статьи расходов не найдены</p>
            <p className="text-[#8e8e8e] text-sm mt-2">Создайте первую статью расходов</p>
          </div>
        )}
      </div>

      {renderPagination()}

      {/* Модальные окна */}
      <AddExpenseCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setSelectedCategory(null)
        }}
        category={selectedCategory}
      />

      <DeleteExpenseCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedCategory(null)
        }}
        category={selectedCategory}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
