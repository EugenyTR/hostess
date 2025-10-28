"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DatePickerProps {
  value: string
  onChange: (date: Date) => void
  placeholder?: string
  icon?: React.ReactNode
  className?: string
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Выберите дату",
  icon,
  className = "",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Parse the value string (DD.MM.YYYY) to Date
  const parseValue = (val: string): Date | null => {
    if (!val) return null
    const parts = val.split(".")
    if (parts.length !== 3) return null
    const day = Number.parseInt(parts[0], 10)
    const month = Number.parseInt(parts[1], 10) - 1
    const year = Number.parseInt(parts[2], 10)
    const date = new Date(year, month, day)
    return isNaN(date.getTime()) ? null : date
  }

  const selectedDate = parseValue(value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
      days.push(null)
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleDateSelect = (date: Date) => {
    onChange(date)
    setIsOpen(false) // Закрываем календарь после выбора
  }

  const formatMonthYear = (date: Date) => {
    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ]
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="flex items-center justify-between border border-gray-300 rounded-full px-3 py-2 cursor-pointer bg-white text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>{value || placeholder}</span>
        {icon}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 right-0.5 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePreviousMonth} className="p-1 hover:bg-gray-100 rounded" type="button">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium">{formatMonthYear(currentMonth)}</span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded" type="button">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}

            {days.map((day, index) => (
              <div key={index} className="text-center">
                {day ? (
                  <button
                    onClick={() => handleDateSelect(day)}
                    className={`w-8 h-8 rounded-full text-sm ${
                      isSameDay(day, selectedDate) ? "bg-[#2055a4] text-white" : "hover:bg-gray-100 text-gray-900"
                    }`}
                    type="button"
                  >
                    {day.getDate()}
                  </button>
                ) : (
                  <div className="w-8 h-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
