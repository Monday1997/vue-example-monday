import type { ColumnProps } from 'ant-design-vue/es/table'
import type { StringKeyOf } from '../tsHelp'
/**
 *
 * @param {ColumnProps[]}  columns 原始表格列
 * @param {T[]} list 表格行数据
 * @param {string} [stopKey] 要停止列合并的key
 */
export function getMergeColumn<T extends Record<string, any>>(
  columns: ColumnProps[],
  list: T[],
  options?: {
    stopKey?: string
  },
): ColumnProps[] {
  if (!list || !list.length) {
    return columns
  }
  const columnSpans = getSpansColumn<T>(columns, options?.stopKey || '')
  const columnConfig = calculateRowSpans<T>(columnSpans, list)
  const resultColumns = generateMergedColumns(columnConfig, columns)
  return resultColumns
}
//截取需要合并的项
function getSpansColumn<T>(
  sellColumns: ColumnProps[],
  stopKey: string,
): StringKeyOf<T>[] {
  const spans: StringKeyOf<T>[] = []
  for (let i = 0; i < sellColumns.length; i++) {
    const key = sellColumns[i].dataIndex
    spans.push(key as StringKeyOf<T>)
    if (stopKey && key === stopKey) {
      return spans
    }
  }
  // 兜底
  return spans
}
// 计算每一列需要的rowsSpans
function calculateRowSpans<T extends Record<string, any>>(
  columnSpans: StringKeyOf<T>[],
  list: T[],
): Record<string, number[]> {
  const rows = list
  // 收集跨行映射
  const spanConfig = {} as Record<keyof T, number[]>
  const spansData = new Array(rows.length).fill(0)
  //遍历到当前列为止的行值
  const columnValues: string[] = new Array(rows.length).fill('')
  columnSpans.forEach((columnSpan) => {
    const spans: number[] = [...spansData]
    columnValues[0] += (rows[0][columnSpan] as string) + '_'
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
function generateMergedColumns(
  columnConfig: Record<string, number[]>,
  columns: ColumnProps[],
): ColumnProps[] {
  return columns.map((column) => {
    if (!columnConfig[column.dataIndex as string]) return column

    return {
      ...column,
      customCell: (_: any, index: number) => ({
        rowSpan: columnConfig[column.dataIndex as string][index],
      }),
    } as ColumnProps
  })
}
