<template>
  <div class="text_box">
    <div
      :class="{ hightLight: index % 2 !== 0 }"
      v-for="(item, index) in textData"
      :key="index"
    >
      <span>{{ item }}</span>

      <img
        v-if="index % 2 !== 0"
        @click="showCard(item, $event)"
        src="https://img95.699pic.com/element/40029/9841.png_860.png"
      />
    </div>
    <Transition name="card">
      <!-- 弹出的卡片 -->
      <div
        v-click-outside="hideCard"
        class="card"
        v-show="card.show"
        :style="`left:${card.x}px;top:${card.y}px`"
      >
        {{ card.text }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import useSplitWrords from './use-split-words'
import { mapData } from './config'

const keys: string[] = []
for (const key in mapData) {
  keys.push(key)
}
// 根据map动态填写规则
// 今天突然感冒了，请问吃三九好还是小柴胡好
const str = '这是一份买车险'

const { textData } = useSplitWrords(str, keys)

const card = reactive({ show: false, x: 0, y: 0, text: '', id: -1 })
function showCard(item: string, e: MouseEvent) {
  card.show = true
  card.x = e.clientX
  card.y = e.clientY
  card.text = mapData[item] || `该词条待完善`
  console.log(e.clientX)
}
function hideCard() {
  card.show = false
}
</script>

<style lang="less" scoped>
.text_box {
  display: flex;
  align-items: start;
}
.text_box a {
  color: red;
}
.text_box img {
  width: 20px;
  vertical-align: middle;
  margin-top: -10px;
  cursor: pointer;
}
.text_box .card {
  width: 120px;
  background-color: #bfc;
  border-radius: 20px;
  position: absolute;
  padding: 10px;
  color: #ff0000;
}
.card {
  font-size: 14px;
  min-height: 100px;
  transition:
    opacity 0.3s,
    font-size 0.3s ease,
    left 0.5s ease,
    min-height 0.3s;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  min-height: 0;
  font-size: 0;
}
.card-enter-to,
.card-leave-from {
  font-size: 18px;
}
.hightLight {
  color: red;
}
</style>
