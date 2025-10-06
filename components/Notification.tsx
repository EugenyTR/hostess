"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface NotificationProps {
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
}

interface NotificationState extends NotificationProps {
  id: string
  isVisible: boolean
}

let notifications: NotificationState[] = []
let setNotifications: React.Dispatch<React.SetStateAction<NotificationState[]>> | null = null

export function addNotification(notification: NotificationProps) {
  const newNotification: NotificationState = {
    ...notification,
    id: Date.now().toString(),
    isVisible: true,
  }

  notifications = [...notifications, newNotification]
  if (setNotifications) {
    setNotifications([...notifications])
  }

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeNotification(newNotification.id)
  }, 5000)
}

export function removeNotification(id: string) {
  notifications = notifications.filter((n) => n.id !== id)
  if (setNotifications) {
    setNotifications([...notifications])
  }
}

export default function NotificationContainer() {
  const [notificationList, setNotificationList] = useState<NotificationState[]>([])

  useEffect(() => {
    setNotifications = setNotificationList
    setNotificationList([...notifications])

    return () => {
      setNotifications = null
    }
  }, [])

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-500 text-green-700"
      case "error":
        return "bg-red-100 border-red-500 text-red-700"
      case "warning":
        return "bg-yellow-100 border-yellow-500 text-yellow-700"
      case "info":
        return "bg-blue-100 border-blue-500 text-blue-700"
      default:
        return "bg-gray-100 border-gray-500 text-gray-700"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notificationList.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full border-l-4 p-4 rounded shadow-lg transition-all duration-300 ${getNotificationStyles(
            notification.type,
          )} ${notification.isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{notification.title}</h4>
              <p className="text-sm mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
