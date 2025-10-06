"use client"

import { X } from "lucide-react"
import { useEffect, useRef } from "react"

interface DeleteServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteServiceModal({ isOpen, onClose, onConfirm }: DeleteServiceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6 mt-2">
          <h3 className="text-xl font-medium text-[#2c2c33]">Вы уверены, что хотите удалить услугу?</h3>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-[#2055a4] text-white px-6 py-2 rounded-lg hover:bg-[#1a4590] transition-colors"
          >
            Удалить
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 text-[#2c2c33] px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Оставить
          </button>
        </div>
      </div>
    </div>
  )
}
