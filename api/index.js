// // api/index.js
// import request from './request'

// export default {
//   // 获取热门讲师和热门课程（若后端提供好此接口）
//   getHotTeacherAndHotCourse() {
//     return request({
//       url: '/user/edu/index/hot',
//       method: 'GET'
//     })
//   }
// }

// api/index.js
export { default as request } from './request'  // 如果需要直接使用request

export { default as loginApi } from './login'
export { default as registerApi } from './register'
export { default as memberApi } from './ucenter/member'
export { default as bannerApi } from './cms/banner'
export { default as courseApi } from './edu/course'
export { default as teacherApi } from './edu/teacher'
export { default as commentApi } from './edu/comment'
export { default as subjectApi } from './edu/subject'
export { default as recordApi } from './edu/record'
export { default as orderApi } from './order/order'