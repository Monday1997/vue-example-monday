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
import { columns } from './config'
import { useExcelHandle } from '@/composable/use-excel-handle'
const formFile = ref<HTMLInputElement>()
const dataMap: Record<string, string | undefined> = {} //{数据1:data1}

columns.forEach((item) => {
  dataMap[item.title as string] = item.dataIndex as string
})
const { tableLoading, tableList, importTable } = useExcelHandle(
  formFile as Ref<HTMLInputElement>,
  columns,
)
async function modalUpload() {
  importTable()
}
</script>

<style lang="scss" scoped></style>
