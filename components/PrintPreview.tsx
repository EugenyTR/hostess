"use client"

import { useRef } from "react"
import Image from "next/image"
import type { PrintSettings } from "./modals/PrintSettingsModal"
import type { Order, Client, StatusHistoryItem } from "@/types"

interface PrintPreviewProps {
  order: Order
  client: Client | null
  statusHistory: StatusHistoryItem[]
  settings: PrintSettings
}

export function PrintPreview({ order, client, statusHistory, settings }: PrintPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null)

  // Функция для получения текста статуса
  const getOrderStatusText = (status: string): string => {
    switch (status) {
      case "completed":
        return "Выполнен"
      case "in-progress":
        return "В работе"
      case "waiting":
        return "Ожидание"
      default:
        return "Неизвестно"
    }
  }

  const clientName = client
    ? client.type === "individual"
      ? `${client.surname} ${client.name} ${client.patronymic}`
      : client.companyName || ""
    : "Неизвестный клиент"

  return (
    <div ref={printRef} className={`print-container ${settings.paperSize} ${settings.orientation}`}>
      {settings.showHeader && (
        <div className="print-header">
          {settings.includeLogo && (
            <div className="logo-container">
              <Image src="/logo.webp" alt="Логотип" width={120} height={40} />
            </div>
          )}
          <h1>Заказ №{order.id}</h1>
        </div>
      )}

      <div className="print-content">
        {settings.includeOrderDetails && (
          <div className="print-section">
            <h2>Информация о заказе</h2>
            <div className="print-grid">
              <div>
                <div className="label">Номер заказа</div>
                <div className="value">{order.id}</div>
              </div>
              <div>
                <div className="label">Дата</div>
                <div className="value">{order.date}</div>
              </div>
              <div>
                <div className="label">Статус</div>
                <div className="value">{getOrderStatusText(order.status)}</div>
              </div>
              <div>
                <div className="label">Тип оплаты</div>
                <div className="value">{order.isCashless ? "Безналичный" : "Наличный"}</div>
              </div>
            </div>

            {settings.includeComments && order.comments && (
              <div className="comments-section">
                <div className="label">Комментарии</div>
                <div className="value comments">{order.comments}</div>
              </div>
            )}
          </div>
        )}

        {settings.includeClientInfo && client && (
          <div className="print-section">
            <h2>Информация о клиенте</h2>
            <div className="print-grid">
              {client.type === "legal" && client.companyName && (
                <div>
                  <div className="label">Компания</div>
                  <div className="value">{client.companyName}</div>
                </div>
              )}
              <div>
                <div className="label">ФИО</div>
                <div className="value">
                  {client.surname} {client.name} {client.patronymic}
                </div>
              </div>
              <div>
                <div className="label">Телефон</div>
                <div className="value">{client.phone}</div>
              </div>
              {client.email && (
                <div>
                  <div className="label">Email</div>
                  <div className="value">{client.email}</div>
                </div>
              )}
              <div>
                <div className="label">Адрес</div>
                <div className="value">
                  {client.address.city}, {client.address.street}, {client.address.house}
                  {client.address.apartment && `, кв. ${client.address.apartment}`}
                </div>
              </div>
            </div>
          </div>
        )}

        {settings.includeServices && (
          <div className="print-section">
            <h2>Услуги</h2>
            <table className="print-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Услуга</th>
                  <th>Кол-во</th>
                  {settings.showPrices && <th>Цена</th>}
                  {settings.showPrices && <th>Итого</th>}
                  <th>Дата готовности</th>
                </tr>
              </thead>
              <tbody>
                {order.services.map((service, index) => (
                  <tr key={service.id}>
                    <td>{index + 1}</td>
                    <td>{service.serviceName}</td>
                    <td>{service.quantity}</td>
                    {settings.showPrices && <td>{service.price} ₽</td>}
                    {settings.showPrices && <td>{service.total} ₽</td>}
                    <td>{service.readyDate}</td>
                  </tr>
                ))}
              </tbody>
              {settings.showPrices && (
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-right">
                      Итого:
                    </td>
                    <td colSpan={2}>{order.totalAmount} ₽</td>
                    <td></td>
                  </tr>
                  {settings.showDiscount && order.discount > 0 && (
                    <>
                      <tr>
                        <td colSpan={3} className="text-right">
                          Скидка:
                        </td>
                        <td colSpan={2}>{order.discount}%</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="text-right">
                          К оплате:
                        </td>
                        <td colSpan={2}>{order.discountedAmount} ₽</td>
                        <td></td>
                      </tr>
                    </>
                  )}
                </tfoot>
              )}
            </table>
          </div>
        )}

        {settings.includeTechPassport && order.services.some((s) => s.techPassport) && (
          <div className="print-section">
            <h2>Технические паспорта</h2>
            <div className="tech-passports">
              {order.services
                .filter((s) => s.techPassport)
                .map((service) => (
                  <div key={service.id} className="tech-passport">
                    <h3>{service.serviceName}</h3>
                    <div className="print-grid">
                      <div>
                        <div className="label">Номер договора</div>
                        <div className="value">{service.techPassport?.contractNumber || "Не указан"}</div>
                      </div>
                      <div>
                        <div className="label">Заказчик</div>
                        <div className="value">{service.techPassport?.client || clientName}</div>
                      </div>
                      <div>
                        <div className="label">Наименование изделия</div>
                        <div className="value">{service.techPassport?.itemName || "Не указано"}</div>
                      </div>
                      <div>
                        <div className="label">Материал</div>
                        <div className="value">{service.techPassport?.material || "Не указан"}</div>
                      </div>
                      <div>
                        <div className="label">Цвет</div>
                        <div className="value">{service.techPassport?.color || service.color || "Не указан"}</div>
                      </div>
                      <div>
                        <div className="label">Производитель</div>
                        <div className="value">
                          {service.techPassport?.manufacturer || service.brand || "Не указан"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {settings.includeStatusHistory && statusHistory.length > 0 && (
          <div className="print-section status-history-section">
            <h2>История изменений статуса</h2>
            <table className="print-table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Статус</th>
                  <th>Пользователь</th>
                </tr>
              </thead>
              <tbody>
                {statusHistory.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{getOrderStatusText(item.status)}</td>
                    <td>{item.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {settings.showFooter && (
        <div className="print-footer">
          <p>{settings.footerText}</p>
          <p>Дата печати: {new Date().toLocaleDateString()}</p>
        </div>
      )}
    </div>
  )
}
