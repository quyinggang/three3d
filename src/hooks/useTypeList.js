import { ref } from 'vue'
import configList from '@/router/config'

export function useTypeList() {
  return { configs: ref(configList) }
}
