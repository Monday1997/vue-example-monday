<template>
  <h2>竖排</h2>
  <Drag v-model:list="list" :itemWidth="'25%'" direction="horizontal">
    <template #item="{ index, item }">
      <div class="flex-wrap flex-y-center wrap-box">
        <div class="book-bg">
          <h2 class="title">《{{ item.title }}》</h2>
          <div class="auth">{{ item.auth }}</div>
          <div v-if="item.noDrag" class="no-drag-text">禁止移动</div>
          <div class="descript">{{ item.descript }}</div>
        </div>
        <div class="tool-box flex-wrap flex-x-center flex-y-center">
          <DeleteOutlined @click="remove(index)" style="cursor: pointer" />
        </div>
      </div>
    </template>
  </Drag>
  <br />
  <h2>横排</h2>
  <Drag
    v-model:list="titleList"
    :propListItemWrapStyle="{ width: '200px' }"
    labelKey="data"
  />
</template>

<script setup lang="ts">
import { bookList, titleList as titleListData } from './config'
import Drag from './drag.vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
const list = ref(bookList)
function remove(index: number) {
  list.value.splice(index, 1)
}
const titleList = ref(titleListData)
</script>

<style scoped>
.wrap-box {
  flex-direction: column;
  border: 1px solid #f0f0f0;
}
.book-bg {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 180px;
  height: 250px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  flex-direction: column;
  position: relative;
  margin: 20px 0;
}
.title {
  font-size: 18px;
  padding-top: 40px;
  text-align: center;
}
.no-drag-text {
  color: red;
  text-align: center;
}
.auth {
  text-align: center;
}
.descript {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tool-box {
  width: 100%;
  height: 30px;
  border-top: 1px solid #f0f0f0;
}
</style>
