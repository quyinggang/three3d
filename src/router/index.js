import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layouts/default.vue'
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
    component: Layout,
    redirect: routerList[0].path,
    children: [...routerList]
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
