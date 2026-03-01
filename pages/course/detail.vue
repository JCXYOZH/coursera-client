<template>
  <view class="course-detail">
    <Header />

    <!-- 加载中 -->
    <view class="loading" v-if="!course">加载中...</view>

    <view v-else>
      <!-- 封面图 -->
      <view class="cover-wrap">
        <image :src="getFullUrl(course.cover)" mode="aspectFill" class="cover" />
        <view class="cover-mask"></view>
        <view class="cover-info">
          <text class="title">{{ course.title }}</text>
          <text class="teacher">主讲：{{ course.teacherName }}</text>
        </view>
      </view>

      <!-- 价格与购买 -->
      <view class="price-section">
        <text class="price-label">价格：</text>
        <text class="price-value" v-if="course.price > 0">￥{{ course.price }}</text>
        <text class="price-value free" v-else>免费</text>
        <view class="action">
          <button 
            v-if="isBuyCourse || course.price === 0"
            class="watch-btn"
            @click="playFirstVideo"
          >立即观看</button>
          <button v-else class="buy-btn" @click="createOrder">立即购买</button>
        </view>
      </view>

      <!-- 课程大纲 -->
      <view class="outline-section">
        <view class="section-title">课程大纲</view>
        <view class="chapters">
          <view v-for="chapter in chapterList" :key="chapter.id" class="chapter">
            <text class="chapter-title">{{ chapter.title }}</text>
            <view class="videos">
              <view 
                v-for="video in chapter.children" 
                :key="video.id" 
                class="video-item"
                @click="playVideo(video)"
              >
                <text class="video-name">{{ video.title }}</text>
                <!-- <text class="video-duration">{{ video.duration || '00:00' }}</text>  // 显示时长 -->
                <text 
                  class="video-status" 
                  :class="{ free: isBuyCourse || course.price === 0 }"
                >
                  {{ isBuyCourse || course.price === 0 ? '立即观看' : '购买后观看' }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="footer-placeholder"></view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Header from '@/components/Header.vue'
import { getFullUrl } from '@/utils/tools'
import { courseApi, orderApi } from '@/api'

const courseId = ref('')
const course = ref(null)
const chapterList = ref([])
const isBuyCourse = ref(false)

onLoad((query) => {
  if (query.id) {
    courseId.value = query.id
    fetchCourseDetail()
  }
})

const fetchCourseDetail = async () => {
  try {
    const res = await courseApi.getCourseInfo(courseId.value)
    if (res.code === 20000) {
      course.value = res.data.courseUserInfoVO
      chapterList.value = res.data.chapterAndVideoList || []
      isBuyCourse.value = res.data.haveBuyCourse || false
    }
  } catch (err) {
    console.error('加载课程详情失败', err)
  }
}

// 第一个可播放视频
const firstVideo = computed(() => {
  for (let chapter of chapterList.value) {
    if (chapter.children && chapter.children.length > 0) {
      return chapter.children[0]
    }
  }
  return null
})

const playFirstVideo = () => {
  if (firstVideo.value) {
    playVideo(firstVideo.value)
  }
}

const playVideo = (video) => {
  const token = uni.getStorageSync('oes_token')
  if (!token) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/login/login' })
    }, 1500)
    return
  }
  if (isBuyCourse.value || course.value.price === 0) {
    uni.navigateTo({
      url: `/pages/player/index?id=${video.videoSourceId}&courseId=${course.value.id}`
    })
  } else {
    uni.showToast({ title: '请先购买课程', icon: 'none' })
  }
}

// const createOrder = async () => {
//   try {
//     const res = await orderApi.createOrder(courseId.value)
//     if (res.code === 20000) {
//       uni.navigateTo({ url: `/pages/orders/detail?id=${res.data}` })
//     } else {
//       uni.showToast({ title: '创建订单失败', icon: 'none' })
//     }
//   } catch (err) {
//     uni.showToast({ title: '网络错误', icon: 'none' })
//   }
// }

const createOrder = async () => {
  if (!courseId.value) {
    uni.showToast({ title: '课程ID不存在', icon: 'none' })
    return
  }
  console.log('创建订单，课程ID:', courseId.value)
  try {
    const res = await orderApi.createOrder(courseId.value)
    console.log('创建订单响应', res)
    if (res.code === 20000) {
      uni.navigateTo({ url: `/pages/orders/detail?id=${res.data}` })
    } else {
      uni.showToast({ title: res.message || '创建订单失败', icon: 'none' })
    }
  } catch (err) {
    console.error('创建订单错误', err)
    uni.showToast({ title: '网络错误', icon: 'none' })
  }
}
</script>

<style scoped>
.course-detail {
  background: #f8f8f8;
  min-height: 100vh;
}
.loading {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}
.cover-wrap {
  position: relative;
  width: 100%;
  height: 400rpx;
}
.cover {
  width: 100%;
  height: 100%;
}
.cover-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.6));
}
.cover-info {
  position: absolute;
  bottom: 30rpx;
  left: 30rpx;
  right: 30rpx;
  color: #fff;
}
.cover-info .title {
  font-size: 40rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}
.cover-info .teacher {
  font-size: 28rpx;
  opacity: 0.9;
}
.price-section {
  background: #fff;
  padding: 30rpx;
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.price-label {
  font-size: 28rpx;
  color: #666;
}
.price-value {
  font-size: 40rpx;
  color: #f60;
  font-weight: bold;
  flex: 1;
}
.price-value.free {
  color: #090;
}
.action button {
  min-width: 180rpx;
  height: 70rpx;
  line-height: 70rpx;
  border-radius: 35rpx;
  font-size: 28rpx;
  color: #fff;
  border: none;
}
.watch-btn {
  background: #3edeb3;
}
.buy-btn {
  background: #f60;
}
.outline-section {
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
.chapter {
  margin-bottom: 30rpx;
}
.chapter-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}
.video-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #f0f0f0;
}
.video-item:last-child {
  border-bottom: none;
}
.video-name {
  flex: 1;
  font-size: 28rpx;
  color: #666;
}
.video-duration {
  font-size: 24rpx;
  color: #999;
  margin-right: 30rpx;
}
.video-status {
  font-size: 24rpx;
  color: #999;
}
.video-status.free {
  color: #3edeb3;
}
.footer-placeholder {
  height: 120rpx;
}
</style>