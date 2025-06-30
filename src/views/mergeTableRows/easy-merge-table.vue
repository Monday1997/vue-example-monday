<template>
  <PageLayout :navs="['合并表格', '简单合并']" title="简单合并">
    <a-table bordered :columns="resultColumns" :dataSource="list"></a-table>
  </PageLayout>
</template>

<script setup lang="ts">
import { columns, list } from './config'
import { EItem } from './config'
import { getMergeColumn } from '@/utils/tools/easy-table-merge'
const resultColumns = getMergeColumn(columns, list, { stopKey: EItem.attr3 })
</script>

<style scoped></style>
