/**
 * Экспортирует данные в CSV формат с правильным разделением на колонки
 */
export function exportToCSV(data: Record<string, any>[], filename: string) {
    try {
        if (data.length === 0) {
            throw new Error("Нет данных для экспорта")
        }

        // Получаем заголовки из первого объекта
        const headers = Object.keys(data[0])

        // Функция для экранирования значений CSV
        const escapeCSVValue = (value: any): string => {
            if (value === null || value === undefined) {
                return ""
            }

            const stringValue = String(value)

            // Если значение содержит запятую, кавычки или перенос строки, оборачиваем в кавычки
            if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
                return `"${stringValue.replace(/"/g, '""')}"`
            }

            return stringValue
        }

        // Создаем CSV контент
        const csvContent = [
            // Заголовки
            headers
                .map(escapeCSVValue)
                .join(","),
            // Данные
            ...data.map((row) => headers.map((header) => escapeCSVValue(row[header])).join(",")),
        ].join("\n")

        // Создаем и скачиваем файл с BOM для корректного отображения кириллицы
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
        downloadFile(blob, `${filename}.csv`)

        return { success: true, count: data.length }
    } catch (error) {
        console.error("Ошибка при экспорте в CSV:", error)
        throw error
    }
}

/**
 * Экспортирует данные в XLS формат (HTML таблица с расширением .xls)
 */
export function exportToXLS(data: Record<string, any>[], filename: string) {
    try {
        if (data.length === 0) {
            throw new Error("Нет данных для экспорта")
        }

        // Получаем заголовки из первого объекта
        const headers = Object.keys(data[0])

        // Функция для экранирования HTML
        const escapeHTML = (value: any): string => {
            if (value === null || value === undefined) {
                return ""
            }

            return String(value)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
        }

        // Создаем HTML таблицу
        const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Sheet1</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                ${headers.map((header) => `<th>${escapeHTML(header)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${data
            .map((row) => `<tr>${headers.map((header) => `<td>${escapeHTML(row[header])}</td>`).join("")}</tr>`)
            .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `

        // Создаем и скачиваем файл
        const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" })
        downloadFile(blob, `${filename}.xls`)

        return { success: true, count: data.length }
    } catch (error) {
        console.error("Ошибка при экспорте в XLS:", error)
        throw error
    }
}

/**
 * Вспомогательная функция для скачивания файла
 */
function downloadFile(blob: Blob, filename: string) {
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Освобождаем память
    setTimeout(() => URL.revokeObjectURL(url), 100)
}
