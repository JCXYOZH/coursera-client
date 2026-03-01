import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// 可以打印插件信息，但不是直接打印插件内部的代码
// console.log('Vite 配置文件已加载')
// console.log('uni 插件类型:', typeof uni) // 输出插件的类型

export default defineConfig({
  plugins: [
    // 使用插件，并可以查看它的返回值（较为复杂）
    uni()
  ],
  build: {
    rollupOptions: {
      output: {
        // 关键：强制将输出格式设置为 'es'，覆盖任何可能的错误配置
        format: 'es'
      }
    }
  }
})