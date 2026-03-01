// api/cms/banner.js
import request from '../request'

const API_PATH = 'user/cms/banner'

export default {
  // 获取所有轮播图
  getAllBanner() {
    return request({
      url: `${API_PATH}/getAllBanner`,
      method: 'GET'
    })
  }
}