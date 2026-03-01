<!-- <template>
  <view class="player">
    <view class="video-container">
      <video
        id="myVideo"
        :src="videoUrl"
        controls
        autoplay
        object-fit="contain"
        :enable-playback-rate="true"
        :show-fullscreen-btn="true"
        :show-download-btn="false"
        @error="handleError"
      ></video>
    </view>
    <view class="info" v-if="courseTitle">
      <text>{{ courseTitle }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getFullUrl } from '@/utils/tools'

const videoUrl = ref('')
const courseTitle = ref('')

onLoad((query) => {
  // query.id 为相对路径，例如 'video/2026/02/24/xxx.mp4'
  if (query.id) {
    videoUrl.value = getFullUrl(query.id)
  }
  if (query.courseId) {
    // 可选：根据课程ID获取课程标题
  }
})

const handleError = (e) => {
  console.error('视频播放错误', e)
  uni.showToast({ title: '视频加载失败', icon: 'none' })
}
</script>

<style scoped>
.player {
  background: #000;
  min-height: 100vh;
}
.video-container {
  width: 100%;
  height: 400rpx;
}
.video-container video {
  width: 100%;
  height: 100%;
}
.info {
  padding: 30rpx;
  color: #fff;
  font-size: 32rpx;
}
</style> -->


<template>
  <view class="player" :class="{ 'fullscreen': isFullscreen }">
    <video
      id="myVideo"
      :src="videoUrl"
      controls
      autoplay
      object-fit="contain"
      :enable-playback-rate="true"
      :show-fullscreen-btn="true"
      :show-download-btn="false"
      :direction="direction"
      @fullscreenchange="onFullscreenChange"
      @error="handleError"
    ></video>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getFullUrl } from '@/utils/tools'

const videoUrl = ref('')
const courseTitle = ref('')
const isFullscreen = ref(false)
const direction = ref(0) // 0: 跟随系统

onLoad((query) => {
  // 检查登录
  const token = uni.getStorageSync('oes_token')
  if (!token) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/login/login' })
    }, 1500)
    return
  }
  if (query.id) {
    videoUrl.value = getFullUrl(query.id)
  }
  if (query.courseId) {
    // 可选，根据课程ID获取课程标题，暂不实现
  }
})

const onFullscreenChange = (e) => {
  isFullscreen.value = e.detail.fullscreen
  if (isFullscreen.value) {
    // 强制横屏
    uni.setScreenBrightness({ value: 1 }) // 可选
  } else {
    // 退出全屏恢复
  }
}

const handleError = (e) => {
  console.error('视频播放错误', e)
  uni.showToast({ title: '视频加载失败', icon: 'none' })
}

// 监听屏幕旋转（可选）
onMounted(() => {
  uni.onWindowResize((res) => {
    // 可根据窗口尺寸调整布局
  })
})

onUnmounted(() => {
  uni.offWindowResize()
})
</script>

<style scoped>
.player {
  background: #000;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.video-container {
  width: 100%;
  height: 400rpx;
}
.video-container video {
  width: 100%;
  height: 100%;
}
.fullscreen .video-container {
  height: 100vh; /* 全屏时视频占满 */
}
.info {
  padding: 30rpx;
  color: #fff;
  font-size: 32rpx;
}
</style>