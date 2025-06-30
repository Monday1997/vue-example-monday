import type { TableColumnType } from 'ant-design-vue'
import type { StringKeyOf } from '../tsHelp'
import { isEmpty } from '../is-type'
const PREFIX = 'column_span_'

/**
 * 合并列数据并将字段整合至list
 * @param columnSpans string[] 要设置的列（必须连贯）
 * @param list any[]
 * */
export function addSpansValueInList<T extends Record<string, any>>(
  columnSpans: StringKeyOf<T>[],
  list: T[],
): any[] {
  calculateRowSpans<T>(columnSpans, list)
  return list
}

// 计算每一列需要的rowsSpans 要合并的columnSpan
function calculateRowSpans<T extends Record<string, any>>(
  columnSpans: StringKeyOf<T>[],
  list: any[],
): void {
  const rows = list
  //遍历到当前列为止的行值
  const columnValues: string[] = new Array(rows.length).fill('')
  columnSpans.forEach((columnSpan) => {
    columnValues[0] += rows[0][columnSpan] + '_'
    let currentSpanStart = 0
    for (let i = 0; i < rows.length; i++) {
      if (i < rows.length - 1) {
        columnValues[i + 1] += rows[i + 1][columnSpan] + '_'
      }
      // 遇到不同组或最后一行时结算跨度
      if (i === rows.length - 1 || columnValues[i + 1] !== columnValues[i]) {
        rows[currentSpanStart][PREFIX + columnSpan] = i - currentSpanStart + 1
        for (let j = currentSpanStart + 1; j <= i; j++) {
          rows[j][PREFIX + columnSpan] = 0
        }
        currentSpanStart = i + 1
      }
    }
  })
}

/**
 * 结合setFormatHandle 设置要合并的行
 * @param row_key string 对应的列名
 * @param customCell 若原先有customCell
 * */
type CustomCellType = TableColumnType extends { customCell?: infer T }
  ? T
  : never

export function setCustomCell(
  row_key: string,
  customCell?: CustomCellType,
): CustomCellType {
  return (record, rowIndex, column) => {
    const baseCell =
      typeof customCell === 'function'
        ? customCell(record, rowIndex, column)
        : {}
    return {
      ...baseCell,
      rowSpan: isEmpty(record[PREFIX + row_key]) ? 1 : record[PREFIX + row_key],
    }
  }
}
