<template>
  <div style="position: relative">
    <transition-group name="list">
      <div
        v-for="(item, index) in dragList"
        class="no-select list-item-wrap"
        :class="{ 'ban-move': item.noDrag || disabled }"
        :key="item.dragId"
        :style="listItemWrapStyle"
        @dragover.prevent
      >
        <!-- 列表项目容器，可以通过插槽插入其他内容 -->
        <div
          @dragstart.stop="(e) => handleDragStart(e, index, item.dragId)"
          @dragend.stop="handleDragEnd"
          :draggable="!item.noDrag"
        >
          <slot :index="index" :item="item" name="item">
            <div :class="{ 'list-item': true, 'ban-move': disabled }">
              {{ item[labelKey] }}
            </div>
          </slot>
          <!-- 项目在拖拽时激活显示 -->
          <transition name="fade-drag">
            <div v-if="item.dragId === draggedId" class="list-item-active" />
          </transition>
        </div>

        <!-- 显示的色块 -->
        <div
          @dragenter.stop="handleDragEnter"
          @dragleave.stop="handleDragLeave"
          @drop.prevent.stop="handleDrop"
          v-if="
            !item.noDrag && !isEmpty(draggedId) && draggedId !== item.dragId
          "
          class="drag-zone drag-zone-rect"
          :data-index="index"
        />
      </div>
    </transition-group>
    <slot name="after" />
  </div>
</template>

<script lang="ts" setup>
import type { PropType, CSSProperties } from 'vue'
import { refNull } from '@/utils/tsHelp'
import { isNumber, isEmpty } from '@/utils/is-type'
const props = defineProps({
  /** 插入区域方向，默认为垂直方向 */
  direction: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'vertical',
  },
  /** 设置内边距 也可以理解为空隙 */
  padding: {
    type: [String, Number],
    default: '6',
  },
  list: {
    type: Array as PropType<any[]>,
    required: true,
  },
  labelKey: {
    type: String,
    default: 'label',
  },
  /** 可移动模块的宽度占比 */
  itemWidth: {
    type: [String, Number],
    default: 'auto',
  },
  /** 外部容器的自定义样式 */
  propListItemWrapStyle: {
    type: Object as PropType<CSSProperties>,
    default() {
      return {}
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits<{
  'on-sort': [dragList: any[]]
  'on-drag-start': [{ index: number; dragId: string }]
  'update:list': [data: any[]]
}>()

const draggedId = refNull<string>(null)

// 列表容器样式
const listItemWrapStyle = computed<CSSProperties>(() => {
  return {
    display: props.direction === 'vertical' ? 'block' : 'inline-block',
    padding: `${props.padding}px`,
    width: isNumber(props.itemWidth) ? `${props.itemWidth}px` : props.itemWidth,
    ...props.propListItemWrapStyle,
  }
})

const dragList = ref<any[]>([]) // 每个项目必须有id
watch(() => props.list.length, initItems, { immediate: true })
function initItems() {
  const id = `drag_${Math.random().toString(16).slice(-6)}${Date.now()}`
  dragList.value = props.list.map((item, index) => ({
    ...item,
    dragId: item.id || item.dragId || `${id}${index.toString()}`,
  }))
  emits('update:list', dragList.value)
}

let draggedIndex = -1
let draggedHTML: HTMLElement | null = null

function handleDragStart(event: DragEvent, index: number, dragId: string) {
  if (draggedHTML || props.disabled) {
    return
  }
  draggedHTML = event.currentTarget as HTMLElement
  draggedIndex = index
  draggedId.value = dragId
  emits('on-drag-start', {
    index,
    dragId,
  })
}

function handleDrop(event: DragEvent) {
  const target = event.currentTarget as HTMLElement
  // 放置
  if (target.classList.contains('drag-zone')) {
    target.style.background = ''
    const index = parseInt(target.getAttribute('data-index')!)
    if (draggedIndex === index) {
      return
    }
    dragList.value.splice(index, 0, dragList.value.splice(draggedIndex, 1)[0])
    emits('update:list', dragList.value)
    emits('on-sort', dragList.value)
  }
}
function handleDragEnd() {
  if (draggedHTML) {
    draggedHTML.style.background = ''
  }
  setTimeout(() => {
    draggedHTML = null
    draggedId.value = ''
  }, 600)
}

function handleDragEnter(event: DragEvent) {
  const target = event.currentTarget as HTMLElement
  // 当可拖动的元素进入可放置的目标高亮目标节点
  if (target.classList.contains('drag-zone')) {
    target.style.background = 'blue'
  }
}
function handleDragLeave(event: DragEvent) {
  const target = event.currentTarget as HTMLElement
  // 当拖动元素离开可放置目标节点，重置其背景
  if (target.classList.contains('drag-zone')) {
    target.style.background = ''
  }
}
</script>

<style lang="less" scoped>
.list-item-wrap {
  position: relative;
  overflow: hidden;
  cursor: move;
  transition: all 0.6s ease;
  :deep(img) {
    user-select: none;
    pointer-events: none;
  }
}
.list-item {
  position: relative;
  padding: 6px 12px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
.list-item-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 0, 179, 0.2);
}
.ban-move {
  cursor: not-allowed;
}
.drag-zone-slide {
  position: absolute;
  z-index: 2;
}
.drag-zone-rect {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  opacity: 0.4;
}

.fade-drag-enter-active,
.fade-drag-leave-active {
  transition: all 0.6s ease;
}
.fade-drag-enter-from,
.fade-drag-leave-to {
  opacity: 0;
}
/** 列表过渡 */
.list-enter-from,
.list-leave-to {
  transform: translateY(30px);
  opacity: 0;
}
/** 不加这个，列表add和remove过渡效果会不出现 */
.list-leave-active {
  position: absolute;
}
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
