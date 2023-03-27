import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/Home.vue'
import configList from './config'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  ...configList.map((item) => {
    return {
      path: item.path,
      component: () => import(`@/components/${item.componentName}.vue`)
    }
  })
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
