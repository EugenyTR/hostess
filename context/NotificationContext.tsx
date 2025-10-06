"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react"

interface NotificationContextType {
  showNotification: (message: string, type?: "success" | "error" | "info" | "warning") => void
}

interface NotificationState {
  id: number
  message: string
  type: "success" | "error" | "info" | "warning"
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationState[]>([])
  const [nextId, setNextId] = useState(1)

  const showNotification = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = nextId
    setNextId((prev) => prev + 1)

    const newNotification: NotificationState = { id, message, type }
    setNotifications((prev) => [...prev, newNotification])

    // Автоматически удаляем уведомление через 5 секунд
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000)
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />
      case "error":
        return <XCircle className="w-5 h-5" />
      case "warning":
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      case "warning":
        return "bg-yellow-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {/* Контейнер для уведомлений */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`${getBackgroundColor(notification.type)} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-80 max-w-96 animate-in slide-in-from-right duration-300`}
            onClick={() => removeNotification(notification.id)}
          >
            {getIcon(notification.type)}
            <span className="flex-1 text-sm font-medium">{notification.message}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeNotification(notification.id)
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
