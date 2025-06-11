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
    <!-- 弹出的卡片 -->
    <div
      v-click-outside="hideCard"
      class="card"
      v-show="card.show"
      :style="`left:${card.x}px;top:${card.y}px`"
    >
      {{ card.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
const mapData: Record<string, number> = {
  感冒: 0,
  三九: 1,
  小柴胡: 2,
  发烧: 3,
  咳嗽: 4,
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
  const id = mapData[item]
  card.show = true
  card.x = e.clientX
  card.y = e.clientY
  card.id = id
  card.text = `根据id值${id}请求回来的数据展示`
  console.log(e.clientX)
}
function hideCard() {
  card.show = false
}
</script>

<style>
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
  /* margin-bottom: 20px; */
}
.text_box .card {
  width: 100px;
  height: 100px;
  background-color: #bfc;
  border-radius: 20px;
  position: absolute;
  padding: 10px;
  font-size: 18px;
  color: #ff0000;
  animation: mymove 0.3s 1;
  transition: all 0.5s ease-in-out;
}
@keyframes mymove {
  from {
    height: 0;
    font-size: 0;
  }
  to {
    height: 100px;
    font-size: 18px;
  }
}
.hightLight {
  color: red;
}
</style>
