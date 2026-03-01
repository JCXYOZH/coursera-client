<template>
  <view class="version-update-mask" v-if="show">
    <view class="version-update-dialog">
      <text class="title">发现新版本 {{ versionInfo.versionName }}</text>
      <scroll-view class="content" scroll-y>
        <text>{{ versionInfo.updateContent }}</text>
      </scroll-view>
      <view class="progress" v-if="downloading">
        <progress :percent="downloadProgress" show-info stroke-width="6" />
      </view>
      <view class="buttons">
        <button v-if="!downloading" class="btn update" @click="startUpdate">立即更新</button>
        <button v-if="!downloading && !versionInfo.forceUpdate" class="btn exit" @click="exit">退出应用</button>
        <button v-if="downloading" class="btn" disabled>下载中 {{ downloadProgress }}%</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  versionInfo: {
    type: Object,
    required: true
  }
})

const show = ref(true)
const downloading = ref(false)
const downloadProgress = ref(0)
let downloadTask = null

const emit = defineEmits(['update', 'exit'])

const startUpdate = () => {
  downloading.value = true
  // 使用 plus.downloader 创建下载任务
  // 注意：仅在 App 端有效
  // #ifdef APP-PLUS
  const dtask = plus.downloader.createDownload(
    props.versionInfo.downloadUrl,
    {
      filename: '_doc/update/' // 下载到应用文档目录下的update文件夹
    },
    (d, status) => {
      if (status === 200) {
        // 下载完成，安装apk
        plus.runtime.install(d.filename, {
          force: true
        }, (res) => {
          console.log('安装成功', res)
        }, (err) => {
          console.error('安装失败', err)
          uni.showToast({ title: '安装失败', icon: 'none' })
        })
      } else {
        uni.showToast({ title: '下载失败', icon: 'none' })
        downloading.value = false
      }
    }
  )
  dtask.addEventListener('statechanged', (task, status) => {
    switch (task.state) {
      case 1: // 开始
        console.log('下载开始')
        break
      case 2: // 已连接到服务器
        break
      case 3: // 正在下载
        downloadProgress.value = parseInt(task.downloadedSize / task.totalSize * 100)
        break
      case 4: // 下载完成
        break
    }
  })
  dtask.start()
  downloadTask = dtask
  // #endif
  // #ifndef APP-PLUS
  uni.showToast({ title: '请使用App更新', icon: 'none' })
  // #endif
}

const exit = () => {
  // 退出应用（仅 App 有效）
  // #ifdef APP-PLUS
  plus.runtime.quit()
  // #endif
  // #ifndef APP-PLUS
  uni.showToast({ title: '请在App中操作', icon: 'none' })
  // #endif
}
</script>

<style scoped>
.version-update-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.version-update-dialog {
  width: 600rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  text-align: center;
  margin-bottom: 30rpx;
}
.content {
  max-height: 300rpx;
  margin-bottom: 30rpx;
  font-size: 28rpx;
  color: #666;
}
.progress {
  margin-bottom: 30rpx;
}
.buttons {
  display: flex;
  gap: 20rpx;
}
.btn {
  flex: 1;
  height: 70rpx;
  line-height: 70rpx;
  border-radius: 35rpx;
  font-size: 28rpx;
  border: none;
}
.update {
  background: #3edeb3;
  color: #fff;
}
.exit {
  background: #f5f5f5;
  color: #999;
}
</style>