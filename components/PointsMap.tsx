"use client"

import { useEffect, useState } from "react"
import type { Point } from "@/types"

interface PointsMapProps {
  points: Point[]
  onPointClick?: (point: Point) => void
  height?: string
  width?: string
  className?: string
}

export default function PointsMap({
  points,
  onPointClick,
  height = "400px",
  width = "100%",
  className = "",
}: PointsMapProps) {
  const [mapUrl, setMapUrl] = useState("")

  useEffect(() => {
    const pointsWithCoordinates = points.filter((point) => point.coordinates)

    if (pointsWithCoordinates.length === 0) {
      return
    }

    // Находим центр карты (среднее значение координат)
    const avgLat =
      pointsWithCoordinates.reduce((sum, point) => sum + (point.coordinates?.lat || 0), 0) /
      pointsWithCoordinates.length
    const avgLng =
      pointsWithCoordinates.reduce((sum, point) => sum + (point.coordinates?.lng || 0), 0) /
      pointsWithCoordinates.length

    // Создаем URL для встраивания карты OpenStreetMap
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${avgLng - 0.1}%2C${avgLat - 0.1}%2C${avgLng + 0.1}%2C${avgLat + 0.1}&layer=mapnik`
    setMapUrl(url)
  }, [points])

  const pointsWithCoordinates = points.filter((point) => point.coordinates)

  if (pointsWithCoordinates.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height, width }}>
        <div className="text-center text-gray-500">
          <p>Нет точек с координатами для отображения</p>
        </div>
      </div>
    )
  }

  // Добавить проверку на mapUrl перед рендерингом iframe
  if (!mapUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height, width }}>
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Загрузка карты...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ height, width }}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Карта точек"
        className="rounded-lg"
      />
    </div>
  )
}
