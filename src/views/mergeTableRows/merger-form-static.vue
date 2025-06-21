<template>
  <PageLayout :navs="['合并表格', '合并表格(静态列)']" title="合并表格(静态列)">
    <a-table bordered :columns="staticColumns" :dataSource="list"></a-table>
  </PageLayout>
</template>

<script setup lang="ts">
import { addSpansValueInList } from '@/utils/tools/table-utils'
import { list, staticColumns } from './config'
addSpansValueInList(['scheme', 'attr1', 'attr2', 'attr3'], list)
</script>

<style scoped></style>
