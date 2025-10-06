"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { ChartTooltip } from "./ChartTooltip"
import { useChartAnimation } from "../../hooks/useChartAnimation"

interface DataPoint {
  name: string
  value: number
  color?: string
}

interface BarChartProps {
  data: DataPoint[]
  title?: string
  height?: number
  colors?: string[]
  className?: string
  animated?: boolean
}

export function BarChart({ data, title, height = 200, colors = [], className = "", animated = true }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: null as React.ReactNode,
  })

  // Анимация
  const { progress, startAnimation } = useChartAnimation({
    duration: 1000,
    delay: 200,
    easing: (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart
  })

  // Сохраняем данные о столбцах для интерактивности
  const barsRef = useRef<
    Array<{ x: number; y: number; width: number; height: number; value: number; name: string; color: string }>
  >([])

  useEffect(() => {
    if (animated) {
      startAnimation()
    }
  }, [data, animated])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Очистка холста
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Настройка размеров
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    if (!data || data.length === 0) {
      ctx.fillStyle = "#8e8e8e"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Нет данных для отображения", canvas.width / 2, canvas.height / 2)
      return
    }

    const maxValue = Math.max(...data.map((item) => item.value)) || 1
    const scaledMaxValue = Math.ceil(maxValue * 1.1)

    // Анимированная прозрачность для осей и сетки
    const gridAlpha = animated ? progress * 0.8 : 0.8

    // Рисуем оси с анимацией
    ctx.globalAlpha = gridAlpha
    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.moveTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Рисуем горизонтальные линии сетки и метки оси Y
    const ySteps = 5
    ctx.textAlign = "right"
    ctx.font = "10px Arial"
    ctx.fillStyle = "#9ca3af"
    for (let i = 0; i <= ySteps; i++) {
      const y = padding + (chartHeight * i) / ySteps
      const value = Math.round(scaledMaxValue - (scaledMaxValue * i) / ySteps)

      ctx.beginPath()
      ctx.strokeStyle = "#f3f4f6"
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()

      ctx.fillText(value.toString(), padding - 5, y + 3)
    }

    ctx.globalAlpha = 1

    // Очищаем предыдущие столбцы
    barsRef.current = []

    // Рисуем столбцы с анимацией
    const barWidth = (chartWidth / data.length) * 0.8
    const barSpacing = (chartWidth / data.length) * 0.2

    data.forEach((item, index) => {
      const defaultColors = ["#2055a4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
      const color = colors[index] || item.color || defaultColors[index % defaultColors.length]

      const fullBarHeight = (chartHeight * item.value) / scaledMaxValue

      // Анимация высоты столбца
      const barProgress = animated ? Math.max(0, Math.min(1, (progress - index * 0.1) / 0.8)) : 1
      const animatedBarHeight = fullBarHeight * barProgress

      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2
      const y = canvas.height - padding - animatedBarHeight

      if (animatedBarHeight > 0) {
        // Создаем градиент для столбца
        const gradient = ctx.createLinearGradient(0, y, 0, y + animatedBarHeight)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, color + "CC") // ��обавляем прозрачность

        // Тень столбца
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
        ctx.fillRect(x + 2, y + 2, barWidth, animatedBarHeight)

        // Основной столбец
        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth, animatedBarHeight)

        // Блик на столбце
        const highlightGradient = ctx.createLinearGradient(x, y, x + barWidth / 3, y)
        highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.3)")
        highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        ctx.fillStyle = highlightGradient
        ctx.fillRect(x, y, barWidth / 3, animatedBarHeight)

        // Сохраняем информацию о столбце для интерактивности
        barsRef.current.push({
          x,
          y,
          width: barWidth,
          height: animatedBarHeight,
          value: item.value,
          name: item.name,
          color,
        })

        // Анимиров��нн��е значение над столбцом
        if (barProgress > 0.7) {
          const valueAlpha = (barProgress - 0.7) / 0.3
          ctx.globalAlpha = valueAlpha
          ctx.fillStyle = "#4b5563"
          ctx.textAlign = "center"
          ctx.font = "bold 11px Arial"
          ctx.fillText(item.value.toString(), x + barWidth / 2, y - 8)
          ctx.globalAlpha = 1
        }
      }

      // Подпись под столбцом (появляется в конце)
      if (barProgress > 0.8) {
        const labelAlpha = (barProgress - 0.8) / 0.2
        ctx.globalAlpha = labelAlpha
        ctx.fillStyle = "#9ca3af"
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        const maxLabelLength = 10
        const label = item.name.length > maxLabelLength ? item.name.substring(0, maxLabelLength) + "..." : item.name
        ctx.fillText(label, x + barWidth / 2, canvas.height - padding + 15)
        ctx.globalAlpha = 1
      }
    })

    // Добавляем заголовок с анимацией появления
    if (title) {
      ctx.globalAlpha = animated ? progress : 1
      ctx.font = "bold 16px Arial"
      ctx.fillStyle = "#1f2937"
      ctx.textAlign = "center"
      ctx.fillText(title, canvas.width / 2, 25)
      ctx.globalAlpha = 1
    }
  }, [data, title, height, colors, progress, animated])

  // Обработчик движения мыши для отображения подсказок
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !containerRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const bar = barsRef.current.find((b) => x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height)

    if (bar) {
      setTooltip({
        visible: true,
        x: bar.x + bar.width / 2,
        y: bar.y,
        content: (
          <div className="flex flex-col items-center">
            <div className="font-medium">{bar.name}</div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bar.color }} />
              <span className="font-semibold">{bar.value}</span>
            </div>
          </div>
        ),
      })
    } else {
      setTooltip((prev) => ({ ...prev, visible: false }))
    }
  }

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }

  return (
    <div
      ref={containerRef}
      className={`bg-white rounded-lg p-4 relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} width={800} height={height} className="w-full" />
      <ChartTooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y} content={tooltip.content} />
    </div>
  )
}
