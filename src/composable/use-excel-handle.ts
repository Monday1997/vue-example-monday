import { loadXLSX } from '@/utils/laodScript'
import type { TableColumnType } from 'ant-design-vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { TusualObj } from '@/type/common'

export function useExcelHandle<T extends TusualObj = TusualObj>(formFile: Ref<HTMLInputElement>, columns: TableColumnType[]) {
  const tableLoading = ref(false)
  const tableList = ref<T[]>([])
  const dataMap: Record<string, string | undefined> = {} //{数据1:data1}
  columns.forEach((item) => {
    dataMap[item.title as string] = item.dataIndex as string
  })
  async function importTable() {
    try {
      tableLoading.value = true
      await loadXLSX()
      const file = formFile.value?.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async function (e) {
        if (e.target) {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          // const raw_data = XLSX.utils.sheet_to_json(worksheet,{header:1})
          // 另一种数据格式
          const raw_data: TusualObj[] =
            XLSX.utils.sheet_to_json(worksheet)
          const showTableList = raw_data.map((item) => {
            const result: TusualObj = {}
            Object.entries(item).forEach(([key, value]) => {
              if (dataMap[key]) {
                result[dataMap[key]] = value
              }
            })
            return result as T
          })
          tableList.value = showTableList
          tableLoading.value = false
          console.log('🚀 ~ raw_data:', showTableList)
        }
      }
      reader.readAsArrayBuffer(file)
    } catch (error) {
      console.error(error)
      tableLoading.value = false
    }
  }
  return { importTable, tableLoading, tableList }
}
