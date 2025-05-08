import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/Layout/index.vue'
export type TMenuRouteRaw = RouteRecordRaw & {
  name: string
  meta: {
    title: string
    [key: string]: unknown
  }
}
// 页面上的路由
export const pagesRoute: TMenuRouteRaw[] = [
  {
    path: 'merge-table',
    name: 'meregTable',
    meta: {
      title: '合并表格'
    },
    redirect: '/pages/merge-table/merge-table-array',
    children: [
      {
        path: 'merge-table-array',
        component: () => import('@/views/mergeTableRows/index.vue'),
        name: 'mergeTableArray',
        meta: {
          title: '合并表格'
        },
      },
      {
        path: 'merge-table-by-form',
        component: () => import('@/views/mergeTableRows/mergeByForm.vue'),
        name: 'mergeTableByForm',
        meta: {
          title: '合并表格(表单)'
        },
      },
      {
        path: 'merge-table-form-optimize',
        component: () => import('@/views/mergeTableRows/mergeByFormOptimize.vue'),
        name: 'merge-table-form-optimize',
        meta: {
          title: '合并表格(表单升级)'
        },
      }
    ]
  },

  {
    path: 'excel-handler',
    name: 'excelHandler',
    meta: {
      title: 'excel导入导出'
    },
    redirect: '/pages/excel-handler/excel-out',
    children: [
      {
        path: 'excel-in',
        component: () => import('@/views/excel-handler/excel-in/index.vue'),
        name: 'excelIn',
        meta: {
          title: 'excel导入'
        },
      },
      {
        path: 'excel-out',
        component: () => import('@/views/excel-handler/excel-out/index.vue'),
        name: 'excelOut',
        meta: {
          title: 'excel导处'
        },
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'pages',
      component: Layout,
      path: '/pages',
      alias: '/',
      redirect: 'merge-table',
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
