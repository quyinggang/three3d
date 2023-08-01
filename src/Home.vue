<script setup>
import { useTypeList } from '@/hooks/useTypeList'
import LinkList from '@/components/LinkList.vue'

const { basicList, shaderList } = useTypeList()
</script>

<template>
  <div class="main">
    <LinkList :list="basicList" />
    <LinkList :list="shaderList" />
  </div>
</template>

<style scoped>
.main {
  display: flex;
  padding: 10px 0 0 10px;
}
</style>
