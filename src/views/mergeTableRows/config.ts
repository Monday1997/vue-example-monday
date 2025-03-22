import type { TColumnProps, EItem } from './data'
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
