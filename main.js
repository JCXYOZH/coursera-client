import { createSSRApp } from 'vue'
import App from './App'
import BASE_URL from '@/config'   // 统一导入

// #ifdef VUE3
export function createApp() {
  const app = createSSRApp(App)
  // 全局挂载工具函数
    app.config.globalProperties.$getFullUrl = (url) => {
      // const base = 'http://localhost:8500'
	  // const base = 'http://6535d93f.r16.vip.cpolar.cn'
      if (!url) return ''
      if (url.startsWith('http')) return url
      return BASE_URL + '/' + url.replace(/^\/+/, '')
    }
	
  // 也可以直接把 BASE_URL 挂上去，方便在组件中使用
  app.config.globalProperties.$baseUrl = BASE_URL
  
  return {
    app
  }
}
// #endif