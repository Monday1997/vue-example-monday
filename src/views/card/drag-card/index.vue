<template>
  <Drag v-model:items="list" :itemWidth="'25%'" direction="horizontal">
    <template #item="{ index, item }">
      <div
        class="flex-wrap flex-x-center flex-y-center wrap-box"
        @click="remove(index)"
      >
        <div class="book-bg">
          <h2 class="title">《{{ item.title }}》</h2>
          <div class="auth">{{ item.auth }}</div>
          <div class="descript">{{ item.descript }}</div>
        </div>
      </div>
    </template>
  </Drag>
</template>

<script setup lang="ts">
import Drag from './drag.vue'
const list = ref<{ title: string; descript: string; auth: string }[]>([
  {
    title: '三国演义',
    descript: '东汉末年群雄争霸的历撒旦发射点发射点发射点发射点发史演义',
    auth: '罗贯中',
  },
  {
    title: '水浒传',
    descript: '北宋梁山好汉反抗压迫的侠义故事',
    auth: '施耐庵',
  },
  {
    title: '西游记',
    descript: '唐僧师徒西天取经的神魔冒险',
    auth: '吴承恩',
  },
  {
    title: '红楼梦',
    descript: '贾府兴衰与宝黛爱情的家族史诗',
    auth: '曹雪芹',
  },
  {
    title: '安徒生童话',
    descript: '充满奇幻与哲理的经典童话集',
    auth: '安徒生',
  },
  {
    title: '老人与海',
    descript: '老渔夫与大海搏斗的勇气之歌',
    auth: '海明威',
  },
  {
    title: '生活',
    descript: '记录平凡人生的真实与感悟',
    auth: '佚名',
  },
  {
    title: '钢铁是怎样炼成的',
    descript: '保尔·柯察金坚韧成长的励志传奇',
    auth: '奥斯特洛夫斯基',
  },
])
function remove(index: number) {
  list.value.splice(index, 1)
}
</script>

<style scoped>
.wrap-box {
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.book-bg {
  width: 180px;
  height: 250px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  flex-direction: column;
  position: relative;
}
.title {
  font-size: 18px;
  padding-top: 40px;
  text-align: center;
}
.auth {
  text-align: center;
}
.descript {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
