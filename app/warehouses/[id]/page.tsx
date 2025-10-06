"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAppContext } from "@/context/AppContext"

// Simple SVG icons
const ArrowLeft = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
)

const Save = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17,21 17,13 7,13 7,21" />
    <polyline points="7,3 7,8 15,8" />
  </svg>
)

interface EditWarehousePageProps {
  params: {
    id: string
  }
}

export default function EditWarehousePage({ params }: EditWarehousePageProps) {
  const router = useRouter()
  const { getWarehouseById, updateWarehouse, cities, contractors } = useAppContext()

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cityId: "",
    contractorId: "",
    paymentMethod: "cashless" as "cash" | "cashless" | "mixed",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const warehouseId = Number.parseInt(params.id)
    const warehouse = getWarehouseById(warehouseId)

    if (warehouse) {
      setFormData({
        name: warehouse.name,
        address: warehouse.address,
        cityId: warehouse.cityId.toString(),
        contractorId: warehouse.contractorId.toString(),
        paymentMethod: warehouse.paymentMethod,
      })
    } else {
      router.push("/warehouses")
    }

    setLoading(false)
  }, [params.id, getWarehouseById, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cityId" || name === "contractorId" ? value : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Наименование склада обязательно"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Адрес склада обязателен"
    }

    if (!formData.cityId) {
      newErrors.cityId = "Выберите город"
    }

    if (!formData.contractorId) {
      newErrors.contractorId = "Выберите контрагента"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const warehouseId = Number.parseInt(params.id)
      const warehouse = getWarehouseById(warehouseId)

      if (warehouse) {
        updateWarehouse({
          ...warehouse,
          name: formData.name.trim(),
          address: formData.address.trim(),
          cityId: Number(formData.cityId),
          contractorId: Number(formData.contractorId),
          paymentMethod: formData.paymentMethod,
        })

        router.push("/warehouses")
      }
    } catch (error) {
      console.error("Error updating warehouse:", error)
    }
  }

  const handleCancel = () => {
    router.push("/warehouses")
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/warehouses" className="text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Редактировать склад</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Наименование склада *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Введите наименование склада"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="contractorId" className="block text-sm font-medium text-gray-700 mb-2">
              Контрагент *
            </label>
            <select
              id="contractorId"
              name="contractorId"
              value={formData.contractorId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.contractorId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Выберите контрагента</option>
              {contractors.map((contractor) => (
                <option key={contractor.id} value={contractor.id}>
                  {contractor.legalName}
                </option>
              ))}
            </select>
            {errors.contractorId && <p className="mt-1 text-sm text-red-600">{errors.contractorId}</p>}
          </div>

          <div>
            <label htmlFor="cityId" className="block text-sm font-medium text-gray-700 mb-2">
              Город *
            </label>
            <select
              id="cityId"
              name="cityId"
              value={formData.cityId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.cityId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Выберите город</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.cityId && <p className="mt-1 text-sm text-red-600">{errors.cityId}</p>}
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
              Способ оплаты *
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cash">Наличные</option>
              <option value="cashless">Безналичные</option>
              <option value="mixed">Смешанные</option>
            </select>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Адрес склада *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Введите адрес склада"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Отменить
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save size={20} />
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
