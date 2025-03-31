<template>
  <div>
    <a-table bordered :columns="resultColumns" :dataSource="list"></a-table>
  </div>
</template>

<script setup lang="ts">
import type { ColumnProps } from 'ant-design-vue/es/table'
import { columns, list } from './config'
import { EItem } from './config'
const columnSpans = getSpansColumn(columns)
const columnConfig = calculateRowSpans(columnSpans)
const resultColumns = generateMergedColumns(columnConfig)
console.log('🚀 ~ resultColumns:', resultColumns)

//截取需要合并的项
function getSpansColumn(sellColumns: ColumnProps[]): EItem[] {
  const spans: EItem[] = []
  for (let i = 0; i < sellColumns.length; i++) {
    const key = sellColumns[i].dataIndex
    spans.push(key as EItem)
    if (key === EItem.attr3) {
      return spans
    }
  }
  // 兜底
  return spans
}
// 计算每一列需要的rowsSpans
function calculateRowSpans(columnSpans: EItem[]): Record<EItem, number[]> {
  const rows = list
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
function generateMergedColumns(columnConfig: Record<EItem, number[]>) {
  return columns.map((column) => {
    if (!columnConfig[column.dataIndex as EItem]) return column

    return {
      ...column,
      customCell: (_, index: number) => ({
        rowSpan: columnConfig[column.dataIndex as EItem][index],
      }),
    }
  })
}
</script>

<style scoped></style>
