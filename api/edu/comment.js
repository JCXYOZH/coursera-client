// api/edu/comment.js
import request from '../request'

const API_PATH = 'user/edu/comment'

export default {
  // 分页查询课程评论
  pageQueryComment(courseId, index, limit) {
    return request({
      url: `${API_PATH}/pageQueryComment/${courseId}/${index}/${limit}`,
      method: 'GET'
    })
  },
  // 添加评论
  addComment(comment) {
    return request({
      url: `${API_PATH}/addComment`,
      method: 'POST',
      data: comment
    })
  }
}