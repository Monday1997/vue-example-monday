<template>
  <PageLayout :navs="['合并表格', '用户操作']" title="用户操作">
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
      :pagination="false"
      bordered
      :columns="resultColumns"
      :dataSource="resultList"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'price'">
          <a-input v-model:value="record.price"></a-input>
        </template>
      </template>
    </a-table>
  </PageLayout>
</template>

<script setup lang="ts">
import type { ColumnProps } from 'ant-design-vue/es/table'
import { EItem } from './config'
import type { TColumn, TColumnProps } from './data'
import {
  columnsWithForm as columns,
  selectOptions,
  formGroup,
  spans,
} from './config'

const form = reactive<Partial<Record<EItem, number[]>>>({
  [EItem.scheme]: [11],
  [EItem.attr1]: [4, 5],
  [EItem.attr2]: [],
  [EItem.attr3]: [7, 9],
})
// 设置form的value与label映射
const formValueLabelMap: Record<number, string> = {}
const selecKeys = Object.keys(selectOptions) as EItem[]
selecKeys.forEach((key: EItem) => {
  const valueList = selectOptions[key]
  valueList!.forEach((item) => {
    formValueLabelMap[item.value as number] = item.label
  })
})

let dynamicColumn: TColumnProps = []
const resultColumns = ref<ColumnProps[]>([])
const resultList = ref<Record<string, unknown>[]>([])
let colsTableMap: Record<string, Record<string, unknown>> = {}

watch(
  () => form,
  () => {
    dynamicColumn = getDynamicColumn()
    resultList.value = permuteForm()
    resultColumns.value = getColumns()
  },
  {
    deep: true,
    immediate: true,
  },
)
function getDynamicColumn(): TColumnProps {
  return formGroup
    .filter((item) => form[item.key]!.length > 0)
    .map((item) => {
      return {
        dataIndex: item.key,
        title: item.label,
      }
    }) as TColumnProps
}
function getColumns() {
  const columnSpans = getSpansColumn()
  const columnConfig = calculateRowSpans(columnSpans)
  const column = generateMergedColumns(columnConfig)
  return column
}
//截取需要合并的项
function getSpansColumn(): TColumn[] {
  const spans: TColumn[] = []
  for (let i = 0; i < dynamicColumn.length; i++) {
    const key = dynamicColumn[i].dataIndex
    spans.push(key as TColumn)
  }
  return spans
}
// 计算每一列需要的rowsSpans
function calculateRowSpans(columnSpans: TColumn[]): Record<TColumn, number[]> {
  const rows = resultList.value
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
/**
 * 生成带合并配置的列定义
 * @params columnConfig 合并行的列配置
 */
function generateMergedColumns(
  columnConfig: Record<TColumn, number[]>,
): ColumnProps[] {
  return dynamicColumn.concat(columns).map((column) => {
    if (!columnConfig[column.dataIndex as TColumn]) {
      return column
    }
    return {
      ...column,
      customCell: (_, index: number) => ({
        rowSpan: columnConfig[column.dataIndex as TColumn][index],
      }),
    } as ColumnProps
  })
}

/**
 * 生成表格数据
 */
function permuteForm(): Record<string, unknown>[] {
  if (dynamicColumn.length === 0) {
    return []
  }
  const keys: EItem[] = dynamicColumn.map((item) => item.dataIndex as EItem)
  let result: number[][] = [[]]

  for (const key of keys) {
    const values = form[key]
    const newResult: number[][] = []
    for (const prevCombination of result) {
      for (const value of values!) {
        newResult.push([...prevCombination, value])
      }
    }
    result = newResult
  }
  let type: 'add' | 'del' | 'udpate' = 'add'
  if (resultList.value.length === result.length) {
    type = 'udpate'
  }
  const colsTableMapCpoy = colsTableMap
  colsTableMap = {}
  return result.map((combination, index) => {
    const obj: { [key: string]: unknown } = { price: 0, price2: 0 }
    const colsValue = combination.join('')
    if (type === 'udpate') {
      obj.price = resultList.value[index].price as number
      obj.price2 = resultList.value[index].price2 as number
    } else if (type === 'add') {
      if (colsTableMapCpoy[colsValue]) {
        colsTableMap[colsValue] = colsTableMapCpoy[colsValue]
        return colsTableMap[colsValue]
      }
    }
    keys.forEach((key, keyIndex) => {
      obj[key] = formValueLabelMap[combination[keyIndex]]
    })
    colsTableMap[colsValue] = obj
    return obj
  })
}
</script>

<style scoped></style>
