import { createRouter, createWebHashHistory } from 'vue-router'

import Layout from '@/Layout/index.vue'
import { pagesRoute } from './config'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'pages',
      component: Layout,
      path: '/pages',
      alias: '/',
      redirect: 'merge-table',
      children: [...pagesRoute],
    },
  ],
})
router.beforeEach((to, _, next) => {
  document.title = (to.meta.name as string) || 'vue-简单示例'
  next()
})
export default router
