"use client"

import { useState } from "react"
import { Trophy, ThumbsUp, TrendingUp, AlertTriangle, XCircle, Settings, RefreshCw, UserPlus } from 'lucide-react'
import { useAppContext } from "@/context/AppContext"
import type { RFMSettings, RFMSegment } from "@/types"

export default function RFMAnalysis() {
  const { clients, orders } = useAppContext()
  const [settings, setSettings] = useState<RFMSettings>({
    recencyDays: 90,
    frequencyOrders: 3,
    monetaryAmount: 5000,
  })

  // Функция для расчета RFM сегментов
  const calculateRFMSegments = (): RFMSegment[] => {
    const currentDate = new Date()
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setFullYear(currentDate.getFullYear() - 1)

    // Группируем заказы по клиентам
    const clientStats = clients.map((client) => {
      const clientOrders = orders.filter((order) => order.clientId === client.id)
      
      // Заказы за последние 12 месяцев для F и M
      const ordersLast12Months = clientOrders.filter(order => 
        new Date(order.date) >= twelveMonthsAgo
      )

      // Recency - дни с последнего заказа
      const lastOrderDate =
        clientOrders.length > 0 ? Math.max(...clientOrders.map((order) => new Date(order.date).getTime())) : 0
      const recency =
        lastOrderDate > 0 ? Math.floor((currentDate.getTime() - lastOrderDate) / (1000 * 60 * 60 * 24)) : 999

      // Frequency - количество чеков за 12 месяцев
      const frequency = ordersLast12Months.length

      // Monetary - общая сумма за 12 месяцев
      const monetary = ordersLast12Months.reduce((sum, order) => sum + order.discountedAmount, 0)

      return {
        client,
        recency,
        frequency,
        monetary,
        rfmScore: calculateRFMScore(recency, frequency, monetary),
      }
    })

    // Определяем сегменты по новым критериям
    const champions = clientStats.filter(
      (stat) => stat.recency >= 0 && stat.recency <= 30 && stat.frequency >= 12 && stat.monetary >= 24000,
    )

    const loyalCustomers = clientStats.filter(
      (stat) => 
        stat.recency >= 15 && stat.recency <= 90 && 
        stat.frequency >= 7 && stat.frequency <= 11 && 
        stat.monetary >= 14000 && stat.monetary <= 23999 && 
        !champions.includes(stat),
    )

    const potentialLoyalists = clientStats.filter(
      (stat) =>
        stat.recency >= 0 && stat.recency <= 30 &&
        stat.frequency >= 2 && stat.frequency <= 6 &&
        stat.monetary >= 4000 && stat.monetary <= 13999 &&
        !champions.includes(stat) &&
        !loyalCustomers.includes(stat),
    )

    const atRisk = clientStats.filter(
      (stat) =>
        stat.recency >= 31 && stat.recency <= 180 &&
        stat.frequency >= 4 && stat.frequency <= 11 &&
        stat.monetary >= 8000 &&
        !champions.includes(stat) &&
        !loyalCustomers.includes(stat) &&
        !potentialLoyalists.includes(stat),
    )

    const lost = clientStats.filter(
      (stat) =>
        stat.recency > 360 &&
        stat.frequency >= 1 && stat.frequency <= 3 &&
        stat.monetary < 7999 &&
        !champions.includes(stat) &&
        !loyalCustomers.includes(stat) &&
        !potentialLoyalists.includes(stat) &&
        !atRisk.includes(stat),
    )

    // Новый сегмент - Новички
    const newcomers = clientStats.filter(
      (stat) =>
        stat.recency >= 0 && stat.recency <= 30 &&
        stat.frequency === 1 &&
        stat.monetary >= 1 &&
        !champions.includes(stat) &&
        !loyalCustomers.includes(stat) &&
        !potentialLoyalists.includes(stat) &&
        !atRisk.includes(stat) &&
        !lost.includes(stat),
    )

    return [
      {
        id: "champions",
        name: "Чемпионы",
        description: "Покупали недавно, часто и потратили много денег",
        color: "border-green-200 bg-green-50",
        icon: "trophy",
        clientsCount: champions.length,
        criteria: `R: 0-30 дн. | F: ≥12 чеков | M: ≥24,000 руб.`,
        aiRecommendation: "Предложить эксклюзивные скидки, ранний доступ к новым услугам, запросить отзывы.",
        clients: champions.map((stat) => stat.client),
      },
      {
        id: "loyal",
        name: "Лояльные клиенты",
        description: "Регулярно пользуются услугами и тратят хорошие суммы",
        color: "border-blue-200 bg-blue-50",
        icon: "thumbs-up",
        clientsCount: loyalCustomers.length,
        criteria: `R: 15-90 дн. | F: 7-11 чеков | M: 14,000-23,999 руб.`,
        aiRecommendation: "Предложить бонусы за лояльность, персонализированные акции, cross-sell.",
        clients: loyalCustomers.map((stat) => stat.client),
      },
      {
        id: "potential",
        name: "Потенциально лояльные",
        description: "Недавние клиенты с потенциалом роста",
        color: "border-cyan-200 bg-cyan-50",
        icon: "trending-up",
        clientsCount: potentialLoyalists.length,
        criteria: `R: 0-30 дн. | F: 2-6 чеков | M: 4,000-13,999 руб.`,
        aiRecommendation: "Стимулировать повторные покупки (акции, привлечь друга), накопительные скидки.",
        clients: potentialLoyalists.map((stat) => stat.client),
      },
      {
        id: "newcomers",
        name: "Новички",
        description: "Новые клиенты, совершившие первую покупку",
        color: "border-purple-200 bg-purple-50",
        icon: "user-plus",
        clientsCount: newcomers.length,
        criteria: `R: 0-30 дн. | F: 1 чек | M: ≥1 руб.`,
        aiRecommendation: "Приветственные бонусы, знакомство с услугами, стимулирование второй покупки.",
        clients: newcomers.map((stat) => stat.client),
      },
      {
        id: "at-risk",
        name: "В зоне риска",
        description: "Давно не обращались, нужна реактивация",
        color: "border-yellow-200 bg-yellow-50",
        icon: "alert-triangle",
        clientsCount: atRisk.length,
        criteria: `R: 31-180 дн. | F: 4-11 чеков | M: ≥8,000 руб.`,
        aiRecommendation: "Реактивационные кампании со специальными предложениями, опросы о причинах ухода.",
        clients: atRisk.map((stat) => stat.client),
      },
      {
        id: "lost",
        name: "Потерянные",
        description: "Давно не обращались, низкая активность",
        color: "border-red-200 bg-red-50",
        icon: "x-circle",
        clientsCount: lost.length,
        criteria: `R: >360 дн. | F: 1-3 чека | M: <7,999 руб.`,
        aiRecommendation:
          "Последние попытки реактивации с очень выгодными предложениями или исключение из активных рассылок.",
        clients: lost.map((stat) => stat.client),
      },
    ]
  }

  const calculateRFMScore = (recency: number, frequency: number, monetary: number): string => {
    const rScore = recency <= 30 ? 5 : recency <= 60 ? 4 : recency <= 90 ? 3 : recency <= 180 ? 2 : 1
    const fScore = frequency >= 5 ? 5 : frequency >= 3 ? 4 : frequency >= 2 ? 3 : frequency >= 1 ? 2 : 1
    const mScore = monetary >= 5000 ? 5 : monetary >= 3000 ? 4 : monetary >= 2000 ? 3 : monetary >= 1000 ? 2 : 1
    return `${rScore}${fScore}${mScore}`
  }

  const [segments, setSegments] = useState<RFMSegment[]>(calculateRFMSegments())

  const handleUpdateAnalysis = () => {
    setSegments(calculateRFMSegments())
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "trophy":
        return <Trophy className="h-6 w-6 text-green-600" />
      case "thumbs-up":
        return <ThumbsUp className="h-6 w-6 text-blue-600" />
      case "trending-up":
        return <TrendingUp className="h-6 w-6 text-cyan-600" />
      case "user-plus":
        return <UserPlus className="h-6 w-6 text-purple-600" />
      case "alert-triangle":
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />
      case "x-circle":
        return <XCircle className="h-6 w-6 text-red-600" />
      default:
        return <Settings className="h-6 w-6" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Настройки RFM */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Настройки RFM
            </h2>
            <p className="text-sm text-gray-600 mt-1">Сегментация базы по давности, частоте и сумме покупок.</p>
          </div>
          <button
            onClick={handleUpdateAnalysis}
            className="flex items-center px-4 py-2 bg-[#2055a4] text-white rounded-lg hover:bg-[#1a4a8f] transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить RFM анализ
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recency (дни)</label>
            <input
              type="number"
              value={settings.recencyDays}
              onChange={(e) => setSettings({ ...settings, recencyDays: Number.parseInt(e.target.value) || 90 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency (заказы)</label>
            <input
              type="number"
              value={settings.frequencyOrders}
              onChange={(e) => setSettings({ ...settings, frequencyOrders: Number.parseInt(e.target.value) || 3 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monetary (рубли)</label>
            <input
              type="number"
              value={settings.monetaryAmount}
              onChange={(e) => setSettings({ ...settings, monetaryAmount: Number.parseInt(e.target.value) || 5000 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2055a4] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Сегменты RFM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {segments.map((segment) => (
          <div key={segment.id} className={`rounded-lg border-2 p-6 ${segment.color}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {getIcon(segment.icon)}
                <h3 className="text-lg font-semibold ml-2">{segment.name}</h3>
              </div>
              <span className="text-2xl font-bold">{segment.clientsCount} клиентов</span>
            </div>

            <p className="text-sm text-gray-600 mb-3">{segment.criteria}</p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-start">
                <span className="text-yellow-600 font-medium text-xs mr-2">💡 AI Рекомендации:</span>
                <p className="text-xs text-gray-700">{segment.aiRecommendation}</p>
              </div>
            </div>

            <button className="w-full text-center text-[#2055a4] hover:text-[#1a4a8f] font-medium text-sm py-2 border border-[#2055a4] rounded-lg hover:bg-[#2055a4] hover:text-white transition-colors">
              Создать кампанию для сегмента
            </button>
          </div>
        ))}
      </div>

      {/* Общая статистика */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Общая статистика</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {segments.map((segment) => (
            <div key={segment.id} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{segment.clientsCount}</div>
              <div className="text-sm text-gray-600">{segment.name}</div>
              <div className="text-xs text-gray-500">
                {clients.length > 0 ? Math.round((segment.clientsCount / clients.length) * 100) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
