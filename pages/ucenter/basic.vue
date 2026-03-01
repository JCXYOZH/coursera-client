<template>
  <view class="ucenter">
    <Header />

    <!-- 用户信息卡片 -->
    <view class="user-card" v-if="memberInfo.id">
      <image :src="getFullUrl(memberInfo.avatar)" mode="aspectFill" class="avatar" />
      <view class="info">
        <text class="nickname">{{ memberInfo.nickname }}</text>
        <text class="mobile">{{ memberInfo.mobile }}</text>
      </view>
    </view>
    <view class="user-card" v-else @click="goToLogin">
      <image src="/static/default-avatar.png" mode="aspectFill" class="avatar" />
      <view class="info">
        <text class="nickname">点击登录</text>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="menu-list">
      <view class="menu-item" @click="navigateTo('/pages/ucenter/password')">
        <text class="iconfont icon-password"></text>
        <text>修改密码</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/ucenter/collect')">
        <text class="iconfont icon-collect"></text>
        <text>收藏课程</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/ucenter/study')">
        <text class="iconfont icon-study"></text>
        <text>学习记录</text>
        <text class="arrow">></text>
      </view>
    </view>

    <!-- 退出登录按钮（仅登录态） -->
    <button v-if="memberInfo.id" class="logout-btn" @click="logout">退出登录</button>

    <view class="footer-placeholder"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import Header from '@/components/Header.vue'
import { getFullUrl } from '@/utils/tools'

const memberInfo = ref({})

const loadUserInfo = () => {
  const userStr = uni.getStorageSync('oes_ucenter')
  if (userStr) {
    try {
      memberInfo.value = JSON.parse(userStr)
    } catch (e) {
      memberInfo.value = {}
    }
  } else {
    memberInfo.value = {}
  }
}

onMounted(() => {
  loadUserInfo()
})

onShow(() => {
  loadUserInfo()
})

const navigateTo = (url) => {
  const token = uni.getStorageSync('oes_token')
  if (!token) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }
  uni.navigateTo({ url })
}

const goToLogin = () => {
  uni.navigateTo({ url: '/pages/login/login' })
}

const logout = () => {
  uni.removeStorageSync('oes_token')
  uni.removeStorageSync('oes_ucenter')
  memberInfo.value = {}
  uni.showToast({ title: '已退出', icon: 'success' })
  // 可选跳转到首页
  uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style scoped>
.ucenter {
  background: #f8f8f8;
  min-height: 100vh;
}
.user-card {
  background: #fff;
  margin: 30rpx;
  padding: 40rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 30rpx;
}
.info {
  flex: 1;
}
.nickname {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}
.mobile {
  font-size: 28rpx;
  color: #999;
}
.menu-list {
  background: #fff;
  margin: 30rpx;
  border-radius: 16rpx;
  overflow: hidden;
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 2rpx solid #f0f0f0;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item .iconfont {
  font-size: 40rpx;
  color: #3edeb3;
  margin-right: 20rpx;
}
.menu-item text:nth-child(2) {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}
.arrow {
  color: #ccc;
  font-size: 32rpx;
}
.logout-btn {
  width: 90%;
  margin: 40rpx auto;
  background: #f56c6c;
  color: #fff;
  border-radius: 40rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
}
.footer-placeholder {
  height: 120rpx;
}
</style>