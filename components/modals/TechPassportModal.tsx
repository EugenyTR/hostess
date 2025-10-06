"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { TechPassport } from "@/types"

interface TechPassportModalProps {
  initialData?: TechPassport | undefined
  onClose: () => void
  onSave: (techPassport: TechPassport) => void
}

// Создаем дефолтный технический паспорт
const defaultTechPassport: TechPassport = {
  contractNumber: "ВП № 001",
  client: "",
  executor: "",
  inn: "",
  city: "",
  street: "",
  phone: "",

  itemName: "",
  manufacturer: "",
  color: "",
  material: "",
  accessories: "",

  processingType: {
    manual: false,
    bioTechnology: false,
  },

  additionalProcessing: {
    stainRemoval: false,
    waterRepellent: false,
    atelierService: false,
  },

  lining: {
    exists: false,
    color: "",
    wear: "",
  },

  manufacturerMarking: "missing",
  contaminationDegree: "medium",

  hasHiddenDefects: false,
  hasStains: false,
  hasRoadReagentStains: false,

  wearDegree: "30%",
  colorFading: "none",

  defects: {
    textile: {
      pilling: false,
      tears: false,
      abrasion: false,
      odor: false,
    },
    fur: {
      rigidity: false,
      hairLoss: false,
      yellowness: false,
      odor: false,
    },
    leather: {
      rigidity: false,
      scratches: false,
      colorLoss: false,
      odor: false,
    },
    suede: {
      cracks: false,
      hairLoss: false,
      rigidity: false,
      odor: false,
    },
    lining: {
      heavyContamination: false,
      shine: false,
      tears: false,
      stains: false,
    },
  },

  notes: "",
  clientConsent: false,
}

export default function TechPassportModal({ initialData, onClose, onSave }: TechPassportModalProps) {
  // Инициализируем состояние с безопасной проверкой
  const [techPassport, setTechPassport] = useState<TechPassport>(defaultTechPassport)

  // Используем useEffect для безопасной инициализации данных
  useEffect(() => {
    if (initialData) {
      // Убедимся, что все необходимые вложенные объекты существуют
      const safeInitialData = {
        ...defaultTechPassport,
        ...initialData,
        processingType: {
          ...defaultTechPassport.processingType,
          ...(initialData.processingType || {}),
        },
        additionalProcessing: {
          ...defaultTechPassport.additionalProcessing,
          ...(initialData.additionalProcessing || {}),
        },
        lining: {
          ...defaultTechPassport.lining,
          ...(initialData.lining || {}),
        },
        defects: {
          textile: {
            ...defaultTechPassport.defects.textile,
            ...((initialData.defects && initialData.defects.textile) || {}),
          },
          fur: {
            ...defaultTechPassport.defects.fur,
            ...((initialData.defects && initialData.defects.fur) || {}),
          },
          leather: {
            ...defaultTechPassport.defects.leather,
            ...((initialData.defects && initialData.defects.leather) || {}),
          },
          suede: {
            ...defaultTechPassport.defects.suede,
            ...((initialData.defects && initialData.defects.suede) || {}),
          },
          lining: {
            ...defaultTechPassport.defects.lining,
            ...((initialData.defects && initialData.defects.lining) || {}),
          },
        },
      }
      setTechPassport(safeInitialData)
    }
  }, [initialData])

  const handleChange = (field: string, value: any) => {
    setTechPassport((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setTechPassport((prev) => {
      const parentObj = (prev[parent as keyof TechPassport] as Record<string, any>) || {}
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [field]: value,
        },
      }
    })
  }

  const handleDefectChange = (category: string, field: string, value: boolean) => {
    setTechPassport((prev) => {
      // Создаем безопасную копию объекта defects
      const defects = { ...prev.defects }

      // Убедимся, что категория существует
      if (!defects[category as keyof typeof defects]) {
        defects[category as keyof typeof defects] = {} as any
      }

      // Обновляем значение
      const categoryObj = defects[category as keyof typeof defects] as Record<string, boolean>
      categoryObj[field] = value

      return {
        ...prev,
        defects,
      }
    })
  }

  const handleSubmit = () => {
    onSave(techPassport)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-10">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-medium mb-6 text-center">Технический паспорт</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Квитанция-договор</div>
              <input
                type="text"
                value={techPassport.contractNumber}
                onChange={(e) => handleChange("contractNumber", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Заказчик</div>
              <input
                type="text"
                value={techPassport.client}
                onChange={(e) => handleChange("client", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Исполнитель</div>
              <input
                type="text"
                value={techPassport.executor}
                onChange={(e) => handleChange("executor", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">ИНН</div>
              <input
                type="text"
                value={techPassport.inn}
                onChange={(e) => handleChange("inn", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Адрес</div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Город"
                  value={techPassport.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <input
                  type="text"
                  placeholder="Улица"
                  value={techPassport.street}
                  onChange={(e) => handleChange("street", e.target.value)}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Телефон</div>
              <input
                type="text"
                value={techPassport.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <h3 className="text-lg font-medium mb-4">Информация об изделии</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Наименование изделия</div>
              <input
                type="text"
                value={techPassport.itemName}
                onChange={(e) => handleChange("itemName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Производитель</div>
              <input
                type="text"
                value={techPassport.manufacturer}
                onChange={(e) => handleChange("manufacturer", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Цвет</div>
              <input
                type="text"
                value={techPassport.color}
                onChange={(e) => handleChange("color", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Материал</div>
              <input
                type="text"
                value={techPassport.material}
                onChange={(e) => handleChange("material", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="mb-4 col-span-2">
              <div className="text-sm font-medium mb-1">Комплектность/Фурнитура</div>
              <input
                type="text"
                value={techPassport.accessories}
                onChange={(e) => handleChange("accessories", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <h3 className="text-lg font-medium mb-4">Вид обработки</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="manual"
                checked={techPassport.processingType.manual}
                onChange={(e) => handleNestedChange("processingType", "manual", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="manual" className="text-sm">
                Ручная чистка (ручная чистка)
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="bioTechnology"
                checked={techPassport.processingType.bioTechnology}
                onChange={(e) => handleNestedChange("processingType", "bioTechnology", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="bioTechnology" className="text-sm">
                Ручная чистка по технологии БИО
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <h3 className="text-lg font-medium mb-4">Дополнительная обработка</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="stainRemoval"
                checked={techPassport.additionalProcessing.stainRemoval}
                onChange={(e) => handleNestedChange("additionalProcessing", "stainRemoval", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="stainRemoval" className="text-sm">
                Пятновыведение / удаление пятен
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="waterRepellent"
                checked={techPassport.additionalProcessing.waterRepellent}
                onChange={(e) => handleNestedChange("additionalProcessing", "waterRepellent", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="waterRepellent" className="text-sm">
                Гидрофобная (влагозащитная)
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="atelierService"
                checked={techPassport.additionalProcessing.atelierService}
                onChange={(e) => handleNestedChange("additionalProcessing", "atelierService", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="atelierService" className="text-sm">
                Доп. Услуга Ателье
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <h3 className="text-lg font-medium mb-4">Подкладка</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="liningExists"
                checked={techPassport.lining.exists}
                onChange={(e) => handleNestedChange("lining", "exists", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="liningExists" className="text-sm">
                Имеется
              </label>
            </div>
            {techPassport.lining.exists && (
              <>
                <div className="mb-2">
                  <div className="text-sm font-medium mb-1">Цвет подкладки</div>
                  <input
                    type="text"
                    value={techPassport.lining.color}
                    onChange={(e) => handleNestedChange("lining", "color", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div className="mb-2">
                  <div className="text-sm font-medium mb-1">Износ подкладки</div>
                  <select
                    value={techPassport.lining.wear}
                    onChange={(e) => handleNestedChange("lining", "wear", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="сильный">Сильный</option>
                    <option value="средний">Средний</option>
                    <option value="слабый">Слабый</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <h3 className="text-lg font-medium mb-4">Маркировка и состояние</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Наличие маркировки фирмы изготовителя</div>
              <select
                value={techPassport.manufacturerMarking}
                onChange={(e) => handleChange("manufacturerMarking", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="exists">Имеется</option>
                <option value="missing">Отсутствует</option>
                <option value="nonCompliant">Не соответствует ГОСТу</option>
              </select>
            </div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Степень загрязнения</div>
              <select
                value={techPassport.contaminationDegree}
                onChange={(e) => handleChange("contaminationDegree", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="high">Очень сильная</option>
                <option value="medium">Сильная</option>
                <option value="low">Общая</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasHiddenDefects"
                checked={techPassport.hasHiddenDefects}
                onChange={(e) => handleChange("hasHiddenDefects", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="hasHiddenDefects" className="text-sm">
                Возможно наличие скрытых дефектов
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasStains"
                checked={techPassport.hasStains}
                onChange={(e) => handleChange("hasStains", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="hasStains" className="text-sm">
                Наличие трудновыводимых пятен
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasRoadReagentStains"
                checked={techPassport.hasRoadReagentStains}
                onChange={(e) => handleChange("hasRoadReagentStains", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="hasRoadReagentStains" className="text-sm">
                Наличие солевых вытравок
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Степень износа</div>
              <select
                value={techPassport.wearDegree}
                onChange={(e) => handleChange("wearDegree", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="30%">30%</option>
                <option value="50%">50%</option>
                <option value="75%">75%</option>
                <option value="over75%">более 75%</option>
              </select>
            </div>
            <div className="mb-4">
              <div className="text-sm font-medium mb-1">Степень выгора/изменение цвета</div>
              <select
                value={techPassport.colorFading}
                onChange={(e) => handleChange("colorFading", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="high">Очень высокая</option>
                <option value="medium">Высокая</option>
                <option value="none">Отсутствует</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <h3 className="text-lg font-medium mb-4">Дефекты изделия</h3>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Текстиль</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="textile-pilling"
                  checked={techPassport.defects.textile.pilling}
                  onChange={(e) => handleDefectChange("textile", "pilling", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="textile-pilling" className="text-sm">
                  Пиллинг/Зацепки
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="textile-tears"
                  checked={techPassport.defects.textile.tears}
                  onChange={(e) => handleDefectChange("textile", "tears", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="textile-tears" className="text-sm">
                  Порывы/Разрывы
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="textile-abrasion"
                  checked={techPassport.defects.textile.abrasion}
                  onChange={(e) => handleDefectChange("textile", "abrasion", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="textile-abrasion" className="text-sm">
                  Истирание ворса
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="textile-odor"
                  checked={techPassport.defects.textile.odor}
                  onChange={(e) => handleDefectChange("textile", "odor", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="textile-odor" className="text-sm">
                  Посторонний запах
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Мех</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fur-rigidity"
                  checked={techPassport.defects.fur.rigidity}
                  onChange={(e) => handleDefectChange("fur", "rigidity", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="fur-rigidity" className="text-sm">
                  Жесткость/Хруст
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fur-hairLoss"
                  checked={techPassport.defects.fur.hairLoss}
                  onChange={(e) => handleDefectChange("fur", "hairLoss", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="fur-hairLoss" className="text-sm">
                  Истирание ворса
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fur-yellowness"
                  checked={techPassport.defects.fur.yellowness}
                  onChange={(e) => handleDefectChange("fur", "yellowness", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="fur-yellowness" className="text-sm">
                  Выгар/Желтизна
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fur-odor"
                  checked={techPassport.defects.fur.odor}
                  onChange={(e) => handleDefectChange("fur", "odor", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="fur-odor" className="text-sm">
                  Посторонний запах
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Кожа</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="leather-rigidity"
                  checked={techPassport.defects.leather.rigidity}
                  onChange={(e) => handleDefectChange("leather", "rigidity", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="leather-rigidity" className="text-sm">
                  Жесткость/Хруст
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="leather-scratches"
                  checked={techPassport.defects.leather.scratches}
                  onChange={(e) => handleDefectChange("leather", "scratches", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="leather-scratches" className="text-sm">
                  Царапины
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="leather-colorLoss"
                  checked={techPassport.defects.leather.colorLoss}
                  onChange={(e) => handleDefectChange("leather", "colorLoss", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="leather-colorLoss" className="text-sm">
                  Замины/заломы
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="leather-odor"
                  checked={techPassport.defects.leather.odor}
                  onChange={(e) => handleDefectChange("leather", "odor", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="leather-odor" className="text-sm">
                  Посторонний запах
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Замша, спилок, нубук</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="suede-cracks"
                  checked={techPassport.defects.suede.cracks}
                  onChange={(e) => handleDefectChange("suede", "cracks", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="suede-cracks" className="text-sm">
                  Трещины/Порывы/Разрывы
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="suede-hairLoss"
                  checked={techPassport.defects.suede.hairLoss}
                  onChange={(e) => handleDefectChange("suede", "hairLoss", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="suede-hairLoss" className="text-sm">
                  Истирание ворса
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="suede-rigidity"
                  checked={techPassport.defects.suede.rigidity}
                  onChange={(e) => handleDefectChange("suede", "rigidity", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="suede-rigidity" className="text-sm">
                  Жесткость
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="suede-odor"
                  checked={techPassport.defects.suede.odor}
                  onChange={(e) => handleDefectChange("suede", "odor", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="suede-odor" className="text-sm">
                  Посторонний запах
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Подкладка</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lining-heavyContamination"
                  checked={techPassport.defects.lining.heavyContamination}
                  onChange={(e) => handleDefectChange("lining", "heavyContamination", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="lining-heavyContamination" className="text-sm">
                  Сильное загрязнение
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lining-shine"
                  checked={techPassport.defects.lining.shine}
                  onChange={(e) => handleDefectChange("lining", "shine", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="lining-shine" className="text-sm">
                  Вышерк
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lining-tears"
                  checked={techPassport.defects.lining.tears}
                  onChange={(e) => handleDefectChange("lining", "tears", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="lining-tears" className="text-sm">
                  Порывы/Разрывы
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lining-stains"
                  checked={techPassport.defects.lining.stains}
                  onChange={(e) => handleDefectChange("lining", "stains", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="lining-stains" className="text-sm">
                  Пятна
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <h3 className="text-sm font-medium mb-2">Примечания</h3>
          <textarea
            value={techPassport.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            rows={3}
          ></textarea>
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="clientConsent"
            checked={techPassport.clientConsent}
            onChange={(e) => handleChange("clientConsent", e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="clientConsent" className="text-sm">
            Заказчик согласен с условиями
          </label>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleSubmit}
            className="bg-[#2055a4] text-white px-6 py-2 rounded hover:bg-[#1a4a8f] transition-colors"
          >
            Сохранить
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}
