import { ref } from 'vue'
import configList from '@/router/config'

export function useTypeList() {
  const shaderConfigList = []
  const basicConfigList = []
  configList.forEach((config) => {
    config.type === 'shader' ? shaderConfigList.push(config) : basicConfigList.push(config)
  })

  return {
    basicList: ref(basicConfigList),
    shaderList: ref(shaderConfigList)
  }
}
