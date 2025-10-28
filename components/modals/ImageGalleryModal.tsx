"use client"

import type React from "react"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import type { ServiceImage } from "@/types"

interface ImageGalleryModalProps {
    images: ServiceImage[]
    initialIndex?: number
    onClose: () => void
    onDelete?: (imageId: number) => void
}

export default function ImageGalleryModal({ images, initialIndex = 0, onClose, onDelete }: ImageGalleryModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
    }

    const handleDelete = () => {
        if (onDelete && images[currentIndex]) {
            onDelete(images[currentIndex].id)

            // Если это последнее изображение, закрываем модальное окно
            if (images.length === 1) {
                onClose()
            } else {
                // Переходим к следующему изображению или предыдущему, если это было последнее
                setCurrentIndex((prev) => (prev >= images.length - 1 ? prev - 1 : prev))
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
            handlePrevious()
        } else if (e.key === "ArrowRight") {
            handleNext()
        } else if (e.key === "Escape") {
            onClose()
        }
    }

    if (images.length === 0) {
        return null
    }

    const currentImage = images[currentIndex]

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={onClose}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className="relative w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                {/* Кнопка закрытия */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                >
                    <X className="w-8 h-8" />
                </button>

                {/* Кнопка удаления */}
                {onDelete && (
                    <button
                        onClick={handleDelete}
                        className="absolute top-4 right-16 text-white hover:text-red-500 transition-colors z-10"
                        title="Удалить изображение"
                    >
                        <Trash2 className="w-6 h-6" />
                    </button>
                )}

                {/* Кнопка "Предыдущее" */}
                {images.length > 1 && (
                    <button
                        onClick={handlePrevious}
                        className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                    >
                        <ChevronLeft className="w-12 h-12" />
                    </button>
                )}

                {/* Изображение */}
                <div className="max-w-5xl max-h-full flex flex-col items-center">
                    <img
                        src={currentImage.url || "/placeholder.svg"}
                        alt={currentImage.name}
                        className="max-w-full max-h-[80vh] object-contain rounded-lg"
                    />

                    {/* Информация об изображении */}
                    <div className="mt-4 text-white text-center">
                        <p className="text-lg font-medium">{currentImage.name}</p>
                        <p className="text-sm text-gray-300 mt-1">
                            {currentIndex + 1} из {images.length}
                        </p>
                    </div>
                </div>

                {/* Кнопка "Следующее" */}
                {images.length > 1 && (
                    <button
                        onClick={handleNext}
                        className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                    >
                        <ChevronRight className="w-12 h-12" />
                    </button>
                )}

                {/* Миниатюры */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4">
                        {images.map((image, index) => (
                            <button
                                key={image.id}
                                onClick={() => setCurrentIndex(index)}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                    index === currentIndex ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                            >
                                <img src={image.url || "/placeholder.svg"} alt={image.name} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
