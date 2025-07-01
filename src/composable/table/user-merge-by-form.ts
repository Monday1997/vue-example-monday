import { EItem } from '@/views/mergeTableRows/config'
export type TColumn = EItem | 'price' | 'price2'
import type { ColumnProps } from 'ant-design-vue/es/table'
import type {
  TFormGroupItem,
  TForm,
  MergeFormProps,
  TSelectConfig,
} from './type'
export function userMergeByForm<T = any>(options: MergeFormProps<T>) {
  const { getSelectOptionApi, fixColumns = [], formGroup } = options

  let dynamicColumn: ColumnProps[] = []
  // 根据传入的formGroup生成表单
  function generateForm() {
    return formGroup.reduce((pre: TForm, cur: TFormGroupItem) => {
      pre[cur.key] = []
      return pre
    }, {})
  }

  const form = reactive<TForm>(generateForm())

  // 设置form的value与label映射
  const formValueLabelMap: Record<number | string, string> = {}
  async function loadSelectOption() {
    const res = await getSelectOptionApi()
    const selectConfig: TSelectConfig =
      options.setSelectOptions?.(res) || (res as any).selectConfig || {}
    const initForm: TForm =
      options.setInitForm?.(res) || (res as any).initForm || {}
    // key与label的映射
    Object.entries(selectConfig).forEach(([_, value]) => {
      value.forEach((item: any) => {
        formValueLabelMap[item.value] = item.label
      })
    })
    Object.entries(initForm).forEach(([key, value]) => {
      form[key] = value
    })
  }

  const resultColumns = ref<ColumnProps[]>([])
  const resultList = ref<Record<string, unknown>[]>([])
  watch(
    () => form,
    () => {
      console.log('form')
      dynamicColumn = getDynamicColumn()
      resultList.value = permuteForm()
      resultColumns.value = getColumns()
    },
    {
      deep: true,
    },
  )

  // 缓存变化过的数据
  let cacheColsTableMap: Record<string, Record<string, unknown>> = {}
  /**
   * 根据form生成表格数据
   */
  function permuteForm(): Record<string, unknown>[] {
    if (dynamicColumn.length === 0) {
      return []
    }
    const keys: EItem[] = dynamicColumn.map((item) => item.dataIndex as EItem)
    let result: (number | string)[][] = [[]]

    for (const key of keys) {
      const values = form[key]
      const newResult: (number | string)[][] = []
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
    const colsTableMapCpoy = cacheColsTableMap
    cacheColsTableMap = {}
    return result.map((combination, index) => {
      const obj: { [key: string]: unknown } = { price: 0, price2: 0 }
      const colsValue = combination.join('')
      if (type === 'udpate') {
        obj.price = resultList.value[index].price as number
        obj.price2 = resultList.value[index].price2 as number
      } else if (type === 'add') {
        if (colsTableMapCpoy[colsValue]) {
          cacheColsTableMap[colsValue] = colsTableMapCpoy[colsValue]
          return cacheColsTableMap[colsValue]
        }
      }
      keys.forEach((key, keyIndex) => {
        obj[key] = combination[keyIndex]
        obj[`${key}_label`] = formValueLabelMap[combination[keyIndex]]
      })
      cacheColsTableMap[colsValue] = obj
      return obj
    })
  }

  function getDynamicColumn(): ColumnProps[] {
    // return opitons.getColumnByForm()
    return formGroup.reduce((pre: ColumnProps[], item) => {
      if (form[item.key]!.length > 0) {
        pre.push({
          dataIndex: item.key,
          title: item.label,
        } as ColumnProps)
      }
      return pre
    }, [])
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
  function calculateRowSpans(
    columnSpans: TColumn[],
  ): Record<TColumn, number[]> {
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
    return dynamicColumn.concat(fixColumns).map((column) => {
      if (!columnConfig[column.dataIndex as TColumn]) {
        return column
      }
      return {
        ...column,
        dataIndex: `${column.dataIndex}_label`,
        customCell: (_, index: number) => ({
          rowSpan: columnConfig[column.dataIndex as TColumn][index],
        }),
      } as ColumnProps
    })
  }

  return {
    resultColumns,
    resultList,
    form,
    loadSelectOption,
  }
}
