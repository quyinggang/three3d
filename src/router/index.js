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
    const { path, componentName, type } = item
    const subPath = type === 'shader' ? 'shaders' : 'basic'
    return {
      path,
      component: () => import(`@/views/${subPath}/${componentName}.vue`)
    }
  })
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
