<template>
  <div>
    <a-table :columns="rows" :dataSource="list"></a-table>
  </div>
</template>

<script setup lang="ts">
import type { ColumnProps } from 'ant-design-vue/es/table'
const rows: Array<ColumnProps> = [
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
type TItem = {
  scheme: string
  attr1: string
  attr2: string
  price: string
  price2: string
}
const list: TItem[] = [
  {
    scheme: '普通套餐',
    attr1: '35G',
    attr2: '天蓝色',
    price: '1000',
    price2: '2000',
  },
  {
    scheme: '普通套餐',
    attr1: '35G',
    attr2: '鹦鹉绿',
    price: '1000',
    price2: '2000',
  },
  {
    scheme: '普通套餐',
    attr1: '35G',
    attr2: '兰花紫',
    price: '1000',
    price2: '2000',
  },
  {
    scheme: '耳机套餐',
    attr1: '35G',
    attr2: '天蓝色',
    price: '1001',
    price2: '2001',
  },
  {
    scheme: '耳机套餐',
    attr1: '35G',
    attr2: '鹦鹉绿',
    price: '1001',
    price2: '2001',
  },
  {
    scheme: '耳机套餐',
    attr1: '35G',
    attr2: '兰花紫',
    price: '1001',
    price2: '2001',
  },
]
</script>

<style scoped></style>
