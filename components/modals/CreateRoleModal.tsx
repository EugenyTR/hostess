"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface Permission {
  section: string
  level: "read" | "write" | "none"
}

interface Role {
  id: number
  name: string
  status: "active" | "deactivated"
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

interface CreateRoleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (role: any) => void
  initialData?: Role
  isEditing?: boolean
}

const availableSections = [
  "Заказы",
  "Клиенты",
  "Отчеты",
  "Номенклатура",
  "Маркетинг",
  "Настройки",
  "Справочники",
  "Управление ролями",
]

export function CreateRoleModal({ isOpen, onClose, onSave, initialData, isEditing = false }: CreateRoleModalProps) {
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"active" | "deactivated">("active")
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [nameError, setNameError] = useState("")

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setStatus(initialData.status)
      setPermissions(initialData.permissions)
    } else {
      // Инициализация разрешений для новой роли
      setPermissions(
        availableSections.map((section) => ({
          section,
          level: "none" as "none" | "read" | "write",
        })),
      )
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setNameError("Название роли обязательно")
      return
    }

    const roleData = {
      ...(initialData || {}),
      name,
      status,
      permissions,
    }

    onSave(roleData)
    onClose()
  }

  const handlePermissionChange = (section: string, level: "none" | "read" | "write") => {
    setPermissions(permissions.map((p) => (p.section === section ? { ...p, level } : p)))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{isEditing ? "Редактирование роли" : "Создание новой роли"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Название роли*
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setNameError("")
              }}
              className={`w-full px-3 py-2 border ${
                nameError ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Введите название роли"
            />
            {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  checked={status === "active"}
                  onChange={() => setStatus("active")}
                />
                <span className="ml-2">Активен</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  checked={status === "deactivated"}
                  onChange={() => setStatus("deactivated")}
                />
                <span className="ml-2">Деактивирован</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Права доступа</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Раздел
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Уровень доступа
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permissions.map((permission) => (
                    <tr key={permission.section}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {permission.section}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio h-4 w-4 text-blue-600"
                              checked={permission.level === "none"}
                              onChange={() => handlePermissionChange(permission.section, "none")}
                            />
                            <span className="ml-2">Нет доступа</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio h-4 w-4 text-blue-600"
                              checked={permission.level === "read"}
                              onChange={() => handlePermissionChange(permission.section, "read")}
                            />
                            <span className="ml-2">Чтение</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio h-4 w-4 text-blue-600"
                              checked={permission.level === "write"}
                              onChange={() => handlePermissionChange(permission.section, "write")}
                            />
                            <span className="ml-2">Запись</span>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {isEditing ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
