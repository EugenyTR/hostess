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

interface SimpleDataPoint {
  name: string
  value: number
}

interface LineChartProps {
  data: DataPoint[][] | SimpleDataPoint[]
  labels?: string[]
  title?: string
  height?: number
  colors?: string[]
  className?: string
  animated?: boolean
}

export function LineChart({
  data,
  labels,
  title,
  height = 200,
  colors = [],
  className = "",
  animated = true,
}: LineChartProps) {
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
    duration: 1200,
    delay: 100,
    easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
  })

  // Сохраняем данные о точках для интерактивности
  const pointsRef = useRef<Array<{ x: number; y: number; value: number; label: string; color: string }>>([])

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

    // Нормализация данных
    let normalizedData: DataPoint[][]
    let chartLabels: string[]

    if (Array.isArray(data) && data.length > 0) {
      if (Array.isArray(data[0])) {
        normalizedData = data as DataPoint[][]
        chartLabels = labels || []
      } else {
        const simpleData = data as SimpleDataPoint[]
        normalizedData = [
          simpleData.map((item) => ({
            label: item.name,
            value: item.value,
          })),
        ]
        chartLabels = simpleData.map((item) => item.name)
      }
    } else {
      normalizedData = []
      chartLabels = []
    }

    if (normalizedData.length === 0 || normalizedData[0]?.length === 0) {
      ctx.fillStyle = "#8e8e8e"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Нет данных для отображения", canvas.width / 2, canvas.height / 2)
      return
    }

    // Находим максимальное значение для масштабирования
    let maxValue = 0
    normalizedData.forEach((series) => {
      series.forEach((point) => {
        maxValue = Math.max(maxValue, point.value)
      })
    })
    maxValue = Math.ceil(maxValue * 1.1) || 1

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
      const value = Math.round(maxValue - (maxValue * i) / ySteps)

      // Линия сетки с анимацией
      ctx.beginPath()
      ctx.strokeStyle = "#f3f4f6"
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()

      // Метка оси Y
      ctx.fillText(value.toString(), padding - 5, y + 3)
    }

    // Рисуем метки оси X
    if (chartLabels.length > 0) {
      ctx.textAlign = "center"
      chartLabels.forEach((label, i) => {
        const x = padding + (chartWidth * i) / Math.max(chartLabels.length - 1, 1)
        ctx.fillText(label, x, canvas.height - padding + 15)
      })
    }

    ctx.globalAlpha = 1

    // Очищаем предыдущие точки
    pointsRef.current = []

    // Рисуем линии для каждой серии данных с анимацией
    normalizedData.forEach((series, seriesIndex) => {
      if (!series || series.length === 0) return

      const defaultColors = ["#2055a4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
      const color = colors[seriesIndex] || series[0]?.color || defaultColors[seriesIndex % defaultColors.length]

      // Анимация линии - рисуем только часть линии в зависимости от прогресса
      const animatedLength = animated ? progress : 1
      const pointsToShow = Math.floor(series.length * animatedLength)
      const partialProgress = series.length * animatedLength - pointsToShow

      if (pointsToShow > 0) {
        // Рисуем основную линию
        ctx.beginPath()
        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        for (let i = 0; i < pointsToShow; i++) {
          const point = series[i]
          const x = padding + (chartWidth * i) / Math.max(series.length - 1, 1)
          const y = padding + chartHeight - (chartHeight * point.value) / maxValue

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        // Добавляем частичную линию для плавности
        if (partialProgress > 0 && pointsToShow < series.length) {
          const currentPoint = series[pointsToShow - 1]
          const nextPoint = series[pointsToShow]

          const currentX = padding + (chartWidth * (pointsToShow - 1)) / Math.max(series.length - 1, 1)
          const currentY = padding + chartHeight - (chartHeight * currentPoint.value) / maxValue

          const nextX = padding + (chartWidth * pointsToShow) / Math.max(series.length - 1, 1)
          const nextY = padding + chartHeight - (chartHeight * nextPoint.value) / maxValue

          const partialX = currentX + (nextX - currentX) * partialProgress
          const partialY = currentY + (nextY - currentY) * partialProgress

          ctx.lineTo(partialX, partialY)
        }

        ctx.stroke()

        // Рисуем точки с анимацией масштаба
        for (let i = 0; i < pointsToShow; i++) {
          const point = series[i]
          const x = padding + (chartWidth * i) / Math.max(series.length - 1, 1)
          const y = padding + chartHeight - (chartHeight * point.value) / maxValue

          // Анимация появления точки
          const pointProgress = Math.min((animatedLength * series.length - i) / 1, 1)
          const pointScale = animated ? Math.max(0, pointProgress) : 1
          const pointRadius = 5 * pointScale

          if (pointRadius > 0) {
            // Тень точки
            ctx.beginPath()
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
            ctx.arc(x + 1, y + 1, pointRadius, 0, Math.PI * 2)
            ctx.fill()

            // Основная точка
            ctx.beginPath()
            ctx.fillStyle = color
            ctx.arc(x, y, pointRadius, 0, Math.PI * 2)
            ctx.fill()

            // Белая обводка
            ctx.beginPath()
            ctx.strokeStyle = "#ffffff"
            ctx.lineWidth = 2
            ctx.arc(x, y, pointRadius, 0, Math.PI * 2)
            ctx.stroke()

            // Сохраняем информацию о точке для интерактивности
            pointsRef.current.push({
              x,
              y,
              value: point.value,
              label: chartLabels[i] || point.label || `Точка ${i + 1}`,
              color,
            })
          }
        }
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
  }, [data, labels, title, height, colors, progress, animated])

  // Обработчик движения мыши для отображения подсказок
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !containerRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const point = pointsRef.current.find((p) => Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2)) < 12)

    if (point) {
      setTooltip({
        visible: true,
        x: point.x,
        y: point.y,
        content: (
          <div className="flex flex-col items-center">
            <div className="font-medium">{point.label}</div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: point.color }} />
              <span className="font-semibold">{point.value}</span>
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
