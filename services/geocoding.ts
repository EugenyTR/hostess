// Простой сервис геокодирования с использованием Nominatim API (OpenStreetMap)
export interface Coordinates {
  lat: number
  lng: number
}

export interface GeocodeResult {
  coordinates?: {
    lat: number
    lng: number
  }
  address?: string
  error?: string
}

// Функция для получения координат по адресу
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  try {
    // Имитация геокодирования - в реальном при��ожении здесь был бы API вызов
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Возвращаем примерные координаты для демонстрации
    const mockCoordinates = {
      lat: 55.7558 + (Math.random() - 0.5) * 0.1,
      lng: 37.6173 + (Math.random() - 0.5) * 0.1,
    }

    return {
      coordinates: mockCoordinates,
      address: address,
    }
  } catch (error) {
    console.error("Geocoding error:", error)
    return {}
  }
}

// Функция для получения адреса по координатам (обратное геокодирование)
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`

    const response = await fetch(url, {
      headers: {
        "User-Agent": "PointsMap/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.display_name) {
      return {
        coordinates: { lat, lng },
        address: data.display_name,
      }
    } else {
      return {
        coordinates: { lat, lng },
        error: "Адрес не найден",
      }
    }
  } catch (error) {
    console.error("Ошибка обратного геокодирования:", error)
    return {
      coordinates: { lat, lng },
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    }
  }
}

// Функция для валидации координат
export function validateCoordinates(lat: number, lng: number): boolean {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
  )
}

// Функция для вычисления расстояния между двумя точками (в км)
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Радиус Земли в км
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
