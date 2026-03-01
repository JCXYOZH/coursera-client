<template>
  <view class="teacher-detail">
    <Header />

    <!-- 加载中 -->
    <view class="loading" v-if="!teacher">加载中...</view>

    <view v-else>
      <!-- 讲师信息卡片 -->
      <view class="teacher-card">
        <image :src="getFullUrl(teacher.avatar)" mode="aspectFill" class="avatar" />
        <view class="info">
          <text class="name">{{ teacher.name }}</text>
          <text class="level">{{ teacher.level == 1 ? '高级讲师' : '首席讲师' }}</text>
          <text class="career">{{ teacher.career }}</text>
          <text class="intro">{{ teacher.intro }}</text>
        </view>
      </view>

      <!-- 主讲课程 -->
      <view class="course-section">
        <view class="section-title">主讲课程</view>
        <view class="course-list" v-if="courseList.length">
          <view 
            class="course-item" 
            v-for="course in courseList" 
            :key="course.id"
            @click="goToCourse(course.id)"
          >
            <image :src="getFullUrl(course.cover)" mode="aspectFill" class="cover" />
            <view class="info">
              <text class="title">{{ course.title }}</text>
              <text class="price" :class="{ free: course.price === 0 }">
                {{ course.price > 0 ? '￥' + course.price : '免费' }}
              </text>
            </view>
          </view>
        </view>
        <view class="empty" v-else>暂无课程</view>
      </view>
    </view>

    <view class="footer-placeholder"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Header from '@/components/Header.vue'
import { getFullUrl } from '@/utils/tools'
import { teacherApi } from '@/api'

const teacherId = ref('')
const teacher = ref(null)
const courseList = ref([])

onLoad((query) => {
  if (query.id) {
    teacherId.value = query.id
    fetchTeacherDetail()
  }
})

const fetchTeacherDetail = async () => {
  try {
    const res = await teacherApi.getTeacherAndCourse(teacherId.value)
    if (res.code === 20000) {
      teacher.value = res.data.teacher
      courseList.value = res.data.courseList || []
    }
  } catch (err) {
    console.error('加载讲师详情失败', err)
  }
}

const goToCourse = (id) => {
  uni.navigateTo({ url: `/pages/course/detail?id=${id}` })
}
</script>

<style scoped>
.teacher-detail {
  background: #f8f8f8;
  min-height: 100vh;
}
.loading {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}
.teacher-card {
  background: #fff;
  margin: 30rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  display: flex;
  gap: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  flex-shrink: 0;
}
.info {
  flex: 1;
}
.name {
  font-size: 36rpx;
  font-weight: bold;
  margin-right: 20rpx;
}
.level {
  font-size: 24rpx;
  color: #3edeb3;
  background: rgba(62, 222, 179, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}
.career {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin: 10rpx 0;
}
.intro {
  font-size: 26rpx;
  color: #999;
  line-height: 1.5;
}
.course-section {
  background: #fff;
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.section-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
}
.course-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}
.course-item {
  display: flex;
  background: #f8f8f8;
  border-radius: 12rpx;
  overflow: hidden;
}
.cover {
  width: 200rpx;
  height: 150rpx;
}
.info {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.price {
  font-size: 32rpx;
  color: #f60;
}
.price.free {
  color: #090;
}
.empty {
  text-align: center;
  padding: 50rpx 0;
  color: #999;
}
.footer-placeholder {
  height: 120rpx;
}
</style>