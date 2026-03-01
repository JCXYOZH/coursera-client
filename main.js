import { createSSRApp } from 'vue'
import App from './App'

// #ifdef VUE3
export function createApp() {
  const app = createSSRApp(App)
  // 全局挂载工具函数
    app.config.globalProperties.$getFullUrl = (url) => {
      const base = 'http://localhost:8500'
      if (!url) return ''
      if (url.startsWith('http')) return url
      return base + '/' + url.replace(/^\/+/, '')
    }
  return {
    app
  }
}
// #endif