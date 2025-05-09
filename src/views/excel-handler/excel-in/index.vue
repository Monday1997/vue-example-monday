<template>
  <PageLayout :navs="['excel导入导出', '导入']" title="导入示例">
    <template #extract-btn>
      <a-space>
        <a-button type="primary" @click="downModel" :loading="btnLoading">
          模板下载
        </a-button>
        <a-button @click="refInput!.click()">
          导入
          <input
            ref="refInput"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            multiple
            style="display: none"
            type="file"
            @input="importTable"
          />
        </a-button>
      </a-space>
    </template>
    <a-table
      :loading="tableLoading"
      :pagination="false"
      bordered
      :columns="columns"
      :dataSource="tableList"
    ></a-table>
  </PageLayout>
</template>

<script setup lang="ts">
import { columns } from '../config'
import { useExcelHandle } from '@/composable/use-excel-handle'
const refInput = ref<HTMLInputElement>()

const { tableLoading, tableList, importTable, downModel, btnLoading } =
  useExcelHandle(columns, refInput as Ref<HTMLInputElement>)
</script>

<style lang="scss" scoped></style>
