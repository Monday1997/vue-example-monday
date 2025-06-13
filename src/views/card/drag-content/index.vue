<template>
  <PageLayout :navs="['其他', '内容拖拽']" title="内容拖拽">
    <div class="flex-wrap">
      <div class="left" style="width: 200px; margin-left: 20px">
        <div
          class="left-item"
          v-for="item in leftList"
          :key="item.key"
          draggable="true"
          @dragstart="(e) => dragstart(e, item)"
          @dragend="dragend"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="main">
        <div class="main-item" v-if="mainList.length === 0">
          拖拽到此
          <div
            v-show="dragTarget"
            class="drop-box"
            :class="`color-${removePosition}`"
            @drop="drop"
            @dragenter="dragenter"
            @dragover.prevent="dragover"
            @dragleave="dragLeave"
          ></div>
        </div>
        <template v-else>
          <div v-for="item in mainList" :key="item.key">{{ item.label }}</div>
          <div
            v-show="dragTarget"
            class="drop-box"
            :class="`color-${removePosition}`"
            @drop="drop"
            @dragenter="dragenter"
            @dragover.prevent="dragover"
            @dragleave="dragLeave"
          ></div>
        </template>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { throllte } from '@/utils/tools/basic'
import type { SelectProps } from 'ant-design-vue'
type TLeftItem = {
  label: string
  key: string
  type: 'input' | 'select' | 'switch'
  options?: SelectProps['options']
}
const leftList = shallowRef<TLeftItem[]>([
  {
    label: '名字',
    key: 'name',
    type: 'input',
  },
  {
    label: '爱好',
    key: 'hobby',
    type: 'select',
    options: [
      { label: '踢足球', value: 'footbool' },
      { label: '游泳', value: 'swimming' },
    ],
  },
])
const mainList = ref<TLeftItem[]>([])
// 被拉取的元素
const dragTarget = shallowRef<HTMLElement | null>(null)
const dragItem = shallowRef<TLeftItem | null>(null)
function dragstart(e: DragEvent, item: TLeftItem) {
  dragTarget.value = e.currentTarget as HTMLElement
  dragItem.value = item
}

const removePosition = ref('top')
const dragover = throllte((e) => {
  if (!e.currentTarget) {
    return
  }
  const mouseY = e.clientY
  const { top, bottom } = (
    e.currentTarget as HTMLElement
  ).getBoundingClientRect()
  removePosition.value = mouseY < (top + bottom) / 2 ? 'top' : 'bottom'
}, 50)

const isDivIn = ref(false)
function dragenter(e) {
  console.log('进来了')
  isDivIn.value = true
}
function dragLeave() {
  console.log('离开了')
  isDivIn.value = false
}
function dragend() {
  dragTarget.value = null
}
function drop(e: DragEvent) {
  if (!dragTarget.value) {
    return
  }
  leftList.value = leftList.value.filter(
    (item) => item.key !== dragItem.value?.key,
  )
  if (removePosition.value === 'top') {
    mainList.value.unshift(dragItem.value!)
  } else {
    mainList.value.push(dragItem.value!)
  }
  // const drageValue = dragTarget.value
  // drageValue.parentNode?.removeChild(drageValue!)
  // const currentTarget = e.currentTarget as HTMLElement
  // const aim = currentTarget.parentNode
  // aim?.parentNode?.insertBefore(drageValue, aim)
  // dragTarget.value = null
}
</script>

<style scoped lang="less">
.main {
  position: relative;
}
.drop-box {
  position: absolute;
  inset: 0;
}

.color-top {
  border-top: 1px solid red;
}
.color-bottom {
  border-bottom: 1px solid red;
}
</style>
