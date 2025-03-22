import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/Layout/index.vue'
import { MenuRouteConfig } from '@/Layout/home-menu/config'
type TMenuRouteRaw = RouteRecordRaw & {
  meta: {
    title: string,
    /** 映射的菜单name 默认使用路由name */
    menuName?: string
  }
}
// 页面上的路由
const pagesRoute: TMenuRouteRaw[] = [
  {
    path: 'merge-table-rows1',
    component: () => import('@/views/mergeTableRows/index.vue'),
    name: MenuRouteConfig.mergeTableRows1,
    meta: {
      title: '合并表格'
    }
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'pages',
      component: Layout,
      path: '/pages',
      redirect: 'merge-table-rows1',
      children: [
        ...pagesRoute
      ]
    }
  ],
})
router.beforeEach((to, _, next) => {
  document.title = to.meta.name as string || 'vue-简单示例'
  next()
})
export default router
