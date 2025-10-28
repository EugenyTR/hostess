"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, Trash2, Camera } from "lucide-react"
import type { ServiceImage } from "@/types"

interface AddImageModalProps {
  onClose: () => void
  onAdd: (images: ServiceImage[]) => void
}

export default function AddImageModal({ onClose, onAdd }: AddImageModalProps) {
  const [images, setImages] = useState<ServiceImage[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    onAdd(images)
  }

  const handleRemoveImage = (id: number) => {
    setImages(images.filter((image) => image.id !== id))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const newImages: ServiceImage[] = []

    Array.from(files).forEach((file, index) => {
      // Create a URL for the file
      const url = URL.createObjectURL(file)

      newImages.push({
        id: Date.now() + index,
        name: file.name,
        url: url,
      })
    })

    setImages([...images, ...newImages])
  }

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-medium mb-6 text-center">Добавление фото</h2>

          <div
              className={`mb-6 border-2 border-dashed ${dragActive ? "border-[#2055a4] bg-blue-50" : "border-gray-300"} rounded-lg p-6 flex flex-col items-center justify-center`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-500 text-center mb-4">
              Переместите фото в поле
              <br />
              или{" "}
              <span className="text-[#2055a4] cursor-pointer" onClick={openFileSelector}>
              выберете файл
            </span>
            </p>

            <button
                onClick={openCamera}
                className="flex items-center gap-2 px-4 py-2 bg-[#2055a4] text-white rounded-full hover:bg-[#1a4a8f] transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>Использовать камеру</span>
            </button>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
            />

            <input
                type="file"
                ref={cameraInputRef}
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
            />
          </div>

          <div className="mb-6 max-h-60 overflow-y-auto">
            {images.map((image) => (
                <div key={image.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div className="flex items-center">
                    <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.name}
                        className="w-12 h-12 object-cover rounded mr-3"
                    />
                    <span className="text-gray-700 text-sm">{image.name}</span>
                  </div>
                  <button onClick={() => handleRemoveImage(image.id)} className="text-gray-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <button
                onClick={handleSubmit}
                className="bg-[#2055a4] text-white px-6 py-2 rounded hover:bg-[#1a4a8f] transition-colors"
                disabled={images.length === 0}
            >
              Добавить
            </button>
            <button
                onClick={onClose}
                className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              Отменить
            </button>
          </div>
        </div>
      </div>
  )
}
