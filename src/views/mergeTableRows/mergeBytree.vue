<template>
  <a-form :model="form">
    <a-row :gutter="8">
      <a-col v-bind="spans" v-for="item in formGroup" :key="item.key">
        <a-form-item v-model:value="form[item.key]" :label="item.label">
          <a-select
            mode="multiple"
            v-model:value="form[item.key]"
            :options="selectOptions[item.key]"
          ></a-select>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
  <a-table
    :scroll="{ y: 500 }"
    :pagination="false"
    bordered
    :columns="resultColumns"
    :dataSource="rowsData"
  ></a-table>
</template>

<script setup lang="ts">
import type { SelectProps } from 'ant-design-vue'
import type { ColumnProps } from 'ant-design-vue/es/table'
import type { TColumn } from './data'
import { columnsWithForm as columns } from './config'
const spans = {
  xs: 8,
  sm: 8,
  md: 6,
  lg: 4,
  xl: 4,
  xxl: 4,
}
const form = reactive<Record<string, number[]>>({
  scheme: [11],
  attr1: [4, 5],
  attr2: [],
  attr3: [7, 9],
})
const formGroup = [
  { label: '套餐', key: 'scheme' },
  { label: '内存', key: 'attr1' },
  { label: '颜色', key: 'attr2' },
  { label: '运行内存', key: 'attr3' },
]
const selectOptions: Record<string, SelectProps['options']> = {
  scheme: [
    { label: '套餐一', value: 11 },
    { label: '套餐二', value: 12 },
  ],
  attr1: [
    { label: '32G', value: 4 },
    { label: '64G', value: 5 },
    { label: '128G', value: 6 },
  ],
  attr2: [
    { label: '红色', value: 1 },
    { label: '黄色', value: 2 },
    { label: '绿色', value: 3 },
  ],
  attr3: [
    { label: '32G', value: 7 },
    { label: '64G', value: 8 },
    { label: '128G', value: 9 },
  ],
}

const formMap: Record<number, string> = {}
const formData: Record<string, number[]> = {}
const dynamicColumn = formGroup
  .filter((item) => form[item.key].length > 0)
  .map((item) => {
    formData[item.key] = form[item.key]
    return {
      dataIndex: item.key,
      title: item.label,
    }
  })

Object.keys(selectOptions).forEach((key: string) => {
  const valueList = selectOptions[key]
  valueList!.forEach((item) => {
    formMap[item.value as number] = item.label
  })
})
const rowsData = permuteForm(formData)

const columnSpans = getSpansColumn(dynamicColumn)
debugger
const columnConfig = calculateRowSpans(columnSpans, rowsData)
const resultColumns = generateMergedColumns(columnConfig)
//截取需要合并的项
function getSpansColumn(sellColumns: ColumnProps[]): TColumn[] {
  const spans: TColumn[] = []
  for (let i = 0; i < sellColumns.length; i++) {
    const key = sellColumns[i].dataIndex
    spans.push(key as TColumn)
    if (key === 'attr3') {
      return spans
    }
  }
  // 兜底
  return spans
}
// 计算每一列需要的rowsSpans
function calculateRowSpans(
  columnSpans: TColumn[],
  rows: any[],
): Record<TColumn, number[]> {
  // 收集跨行映射
  const spanConfig: Record<string, number[]> = {}
  const spansData = new Array(rows.length).fill(0)
  //遍历到当前列为止的行值
  const columnValues: string[] = new Array(rows.length).fill('')
  columnSpans.forEach((columnSpan) => {
    const spans: number[] = [...spansData]
    columnValues[0] += rows[0][columnSpan] + '_'
    let currentSpanStart = 0
    for (let i = 0; i < rows.length; i++) {
      if (i < rows.length - 1) {
        columnValues[i + 1] += rows[i + 1][columnSpan] + '_'
      }
      // 遇到不同组或最后一行时结算跨度
      if (i === rows.length - 1 || columnValues[i + 1] !== columnValues[i]) {
        spans[currentSpanStart] = i - currentSpanStart + 1
        for (let j = currentSpanStart + 1; j <= i; j++) {
          spans[j] = 0
        }
        currentSpanStart = i + 1
      }
    }
    spanConfig[columnSpan] = spans
  })
  return spanConfig
}
//生成带合并配置的列定义
function generateMergedColumns(columnConfig: Record<TColumn, number[]>) {
  return dynamicColumn.concat(columns).map((column) => {
    if (!columnConfig[column.dataIndex]) return column

    return {
      ...column,
      customCell: (_, index: number) => ({
        rowSpan: columnConfig[column.dataIndex][index],
      }),
    }
  })
}

function permuteForm(form: {
  [key: string]: number[]
}): { [key: string]: number }[] {
  const keys = Object.keys(form)
  if (keys.length === 0) {
    return []
  }

  let result: string[][] = [[]]

  for (const key of keys) {
    const values = form[key]
    const newResult: string[][] = []
    for (const prevCombination of result) {
      for (const value of values) {
        newResult.push([...prevCombination, value])
      }
    }
    result = newResult
    console.log('🚀 ~ result:', result)
  }
  debugger
  return result.map((combination) => {
    const obj: { [key: string]: string } = { price: 0, price2: 0 }
    keys.forEach((key, index) => {
      obj[key] = formMap[combination[index]]
    })
    return obj
  })
}
</script>

<style scoped></style>
