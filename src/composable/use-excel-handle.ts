import { loadXLSX } from '@/utils/load-script'
import type { TableColumnType } from 'ant-design-vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { TusualObj } from '@/type/common'
/**
 * 导入导出操作
 * @param columns 要操作的列
 * @param refInput 用于导入的input元素示例
 */
export function useExcelHandle<T extends TusualObj = TusualObj>(
  columns: TableColumnType[],
  refInput?: Ref<HTMLInputElement>,
) {
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
      const file = refInput?.value?.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async function (e) {
        if (e.target) {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          // const raw_data = XLSX.utils.sheet_to_json(worksheet,{header:1})
          // 另一种数据格式
          const raw_data: TusualObj[] = XLSX.utils.sheet_to_json(worksheet)
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

  // 下载数据，导出数据时的按钮
  const btnLoading = ref(false)
  async function downModel(downName: string = '下载数据') {
    exportTable([], downName)
  }
  async function exportTable<T extends any[]>(
    listData: T,
    outName: string = '导出数据',
  ) {
    try {
      btnLoading.value = true
      await loadXLSX()
      const worksheet = XLSX.utils.json_to_sheet(listData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Dates')
      const titleList = columns.map((item) => item.title)
      XLSX.utils.sheet_add_aoa(worksheet, [titleList], { origin: 'A1' })
      // 举例计算一二列宽度
      // worksheet["!cols"] = [{ wch: 20 }, { wch: 50 }];
      XLSX.writeFile(workbook, `${outName}.xlsx`, { compression: true })
      btnLoading.value = false
    } catch {
      btnLoading.value = false
    }
  }

  return {
    importTable,
    tableLoading,
    tableList,
    downModel,
    exportTable,
    btnLoading,
  }
}
