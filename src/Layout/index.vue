<script setup lang="ts">
import HomeMenu from './home-menu/index.vue'
import type { CSSProperties } from 'vue'

const collapsed = ref(false)
const containerStyle: CSSProperties = {
  padding: '24px',
  background: '#f5f5f5',
  height: '100vh',
}
</script>
<template>
  <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <HomeMenu />
    </a-layout-sider>
    <a-layout-content :style="containerStyle">
      <div class="page">
        <RouterView />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: white;
  overflow-y: auto;
  padding: 24px;
}
</style>
