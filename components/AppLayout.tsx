"use client"

import type React from "react"

import { useAuth } from "@/context/AuthContext"
import { usePathname } from "next/navigation"
import Sidebar from "./Sidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()

  // Don't show sidebar on login page
  const isLoginPage = pathname === "/login"

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2055a4]"></div>
      </div>
    )
  }

  if (!user && !isLoginPage) {
    return null // This will be handled by ProtectedRoute
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-[220px] md:ml-[220px]">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  )
}
