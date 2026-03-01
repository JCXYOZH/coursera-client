// api/edu/course.js
import request from '../request'

const API_PATH = 'user/edu/course'

export default {
  // 分页查询课程
  pageQueryCourse(index, limit, queryCondition) {
    return request({
      url: `${API_PATH}/pageQueryCourse/${index}/${limit}`,
      method: 'POST',
      data: queryCondition
    })
  },
  // 获取课程详情
  getCourseInfo(courseId) {
    return request({
      url: `${API_PATH}/getCourseInfo/${courseId}`,
      method: 'GET'
    })
  },
  // 分页查询收藏课程
  pageQueryCollectCourse(index, limit) {
    return request({
      url: `${API_PATH}/pageQueryCollectCourse/${index}/${limit}`,
      method: 'GET'
    })
  },
  // 收藏课程
  collectCourse(courseId) {
    return request({
      url: `${API_PATH}/collectCourse/${courseId}`,
      method: 'POST'
    })
  },
  // 取消收藏
  cancelCollectCourse(courseId) {
    return request({
      url: `${API_PATH}/cancelCollectCourse/${courseId}`,
      method: 'POST'
    })
  }
}