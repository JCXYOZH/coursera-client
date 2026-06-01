// api/request.js
// const BASE_URL = 'http://localhost:8500'
// const BASE_URL = 'http://6535d93f.r16.vip.cpolar.cn'  // 确保末尾没有斜杠

import BASE_URL from '@/config'   // 统一从配置文件导入

const request = (options) => {
  return new Promise((resolve, reject) => {

    if (!options || !options.url) {
      console.error('request: url is missing', options)
      uni.showToast({ title: '请求地址错误', icon: 'none' })
      reject(new Error('url is missing'))
      return
    }
	
	// 关键修复：确保中间有一个斜杠，并去除多余的斜杠
	const urlPath = options.url.replace(/^\/+/, '')          // 去除开头的所有斜杠
	const fullUrl = BASE_URL.replace(/\/+$/, '') + '/' + urlPath  // BASE_URL去除末尾斜杠，然后加斜杠和路径
	
	// console.log('fullUrl:', fullUrl)
	
	// 可选：URL 有效性验证
	// try { new URL(fullUrl) } catch (e) { ... }

    const token = uni.getStorageSync('oes_token') || ''
    uni.request({
      url: fullUrl,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        'token': token
      },
      success: (res) => {
        // console.log('response:', res)
        if (res.statusCode === 200) {
          const data = res.data
          if (data.code === 20000) {
            resolve(data)
          } else if (data.code === 25000) {
            resolve(data)
          } else if (data.code === 28000) {
            uni.showToast({ title: data.message || '登录失效', icon: 'none', duration: 3000 })
            uni.removeStorageSync('oes_token')
            uni.removeStorageSync('oes_ucenter')
            setTimeout(() => uni.navigateTo({ url: '/pages/login/login' }), 1500)
            reject(data)
          } else {
            uni.showToast({ title: data.message || '请求失败', icon: 'none' })
            reject(data)
          }
        } else {
          uni.showToast({ title: '网络错误', icon: 'none' })
          reject(res)
        }
      },
      fail: (err) => {
        console.error('request fail:', err)
        uni.showToast({ title: '网络请求失败', icon: 'none' })
        reject(err)
      }
    })
  })
}

export default request