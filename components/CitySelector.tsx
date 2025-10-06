"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, MapPin } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import type { City } from "@/types"

interface CitySelectorProps {
  value?: number | null
  onChange: (cityId: number | null, cityName: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  showOnlyActive?: boolean
}

export function CitySelector({
  value,
  onChange,
  placeholder = "Выберите город",
  className = "",
  disabled = false,
  showOnlyActive = true,
}: CitySelectorProps) {
  const { cities } = useAppContext()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const availableCities = cities.filter((city) => {
    if (showOnlyActive && !city.isActive) return false
    if (searchTerm) {
      return (
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (city.region && city.region.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    return true
  })

  const selectedCity = cities.find((city) => city.id === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleCitySelect = (city: City) => {
    onChange(city.id, city.name)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleClear = () => {
    onChange(null, "")
    setIsOpen(false)
    setSearchTerm("")
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`flex items-center justify-between border border-[#e3e3e3] rounded-lg px-3 py-2 cursor-pointer bg-white ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-[#2055a4]"
        } transition-colors`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center flex-1">
          <MapPin className="h-4 w-4 text-[#8e8e8e] mr-2" />
          <span className={`text-sm ${selectedCity ? "text-[#2c2c33]" : "text-[#8e8e8e]"}`}>
            {selectedCity ? selectedCity.name : placeholder}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-[#8e8e8e] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-[#e3e3e3] rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Поиск */}
          <div className="p-2 border-b border-[#e3e3e3]">
            <input
              type="text"
              placeholder="Поиск города..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-[#e3e3e3] rounded focus:outline-none focus:ring-1 focus:ring-[#2055a4]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Список городов */}
          <div className="max-h-48 overflow-y-auto">
            {value && (
              <div
                className="px-3 py-2 text-sm text-[#ef4444] hover:bg-[#fef2f2] cursor-pointer border-b border-[#e3e3e3]"
                onClick={handleClear}
              >
                Очистить выбор
              </div>
            )}

            {availableCities.length > 0 ? (
              availableCities.map((city) => (
                <div
                  key={city.id}
                  className={`px-3 py-2 text-sm hover:bg-[#f8f9fa] cursor-pointer flex items-center justify-between ${
                    city.id === value ? "bg-[#e8f0fe] text-[#2055a4]" : "text-[#2c2c33]"
                  }`}
                  onClick={() => handleCitySelect(city)}
                >
                  <div>
                    <div className="font-medium">{city.name}</div>
                    {city.region && <div className="text-xs text-[#8e8e8e]">{city.region}</div>}
                  </div>
                  {city.clientsCount !== undefined && (
                    <div className="text-xs text-[#8e8e8e]">{city.clientsCount} клиентов</div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-[#8e8e8e] text-center">
                {searchTerm ? "Города не найдены" : "Нет доступных городов"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
