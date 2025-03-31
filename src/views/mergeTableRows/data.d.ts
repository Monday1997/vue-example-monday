import { TableColumnType } from 'ant-design-vue'
import { EItem } from './config'
export type TColumn = EItem | 'price' | 'price2'
export type TColumnProps = (Omit<TableColumnType, 'dataIndex'> & { dataIndex: EItem | 'price' | 'price2' })[]

