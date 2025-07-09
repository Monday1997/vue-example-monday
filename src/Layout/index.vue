<script setup lang="ts">
import HomeMenu from './home-menu/index.vue'
import type { CSSProperties } from 'vue'

const containerStyle: CSSProperties = {
  padding: '24px',
  background: '#f5f5f5',
  height: '100vh',
}
</script>
<template>
  <a-layout>
    <a-layout-sider :trigger="null">
      <HomeMenu />
    </a-layout-sider>
    <a-layout-content :style="containerStyle">
      <div class="page">
        <RouterView v-slot="{ Component }">

          <transition name="bounce" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
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

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}
</style>
