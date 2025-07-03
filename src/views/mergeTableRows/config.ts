import type { TColumn } from './data'
import type { TableColumnType, SelectProps } from 'ant-design-vue'
import { setCustomCell } from '@/utils/tools/static-table-merge'
export enum EItem {
  scheme = 'scheme',
  attr1 = 'attr1',
  attr2 = 'attr2',
  attr3 = 'attr3',
}

export const columns: TableColumnType[] = [
  {
    title: '套餐',
    dataIndex: EItem.scheme,
    key: EItem.scheme,
    width: 120,
  },
  {
    title: '内存',
    dataIndex: EItem.attr1,
    width: 120,
  },
  {
    title: '颜色',
    dataIndex: EItem.attr2,
    width: 120,
  },
  {
    title: '运行内存',
    dataIndex: EItem.attr3,
    width: 120,
  },
  {
    title: '进价',
    dataIndex: 'price',
    width: 120,
  },
  {
    title: '售价',
    dataIndex: 'price2',
    width: 120,
  },
]
export const staticColumns: TableColumnType[] = [
  {
    title: '套餐',
    dataIndex: EItem.scheme,
    width: 120,
    customCell: setCustomCell('scheme'),
  },
  {
    title: '内存',
    dataIndex: EItem.attr1,
    width: 120,
    customCell: setCustomCell('attr1'),
  },
  {
    title: '颜色',
    dataIndex: EItem.attr2,
    width: 120,
    customCell: setCustomCell('attr2'),
  },
  {
    title: '运行内存',
    dataIndex: EItem.attr3,
    width: 120,
  },
  {
    title: '进价',
    dataIndex: 'price',
    width: 120,
  },
  {
    title: '售价',
    dataIndex: 'price2',
    width: 120,
  },
]
export const list: Record<TColumn, string>[] = [
  {
    scheme: '普通套餐',
    attr1: '35G',
    attr2: '天蓝色',
    attr3: '64G',
    price: '1000',
    price2: '2000',
  },
  {
    scheme: '普通套餐',
    attr1: '35G',
    attr2: '鹦鹉绿',
    attr3: '64G',
    price: '1000',
    price2: '2000',
  },
  {
    scheme: '普通套餐',
    attr1: '35G',
    attr2: '兰花紫',
    attr3: '64G',
    price: '1000',
    price2: '2000',
  },
  {
    scheme: '耳机套餐',
    attr1: '35G',
    attr2: '天蓝色',
    attr3: '64G',
    price: '1001',
    price2: '2001',
  },
  {
    scheme: '耳机套餐',
    attr1: '35G',
    attr2: '鹦鹉绿',
    attr3: '64G',
    price: '1001',
    price2: '2001',
  },
  {
    scheme: '耳机套餐',
    attr1: '35G',
    attr2: '兰花紫',
    attr3: '64G',
    price: '1001',
    price2: '2001',
  },
  {
    scheme: '耳机套餐',
    attr1: '35G',
    attr2: '兰花紫',
    attr3: '32G',
    price: '1001',
    price2: '2001',
  },
]

// 合并表格二
export const columnsWithForm: TableColumnType[] = [
  {
    title: '进价',
    dataIndex: 'price',
    width: 120,
  },
  {
    title: '售价',
    dataIndex: 'price2',
    width: 120,
  },
]

export const formGroup: { label: string; key: string }[] = [
  { label: '套餐', key: 'scheme' },
  { label: '内存', key: 'attr1' },
  { label: '颜色', key: 'attr2' },
  { label: '运行内存', key: 'attr3' },
]

export const selectOptions: Record<string, SelectProps['options']> = {
  scheme: [
    { label: '套餐一', value: 11 },
    { label: '套餐二', value: 12 },
  ],
  attr1: [
    { label: '32G', value: 4 },
    { label: '64G', value: 5 },
    { label: '128G', value: 6 },
  ],
  attr2: [
    { label: '红色', value: 1 },
    { label: '黄色', value: 2 },
    { label: '绿色', value: 3 },
  ],
  attr3: [
    { label: '32G', value: 7 },
    { label: '64G', value: 8 },
    { label: '128G', value: 9 },
  ],
}

export const spans = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 8,
  xl: 6,
  xxl: 4,
}
