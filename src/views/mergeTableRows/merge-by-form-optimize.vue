<template>
  <PageLayout :navs="['合并表格', '用户操作']" title="用户操作">
    <a-form :model="form">
      <a-row :gutter="8">
        <a-col v-bind="spans" v-for="item in formGroup" :key="item.key">
          <a-form-item v-model:value="form[item.key]" :label="item.label">
            <a-select
              mode="multiple"
              v-model:value="form[item.key]"
              :options="selectOptions[item.key]"
            ></a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-table
      :pagination="false"
      bordered
      :columns="resultColumns"
      :dataSource="resultList"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'price'">
          <a-input v-model:value="record.price"></a-input>
        </template>
      </template>
    </a-table>
  </PageLayout>
</template>

<script setup lang="ts">
import {
  columnsWithForm as columns,
  selectOptions,
  formGroup,
  spans,
} from './config'
import { userMergeByForm } from '@/composable/table/user-merge-by-form'

// 通过异步方式获取选项配置和默认选中值
const getSelectOptionApi = () => {
  return Promise.resolve({
    selectConfig: selectOptions,
    initForm: {
      attr1: [4, 5],
      attr3: [7, 9],
    },
  })
  /*   return new Promise((r) => {
      setTimeout(() => {
        r({
          selectOptions,
          initForm: {
            scheme: [11],
            attr1: [4, 5],
            attr2: [],
            attr3: [7, 9],
          },
        })
      }, 3000)
    }) */
}
const { loadSelectOption, resultColumns, resultList, form } = userMergeByForm({
  // 模拟从后端动态获取表单选项和表单默认值
  getSelectOptionApi,
  // 要渲染的列
  fixColumns: columns,
  // 固定值，可直接设置或通过函数返回值获取
  fixColumnsConfig: {
    price: (record: any) => {
      if (record.attr1 === 4) {
        return 16
      }
      return 18
    },
    price2: 20,
  },
  formGroup,
})
loadSelectOption()
console.log(resultList)
</script>
