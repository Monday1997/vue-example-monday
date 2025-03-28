import { TableColumnType } from 'ant-design-vue'
export enum EItem {
  scheme = 'scheme',
  attr1 = 'attr1',
  attr2 = 'attr2',
  attr3 = 'attr3',
}
export type TColumn = EItem | 'price' | 'price2'
export type TColumnProps = (Omit<TableColumnType, 'dataIndex'> & { dataIndex: EItem | 'price' | 'price2' })[]

