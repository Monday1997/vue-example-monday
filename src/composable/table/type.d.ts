import type { SelectProps } from 'ant-design-vue'
/** 更新列时的必要参数 */
type TColumnUPdateArg = {
  handlerType: 'addColumn' | 'delColumn' | 'ListUpdate' | 'update'
  key?: EItem
  index?: number
}
export type TFormGroupItem = {
  label: string
  key: string
  [key: string]: any
}
export type TForm = Record<string, (string | number)[]>
export type TSelectConfig = Record<string, SelectProps['optins']>

export type MergeFormProps<T = any> = {
  getSelectOptionApi: () => Promise<T>
  formGroup: TFormGroupItem[]
  fixColumns?: ColumnProps[]
  /** 格式化返回值 设置selectOptions */
  setSelectOptions?: (data: T) => TSelectConfig
  /** 格式化返回值 设置form默认值 */
  setInitForm?: (data: T) => TForm
  /** 设置固定列的默认值 */
  fixColumnsConfig?: Reocrd<string, any>
}
