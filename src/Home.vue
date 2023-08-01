<script setup>
import { useTypeList } from '@/hooks/useTypeList'
import LinkList from '@/components/LinkList.vue'

const { configs } = useTypeList()
</script>

<template>
  <div class="main">
    <div class="container" v-for="config of configs" :key="config.type">
      <LinkList :list="config.list" />
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  padding: 10px 0 0 10px;
}
.container:not(:last-child) {
  margin-right: 3em;
}
</style>
