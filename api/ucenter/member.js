import request from '../request'

const API_PATH = 'user/ucenter/member'

export default {
  // 修改用户信息
  updateUserInfo(userInfo) {
    return request({
      url: `${API_PATH}/updateUserInfo`,
      method: 'post',
      data: userInfo
    })
  }
}