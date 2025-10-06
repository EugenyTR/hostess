"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { CreateRoleModal } from "@/components/modals/CreateRoleModal"

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

// Моковые данные ролей
const initialRoles: Role[] = [
  {
    id: 1,
    name: "Маркетолог",
    status: "active",
    permissions: [
      { section: "Заказы", level: "read" },
      { section: "Клиенты", level: "write" },
      { section: "Отчеты", level: "read" },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Управляющий",
    status: "deactivated",
    permissions: [
      { section: "Заказы", level: "write" },
      { section: "Клиенты", level: "write" },
      { section: "Отчеты", level: "write" },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: 3,
    name: "Кассир",
    status: "active",
    permissions: [
      { section: "Заказы", level: "read" },
      { section: "Клиенты", level: "read" },
      { section: "Отчеты", level: "none" },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null)

  const handleCreateRole = (newRoleData: Omit<Role, "id" | "createdAt" | "updatedAt">) => {
    const newRole: Role = {
      ...newRoleData,
      id: Math.max(0, ...roles.map((r) => r.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setRoles([...roles, newRole])
  }

  const handleEditRole = (updatedRole: Role) => {
    setRoles(
      roles.map((role) =>
        role.id === updatedRole.id ? { ...updatedRole, updatedAt: new Date().toISOString() } : role,
      ),
    )
    setEditingRole(null)
  }

  const handleDeleteRole = (roleId: number) => {
    setRoles(roles.filter((role) => role.id !== roleId))
    setDeletingRoleId(null)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f7f7f7" }}>
      <div className="p-6">
        {/* Заголовок и кнопка создания */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "#2c2c33" }}>
            Роли
          </h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#2055a4" }}
          >
            <Plus size={20} />
            <span>Создать роль</span>
          </button>
        </div>

        {/* Таблица */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead style={{ backgroundColor: "#f7f7f7" }}>
              <tr>
                <th
                  className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider"
                  style={{ color: "#979797" }}
                >
                  ID
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider"
                  style={{ color: "#979797" }}
                >
                  Наименование роли
                </th>
                <th
                  className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider"
                  style={{ color: "#979797" }}
                >
                  Статус
                </th>
                <th
                  className="px-6 py-4 text-right text-sm font-medium uppercase tracking-wider"
                  style={{ color: "#979797" }}
                >
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {roles.map((role, index) => (
                <tr
                  key={role.id}
                  className={`hover:bg-gray-50 transition-colors ${index !== roles.length - 1 ? "border-b" : ""}`}
                  style={{ borderColor: "#e3e3e3" }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: "#2c2c33" }}>
                    {role.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: "#2c2c33" }}>
                    {role.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-4 py-1 rounded-full text-xs font-medium ${
                        role.status === "active" ? "text-green-700" : "text-red-700"
                      }`}
                      style={{
                        backgroundColor: role.status === "active" ? "#d1fae5" : "#fee2e2",
                        border: `1px solid ${role.status === "active" ? "#10b981" : "#ef4444"}`,
                      }}
                    >
                      {role.status === "active" ? "Активен" : "Деактивирован"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => setEditingRole(role)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Редактировать роль"
                      >
                        <Edit size={16} style={{ color: "#979797" }} />
                      </button>
                      <button
                        onClick={() => setDeletingRoleId(role.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Удалить роль"
                      >
                        <Trash2 size={16} style={{ color: "#ef4444" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Пагинация */}
          <div className="px-6 py-4 flex items-center justify-center border-t" style={{ borderColor: "#e3e3e3" }}>
            <nav className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "#979797" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M10 12l-4-4 4-4" />
                </svg>
              </button>

              <button className="px-3 py-1 rounded-lg text-sm" style={{ color: "#979797" }}>
                1
              </button>

              <button className="px-3 py-1 rounded-lg text-sm text-white" style={{ backgroundColor: "#2055a4" }}>
                2
              </button>

              <button className="px-3 py-1 rounded-lg text-sm" style={{ color: "#979797" }}>
                3
              </button>

              <span className="px-2 text-sm" style={{ color: "#979797" }}>
                ...
              </span>

              <button className="px-3 py-1 rounded-lg text-sm" style={{ color: "#979797" }}>
                35
              </button>

              <button className="px-3 py-1 rounded-lg text-sm" style={{ color: "#979797" }}>
                36
              </button>

              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "#979797" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </button>
            </nav>
          </div>
        </div>

        {/* Модальные окна */}
        {isCreateModalOpen && (
          <CreateRoleModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSave={handleCreateRole}
          />
        )}

        {editingRole && (
          <CreateRoleModal
            isOpen={!!editingRole}
            onClose={() => setEditingRole(null)}
            onSave={handleEditRole}
            initialData={editingRole}
            isEditing={true}
          />
        )}

        {deletingRoleId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-medium mb-4" style={{ color: "#2c2c33" }}>
                Подтверждение удаления
              </h3>
              <p className="mb-6" style={{ color: "#979797" }}>
                Вы уверены, что хотите удалить роль "{roles.find((r) => r.id === deletingRoleId)?.name}"?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeletingRoleId(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "#e3e3e3", color: "#979797" }}
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleDeleteRole(deletingRoleId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
