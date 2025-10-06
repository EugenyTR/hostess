"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { CreateRoleModal } from "@/components/modals/CreateRoleModal"
import { useAuth } from "@/context/AuthContext" // Правильный импорт с большой буквы
import { useNotification } from "@/context/NotificationContext"

// Типы
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
  const { hasPermission } = useAuth()
  const { showNotification } = useNotification()

  const handleCreateRole = (newRoleData: Omit<Role, "id" | "createdAt" | "updatedAt">) => {
    const newRole: Role = {
      ...newRoleData,
      id: Math.max(0, ...roles.map((r) => r.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setRoles([...roles, newRole])
    showNotification({
      type: "success",
      message: `Роль "${newRole.name}" успешно создана`,
    })
  }

  const handleEditRole = (updatedRole: Role) => {
    setRoles(
      roles.map((role) =>
        role.id === updatedRole.id ? { ...updatedRole, updatedAt: new Date().toISOString() } : role,
      ),
    )
    setEditingRole(null)
    showNotification({
      type: "success",
      message: `Роль "${updatedRole.name}" успешно обновлена`,
    })
  }

  const handleDeleteRole = (roleId: number) => {
    const roleToDelete = roles.find((r) => r.id === roleId)
    setRoles(roles.filter((role) => role.id !== roleId))
    setDeletingRoleId(null)
    showNotification({
      type: "success",
      message: `Роль "${roleToDelete?.name}" успешно удалена`,
    })
  }

  const toggleRoleStatus = (roleId: number) => {
    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          const newStatus = role.status === "active" ? "deactivated" : "active"
          showNotification({
            type: "success",
            message: `Статус роли "${role.name}" изменен на "${newStatus === "active" ? "Активен" : "Деактивирован"}"`,
          })
          return { ...role, status: newStatus, updatedAt: new Date().toISOString() }
        }
        return role
      }),
    )
  }

  const canManageRoles = true // Для тестирования, в реальном приложении: hasPermission("Управление ролями")

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Роли</h1>
        {canManageRoles && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Создать роль</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Наименование роли
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              {canManageRoles && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{role.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{role.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      role.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {role.status === "active" ? "Активен" : "Деактивирован"}
                  </span>
                </td>
                {canManageRoles && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    <button
                      onClick={() => toggleRoleStatus(role.id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      {role.status === "active" ? "Деактивировать" : "Активиров����������ть"}
                    </button>
                    <button onClick={() => setEditingRole(role)} className="text-gray-600 hover:text-gray-900 mr-4">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => setDeletingRoleId(role.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Пагинация */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Предыдущая
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Следующая
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Показано <span className="font-medium">1</span> до <span className="font-medium">{roles.length}</span>{" "}
                из <span className="font-medium">{roles.length}</span> результатов
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  ←
                </button>
                <button className="bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  2
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  →
                </button>
              </nav>
            </div>
          </div>
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
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Подтверждение удаления</h3>
            <p className="mb-6">
              Вы уверены, что хотите удалить роль "{roles.find((r) => r.id === deletingRoleId)?.name}"?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingRoleId(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={() => handleDeleteRole(deletingRoleId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
