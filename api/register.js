import request from './request'

const API_PATH = 'user/ucenter/member'
const SMS_API_PATH = 'user/sms'

export default {
  // 检查手机号是否注册
  checkMobile(mobile) {
    return request({
      url: `${API_PATH}/checkMobile/${mobile}`,
      method: 'get'
    })
  },
  // 提交注册
  submitRegister(params) {
    return request({
      url: `${API_PATH}/userRegister`,
      method: 'post',
      data: params
    })
  },
  // 发送验证码
  sendVerificationCode(phone) {
    return request({
      url: `${SMS_API_PATH}/getVerificationCode/${phone}`,
      method: 'get'
    })
  }
}