<script setup lang="ts">
import HomeMenu from '@/components/home-menu/index.vue'
import { ref } from 'vue'
import type { CSSProperties } from 'vue'
// import {  RouterView } from 'vue-router'

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
}
</style>
