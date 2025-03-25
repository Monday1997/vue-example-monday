import type { TColumnProps, EItem } from './data'
import type { SelectProps } from 'ant-design-vue'
export const columns: Array<TColumnProps> = [
  {
    title: '套餐',
    dataIndex: 'scheme',
    width: 120,
  },
  {
    title: '内存',
    dataIndex: 'attr1',
    width: 120,
  },
  {
    title: '颜色',
    dataIndex: 'attr2',
    width: 120,
  },
  {
    title: '运行内存',
    dataIndex: 'attr3',
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

export const list: Record<EItem, string>[] = [
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

export const columnsWithForm: Array<TColumnProps> = [
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


export const formGroup = [
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
  xs: 8,
  sm: 8,
  md: 6,
  lg: 4,
  xl: 4,
  xxl: 4,
}
