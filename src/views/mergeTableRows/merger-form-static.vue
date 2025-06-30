<template>
  <PageLayout :navs="['合并表格', '合并表格(静态列)']" title="合并表格(静态列)">
    <a-table bordered :columns="staticColumns" :dataSource="list"></a-table>
  </PageLayout>
</template>

<script setup lang="ts">
import { addSpansValueInList } from '@/utils/tools/static-table-merge'
import { list, staticColumns } from './config'
import { EItem } from './config'
addSpansValueInList([EItem.scheme, EItem.attr1, EItem.attr2, EItem.attr3], list)
</script>

<style scoped></style>
