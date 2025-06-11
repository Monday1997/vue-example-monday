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
const mapData: Record<string, string> = {
  感冒: '感冒是指百姓所说的“普通感冒”，又称“伤风”...',
  三九: '999感冒灵颗粒为浅棕色至深棕色的颗粒，味甜...',
  小柴胡: '小柴胡颗粒，中成药名。为和解剂，具有解表散热...',
  发烧: '发热，俗称发烧，症状名，正常...',
  咳嗽: '咳嗽（cough）是一种呼吸道常见症状，由...',
}
const card = reactive({ show: false, x: 0, y: 0, text: '', id: -1 })
const textData = ref<string[]>([])

init()
function init() {
  const a = []
  for (const key in mapData) {
    a.push(key)
  }
  // 根据map动态填写规则
  const str = '今天突然感冒了，请问吃三九好还是小柴胡好'
  const reg = new RegExp(`(${a.join('|')})`, 'g')

  let result: RegExpExecArray | null = null
  let currentIndex = 0
  const returnData: string[] = []

  while ((result = reg.exec(str))) {
    returnData.push(str.slice(currentIndex, result.index))
    returnData.push(result[1])
    currentIndex = result.index + result[0].length
  }
  if (str.length > currentIndex) {
    returnData.push(str.slice(currentIndex, str.length))
  }
  console.log(returnData)
  textData.value = returnData
}
function showCard(item: string, e: MouseEvent) {
  card.show = true
  card.x = e.clientX
  card.y = e.clientY
  card.text = mapData[item] || `根据id值${id}请求回来的数据展示`
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
    opacity 0.8s,
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
