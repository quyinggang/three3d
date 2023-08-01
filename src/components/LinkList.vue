<script setup>
const props = defineProps({
  list: Array
})
</script>

<template>
  <ul class="ul">
    <li v-for="item in props.list" :key="item.path" class="li">
      <router-link :to="item.path">
        {{ item.title }}
      </router-link>
    </li>
  </ul>
</template>

<style scoped>
.ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.li {
  font-size: 14px;
  line-height: 2;
}
</style>
