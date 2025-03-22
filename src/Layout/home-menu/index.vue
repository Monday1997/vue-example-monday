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
import { MenuRouteConfig } from './config.ts'
const route = useRoute()
const selectedKeys = ref([route.meta.menuName || route.name])
const items = [
  {
    key: MenuRouteConfig.mergeTableRows1,
    label: '合并表格1',
  },
]
const handleClick: MenuProps['onClick'] = (menuInfo) => {
  console.log('click ', menuInfo)
}
</script>

<style scoped></style>
