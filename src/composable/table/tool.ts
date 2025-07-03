import type { anyObj, TFormGroupItem, TForm } from './type'
import type { ColumnProps } from 'ant-design-vue/es/table'
/**
 * @description 赋值用户设置的固定值
 * @param record 列数据
 */
export function getFixValueFn(
  record: anyObj,
  fixColumns: ColumnProps[],
  fixColumnsConfig: Record<string, any>,
) {
  fixColumns.map((item) => {
    const { dataIndex } = item as { dataIndex: string }
    record[dataIndex] = ''
    const currentFixColumnsConfig = fixColumnsConfig?.[dataIndex]
    if (currentFixColumnsConfig) {
      record[dataIndex] =
        typeof currentFixColumnsConfig === 'function'
          ? currentFixColumnsConfig(record)
          : currentFixColumnsConfig
    }
  })
}

// 根据传入的formGroup生成表单
export function generateForm(formGroup: TFormGroupItem[]) {
  return formGroup.reduce((pre: TForm, cur: TFormGroupItem) => {
    pre[cur.key] = []
    return pre
  }, {})
}

/**
 * @description 找到被删除的值 确保list1长 list2短
 * @param list1
 * @param list2
 * @returns 被删除的值
 */
export function findDelValue<T extends string | number>(
  list1: T[],
  list2: T[],
) {
  let l = 0,
    r = 0
  while (l < list1.length && r < list2.length) {
    if (list1[l] === list2[r]) {
      l++
      r++
    } else {
      return list1[l]
    }
  }
  return list1[l]
}
