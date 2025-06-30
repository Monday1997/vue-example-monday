import type { RouteRecordRaw } from 'vue-router'
export type TMenuRouteRaw = RouteRecordRaw & {
  name: string
  meta: {
    title: string
    [key: string]: unknown
  }
}
const TableRoute = {
  path: 'merge-table',
  name: 'meregTable',
  meta: {
    title: '合并表格',
  },
  redirect: '/pages/merge-table/merge-table-array',
  children: [
    {
      path: 'merge-table-array',
      component: () => import('@/views/mergeTableRows/easy-merge-table.vue'),
      name: 'mergeTableArray',
      meta: {
        title: '合并表格',
      },
    },
    {
      path: 'merge-table-array2',
      component: () => import('@/views/mergeTableRows/merger-form-static.vue'),
      name: 'mergeTableArray2',
      meta: {
        title: '合并表格(静态列)',
      },
    },
    {
      path: 'merge-table-by-form',
      component: () => import('@/views/mergeTableRows/merge-by-form.vue'),
      name: 'mergeTableByForm',
      meta: {
        title: '合并表格(表单)',
      },
    },
    {
      path: 'merge-table-form-optimize',
      component: () =>
        import('@/views/mergeTableRows/merge-by-form-optimize.vue'),
      name: 'merge-table-form-optimize',
      meta: {
        title: '合并表格(表单升级)',
      },
    },
  ],
}

const ExcelRoute = {
  path: 'excel-handler',
  name: 'excelHandler',
  meta: {
    title: 'excel导入导出',
  },
  redirect: '/pages/excel-handler/excel-out',
  children: [
    {
      path: 'excel-in',
      component: () => import('@/views/excel-handler/excel-in/index.vue'),
      name: 'excelIn',
      meta: {
        title: 'excel导入',
      },
    },
    {
      path: 'excel-out',
      component: () => import('@/views/excel-handler/excel-out/index.vue'),
      name: 'excelOut',
      meta: {
        title: 'excel导处',
      },
    },
  ],
}

const Other = {
  path: 'other-fn-card',
  name: 'otherFnCard',
  meta: {
    title: '其他功能',
  },
  redirect: '/pages/other-fn-card/drag-card',
  children: [
    {
      path: 'drag-card',
      component: () => import('@/views/card/drag-card/index.vue'),
      name: 'dragCard',
      meta: {
        title: '移动卡片',
      },
    },
    {
      path: 'high-light',
      component: () => import('@/views/card/reg-high-light/index.vue'),
      name: 'highLight',
      meta: {
        title: '高亮特殊字段',
      },
    },
    {
      path: 'water-remark',
      component: () => import('@/views/card/water-remark/index.vue'),
      name: 'waterCemark',
      meta: {
        title: '水印',
      },
    },
    {
      path: 'drag-content',
      component: () => import('@/views/card/drag-content/index.vue'),
      name: 'dragContent',
      meta: {
        title: '内容拖拽',
      },
    },
  ],
}
// 页面上的路由
export const pagesRoute: TMenuRouteRaw[] = [TableRoute, ExcelRoute, Other]
