"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import type { Point } from "@/types"

interface AddPointModalProps {
  isOpen: boolean
  onClose: () => void
  point?: Point | null
  onSubmit: (data: any) => void
}

export function AddPointModal({ isOpen, onClose, point, onSubmit }: AddPointModalProps) {
  const { cities } = useAppContext()

  const [form, setForm] = useState({
    name: point?.name || "",
    organizationType: point?.organizationType || ("own" as "own" | "franchise"),
    phone: point?.phone || "",
    address: {
      cityId: point?.address?.cityId || "",
      city: point?.address?.city || "",
      street: point?.address?.street || "",
      house: point?.address?.house || "",
      apartment: point?.address?.apartment || "",
      fullAddress: point?.address?.fullAddress || "",
    },
    coordinates: {
      lat: point?.coordinates?.lat || 0,
      lng: point?.coordinates?.lng || 0,
    },
    isActive: point?.isActive ?? true,
  })

  const handleSubmit = () => {
    const fullAddress = `г. ${form.address.city}, ул. ${form.address.street}, д. ${form.address.house}${form.address.apartment ? `, кв. ${form.address.apartment}` : ""}`

    const pointData = {
      ...form,
      address: {
        ...form.address,
        fullAddress,
      },
      id: point?.id || Date.now(),
      createdAt: point?.createdAt || new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    onSubmit(pointData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#2c2c33]">{point ? "Редактировать точку" : "Добавить точку"}</h2>
          <button onClick={onClose} className="text-[#8e8e8e] hover:text-[#2c2c33] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2c2c33] mb-2">Название</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-[#e0e0e0] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2196f3] focus:border-transparent"
              placeholder="Название точки"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2c2c33] mb-2">Тип организации</label>
            <select
              value={form.organizationType}
              onChange={(e) => setForm({ ...form, organizationType: e.target.value as "own" | "franchise" })}
              className="w-full border border-[#e0e0e0] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2196f3] focus:border-transparent"
            >
              <option value="own">Собственная сеть</option>
              <option value="franchise">Франчайзи</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2c2c33] mb-2">Телефон</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-[#e0e0e0] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2196f3] focus:border-transparent"
              placeholder="+7 (xxx) xxx-xx-xx"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2c2c33] mb-2">Город</label>
              <input
                type="text"
                value={form.address.city}
                onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                className="w-full border border-[#e0e0e0] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2196f3] focus:border-transparent"
                placeholder="Город"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c2c33] mb-2">Улица</label>
              <input
                type="text"
                value={form.address.street}
                onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
                className="w-full border border-[#e0e0e0] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2196f3] focus:border-transparent"
                placeholder="Улица"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2c2c33] mb-2">Дом</label>
              <input
                type="text"
                value={form.address.house}
                onChange={(e) => setForm({ ...form, address: { ...form.address, house: e.target.value } })}
                className="w-full border border-[#e0e0e0] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2196f3] focus:border-transparent"
                placeholder="Дом"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c2c33] mb-2">Квартира/Офис</label>
              <input
                type="text"
                value={form.address.apartment}
                onChange={(e) => setForm({ ...form, address: { ...form.address, apartment: e.target.value } })}
                className="w-full border border-[#e0e0e0] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2196f3] focus:border-transparent"
                placeholder="Квартира/Офис (необязательно)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2c2c33] mb-2">Широта</label>
              <input
                type="number"
                step="0.000001"
                value={form.coordinates.lat}
                onChange={(e) =>
                  setForm({
                    ...form,
                    coordinates: { ...form.coordinates, lat: Number.parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full border border-[#e0e0e0] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2196f3] focus:border-transparent"
                placeholder="55.7558"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2c2c33] mb-2">Долгота</label>
              <input
                type="number"
                step="0.000001"
                value={form.coordinates.lng}
                onChange={(e) =>
                  setForm({
                    ...form,
                    coordinates: { ...form.coordinates, lng: Number.parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full border border-[#e0e0e0] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2196f3] focus:border-transparent"
                placeholder="37.6173"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#e0e0e0] rounded-md text-[#8e8e8e] hover:bg-[#f5f5f5] transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#2196f3] hover:bg-[#1976d2] text-white px-4 py-2 rounded-md transition-colors"
          >
            {point ? "Сохранить" : "Добавить"}
          </button>
        </div>
      </div>
    </div>
  )
}
