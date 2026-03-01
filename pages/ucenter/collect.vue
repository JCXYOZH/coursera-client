<template>
  <view class="collect-container">
    <view v-if="courseList.length === 0" class="empty">
      <text>没有收藏的课程哦，快去收藏吧</text>
    </view>
    <view v-else class="course-list">
      <view class="course-item" v-for="course in courseList" :key="course.id" @click="goToCourse(course.id)">
        <image :src="$getFullUrl(course.cover)" mode="aspectFill" class="cover" />
        <view class="info">
          <text class="title">{{ course.title }}</text>
          <text class="price" :class="{ free: course.price === 0 }">
            {{ course.price > 0 ? '￥' + course.price : '免费' }}
          </text>
        </view>
      </view>
    </view>

    <!-- 分页 -->
    <view class="pagination" v-if="data.pages > 1">
      <view class="page-item" :class="{ disabled: !data.hasPrevious }" @click="gotoPage(data.current - 1)">上一页</view>
      <text class="page-info">{{ data.current }}/{{ data.pages }}</text>
      <view class="page-item" :class="{ disabled: !data.hasNext }" @click="gotoPage(data.current + 1)">下一页</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { courseApi } from '@/api'

const courseList = ref([])
const data = ref({
  current: 1,
  pages: 0,
  total: 0,
  hasPrevious: false,
  hasNext: false
})

const fetchData = async (page = 1) => {
  try {
    const res = await courseApi.pageQueryCollectCourse(page, 8)
    if (res.code === 20000) {
      data.value = res.data
      data.value.pages = Number(data.value.pages)
      courseList.value = data.value.records || []
    }
  } catch (err) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

const gotoPage = (page) => {
  if (page < 1 || page > data.value.pages) return
  fetchData(page)
}

const goToCourse = (id) => {
  uni.navigateTo({ url: `/pages/course/detail?id=${id}` })
}

onMounted(() => {
  const token = uni.getStorageSync('oes_token')
  if (!token) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/login/login' })
    }, 1500)
    return
  }
  fetchData()
})
</script>

<style scoped>
.collect-container {
  padding: 30rpx;
}
.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}
.course-item {
  display: flex;
  margin-bottom: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
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
  justify-content: space-between;
}
.title {
  font-size: 28rpx;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.price {
  font-size: 32rpx;
  color: #f60;
}
.price.free {
  color: #090;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40rpx;
}
.page-item {
  padding: 20rpx 30rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
}
.page-item.disabled {
  opacity: 0.5;
  pointer-events: none;
}
.page-info {
  margin: 0 30rpx;
  font-size: 28rpx;
}
</style>