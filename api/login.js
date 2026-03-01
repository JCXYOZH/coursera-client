import request from './request'

const API_PATH = 'user/ucenter/member'

export default {
  // 用户登录
  submitLogin(loginVO) {
    return request({
      url: `${API_PATH}/userLogin`,
      method: 'POST',
      data: loginVO
    })
  },
  // 根据token获取用户信息
  getUserInfo() {
    return request({
      url: `${API_PATH}/getUserInfo`,
      method: 'GET'
    })
  },
  // 修改密码
  updatePassword(data) {
    return request({
      url: `${API_PATH}/updatePassword`,
      method: 'POST',
      data
    })
  }
}