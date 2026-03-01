// utils/version.js
import request from '@/api/request'

/**
 * 检查最新版本
 * @param {string} currentVersion 当前版本号
 * @returns {Promise} 返回最新版本信息
 */
export function checkVersion(currentVersion) {
  return request({
    url: '/user/app/version/latest',
    method: 'GET',
    data: { currentVersion } // 可传当前版本供后端比较，也可以后端直接返回最新版本由前端比较
  })
}