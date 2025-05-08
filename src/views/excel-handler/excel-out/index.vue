<template>
  <div>
    <a-space>
      <a-button type="primary" @click="exportData" :loading="btnLoading">
        导出数据
      </a-button>
    </a-space>
    <a-table
      :loading="btnLoading"
      :pagination="false"
      bordered
      :columns="columns"
      :dataSource="tableList"
    ></a-table>
  </div>
</template>

<script setup lang="ts">
import { columns } from '../config'
import { useExcelHandle } from '@/composable/use-excel-handle'
const tableList = [
  {
    data1: '1',
    data2: '2',
    data3: '2',
    data4: '2',
    data5: '2',
    data6: '2',
  },
]

const { btnLoading, exportTable } = useExcelHandle(columns)
function exportData() {
  exportTable(tableList)
}
</script>

<style lang="scss" scoped></style>
