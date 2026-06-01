// config.js
const BASE_URL = (() => {
  // 优先使用环境变量（可在 .env 文件中设置）
  if (process.env.VUE_APP_BASE_URL) {
    return process.env.VUE_APP_BASE_URL
  }
  // 根据运行环境自动切换
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8500'   // 本地后端
  }
  return 'http://42a5223c.r16.vip.cpolar.cn'  // 生产环境地址
})()

export default BASE_URL