import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/Layout/index.vue'
import { pagesRoute } from './config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
