<template>
  <view class="index">
    <!-- 头部 -->
    <Header />

    <!-- 轮播图 -->
    <swiper class="banner" indicator-dots autoplay circular>
      <swiper-item v-for="item in bannerList" :key="item.id">
        <image :src="getFullUrl(item.imageUrl)" mode="aspectFill" class="banner-img" @click="goToBanner(item)" />
      </swiper-item>
    </swiper>

    <!-- 热门课程 -->
    <view class="section">
      <view class="section-header">
        <text class="title">热门课程</text>
        <text class="more" @click="goToCourseList">更多</text>
      </view>
      <view class="course-list">
        <view class="course-item" v-for="course in courseList" :key="course.id" @click="goToCourseDetail(course.id)">
          <image :src="getFullUrl(course.cover)" mode="aspectFill" class="cover" />
          <view class="info">
            <text class="course-title">{{ course.title }}</text>
            <text class="course-stats">{{ course.buyCount }}人学习 | {{ course.viewCount }}浏览</text>
            <text class="price" :class="{ free: course.price === 0 }">
              {{ course.price > 0 ? '￥' + course.price : '免费' }}
            </text>
          </view>
        </view>
      </view>
      <view class="more-link">
        <text @click="goToCourseList">全部课程 ></text>
      </view>
    </view>

    <!-- 名师大咖 -->
    <view class="section">
      <view class="section-header">
        <text class="title">名师大咖</text>
        <text class="more" @click="goToTeacherList">更多</text>
      </view>
      <view class="teacher-list">
        <view class="teacher-item" v-for="teacher in teacherList" :key="teacher.id" @click="goToTeacherDetail(teacher.id)">
          <image :src="getFullUrl(teacher.avatar)" mode="aspectFill" class="avatar" />
          <text class="name">{{ teacher.name }}</text>
          <text class="intro">{{ teacher.intro }}</text>
          <text class="career">{{ teacher.career }}</text>
        </view>
      </view>
      <view class="more-link">
        <text @click="goToTeacherList">全部讲师 ></text>
      </view>
    </view>

    <!-- 底部占位，避免tabBar遮挡 -->
    <view class="footer-placeholder"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import { getFullUrl } from '@/utils/tools'
import { bannerApi, courseApi, teacherApi } from '@/api'

const bannerList = ref([])
const courseList = ref([])
const teacherList = ref([])

onMounted(async () => {
  try {
    // 获取轮播图
    const bannerRes = await bannerApi.getAllBanner()
    if (bannerRes.code === 20000) {
      bannerList.value = bannerRes.data || []
    }

    // 获取热门课程和讲师（假设有聚合接口，若无则分别调用）
    // 原项目使用 indexAPI.getHotTeacherAndHotCourse()
    // 这里我们分别调用热门课程和讲师列表（取前几条）
    const courseRes = await courseApi.pageQueryCourse(1, 6, {}) // 取前6条热门
    if (courseRes.code === 20000) {
      // 假设返回的是分页数据，取records
      courseList.value = courseRes.data.records || []
    }

    const teacherRes = await teacherApi.pageQueryTeacher(1, 4)
    if (teacherRes.code === 20000) {
      teacherList.value = teacherRes.data.records || []
    }
  } catch (err) {
    console.error('首页加载失败', err)
    uni.showToast({ title: '网络错误', icon: 'none' })
  }
})

const goToBanner = (item) => {
  if (item.url) {
    // 假设banner的url可能是课程详情或外链
    if (item.url.startsWith('http')) {
      // 外部链接，可跳转webview
      uni.navigateTo({ url: `/pages/webview/index?url=${encodeURIComponent(item.url)}` })
    } else {
      uni.navigateTo({ url: item.url })
    }
  }
}

const goToCourseList = () => {
  uni.switchTab({ url: '/pages/course/index' })
}

const goToCourseDetail = (id) => {
  uni.navigateTo({ url: `/pages/course/detail?id=${id}` })
}

const goToTeacherList = () => {
  uni.switchTab({ url: '/pages/teacher/index' })
}

const goToTeacherDetail = (id) => {
  uni.navigateTo({ url: `/pages/teacher/detail?id=${id}` })
}
</script>

<style scoped>
.index {
  background: #f8f8f8;
  min-height: 100vh;
}
.banner {
  width: 100%;
  height: 350rpx;
}
.banner-img {
  width: 100%;
  height: 100%;
}
.section {
  background: #fff;
  margin: 20rpx 30rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}
.section-header .title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}
.section-header .more {
  font-size: 28rpx;
  color: #999;
}
.course-list {
  display: flex;
  flex-wrap: wrap;
  gap: 30rpx;
}
.course-item {
  width: calc(50% - 15rpx);
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}
.course-item .cover {
  width: 100%;
  height: 200rpx;
}
.course-item .info {
  padding: 20rpx;
}
.course-title {
  font-size: 28rpx;
  font-weight: bold;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 10rpx;
}
.course-stats {
  font-size: 22rpx;
  color: #999;
  display: block;
  margin-bottom: 10rpx;
}
.price {
  font-size: 32rpx;
  color: #f60;
}
.price.free {
  color: #090;
}
.more-link {
  text-align: center;
  margin-top: 30rpx;
}
.more-link text {
  font-size: 28rpx;
  color: #3edeb3;
}
.teacher-list {
  display: flex;
  flex-wrap: wrap;
  gap: 30rpx;
}
.teacher-item {
  width: calc(50% - 15rpx);
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}
.teacher-item .avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin: 0 auto 20rpx;
}
.teacher-item .name {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}
.teacher-item .intro {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.teacher-item .career {
  font-size: 22rpx;
  color: #666;
}
.footer-placeholder {
  height: 120rpx;
}
</style>