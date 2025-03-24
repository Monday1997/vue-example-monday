<template>
  <a-menu
    theme="dark"
    mode="inline"
    v-model:selectedKeys="selectedKeys"
    v-model:openKeys="openKeys"
    style="width: 100%"
    :items="items"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { pagesRoute } from '@/router/index'
import type { TMenuRouteRaw } from '@/router/index'
const route = useRoute()
const router = useRouter()

const selectedKeys = ref([route.name])
const openKeysMap: Record<string, string[]> = {}
const items = getMenu(pagesRoute)

type TMenu = {
  key: string
  label: string
  children: TMenu[] | null
}
/**
 * 构造menu
 * @param routes
 * @param opeKey 父组件的key集合 用于openKey的赋值
 */
function getMenu(routes: TMenuRouteRaw[], opeKey: string[] = []): TMenu[] {
  return routes.map((item: TMenuRouteRaw) => {
    if (opeKey.length) {
      openKeysMap[item.name] = opeKey
    }
    return {
      key: item.name,
      label: item.meta.title,
      children: item.children
        ? getMenu(item.children as TMenuRouteRaw[], opeKey.concat(item.name))
        : null,
    }
  })
}
const openKeys = openKeysMap[route.name as string]

function handleClick(item: TMenu) {
  router.push({
    name: item.key,
  })
}
</script>

<style scoped></style>
