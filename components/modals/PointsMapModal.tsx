"use client"
import { X } from "lucide-react"
import PointsMap from "@/components/PointsMap"
import type { Point } from "@/types"

interface PointsMapModalProps {
  isOpen: boolean
  onClose: () => void
  points: Point[]
  onPointStatistics?: (point: Point) => void
}

export default function PointsMapModal({ isOpen, onClose, points, onPointStatistics }: PointsMapModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b border-[#e0e0e0]">
          <h2 className="text-xl font-semibold text-[#2c2c33]">Карта точек</h2>
          <button onClick={onClose} className="text-[#8e8e8e] hover:text-[#2c2c33] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 h-[calc(100%-80px)]">
          <PointsMap
            points={points}
            onPointClick={onPointStatistics}
            height="100%"
            width="100%"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}
