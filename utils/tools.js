// utils/tools.js
// const BASE_URL = process.env.NODE_ENV === 'development' 
//   ? 'http://localhost:8500' 
//   : 'https://your-production-domain.com' // 替换为实际生产地址
  
  // ? 'http://6535d93f.r16.vip.cpolar.cn'
  // : 'http://6535d93f.r16.vip.cpolar.cn'
  
import BASE_URL from '@/config'   // 统一从配置文件导入

/**
 * 获取完整URL（处理相对路径）
 * @param {string} url 原始URL（可能相对或绝对）
 * @returns {string} 完整URL
 */
export const getFullUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  // 去除开头的斜杠，避免重复
  return BASE_URL + '/' + url.replace(/^\/+/, '')
}

/**
 * 格式化时间（用于学习记录等）
 * @param {string|number} date 时间戳或日期字符串
 * @param {string} fmt 格式
 * @returns {string}
 */
export const formatDate = (date, fmt = 'YYYY-MM-dd HH:mm:ss') => {
  if (!date) return ''
  const d = new Date(date)
  const o = {
    'Y+': d.getFullYear(),
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'H+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : str.padStart(2, '0'))
    }
  }
  return fmt
}