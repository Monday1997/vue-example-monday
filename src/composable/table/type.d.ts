import type { SelectProps } from 'ant-design-vue'
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
  /** 按照自己的方式格式化返回值 设置selectOptions */
  setSelectOptions?: (data: T) => TSelectConfig
  /** 按照自己的方式格式化返回值 设置默认值 */
  setInitForm?: (data: T) => TForm
}
