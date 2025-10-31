"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DatePickerProps {
  value: string
  onChange: (date: Date | string) => void // Поддержка Date и string
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
  const [inputValue, setInputValue] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      // Если value в формате ISO (YYYY-MM-DD), конвертируем в DD.MM.YYYY
      if (value.includes("-") && value.length === 10) {
        const [year, month, day] = value.split("-")
        setInputValue(`${day}.${month}.${year}`)
      } else {
        setInputValue(value)
      }
    } else {
      setInputValue("")
    }
  }, [value])

  const getMaxDaysInMonth = (month: number, year: number): number => {
    // month: 1-12
    if (month === 2) {
      // Февраль - проверка на високосный год
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
      return isLeapYear ? 29 : 28
    }
    // Апрель, июнь, сентябрь, ноябрь - 30 дней
    if ([4, 6, 9, 11].includes(month)) {
      return 30
    }
    // Остальные месяцы - 31 день
    return 31
  }

  const parseValue = (val: string): Date | null => {
    if (!val) return null

    // Поддержка формата DD.MM.YYYY
    if (val.includes(".")) {
      const parts = val.split(".")
      if (parts.length !== 3) return null
      const day = Number.parseInt(parts[0], 10)
      const month = Number.parseInt(parts[1], 10) - 1
      const year = Number.parseInt(parts[2], 10)
      const date = new Date(year, month, day)
      return isNaN(date.getTime()) ? null : date
    }

    // Поддержка формата ISO (YYYY-MM-DD)
    if (val.includes("-")) {
      const date = new Date(val)
      return isNaN(date.getTime()) ? null : date
    }

    return null
  }

  const selectedDate = parseValue(inputValue || value)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d]/g, "") // Remove non-digits

    // Validate day based on month and year
    if (val.length >= 2) {
      const day = Number.parseInt(val.slice(0, 2), 10)

      // Ограничение дня от 1 до 31
      if (day > 31) {
        val = "31" + val.slice(2)
      } else if (day === 0) {
        val = "01" + val.slice(2)
      }

      // Если есть месяц и год, проверяем максимальное количество дней
      if (val.length >= 4) {
        const month = Number.parseInt(val.slice(2, 4), 10)

        // Ограничение месяца от 1 до 12
        if (month > 12) {
          val = val.slice(0, 2) + "12" + val.slice(4)
        } else if (month === 0 && val.length > 2) {
          val = val.slice(0, 2) + "01" + val.slice(4)
        }

        // Если есть год, проверяем день для конкретного месяца
        if (val.length >= 8 && month >= 1 && month <= 12) {
          const year = Number.parseInt(val.slice(4, 8), 10)
          const maxDays = getMaxDaysInMonth(month, year)
          const currentDay = Number.parseInt(val.slice(0, 2), 10)

          if (currentDay > maxDays) {
            val = maxDays.toString().padStart(2, "0") + val.slice(2)
          }
        }
      }
    }

    // Apply mask: DD.MM.YYYY
    if (val.length >= 2) {
      val = val.slice(0, 2) + "." + val.slice(2)
    }
    if (val.length >= 5) {
      val = val.slice(0, 5) + "." + val.slice(5)
    }
    if (val.length > 10) {
      val = val.slice(0, 10)
    }

    setInputValue(val)

    // Validate and call onChange if date is complete and valid
    if (val.length === 10) {
      const parsedDate = parseValue(val)
      if (parsedDate && !isNaN(parsedDate.getTime())) {
        // Check if date is valid (e.g., not 32.13.2024)
        const [day, month, year] = val.split(".").map(Number)
        const testDate = new Date(year, month - 1, day)
        if (testDate.getDate() === day && testDate.getMonth() === month - 1 && testDate.getFullYear() === year) {
          onChange(parsedDate)
        }
      }
    }
  }

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

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
        <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 bg-white">
          <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="flex-1 text-sm text-gray-900 placeholder:text-gray-500 outline-none bg-transparent"
              maxLength={10}
          />
          <button type="button" onClick={handleIconClick} className="ml-2 flex-shrink-0 focus:outline-none">
            {icon}
          </button>
        </div>

        {isOpen && (
            <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64">
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