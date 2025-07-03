import type { ColumnProps } from 'ant-design-vue/es/table'
import type { anyObj, TForm, TFormGroupItem } from './type'
/** 让frmGroup中有选中值的项组成列  */
export function getDynamicColumn(
  formGroup: TFormGroupItem[],
  form: TForm,
): ColumnProps[] {
  return formGroup.reduce((pre: ColumnProps[], item: Record<string, any>) => {
    if (form[item.key]!.length > 0) {
      pre.push({
        dataIndex: item.key,
        title: item.label,
      } as ColumnProps)
    }
    return pre
  }, [])
}

/**
 * 收集动态列的key值
 *  */
function getSpansColumn(dynamicColumn: ColumnProps[]): string[] {
  const spans: string[] = []
  for (let i = 0; i < dynamicColumn.length; i++) {
    const key = dynamicColumn[i].dataIndex
    spans.push(key as string)
  }
  return spans
}

/**
 * @description 计算跨行数据用于customCell
 * @param columnSpans 计算每一列需要的rowsSpans
 * @param resultList 当前的行数据
 * @returns
 */
function calculateRowSpans(
  columnSpans: string[],
  resultList: anyObj[],
): Record<string, number[]> {
  const rows = resultList
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
  columnConfig: Record<string, number[]>,
  dynamicColumn: ColumnProps[],
  fixColumns: ColumnProps[],
): ColumnProps[] {
  return dynamicColumn.concat(fixColumns).map((column) => {
    if (!columnConfig[column.dataIndex as string]) {
      return column
    }
    return {
      ...column,
      dataIndex: `${column.dataIndex}_label`,
      customCell: (_, index: number) => ({
        rowSpan: columnConfig[column.dataIndex as string][index],
      }),
    } as ColumnProps
  })
}

export function getGolumnFn(
  dynamicColumn: ColumnProps[],
  resultList: anyObj[],
  fixColumns: ColumnProps[],
) {
  const columnSpans = getSpansColumn(dynamicColumn)
  const columnConfig = calculateRowSpans(columnSpans, resultList)
  const column = generateMergedColumns(columnConfig, dynamicColumn, fixColumns)
  return column
}
