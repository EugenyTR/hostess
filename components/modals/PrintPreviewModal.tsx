"use client"

import { useRef } from "react"
import { X, Printer } from "lucide-react"
import { PrintPreview } from "../PrintPreview"
import type { PrintSettings } from "./PrintSettingsModal"
import type { Order, Client, StatusHistoryItem } from "@/types"

interface PrintPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order
  client: Client | null
  statusHistory: StatusHistoryItem[]
  settings: PrintSettings
  onPrint: () => void
}

export function PrintPreviewModal({
  isOpen,
  onClose,
  order,
  client,
  statusHistory,
  settings,
  onPrint,
}: PrintPreviewModalProps) {
  const printPreviewRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  return (
    <div className="print-preview-modal">
      <div className="print-preview-content">
        <div className="print-preview-header">
          <h2 className="text-xl font-medium">Предпросмотр печати</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="print-preview-body" ref={printPreviewRef}>
          <div className="border border-gray-200 rounded-lg shadow-sm">
            <PrintPreview order={order} client={client} statusHistory={statusHistory} settings={settings} />
          </div>
        </div>

        <div className="print-preview-actions">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            Отмена
          </button>
          <button
            onClick={onPrint}
            className="flex items-center px-4 py-2 bg-[#2055a4] text-white rounded-md text-sm hover:bg-[#1a4a8f]"
          >
            <Printer className="w-4 h-4 mr-2" />
            Печать
          </button>
        </div>
      </div>
    </div>
  )
}
