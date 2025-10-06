"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Неверный логин или пароль")
      }
    } catch (err) {
      setError("Произошла ошибка при входе")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#d9dbe7] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        {/* Заголовок */}
        <h1 className="text-xl font-semibold text-center text-[#2c2c33] mb-8">Авторизация в системе</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Поле логина */}
          <div>
            <input
              type="text"
              placeholder="Логин*"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-[#e3e3e3] text-[#2c2c33] placeholder-[#979797] focus:outline-none focus:border-[#2055a4] transition-colors"
              required
            />
          </div>

          {/* Поле пароля */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-full border border-[#e3e3e3] text-[#2c2c33] placeholder-[#979797] focus:outline-none focus:border-[#2055a4] transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#979797] hover:text-[#2c2c33] transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Ошибка */}
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          {/* Чекбокс и ссылка */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 text-[#2055a4] border-[#e3e3e3] rounded focus:ring-[#2055a4] focus:ring-2"
              />
              <span className="ml-2 text-sm text-[#2c2c33]">Запомнить</span>
            </label>
            <button type="button" className="text-sm text-[#979797] hover:text-[#2c2c33] transition-colors">
              Забыли пароль?
            </button>
          </div>

          {/* Кнопка входа */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2055a4] hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-full transition-colors"
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  )
}
