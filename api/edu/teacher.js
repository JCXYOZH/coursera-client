// api/edu/teacher.js
import request from '../request'

const API_PATH = 'user/edu/teacher'

export default {
  // 分页查询讲师
  pageQueryTeacher(index, limit) {
    return request({
      url: `${API_PATH}/pageQueryTeacher/${index}/${limit}`,
      method: 'GET'
    })
  },
  // 获取讲师详情及所授课程
  getTeacherAndCourse(teacherId) {
    return request({
      url: `${API_PATH}/getTeacherAndCourse/${teacherId}`,
      method: 'GET'
    })
  }
}