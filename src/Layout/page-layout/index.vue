<template>
  <div>
    <a-breadcrumb style="margin-bottom: 20px">
      <a-breadcrumb-item v-for="item in navs || []" :key="item">
        {{ item }}
      </a-breadcrumb-item>
    </a-breadcrumb>
    <!-- 标题 -->
    <div v-if="title" class="flex-wrap flex-x-between title-box">
      <h1>{{ title }}</h1>
      <slot name="extract-btn"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
type TProps = {
  navs?: string[]
  title?: string
}
defineProps<TProps>()
</script>

<style lang="scss">
.title-box {
  margin-bottom: 20px;
}
</style>
