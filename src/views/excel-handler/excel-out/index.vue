<template>
  <div>
    <a-button @click="formFile!.click()">
      导入
      <input
        ref="formFile"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        multiple
        style="display: none"
        type="file"
        @input="modalUpload"
      />
    </a-button>
    <a-table
      :loading="tableLoading"
      :pagination="false"
      bordered
      :columns="columns"
      :dataSource="tableList"
    ></a-table>
  </div>
</template>

<script setup lang="ts">
import { loadXLSX } from '@/utils/laodScript'
import { columns } from './config'
const formFile = ref<HTMLInputElement>()
const dataMap: Record<string, string | undefined> = {} //{数据1:data1}

columns.forEach((item) => {
  dataMap[item.title as string] = item.dataIndex as string
})
const tableList = ref<any[]>([])
const tableLoading = ref(false)
async function modalUpload() {
  try {
    tableLoading.value = true
    await loadXLSX()
    const file = formFile.value?.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async function (e) {
      console.log('🚀 ~ e:', e)
      if (e.target) {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        // const raw_data = XLSX.utils.sheet_to_json(worksheet,{header:1})
        // 另一种数据格式
        const raw_data: Record<string, any>[] =
          XLSX.utils.sheet_to_json(worksheet)
        const showTableList = raw_data.map((item) => {
          const result: Record<string, any> = {}
          Object.entries(item).forEach(([key, value]: [string, unknown]) => {
            if (dataMap[key] !== undefined) {
              result[dataMap[key]] = value
            }
          })
          return result
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
</script>

<style lang="scss" scoped></style>
