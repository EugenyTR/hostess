"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItemProps {
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  onClick?: () => void
}

export default function NavItem({ href, icon: Icon, label, onClick }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center py-2 px-4 ${
        isActive ? "bg-[#c8cadb]" : "hover:bg-[#c8cadb]"
      } rounded-md transition-colors`}
    >
      <Icon size={20} className="text-[#2c2c33] mr-3" />
      <span className={`text-sm ${isActive ? "text-[#2055a4] font-medium" : "text-[#2c2c33]"}`}>{label}</span>
    </Link>
  )
}
