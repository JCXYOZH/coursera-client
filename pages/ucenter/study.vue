<template>
  <view class="study-container">
    <view v-if="studyList.length === 0" class="empty">
      <text>暂无学习记录</text>
    </view>
    <view v-else>
      <view class="timeline-item" v-for="study in studyList" :key="study.id">
        <view class="time">{{ study.studyTime }}</view>
        <view class="card" @click="goToPlayer(study.videoSourceId)">
          <image :src="$getFullUrl(study.cover)" mode="aspectFill" class="cover" />
          <view class="info">
            <text class="course-title">{{ study.title }}</text>
            <text class="video-name">{{ study.videoName }}</text>
          </view>
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
import { recordApi } from '@/api'

const studyList = ref([])
const data = ref({
  current: 1,
  pages: 0,
  total: 0,
  hasPrevious: false,
  hasNext: false
})

const fetchData = async (page = 1) => {
  try {
    const res = await recordApi.pageQueryUserStudyRecord(page, 8)
    if (res.code === 20000) {
      data.value = res.data
      data.value.pages = Number(data.value.pages)
      studyList.value = data.value.records || []
    }
  } catch (err) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

const gotoPage = (page) => {
  if (page < 1 || page > data.value.pages) return
  fetchData(page)
}

const goToPlayer = (videoSourceId) => {
  uni.navigateTo({ url: `/pages/player/index?id=${videoSourceId}` })
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
.study-container {
  padding: 30rpx;
}
.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}
.timeline-item {
  margin-bottom: 40rpx;
  position: relative;
  padding-left: 30rpx;
  border-left: 4rpx solid #3edeb3;
}
.time {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
}
.card {
  display: flex;
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
  justify-content: center;
}
.course-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.video-name {
  font-size: 24rpx;
  color: #666;
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