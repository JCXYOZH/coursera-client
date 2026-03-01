// api/edu/subject.js
import request from '../request'

const API_PATH = 'user/edu/subject'

export default {
  // 获取所有课程分类（树形结构）
  getAllSubject() {
    return request({
      url: `${API_PATH}/getAllSubject`,
      method: 'GET'
    })
  }
}