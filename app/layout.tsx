import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/context/AppContext"
import { NotificationProvider } from "@/context/NotificationContext"
import { AuthProvider } from "@/context/AuthContext"
import AppLayout from "@/components/AppLayout"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Хозяюшка CRM",
  description: "CRM система для химчистки",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <NotificationProvider>
          <AuthProvider>
            <AppProvider>
              <AppLayout>{children}</AppLayout>
            </AppProvider>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
