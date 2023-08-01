import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/Home.vue'
import configList from './config'
import { TYPE_PATH_ALIAS } from '@/tools/constants'

const routerList = []
configList.forEach((config) => {
  const { type, list } = config
  const subPath = TYPE_PATH_ALIAS[type]
  list.forEach((item) => {
    const { path, componentName } = item
    routerList.push({
      path,
      component: () => import(`@/views/${subPath}/${componentName}.vue`)
    })
  })
})

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  ...routerList
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
