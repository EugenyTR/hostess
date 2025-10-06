import jsPDF from "jspdf"
import "jspdf-autotable"
import type { ReceiptTemplate } from "@/app/receipts/[id]/page"

interface ReceiptItem {
  id: string
  name: string
  quantity: number
  price: number
  total: number
  category: string
}

interface Receipt {
  id: string
  number: string
  date: string
  time: string
  cashier: string
  client: {
    name: string
    phone: string
    email?: string
  }
  items: ReceiptItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  status: "completed" | "refunded" | "cancelled"
  notes?: string
}

interface TemplateConfig {
  colors: {
    primary: [number, number, number]
    secondary: [number, number, number]
    accent: [number, number, number]
    background: [number, number, number]
  }
  fonts: {
    title: number
    header: number
    body: number
    small: number
  }
  styles: {
    headerBg: [number, number, number]
    headerText: [number, number, number]
    borderColor: [number, number, number]
  }
}

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

const templateConfigs: Record<ReceiptTemplate, TemplateConfig> = {
  classic: {
    colors: {
      primary: [0, 0, 0],
      secondary: [102, 102, 102],
      accent: [51, 51, 51],
      background: [255, 255, 255],
    },
    fonts: {
      title: 20,
      header: 14,
      body: 12,
      small: 10,
    },
    styles: {
      headerBg: [240, 240, 240],
      headerText: [0, 0, 0],
      borderColor: [200, 200, 200],
    },
  },
  modern: {
    colors: {
      primary: [37, 99, 235],
      secondary: [100, 116, 139],
      accent: [30, 64, 175],
      background: [248, 250, 252],
    },
    fonts: {
      title: 22,
      header: 16,
      body: 12,
      small: 10,
    },
    styles: {
      headerBg: [37, 99, 235],
      headerText: [255, 255, 255],
      borderColor: [226, 232, 240],
    },
  },
  minimal: {
    colors: {
      primary: [55, 65, 81],
      secondary: [156, 163, 175],
      accent: [107, 114, 128],
      background: [255, 255, 255],
    },
    fonts: {
      title: 18,
      header: 12,
      body: 11,
      small: 9,
    },
    styles: {
      headerBg: [249, 250, 251],
      headerText: [55, 65, 81],
      borderColor: [229, 231, 235],
    },
  },
  corporate: {
    colors: {
      primary: [31, 41, 55],
      secondary: [75, 85, 99],
      accent: [5, 150, 105],
      background: [255, 255, 255],
    },
    fonts: {
      title: 24,
      header: 16,
      body: 12,
      small: 10,
    },
    styles: {
      headerBg: [31, 41, 55],
      headerText: [255, 255, 255],
      borderColor: [209, 213, 219],
    },
  },
  colorful: {
    colors: {
      primary: [124, 58, 237],
      secondary: [168, 85, 247],
      accent: [236, 72, 153],
      background: [253, 244, 255],
    },
    fonts: {
      title: 24,
      header: 16,
      body: 12,
      small: 10,
    },
    styles: {
      headerBg: [124, 58, 237],
      headerText: [255, 255, 255],
      borderColor: [196, 181, 253],
    },
  },
}

export const generateReceiptPDF = async (receipt: Receipt, template: ReceiptTemplate = "classic"): Promise<void> => {
  const doc = new jsPDF()
  const config = templateConfigs[template]
  const pageWidth = doc.internal.pageSize.width
  const margin = 20

  // Загружаем настройки шаблона из localStorage
  const savedTemplate = localStorage.getItem(`receiptTemplate_${template}`)
  let templateSettings = null
  if (savedTemplate) {
    try {
      templateSettings = JSON.parse(savedTemplate)
    } catch (e) {
      console.error("Ошибка при загрузке настроек шаблона:", e)
    }
  }

  // Настройка шрифта
  doc.setFont("helvetica")

  let yPosition = margin

  // Фон для цветных шаблонов
  if (template === "colorful" || template === "modern") {
    doc.setFillColor(...config.colors.background)
    doc.rect(0, 0, pageWidth, doc.internal.pageSize.height, "F")
  }

  // Логотип компании
  if (templateSettings?.logo) {
    try {
      const logoImg = new Image()
      logoImg.crossOrigin = "anonymous"
      logoImg.src = templateSettings.logo

      await new Promise((resolve, reject) => {
        logoImg.onload = () => {
          const logoWidth = 40
          const logoHeight = 20
          const logoX = (pageWidth - logoWidth) / 2

          doc.addImage(logoImg, "JPEG", logoX, yPosition, logoWidth, logoHeight)
          yPosition += logoHeight + 10
          resolve(true)
        }
        logoImg.onerror = reject
      })
    } catch (error) {
      console.error("Ошибка при добавлении логотипа:", error)
    }
  }

  // Заголовок компании (для корпоративного шаблона или если есть настройки)
  if (template === "corporate" || templateSettings?.companyInfo) {
    const companyInfo = templateSettings?.companyInfo || {
      name: "ХИМЧИСТКА 'ХОЗЯЮШКА'",
      address: "г. Москва, ул. Примерная, д. 123",
      phone: "+7 (999) 123-45-67",
      email: "info@hozyaushka.ru",
    }

    if (template === "corporate") {
      doc.setFillColor(...config.colors.primary)
      doc.rect(0, yPosition - 10, pageWidth, 40, "F")
      doc.setTextColor(255, 255, 255)
    } else {
      doc.setTextColor(...config.colors.primary)
    }

    doc.setFontSize(config.fonts.header)
    doc.text(companyInfo.name, pageWidth / 2, yPosition + 5, { align: "center" })

    doc.setFontSize(config.fonts.small)
    doc.text(companyInfo.address, pageWidth / 2, yPosition + 15, { align: "center" })
    doc.text(`${companyInfo.phone} | ${companyInfo.email}`, pageWidth / 2, yPosition + 25, { align: "center" })

    if (companyInfo.website) {
      doc.text(companyInfo.website, pageWidth / 2, yPosition + 32, { align: "center" })
    }
    if (companyInfo.inn) {
      doc.text(`ИНН: ${companyInfo.inn}`, pageWidth / 2, yPosition + 39, { align: "center" })
    }

    yPosition += template === "corporate" ? 55 : 50
  }

  // Заголовок чека
  doc.setTextColor(...config.colors.primary)
  doc.setFontSize(config.fonts.title)

  if (template === "colorful") {
    // Градиентный эффект для яркого шаблона
    doc.setFillColor(...config.colors.primary)
    doc.roundedRect(margin, yPosition - 5, pageWidth - 2 * margin, 20, 5, 5, "F")
    doc.setTextColor(255, 255, 255)
  }

  doc.text("ЧЕК", pageWidth / 2, yPosition + 8, { align: "center" })
  yPosition += template === "colorful" ? 30 : 25

  // Номер чека
  doc.setTextColor(...config.colors.accent)
  doc.setFontSize(config.fonts.header)
  doc.text(`№ ${receipt.number}`, pageWidth / 2, yPosition, { align: "center" })
  yPosition += 20

  // Информация о чеке (используем настройки полей если есть)
  const fields = templateSettings?.fields || [
    { name: "date", label: "Дата", visible: true },
    { name: "time", label: "Время", visible: true },
    { name: "cashier", label: "Кассир", visible: true },
    { name: "paymentMethod", label: "Способ оплаты", visible: true },
  ]

  doc.setTextColor(...config.colors.secondary)
  doc.setFontSize(config.fonts.body)

  const receiptData: Record<string, string> = {
    date: receipt.date,
    time: receipt.time,
    cashier: receipt.cashier,
    paymentMethod: receipt.paymentMethod,
    clientName: receipt.client.name,
    clientPhone: receipt.client.phone,
    clientEmail: receipt.client.email || "",
    status: receipt.status === "completed" ? "Завершен" : receipt.status === "refunded" ? "Возврат" : "Отменен",
  }

  // Рамка для минимального шаблона
  if (template === "minimal") {
    const visibleFields = fields.filter((field: any) => field.visible && receiptData[field.name])
    doc.setDrawColor(...config.styles.borderColor)
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, visibleFields.length * 8 + 10)
  }

  fields.forEach((field: any) => {
    if (field.visible && receiptData[field.name]) {
      doc.setTextColor(...config.colors.secondary)
      doc.text(`${field.label}:`, margin + (template === "minimal" ? 5 : 0), yPosition)
      doc.setTextColor(...config.colors.primary)
      doc.text(receiptData[field.name], margin + 50, yPosition)
      yPosition += 8
    }
  })

  yPosition += 15

  // Таблица товаров
  const tableData = receipt.items.map((item) => [
    item.name,
    item.category,
    item.quantity.toString(),
    `${item.price.toLocaleString()} ₽`,
    `${item.total.toLocaleString()} ₽`,
  ])

  const tableConfig: any = {
    startY: yPosition,
    head: [["Наименование", "Категория", "Кол-во", "Цена", "Сумма"]],
    body: tableData,
    styles: {
      fontSize: config.fonts.small,
      cellPadding: template === "minimal" ? 2 : 4,
      textColor: config.colors.primary,
    },
    headStyles: {
      fillColor: config.styles.headerBg,
      textColor: config.styles.headerText,
      fontStyle: "bold",
      fontSize: config.fonts.body,
    },
    columnStyles: {
      0: { cellWidth: template === "minimal" ? 70 : 60 },
      1: { cellWidth: template === "minimal" ? 30 : 40 },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 30, halign: "right" },
    },
    alternateRowStyles: template === "modern" ? { fillColor: [248, 250, 252] } : {},
  }

  // Специальные стили для разных шаблонов
  if (template === "colorful") {
    tableConfig.alternateRowStyles = { fillColor: [250, 245, 255] }
  } else if (template === "corporate") {
    tableConfig.styles.lineColor = config.colors.accent
    tableConfig.styles.lineWidth = 0.5
  }

  doc.autoTable(tableConfig)

  // Получаем позицию после таблицы
  const finalY = (doc as any).lastAutoTable.finalY || yPosition + 60
  yPosition = finalY + 20

  // Итоги
  const totalsStartY = yPosition
  const totalsX = pageWidth - margin - 80

  if (template === "corporate" || template === "colorful") {
    // Фон для итогов
    doc.setFillColor(...(template === "corporate" ? [249, 250, 251] : [250, 245, 255]))
    doc.roundedRect(totalsX - 10, totalsStartY - 10, 90, 60, 3, 3, "F")
  }

  doc.setFontSize(config.fonts.body)
  doc.setTextColor(...config.colors.secondary)
  doc.text(`Подытог: ${receipt.subtotal.toLocaleString()} ₽`, totalsX, totalsStartY)
  doc.text(`Налог: ${receipt.tax.toLocaleString()} ₽`, totalsX, totalsStartY + 10)
  doc.text(`Скидка: -${receipt.discount.toLocaleString()} ₽`, totalsX, totalsStartY + 20)

  // Линия разделитель
  doc.setDrawColor(...config.colors.accent)
  doc.setLineWidth(template === "minimal" ? 0.3 : 0.5)
  doc.line(totalsX, totalsStartY + 25, totalsX + 70, totalsStartY + 25)

  // Итого
  doc.setFontSize(config.fonts.header)
  doc.setTextColor(...config.colors.accent)
  doc.text(`ИТОГО: ${receipt.total.toLocaleString()} ₽`, totalsX, totalsStartY + 35)

  // Статус
  const statusY = totalsStartY + 50
  doc.setFontSize(config.fonts.body)
  doc.setTextColor(...config.colors.primary)
  const statusText = receipt.status === "completed" ? "Завершен" : receipt.status === "refunded" ? "Возврат" : "Отменен"
  doc.text(`Статус: ${statusText}`, margin, statusY)

  // Примечания
  if (receipt.notes) {
    const notesY = statusY + 20
    doc.setFontSize(config.fonts.header)
    doc.setTextColor(...config.colors.primary)
    doc.text("ПРИМЕЧАНИЯ", margin, notesY)

    doc.setFontSize(config.fonts.small)
    doc.setTextColor(...config.colors.secondary)
    const splitNotes = doc.splitTextToSize(receipt.notes, pageWidth - 2 * margin)
    doc.text(splitNotes, margin, notesY + 10)
  }

  // Футер
  const footerY = doc.internal.pageSize.height - 30
  doc.setFontSize(config.fonts.small - 1)
  doc.setTextColor(...config.colors.secondary)

  if (template === "corporate" || templateSettings?.companyInfo) {
    doc.text("Спасибо за выбор нашей химчистки!", pageWidth / 2, footerY, { align: "center" })
    doc.text("Мы ценим ваше доверие и гарантируем качество услуг", pageWidth / 2, footerY + 8, { align: "center" })
  } else {
    doc.text("Спасибо за покупку!", pageWidth / 2, footerY, { align: "center" })
  }

  doc.text(`Дата создания: ${new Date().toLocaleString("ru-RU")}`, pageWidth / 2, footerY + 12, { align: "center" })

  // Сохранение файла
  const templateName = template === "classic" ? "" : `-${template}`
  doc.save(`receipt-${receipt.number}${templateName}.pdf`)
}
