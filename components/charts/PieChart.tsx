"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { ChartTooltip } from "./ChartTooltip"
import { useChartAnimation } from "../../hooks/useChartAnimation"

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface PieChartProps {
  data: DataPoint[]
  title?: string
  size?: number
  className?: string
  showLegend?: boolean
  animated?: boolean
}

export function PieChart({
  data,
  title,
  size = 200,
  className = "",
  showLegend = true,
  animated = true,
}: PieChartProps) {
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
    duration: 1500,
    delay: 300,
    easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
  })

  // Сохраняем данные о секторах для интерактивности
  const sectorsRef = useRef<
    Array<{
      startAngle: number
      endAngle: number
      value: number
      label: string
      color: string
      centerX: number
      centerY: number
      radius: number
      percentage: number
    }>
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

    if (!data || data.length === 0) {
      ctx.fillStyle = "#8e8e8e"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Нет данных для отображения", canvas.width / 2, canvas.height / 2)
      return
    }

    // Настройка размеров
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = Math.min(centerX, centerY) - 40
    const animatedRadius = animated ? maxRadius * progress : maxRadius

    // Вычисляем общую сумму значений
    const total = data.reduce((sum, point) => sum + point.value, 0) || 1

    // Очищаем предыдущие секторы
    sectorsRef.current = []

    // Рисуем секторы с анимацией
    let currentAngle = -Math.PI / 2 // Начинаем с верхней точки
    const totalAngle = 2 * Math.PI * (animated ? progress : 1)

    const defaultColors = ["#2055a4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

    data.forEach((point, i) => {
      const sliceAngle = (2 * Math.PI * point.value) / total
      const animatedSliceAngle = Math.min(sliceAngle, Math.max(0, totalAngle - (currentAngle + Math.PI / 2)))

      if (animatedSliceAngle > 0) {
        const endAngle = currentAngle + animatedSliceAngle

        // Определяем цвет сектора
        const color = point.color || defaultColors[i % defaultColors.length]

        // Создаем градиент для сектора
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, animatedRadius)
        gradient.addColorStop(0, color + "FF")
        gradient.addColorStop(0.7, color + "DD")
        gradient.addColorStop(1, color + "AA")

        // Рисуем тень сектора
        ctx.save()
        ctx.translate(2, 2)
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, animatedRadius, currentAngle, endAngle)
        ctx.closePath()
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
        ctx.fill()
        ctx.restore()

        // Рисуем основной сектор
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, animatedRadius, currentAngle, endAngle)
        ctx.closePath()
        ctx.fillStyle = gradient
        ctx.fill()

        // Обводка сектора
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, animatedRadius, currentAngle, endAngle)
        ctx.closePath()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()

        // Сохраняем информацию о секторе для интерактивности
        const percentage = Math.round((point.value / total) * 100)
        sectorsRef.current.push({
          startAngle: currentAngle,
          endAngle,
          value: point.value,
          label: point.label,
          color,
          centerX,
          centerY,
          radius: animatedRadius,
          percentage,
        })

        // Добавляем процент в середину сектора, если сектор достаточно большой и анимация почти завершена
        if (animatedSliceAngle > 0.3 && progress > 0.8) {
          const textAlpha = (progress - 0.8) / 0.2
          const percentText = percentage + "%"
          const textAngle = currentAngle + animatedSliceAngle / 2
          const textRadius = animatedRadius * 0.7
          const textX = centerX + textRadius * Math.cos(textAngle)
          const textY = centerY + textRadius * Math.sin(textAngle)

          ctx.globalAlpha = textAlpha
          ctx.font = "bold 12px Arial"
          ctx.fillStyle = "#ffffff"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
          ctx.lineWidth = 3
          ctx.strokeText(percentText, textX, textY)
          ctx.fillText(percentText, textX, textY)
          ctx.globalAlpha = 1
        }
      }

      currentAngle += sliceAngle
    })

    // Добавляем заголовок с анимацией появления
    if (title) {
      ctx.globalAlpha = animated ? progress : 1
      ctx.font = "bold 16px Arial"
      ctx.fillStyle = "#1f2937"
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(title, canvas.width / 2, 15)
      ctx.globalAlpha = 1
    }

    // Рисуем легенду с анимацией, если нужно
    if (showLegend && progress > 0.6) {
      const legendAlpha = (progress - 0.6) / 0.4
      ctx.globalAlpha = legendAlpha

      const legendX = canvas.width - 150
      const legendY = 40
      const legendItemHeight = 20

      data.forEach((point, i) => {
        const color = point.color || defaultColors[i % defaultColors.length]
        const y = legendY + i * legendItemHeight

        // Цветной квадрат
        ctx.fillStyle = color
        ctx.fillRect(legendX, y, 12, 12)

        // Текст
        ctx.font = "12px Arial"
        ctx.fillStyle = "#4b5563"
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
        ctx.fillText(`${point.label} (${Math.round((point.value / total) * 100)}%)`, legendX + 20, y)
      })

      ctx.globalAlpha = 1
    }
  }, [data, title, size, showLegend, progress, animated])

  // Функция для проверки, находится ли точка в секторе
  const isPointInSector = (x: number, y: number, sector: (typeof sectorsRef.current)[0]) => {
    const dx = x - sector.centerX
    const dy = y - sector.centerY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > sector.radius) return false

    let angle = Math.atan2(dy, dx)
    if (angle < 0) angle += 2 * Math.PI

    // Нормализуем углы сектора
    let startAngle = sector.startAngle
    let endAngle = sector.endAngle

    if (startAngle < 0) startAngle += 2 * Math.PI
    if (endAngle < 0) endAngle += 2 * Math.PI

    if (startAngle <= endAngle) {
      return angle >= startAngle && angle <= endAngle
    } else {
      return angle >= startAngle || angle <= endAngle
    }
  }

  // Обработчик движения мыши для отображения подсказок
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !containerRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const sector = sectorsRef.current.find((s) => isPointInSector(x, y, s))

    if (sector) {
      const tooltipAngle = sector.startAngle + (sector.endAngle - sector.startAngle) / 2
      const tooltipDistance = sector.radius * 0.8
      const tooltipX = sector.centerX + tooltipDistance * Math.cos(tooltipAngle)
      const tooltipY = sector.centerY + tooltipDistance * Math.sin(tooltipAngle)

      setTooltip({
        visible: true,
        x: tooltipX,
        y: tooltipY,
        content: (
          <div className="flex flex-col items-center">
            <div className="font-medium">{sector.label}</div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
              <span className="font-semibold">
                {sector.value} ({sector.percentage}%)
              </span>
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
      <canvas ref={canvasRef} width={size} height={size} className="w-full" />
      <ChartTooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y} content={tooltip.content} />
    </div>
  )
}
