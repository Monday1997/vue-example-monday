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
    :dataSource="resultList"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'price'">
        <a-input v-model:value="record.price"></a-input>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import type { TColumn, TColumnProps } from './data'
import type { TableColumnType } from 'ant-design-vue'
import {
  columnsWithForm as columns,
  selectOptions,
  formGroup,
  spans,
} from './config'

const form = reactive<Record<string, number[]>>({
  scheme: [11],
  attr1: [4, 5],
  attr2: [],
  attr3: [7, 9],
})
let oldForm = JSON.parse(JSON.stringify(form))
// 设置form的value与label映射
const formValueLabelMap: Record<number, string> = {}
Object.keys(selectOptions).forEach((key: string) => {
  const valueList = selectOptions[key]
  valueList!.forEach((item) => {
    formValueLabelMap[item.value as number] = item.label
  })
})
let dynamicColumn: TColumnProps = []

const resultColumns = ref<TColumnProps>([])
const resultList = ref<Record<string, unknown>[]>([])
let colsTableMap: Record<string, Record<string, unknown>> = {}

watch(
  () => form,
  () => {
    dynamicColumn = getDynamicColumn()
    const handlerColumnArgs = updateList()
    updateColumns(handlerColumnArgs)
    // const listByForm = permuteForm()
    // resultList.value = listByForm.list
    // updateColumns(listByForm.type)
    // oldForm = JSON.parse(JSON.stringify(form))
  },
  {
    deep: true,
  },
)
function updateList(): {
  handlerType: 'addColumn' | 'delColumn' | 'update'
  key?: string
  index?: number
} {
  if (dynamicColumn.length === 0) {
    resultList.value = []
  }
  if (resultList.value.length === 0) {
    init()
  } else {
    let dynamicIndex = 0
    for (let i = 0; i < formGroup.length; i++) {
      const { key } = formGroup[i]
      const oldLength = oldForm[key].length
      if (oldLength > 0) {
        dynamicIndex++
      }
      if (form[key].length + oldLength === 1) {
        resultList.value = resultList.value.map((item) => {
          if (oldForm[key].length === 0) {
            item[key] = formValueLabelMap[form[key][0]]
          } else {
            delete item[key]
          }
          return item
        })
        const handlerType = oldLength === 0 ? 'addColumn' : 'delColumn'
        updateOldForms()
        return {
          handlerType,
          key,
          index: dynamicIndex,
        }
      }
    }
  }
  return { handlerType: 'update' }
}
function updateOldForms() {
  oldForm = JSON.parse(JSON.stringify(form))
}
function init() {
  dynamicColumn = getDynamicColumn()
  resultList.value = permuteForm()
  resultColumns.value = getColumns()
}
init()

function getDynamicColumn(): TColumnProps {
  return formGroup
    .filter((item) => form[item.key].length > 0)
    .map((item) => {
      return {
        dataIndex: item.key,
        title: item.label,
      }
    })
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
): TableColumnType[] {
  return dynamicColumn.concat(columns).map((column) => {
    if (!columnConfig[column.dataIndex as TColumn]) {
      return column
    }
    return {
      ...column,
      customCell: (_, index: number) => ({
        rowSpan: columnConfig[column.dataIndex as TColumn][index],
      }),
    } as TableColumnType
  })
}

/**
 * 生成表格数据
 */
function permuteForm(): Record<string, unknown>[] {
  if (dynamicColumn.length === 0) {
    return []
  }
  const keys: string[] = dynamicColumn.map((item) => item.dataIndex as string)
  let result: number[][] = [[]]

  for (const key of keys) {
    const values = form[key]
    const newResult: number[][] = []
    for (const prevCombination of result) {
      for (const value of values) {
        newResult.push([...prevCombination, value])
      }
    }
    result = newResult
  }
  // let type: 'add' | 'del' | 'update' = 'add'
  // if (resultList.value.length === result.length) {
  //   type = 'update'
  // }
  // const colsTableMapCpoy = colsTableMap
  colsTableMap = {}
  const list = result.map((combination) => {
    const obj: { [key: string]: unknown } = { price: 0, price2: 0 }
    const colsValue = combination.join('')
    // if (type === 'update') {
    //   obj.price = resultList.value[index].price as number
    //   obj.price2 = resultList.value[index].price2 as number
    // } else if (type === 'add') {
    //   if (colsTableMapCpoy[colsValue]) {
    //     colsTableMap[colsValue] = colsTableMapCpoy[colsValue]
    //     return colsTableMap[colsValue]
    //   }
    // }
    keys.forEach((key, keyIndex) => {
      obj[key] = formValueLabelMap[combination[keyIndex]]
    })
    colsTableMap[colsValue] = obj
    return obj
  })
  return list
}

function updateColumns({
  handlerType,
  key: handlerKey,
  index: handlerIndex,
}: {
  handlerType: 'addColumn' | 'delColumn' | 'update'
  key?: string
  index?: number
}) {
  if (handlerType === 'addColumn' && typeof handlerIndex === 'number') {
    const customCell =
      handlerIndex > 0
        ? resultColumns.value[handlerIndex - 1].customCell
        : (_, index?: number) => ({
            rowSpan: index! > 0 ? 0 : resultList.value.length,
          })
    // @ts-expect-error 忽略一下报错
    resultColumns.value.splice(handlerIndex, 0, {
      dataIndex: handlerKey,
      title: formGroup[handlerIndex].label,
      customCell,
    })
  } else if (handlerType === 'delColumn') {
    resultColumns.value.splice(handlerIndex! - 1, 1)
  }
}
</script>

<style scoped></style>
