<template>
  <a-menu
    theme="dark"
    v-model:selectedKeys="selectedKeys"
    style="width: 100%"
    mode="vertical"
    :items="items"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import type { MenuProps } from 'ant-design-vue'
import { ref } from 'vue'

const selectedKeys = ref(['table-merge'])
const items = ref([
  {
    key: 'table-merge',
    label: '合并表格',
    title: 'Navigation One',
  },
])
const handleClick: MenuProps['onClick'] = (menuInfo) => {
  console.log('click ', menuInfo)
}
</script>

<style scoped></style>
