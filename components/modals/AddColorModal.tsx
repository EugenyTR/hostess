"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, Palette, Target, Pipette, Clock, Trash2 } from "lucide-react"
import ConfirmExitModal from "./ConfirmExitModal"

interface Color {
  id: number
  name: string
  hexCode?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AddColorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (colorData: { name: string; hexCode?: string }) => void
  color?: Color | null
}

type ColorFormat = "HEX" | "RGB" | "HSL"

interface RecentColor {
  hex: string
  timestamp: number
  source: "eyedropper" | "wheel" | "preset"
}

const PRESET_COLORS = [
  { name: "Черный", hex: "#000000" },
  { name: "Белый", hex: "#FFFFFF" },
  { name: "Красный", hex: "#FF0000" },
  { name: "Зеленый", hex: "#00FF00" },
  { name: "Синий", hex: "#0000FF" },
  { name: "Желтый", hex: "#FFFF00" },
  { name: "Оранжевый", hex: "#FFA500" },
  { name: "Фиолетовый", hex: "#800080" },
  { name: "Розовый", hex: "#FFC0CB" },
  { name: "Коричневый", hex: "#A52A2A" },
  { name: "Серый", hex: "#808080" },
  { name: "Темно-синий", hex: "#000080" },
  { name: "Темно-зеленый", hex: "#006400" },
  { name: "Бордовый", hex: "#800000" },
  { name: "Золотой", hex: "#FFD700" },
  { name: "Серебряный", hex: "#C0C0C0" },
  { name: "Бежевый", hex: "#F5F5DC" },
  { name: "Кремовый", hex: "#FFFDD0" },
  { name: "Лавандовый", hex: "#E6E6FA" },
  { name: "Мятный", hex: "#98FB98" },
  { name: "Персиковый", hex: "#FFCBA4" },
  { name: "Голубой", hex: "#87CEEB" },
  { name: "Лимонный", hex: "#FFFACD" },
  { name: "Малиновый", hex: "#DC143C" },
]

// Утилиты для работы с localStorage
const RECENT_COLORS_KEY = "colorModal_recentColors"
const MAX_RECENT_COLORS = 12

const saveRecentColors = (colors: RecentColor[]) => {
  try {
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(colors))
  } catch (error) {
    console.warn("Failed to save recent colors:", error)
  }
}

const loadRecentColors = (): RecentColor[] => {
  try {
    const saved = localStorage.getItem(RECENT_COLORS_KEY)
    if (saved) {
      const colors = JSON.parse(saved) as RecentColor[]
      // Фильтруем цвета старше 30 дней
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
      return colors.filter((color) => color.timestamp > thirtyDaysAgo)
    }
  } catch (error) {
    console.warn("Failed to load recent colors:", error)
  }
  return []
}

const addRecentColor = (hex: string, source: RecentColor["source"]) => {
  const recentColors = loadRecentColors()

  // Удаляем дубликаты
  const filteredColors = recentColors.filter((color) => color.hex.toLowerCase() !== hex.toLowerCase())

  // Добавляем новый цвет в начало
  const newColor: RecentColor = {
    hex: hex.toUpperCase(),
    timestamp: Date.now(),
    source,
  }

  const updatedColors = [newColor, ...filteredColors].slice(0, MAX_RECENT_COLORS)
  saveRecentColors(updatedColors)

  return updatedColors
}

const clearRecentColors = () => {
  try {
    localStorage.removeItem(RECENT_COLORS_KEY)
  } catch (error) {
    console.warn("Failed to clear recent colors:", error)
  }
}

interface ColorWheelProps {
  onColorSelect: (hex: string) => void
  selectedColor?: string
}

function ColorWheel({ onColorSelect, selectedColor }: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(100)
  const [lightness, setLightness] = useState(50)

  useEffect(() => {
    if (selectedColor) {
      const hsl = hexToHsl(selectedColor)
      if (hsl) {
        setHue(hsl.h)
        setSaturation(hsl.s)
        setLightness(hsl.l)
      }
    }
  }, [selectedColor])

  useEffect(() => {
    drawColorWheel()
  }, [hue, saturation, lightness])

  const hexToHsl = (hex: string) => {
    const r = Number.parseInt(hex.slice(1, 3), 16) / 255
    const g = Number.parseInt(hex.slice(3, 5), 16) / 255
    const b = Number.parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const hslToHex = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    let r, g, b
    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    const toHex = (n: number) =>
      Math.round(n * 255)
        .toString(16)
        .padStart(2, "0")
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  const drawColorWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = 200
    const center = size / 2
    const radius = size / 2 - 10

    canvas.width = size
    canvas.height = size

    // Очистка canvas
    ctx.clearRect(0, 0, size, size)

    // Рисуем цветовое колесо
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = ((angle - 1) * Math.PI) / 180
      const endAngle = (angle * Math.PI) / 180

      ctx.beginPath()
      ctx.arc(center, center, radius, startAngle, endAngle)
      ctx.lineWidth = 20
      ctx.strokeStyle = `hsl(${angle}, 100%, 50%)`
      ctx.stroke()
    }

    // Рисуем внутренний круг с насыщенностью и яркостью
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius - 20)
    gradient.addColorStop(0, `hsl(${hue}, 0%, ${lightness}%)`)
    gradient.addColorStop(1, `hsl(${hue}, 100%, ${lightness}%)`)

    ctx.beginPath()
    ctx.arc(center, center, radius - 20, 0, 2 * Math.PI)
    ctx.fillStyle = gradient
    ctx.fill()

    // Рисуем указатель для оттенка
    const hueAngle = ((hue - 90) * Math.PI) / 180
    const hueX = center + Math.cos(hueAngle) * (radius - 10)
    const hueY = center + Math.sin(hueAngle) * (radius - 10)

    ctx.beginPath()
    ctx.arc(hueX, hueY, 8, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    ctx.stroke()

    // Рисуем указатель для насыщенности/яркости
    const satRadius = (saturation / 100) * (radius - 20)
    const satX = center + Math.cos(0) * satRadius
    const satY = center

    ctx.beginPath()
    ctx.arc(satX, satY, 6, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    ctx.stroke()
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const center = 100
    const radius = 90

    const distance = Math.sqrt((x - center) ** 2 + (y - center) ** 2)

    if (distance > radius - 20 && distance < radius) {
      // Клик по цветовому кольцу (выбор оттенка)
      const angle = (Math.atan2(y - center, x - center) * 180) / Math.PI + 90
      const newHue = angle < 0 ? angle + 360 : angle
      setHue(Math.round(newHue))
    } else if (distance < radius - 20) {
      // Клик по внутреннему кругу (выбор насыщенности)
      const newSaturation = Math.min(100, (distance / (radius - 20)) * 100)
      setSaturation(Math.round(newSaturation))
    }

    const hex = hslToHex(hue, saturation, lightness)
    onColorSelect(hex)
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return
    handleCanvasClick(event)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        className="cursor-crosshair border border-[#e3e3e3] rounded-lg"
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      />

      <div className="w-full space-y-3">
        <div>
          <label className="block text-xs font-medium text-[#7f8189] mb-1">Оттенок</label>
          <input
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => {
              const newHue = Number.parseInt(e.target.value)
              setHue(newHue)
              onColorSelect(hslToHex(newHue, saturation, lightness))
            }}
            className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 rounded-lg appearance-none cursor-pointer"
            style={{
              background:
                "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
            }}
          />
          <div className="text-xs text-[#7f8189] mt-1">{hue}°</div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#7f8189] mb-1">Насыщенность</label>
          <input
            type="range"
            min="0"
            max="100"
            value={saturation}
            onChange={(e) => {
              const newSaturation = Number.parseInt(e.target.value)
              setSaturation(newSaturation)
              onColorSelect(hslToHex(hue, newSaturation, lightness))
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`,
            }}
          />
          <div className="text-xs text-[#7f8189] mt-1">{saturation}%</div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#7f8189] mb-1">Яркость</label>
          <input
            type="range"
            min="0"
            max="100"
            value={lightness}
            onChange={(e) => {
              const newLightness = Number.parseInt(e.target.value)
              setLightness(newLightness)
              onColorSelect(hslToHex(hue, saturation, newLightness))
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`,
            }}
          />
          <div className="text-xs text-[#7f8189] mt-1">{lightness}%</div>
        </div>
      </div>
    </div>
  )
}

interface EyeDropperProps {
  onColorSelect: (hex: string) => void
  isActive: boolean
  onToggle: () => void
}

function EyeDropper({ onColorSelect, isActive, onToggle }: EyeDropperProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [isPickingColor, setIsPickingColor] = useState(false)

  useEffect(() => {
    // Проверяем поддержку EyeDropper API
    setIsSupported("EyeDropper" in window)
  }, [])

  const handleEyeDropper = async () => {
    if (!isSupported) {
      // Fallback для браузеров без поддержки EyeDropper API
      handleFallbackColorPicker()
      return
    }

    try {
      setIsPickingColor(true)
      // @ts-ignore - EyeDropper API может не быть в типах
      const eyeDropper = new window.EyeDropper()
      const result = await eyeDropper.open()

      if (result?.sRGBHex) {
        onColorSelect(result.sRGBHex)
        onToggle() // Закрываем режим пипетки после выбора
      }
    } catch (error) {
      // Пользователь отменил выбор или произошла ошибка
      console.log("Color picking cancelled or failed:", error)
    } finally {
      setIsPickingColor(false)
    }
  }

  const handleFallbackColorPicker = () => {
    // Создаем скрытый input[type="color"] для fallback
    const colorInput = document.createElement("input")
    colorInput.type = "color"
    colorInput.style.position = "absolute"
    colorInput.style.left = "-9999px"
    colorInput.style.opacity = "0"

    colorInput.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement
      if (target.value) {
        onColorSelect(target.value)
        onToggle()
      }
      document.body.removeChild(colorInput)
    })

    colorInput.addEventListener("blur", () => {
      // Удаляем элемент если пользователь не выбрал цвет
      setTimeout(() => {
        if (document.body.contains(colorInput)) {
          document.body.removeChild(colorInput)
        }
      }, 100)
    })

    document.body.appendChild(colorInput)
    colorInput.click()
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={handleEyeDropper}
        disabled={isPickingColor}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          isActive || isPickingColor
            ? "bg-[#2055a4] text-white shadow-lg"
            : "bg-[#f7f7f7] text-[#2c2c33] hover:bg-[#e3e3e3]"
        } ${isPickingColor ? "cursor-wait" : "cursor-pointer"}`}
        title={isSupported ? "Выбрать цвет с экрана" : "Выбрать цвет (системный выбор)"}
      >
        <Pipette size={16} className={isPickingColor ? "animate-pulse" : ""} />
        {isPickingColor ? "Выберите цвет..." : "Пипетка"}
      </button>

      <p className="text-xs text-[#7f8189] text-center max-w-32">
        {isSupported ? "Нажмите и выберите любой цвет на экране" : "Откроется системный выбор цвета"}
      </p>

      {isPickingColor && <div className="text-xs text-[#2055a4] text-center animate-pulse">Нажмите ESC для отмены</div>}
    </div>
  )
}

interface RecentColorsProps {
  onColorSelect: (hex: string) => void
  onUpdate: () => void
}

function RecentColors({ onColorSelect, onUpdate }: RecentColorsProps) {
  const [recentColors, setRecentColors] = useState<RecentColor[]>([])

  useEffect(() => {
    setRecentColors(loadRecentColors())
  }, [])

  const handleClearHistory = () => {
    clearRecentColors()
    setRecentColors([])
    onUpdate()
  }

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "только что"
    if (minutes < 60) return `${minutes} мин назад`
    if (hours < 24) return `${hours} ч назад`
    if (days < 7) return `${days} дн назад`
    return new Date(timestamp).toLocaleDateString()
  }

  const getSourceIcon = (source: RecentColor["source"]) => {
    switch (source) {
      case "eyedropper":
        return <Pipette size={10} />
      case "wheel":
        return <Target size={10} />
      case "preset":
        return <Palette size={10} />
      default:
        return null
    }
  }

  const getSourceName = (source: RecentColor["source"]) => {
    switch (source) {
      case "eyedropper":
        return "Пипетка"
      case "wheel":
        return "Колесо"
      case "preset":
        return "Палитра"
      default:
        return "Неизвестно"
    }
  }

  if (recentColors.length === 0) {
    return (
      <div className="text-center py-8 text-[#7f8189]">
        <Clock size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">Недавние цвета появятся здесь</p>
        <p className="text-xs mt-1">Используйте пипетку, колесо или палитру</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-[#2c2c33]">Недавние цвета</h3>
        <button
          onClick={handleClearHistory}
          className="flex items-center gap-1 text-xs text-[#7f8189] hover:text-red-500 transition-colors"
          title="Очистить историю"
        >
          <Trash2 size={12} />
          Очистить
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
        {recentColors.map((recentColor, index) => (
          <button
            key={`${recentColor.hex}-${recentColor.timestamp}`}
            onClick={() => onColorSelect(recentColor.hex)}
            className="group relative aspect-square rounded border border-[#e3e3e3] hover:scale-110 transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: recentColor.hex }}
            title={`${recentColor.hex} • ${getSourceName(recentColor.source)} • ${formatTimestamp(recentColor.timestamp)}`}
          >
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black bg-opacity-50 rounded p-0.5 text-white">{getSourceIcon(recentColor.source)}</div>
            </div>

            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              <div>{recentColor.hex}</div>
              <div className="text-xs opacity-75">{formatTimestamp(recentColor.timestamp)}</div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-[#7f8189]">Сохраняется до {MAX_RECENT_COLORS} цветов за последние 30 дней</p>
    </div>
  )
}

export default function AddColorModal({ isOpen, onClose, onSave, color }: AddColorModalProps) {
  const [name, setName] = useState("")
  const [colorValue, setColorValue] = useState("")
  const [colorFormat, setColorFormat] = useState<ColorFormat>("HEX")
  const [showConfirmExit, setShowConfirmExit] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [showColorWheel, setShowColorWheel] = useState(false)
  const [showEyeDropper, setShowEyeDropper] = useState(false)
  const [showRecentColors, setShowRecentColors] = useState(false)
  const [recentColorsKey, setRecentColorsKey] = useState(0) // Для принудительного обновления

  const isEditing = !!color

  useEffect(() => {
    if (isOpen) {
      if (color) {
        setName(color.name)
        setColorValue(color.hexCode || "")
        setColorFormat("HEX")
      } else {
        setName("")
        setColorValue("")
        setColorFormat("HEX")
      }
      setHasChanges(false)
      setShowPresets(false)
      setShowColorWheel(false)
      setShowEyeDropper(false)
      setShowRecentColors(false)
      setRecentColorsKey((prev) => prev + 1) // Обновляем недавние цвета при открытии
    }
  }, [isOpen, color])

  useEffect(() => {
    const initialName = color?.name || ""
    const initialColorValue = color?.hexCode || ""
    setHasChanges(name !== initialName || colorValue !== initialColorValue)
  }, [name, colorValue, color])

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirmExit(true)
    } else {
      onClose()
    }
  }

  const handleConfirmExit = () => {
    setShowConfirmExit(false)
    onClose()
  }

  const handleSave = () => {
    if (name.trim() && isValidColor(colorValue, colorFormat)) {
      const hexCode = convertToHex(colorValue, colorFormat)
      onSave({
        name: name.trim(),
        hexCode: hexCode || undefined,
      })
    }
  }

  // Валидация цветов
  const isValidHex = (hex: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
  }

  const isValidRGB = (rgb: string) => {
    const rgbPattern = /^rgb$$\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*$$$/
    const match = rgb.match(rgbPattern)
    if (!match) return false
    const [, r, g, b] = match
    return Number.parseInt(r) <= 255 && Number.parseInt(g) <= 255 && Number.parseInt(b) <= 255
  }

  const isValidHSL = (hsl: string) => {
    const hslPattern = /^hsl$$\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*$$$/
    const match = hsl.match(hslPattern)
    if (!match) return false
    const [, h, s, l] = match
    return Number.parseInt(h) <= 360 && Number.parseInt(s) <= 100 && Number.parseInt(l) <= 100
  }

  const isValidColor = (value: string, format: ColorFormat) => {
    switch (format) {
      case "HEX":
        return isValidHex(value)
      case "RGB":
        return isValidRGB(value)
      case "HSL":
        return isValidHSL(value)
      default:
        return false
    }
  }

  // Конвертация в HEX
  const convertToHex = (value: string, format: ColorFormat): string | null => {
    switch (format) {
      case "HEX":
        return isValidHex(value) ? value : null
      case "RGB":
        return rgbToHex(value)
      case "HSL":
        return hslToHex(value)
      default:
        return null
    }
  }

  const rgbToHex = (rgb: string): string | null => {
    const match = rgb.match(/^rgb$$\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*$$$/)
    if (!match) return null
    const [, r, g, b] = match
    const toHex = (n: number) => n.toString(16).padStart(2, "0")
    return `#${toHex(Number.parseInt(r))}${toHex(Number.parseInt(g))}${toHex(Number.parseInt(b))}`
  }

  const hslToHex = (hsl: string): string | null => {
    const match = hsl.match(/^hsl$$\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*$$$/)
    if (!match) return null
    const [, h, s, l] = match
    const hue = Number.parseInt(h) / 360
    const saturation = Number.parseInt(s) / 100
    const lightness = Number.parseInt(l) / 100

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    let r, g, b
    if (saturation === 0) {
      r = g = b = lightness
    } else {
      const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation
      const p = 2 * lightness - q
      r = hue2rgb(p, q, hue + 1 / 3)
      g = hue2rgb(p, q, hue)
      b = hue2rgb(p, q, hue - 1 / 3)
    }

    const toHex = (n: number) =>
      Math.round(n * 255)
        .toString(16)
        .padStart(2, "0")
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  const handleColorValueChange = (value: string) => {
    if (colorFormat === "HEX" && !value.startsWith("#")) {
      value = "#" + value
    }
    setColorValue(value)
  }

  const handleFormatChange = (format: ColorFormat) => {
    setColorFormat(format)
    setColorValue("")
  }

  const handlePresetSelect = (preset: { name: string; hex: string }) => {
    setName(preset.name)
    setColorValue(preset.hex)
    setColorFormat("HEX")
    setShowPresets(false)

    // Сохраняем в недавние цвета
    addRecentColor(preset.hex, "preset")
    setRecentColorsKey((prev) => prev + 1)
  }

  const handleColorWheelSelect = (hex: string) => {
    setColorValue(hex)
    setColorFormat("HEX")

    // Сохраняем в недавние цвета
    addRecentColor(hex, "wheel")
    setRecentColorsKey((prev) => prev + 1)
  }

  const handleEyeDropperSelect = (hex: string) => {
    setColorValue(hex)
    setColorFormat("HEX")
    setShowEyeDropper(false)

    // Сохраняем в недавние цвета
    addRecentColor(hex, "eyedropper")
    setRecentColorsKey((prev) => prev + 1)
  }

  const handleRecentColorSelect = (hex: string) => {
    setColorValue(hex)
    setColorFormat("HEX")
  }

  const toggleEyeDropper = () => {
    setShowEyeDropper(!showEyeDropper)
    setShowColorWheel(false)
    setShowPresets(false)
    setShowRecentColors(false)
  }

  const getPlaceholder = () => {
    switch (colorFormat) {
      case "HEX":
        return "#000000"
      case "RGB":
        return "rgb(255, 0, 0)"
      case "HSL":
        return "hsl(0, 100%, 50%)"
      default:
        return ""
    }
  }

  const getPreviewColor = () => {
    const hexColor = convertToHex(colorValue, colorFormat)
    return hexColor || "#cccccc"
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#2c2c33]">
              {isEditing ? "Редактирование цвета" : "Добавление цвета"}
            </h2>
            <button onClick={handleClose} className="text-[#7f8189] hover:text-[#2c2c33] transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2c2c33] mb-2">
                  Наименование <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите название цвета"
                  className="w-full px-3 py-3 border border-[#e3e3e3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c2c33] mb-2">Формат цвета</label>
                <div className="flex gap-2 mb-3">
                  {(["HEX", "RGB", "HSL"] as ColorFormat[]).map((format) => (
                    <button
                      key={format}
                      onClick={() => handleFormatChange(format)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        colorFormat === format
                          ? "bg-[#2055a4] text-white"
                          : "bg-[#f7f7f7] text-[#2c2c33] hover:bg-[#e3e3e3]"
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={colorValue}
                    onChange={(e) => handleColorValueChange(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="flex-1 px-3 py-3 border border-[#e3e3e3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
                  />
                  <div
                    className="w-12 h-12 rounded-lg border border-[#e3e3e3] flex items-center justify-center"
                    style={{ backgroundColor: getPreviewColor() }}
                  >
                    {!isValidColor(colorValue, colorFormat) && colorValue && (
                      <Palette size={16} className="text-white opacity-50" />
                    )}
                  </div>
                </div>

                {colorValue && !isValidColor(colorValue, colorFormat) && (
                  <p className="text-red-500 text-sm mt-1">
                    Неверный формат {colorFormat}
                    {colorFormat === "RGB" && " (пример: rgb(255, 0, 0))"}
                    {colorFormat === "HSL" && " (пример: hsl(0, 100%, 50%))"}
                    {colorFormat === "HEX" && " (пример: #FF0000)"}
                  </p>
                )}

                {colorValue && isValidColor(colorValue, colorFormat) && colorFormat !== "HEX" && (
                  <p className="text-[#7f8189] text-sm mt-1">HEX: {convertToHex(colorValue, colorFormat)}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-[#2c2c33]">Способы выбора</label>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        setShowEyeDropper(!showEyeDropper)
                        setShowColorWheel(false)
                        setShowPresets(false)
                        setShowRecentColors(false)
                      }}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        showEyeDropper ? "text-[#2055a4]" : "text-[#7f8189] hover:text-[#2055a4]"
                      }`}
                    >
                      <Pipette size={14} />
                      Пипетка
                    </button>
                    <button
                      onClick={() => {
                        setShowColorWheel(!showColorWheel)
                        setShowEyeDropper(false)
                        setShowPresets(false)
                        setShowRecentColors(false)
                      }}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        showColorWheel ? "text-[#2055a4]" : "text-[#7f8189] hover:text-[#2055a4]"
                      }`}
                    >
                      <Target size={14} />
                      Колесо
                    </button>
                    <button
                      onClick={() => {
                        setShowPresets(!showPresets)
                        setShowColorWheel(false)
                        setShowEyeDropper(false)
                        setShowRecentColors(false)
                      }}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        showPresets ? "text-[#2055a4]" : "text-[#7f8189] hover:text-[#2055a4]"
                      }`}
                    >
                      <Palette size={14} />
                      Палитра
                    </button>
                    <button
                      onClick={() => {
                        setShowRecentColors(!showRecentColors)
                        setShowColorWheel(false)
                        setShowEyeDropper(false)
                        setShowPresets(false)
                      }}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        showRecentColors ? "text-[#2055a4]" : "text-[#7f8189] hover:text-[#2055a4]"
                      }`}
                    >
                      <Clock size={14} />
                      Недавн��е
                    </button>
                  </div>
                </div>

                {showPresets && (
                  <div className="border border-[#e3e3e3] rounded-lg p-4 bg-[#f7f7f7]">
                    <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                      {PRESET_COLORS.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => handlePresetSelect(preset)}
                          className="group relative w-8 h-8 rounded border border-[#e3e3e3] hover:scale-110 transition-transform"
                          style={{ backgroundColor: preset.hex }}
                          title={`${preset.name} (${preset.hex})`}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {preset.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {showRecentColors && (
                  <div className="border border-[#e3e3e3] rounded-lg p-4 bg-[#f7f7f7]">
                    <RecentColors
                      key={recentColorsKey}
                      onColorSelect={handleRecentColorSelect}
                      onUpdate={() => setRecentColorsKey((prev) => prev + 1)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {showColorWheel && (
                <div className="border border-[#e3e3e3] rounded-lg p-4 bg-[#f7f7f7]">
                  <ColorWheel
                    onColorSelect={handleColorWheelSelect}
                    selectedColor={isValidColor(colorValue, colorFormat) ? getPreviewColor() : undefined}
                  />
                </div>
              )}

              {showEyeDropper && (
                <div className="border border-[#e3e3e3] rounded-lg p-4 bg-[#f7f7f7] flex justify-center">
                  <EyeDropper
                    onColorSelect={handleEyeDropperSelect}
                    isActive={showEyeDropper}
                    onToggle={toggleEyeDropper}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={!name.trim() || !isValidColor(colorValue, colorFormat)}
              className="flex-1 bg-[#2055a4] text-white py-3 px-4 rounded-lg hover:bg-[#1a4a94] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Сохранить
            </button>
            <button
              onClick={handleClose}
              className="flex-1 border border-[#e3e3e3] text-[#2c2c33] py-3 px-4 rounded-lg hover:bg-[#f7f7f7] transition-colors"
            >
              Отменить
            </button>
          </div>
        </div>
      </div>

      <ConfirmExitModal
        isOpen={showConfirmExit}
        onClose={() => setShowConfirmExit(false)}
        onConfirm={handleConfirmExit}
      />
    </>
  )
}
