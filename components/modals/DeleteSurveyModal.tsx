"use client"

import { X } from "lucide-react"

interface DeleteSurveyModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  surveyName: string
}

export function DeleteSurveyModal({ isOpen, onClose, onConfirm, surveyName }: DeleteSurveyModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors ml-auto">
            <X size={24} />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-lg text-[#2c2c33] mb-2">Вы уверены, что хотите удалить опрос?</p>
          {surveyName && <p className="text-sm text-gray-600">"{surveyName}"</p>}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#2055a4] text-white py-2 px-4 rounded-lg hover:bg-[#1a4a94] transition-colors"
          >
            Удалить
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-[#2c2c33] py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Оставить
          </button>
        </div>
      </div>
    </div>
  )
}
