<template>
  <div style="position: relative">
    <transition-group name="list">
      <div
        v-for="(item, index) in dragItems"
        :key="item.dragId"
        :class="['list-item-wrap']"
        :style="listItemWrapStyle"
        @dragend.stop="handleDragEnd($event)"
        @dragenter.stop="handleDragEnter($event)"
        @dragleave.stop="handleDragLeave($event)"
        @dragover.prevent
        @dragstart.stop="handleDragStart($event, index, item.dragId)"
        @drop.prevent.stop="handleDrop($event)"
      >
        <!-- 列表项目容器，可以通过插槽插入其他内容，允许拖拽 -->
        <div :draggable="!item.noDrag">
          <slot :index="index" :item="item" name="item">
            <div :class="{ 'list-item': true, 'list-move': disabled }">
              {{ item[labelKey] }}
            </div>
          </slot>
          <!-- 项目在拖拽时激活显示 -->
          <transition name="fade-drag">
            <div v-if="item.dragId === draggedId" class="list-item-active" />
          </transition>
        </div>
        <template
          v-if="!item.noDrag && draggedId !== null && draggedId !== item.dragId"
        >
          <!-- 放置显示器，前 -->
          <div
            class="drag-zone drag-zone-slide"
            :data-index="index"
            data-type="slide"
            :style="dragZoneBeforeStyle"
          />
          <!-- 放置显示器，后 -->
          <div
            class="drag-zone drag-zone-slide"
            :data-index="index + 1"
            data-type="slide"
            :style="dragZoneAfterStyle"
          />
          <!-- 放置显示器，覆盖 -->
          <div class="drag-zone drag-zone-rect" :data-index="index" />
        </template>
      </div>
    </transition-group>
    <slot name="after" />
  </div>
</template>

<script>
export default {
  name: 'drag-sort',
  props: {
    // 插入区域方向，默认为垂直方向。垂直的按行布局，横向的按块布局。
    direction: {
      type: String,
      default: 'vertical', // vertical | horizontal
    },
    // 列表拖拽容器和内部项目的间距，同时也是放置显示器的宽或高
    padding: {
      type: [String, Number],
      default: '6',
    },
    items: {
      type: Array,
      required: true,
    },
    labelKey: {
      type: String,
      default: 'label',
    },
    itemWidth: {
      type: [String, Number],
      default: 'auto',
    },
    propListItemWrapStyle: {
      type: Object,
      default() {
        return {}
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['on-sort', 'on-drag-start'],
  data() {
    return {
      dragItems: [], // 每个项目必须有id
      draggedId: null,
      dragZoneBeforeStyle: {},
      dragZoneAfterStyle: {},
      id: '', // 组件每次列表设置，同时设置一个id
    }
  },
  computed: {
    // 列表容器样式
    listItemWrapStyle() {
      return {
        display: this.direction === 'vertical' ? 'block' : 'inline-block',
        padding: `${this.padding}px`,
        width: isNaN(this.itemWidth) ? this.itemWidth : `${this.itemWidth}px`,
        ...this.propListItemWrapStyle,
      }
    },
  },
  watch: {
    items: {
      handler() {
        this.initItems()
      },
      immediate: true,
    },
    direction: {
      handler() {
        const px = `${this.padding}px`
        if (this.direction === 'vertical') {
          const style = {
            left: px,
            right: px,
            height: px,
          }
          this.dragZoneBeforeStyle = {
            top: 0,
            ...style,
          }
          this.dragZoneAfterStyle = {
            bottom: 0,
            ...style,
          }
        } else {
          const style = {
            top: px,
            bottom: px,
            width: px,
          }
          this.dragZoneBeforeStyle = {
            left: 0,
            ...style,
          }
          this.dragZoneAfterStyle = {
            right: 0,
            ...style,
          }
        }
      },
      immediate: true,
    },
  },
  beforeUnmount() {
    // this.dragItems = [];
  },
  methods: {
    initItems() {
      // 一般来说最好不要修改props（原始）的数据
      // 但是这里不这样做的话，在新增或者删除过渡会有点异常
      this.id = `drag_${Math.random().toString(16).slice(-6)}${new Date().getTime()}`

      // 1.0
      this.dragItems = this.items

      // 2.0
      // 先清空已有数据
      // this.dragItems.splice(0, this.dragItems.length);
      // Array.prototype.push.apply(this.dragItems, this.items);

      this.dragItems.forEach((item, index) => {
        item.dragId = item.id || item.dragId || `${this.id}${index.toString()}`
      })
    },
    handleDrop(event) {
      // 放置
      if (event.target.classList.contains('drag-zone')) {
        event.target.style.background = ''
        let index = parseInt(event.target.getAttribute('data-index'))
        const type = event.target.getAttribute('data-type')
        if (this.draggedIndex === index) {
          return
        }
        if (this.draggedIndex < index && type === 'slide') {
          index -= 1
        }
        this.dragItems.splice(
          index,
          0,
          this.dragItems.splice(this.draggedIndex, 1)[0],
        )
        this.$emit('on-sort', this.dragItems)
      }
    },
    handleDragStart(event, index, dragId) {
      if (this.disabled) {
        return
      }
      if (this.dragged) {
        return
      }
      this.dragged = event.target
      this.draggedIndex = index
      this.draggedId = dragId
      this.$emit('on-drag-start', {
        index,
        dragId,
      })
    },
    handleDragEnd() {
      this.dragged && (this.dragged.style.background = '')
      setTimeout(() => {
        this.dragged = null
        this.draggedId = null
      }, 600)
    },
    handleDragEnter(event) {
      // 当可拖动的元素进入可放置的目标高亮目标节点
      if (event.target.classList.contains('drag-zone')) {
        event.target.style.background = 'rgb(0, 200, 190)'
      }
    },
    handleDragLeave(event) {
      // 当拖动元素离开可放置目标节点，重置其背景
      if (event.target.classList.contains('drag-zone')) {
        event.target.style.background = ''
      }
    },
    getDrags() {
      return this.dragItems
    },
  },
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
  background: rgba(164, 235, 231, 0.2);
}
.list-move:hover {
  cursor: move;
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
.drag-zone-active {
  background: rgb(0, 200, 190);
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
</style>
