"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface TooltipProps {
  visible: boolean
  x: number
  y: number
  content: React.ReactNode
}

export function ChartTooltip({ visible, x, y, content }: TooltipProps) {
  const [position, setPosition] = useState({ x, y })

  useEffect(() => {
    // Плавное обновление позиции для анимации
    if (visible) {
      setPosition({ x, y })
    }
  }, [x, y, visible])

  if (!visible) return null

  return (
    <div
      className="absolute z-50 bg-white rounded-md shadow-lg border border-gray-200 p-2 text-sm transition-all duration-150 transform"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%)",
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
      }}
    >
      {content}
    </div>
  )
}
