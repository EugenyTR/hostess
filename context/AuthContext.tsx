"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  username: string
  role: "admin" | "manager" | "cashier"
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Тестовые пользователи
const testUsers: Record<string, { password: string; user: User }> = {
  admin: {
    password: "admin123",
    user: {
      id: "1",
      username: "admin",
      role: "admin",
      permissions: ["all"],
    },
  },
  manager: {
    password: "manager123",
    user: {
      id: "2",
      username: "manager",
      role: "manager",
      permissions: ["orders", "clients", "reports"],
    },
  },
  cashier: {
    password: "cashier123",
    user: {
      id: "3",
      username: "cashier",
      role: "cashier",
      permissions: ["orders"],
    },
  },
  kassir: {
    password: "kassir123",
    user: {
      id: "4",
      username: "kassir",
      role: "cashier",
      permissions: ["orders", "services", "clients"],
    },
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Проверяем сохраненную сессию
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    const testUser = testUsers[username]

    if (testUser && testUser.password === password) {
      setUser(testUser.user)
      localStorage.setItem("user", JSON.stringify(testUser.user))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions.includes("all") || user.permissions.includes(permission)
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    hasPermission,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
