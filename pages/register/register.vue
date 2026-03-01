<template>
  <view class="register-container">
    <view class="title">
      <text @click="goToLogin">登录</text>
      <text class="separator">·</text>
      <text class="active">注册</text>
    </view>

    <view class="form">
      <view class="input-item">
        <input type="text" v-model="params.nickname" placeholder="你的昵称" />
        <text class="iconfont icon-user"></text>
      </view>
      <view class="input-item">
        <input type="number" v-model="params.mobile" placeholder="手机号" maxlength="11" @blur="checkMobile" />
        <text class="iconfont icon-phone"></text>
      </view>
      <view class="input-item code-item">
        <input type="number" v-model="params.code" placeholder="验证码" maxlength="6" />
        <text class="iconfont icon-phone"></text>
        <button class="code-btn" :disabled="!canSend || !sliderSuccess" @click="sendCode">
          {{ codeText }}
        </button>
      </view>
      <view class="input-item">
        <input type="password" v-model="params.password" placeholder="设置密码" />
        <text class="iconfont icon-password"></text>
      </view>

      <!-- 滑块验证 -->
      <view class="slider-container">
        <view 
          class="slider-track" 
          :class="{ success: sliderSuccess }"
          ref="sliderTrack"
          @touchstart="startDrag"
          @touchmove="onDrag"
          @touchend="stopDrag"
          @touchcancel="stopDrag"
        >
          <view class="slider-progress" :style="{ width: sliderLeft + 'px' }"></view>
          <view 
            class="slider-button" 
            :style="{ left: sliderLeft + 'px' }"
            @touchstart="startDrag"
          ></view>
          <text v-if="!sliderSuccess">向右滑动完成验证</text>
          <text v-else>验证成功 ✅</text>
        </view>
      </view>

      <button class="register-btn" @click="submitRegister" :disabled="registerLoading">注册</button>
      <button class="home-btn" @click="goHome">返回首页</button>
    </view>

    <view class="agreement">
      点击 “注册” 即表示您同意并愿意遵守
      <text @click="showAgreement">用户协议</text> 和
      <text @click="showPrivacy">隐私政策</text>。
    </view>

    <!-- 社交登录 -->
    <view class="more-sign">
      <text class="h6">社交帐号直接登录</text>
      <view class="icons">
        <view class="weixin" @click="wxLogin"><text class="iconfont icon-weixin"></text></view>
        <view class="qq" @click="showQQTip"><text class="iconfont icon-qq"></text></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { registerApi } from '@/api'

const params = ref({
  mobile: '',
  code: '',
  nickname: '',
  password: ''
})

const mobileExist = ref(false)
const canSend = ref(true)
const codeText = ref('获取验证码')
const registerLoading = ref(false)
const cooldownKey = 'smsCooldownEndTime'

// 滑块相关
const sliderLeft = ref(0)
const sliderSuccess = ref(false)
const dragging = ref(false)
const startX = ref(0)
const startLeft = ref(0)
const trackWidth = ref(0)
const sliderTrack = ref(null)

// 检查手机号
const checkMobile = async () => {
  const mobile = params.value.mobile
  if (!/^1[3456789]\d{9}$/.test(mobile)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' })
    return
  }
  try {
    const res = await registerApi.checkMobile(mobile)
    // 兼容不同返回结构
    let isRegistered = false
    if (res.data && typeof res.data.isRegistered === 'boolean') {
      isRegistered = res.data.isRegistered
    } else if (res.data && res.data.data && typeof res.data.data.isRegistered === 'boolean') {
      isRegistered = res.data.data.isRegistered
    }
    if (isRegistered) {
      mobileExist.value = true
      uni.showToast({ title: '手机号已注册', icon: 'none' })
    } else {
      mobileExist.value = false
    }
  } catch (err) {
    console.error('检查手机号失败', err)
  }
}

// 发送验证码
const sendCode = async () => {
  if (!sliderSuccess.value) {
    uni.showToast({ title: '请先完成滑块验证', icon: 'none' })
    return
  }
  if (!canSend.value) return
  if (mobileExist.value) {
    uni.showToast({ title: '该手机号已注册', icon: 'none' })
    return
  }
  if (!params.value.mobile) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  try {
    await registerApi.sendVerificationCode(params.value.mobile)
    uni.showToast({ title: '验证码发送成功', icon: 'success' })
    canSend.value = false
    const endTime = Date.now() + 60000 // 60秒倒计时
    uni.setStorageSync(cooldownKey, endTime)
    startCountdown()
  } catch (err) {
    uni.showToast({ title: '发送失败', icon: 'none' })
  }
}

// 倒计时
const startCountdown = () => {
  const timer = setInterval(() => {
    const endTime = uni.getStorageSync(cooldownKey)
    const remaining = Math.floor((endTime - Date.now()) / 1000)
    if (remaining <= 0) {
      clearInterval(timer)
      canSend.value = true
      codeText.value = '获取验证码'
      uni.removeStorageSync(cooldownKey)
    } else {
      codeText.value = `${remaining}秒后重试`
    }
  }, 1000)
}

// 滑块触摸事件
const startDrag = (e) => {
  if (sliderSuccess.value) return
  dragging.value = true
  startX.value = e.touches[0].clientX
  startLeft.value = sliderLeft.value
  // 获取轨道宽度
  const query = uni.createSelectorQuery().in(this)
  query.select('.slider-track').boundingClientRect(data => {
    if (data) {
      trackWidth.value = data.width - 40 // 减去按钮宽度
    }
  }).exec()
}

const onDrag = (e) => {
  if (!dragging.value) return
  e.preventDefault()
  const moveX = e.touches[0].clientX - startX.value
  let newLeft = startLeft.value + moveX
  if (newLeft >= trackWidth.value) {
    sliderLeft.value = trackWidth.value
    sliderSuccess.value = true
    dragging.value = false
    uni.showToast({ title: '验证成功', icon: 'success' })
  } else if (newLeft > 0) {
    sliderLeft.value = newLeft
  }
}

const stopDrag = () => {
  if (!sliderSuccess.value) {
    sliderLeft.value = 0
  }
  dragging.value = false
}

// 提交注册
const submitRegister = async () => {
  if (!sliderSuccess.value) {
    uni.showToast({ title: '请先完成滑块验证', icon: 'none' })
    return
  }
  if (!params.value.nickname || !params.value.mobile || !params.value.code || !params.value.password) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  registerLoading.value = true
  try {
    const res = await registerApi.submitRegister(params.value)
    if (res.code === 20000) {
      uni.showToast({ title: '注册成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateTo({ url: '/pages/login/login' })
      }, 1500)
    } else {
      uni.showToast({ title: res.message || '注册失败', icon: 'none' })
    }
  } catch (err) {
    uni.showToast({ title: '网络错误', icon: 'none' })
  } finally {
    registerLoading.value = false
  }
}

const goToLogin = () => {
  uni.navigateTo({ url: '/pages/login/login' })
}

const goHome = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

const showAgreement = () => {
  // 跳转协议页
  uni.showToast({ title: '用户协议', icon: 'none' })
}
const showPrivacy = () => {
  uni.showToast({ title: '隐私政策', icon: 'none' })
}
const wxLogin = () => {
  uni.showToast({ title: '微信登录开发中', icon: 'none' })
}
const showQQTip = () => {
  uni.showToast({ title: 'QQ登录开发中', icon: 'none' })
}
</script>

<style scoped>
.register-container {
  padding: 60rpx 40rpx;
}
.title {
  font-size: 40rpx;
  text-align: center;
  margin-bottom: 60rpx;
}
.title text {
  margin: 0 10rpx;
  color: #999;
}
.title .active {
  color: #333;
  font-weight: bold;
}
.separator {
  color: #ccc;
}
.input-item {
  position: relative;
  margin-bottom: 30rpx;
  border-bottom: 2rpx solid #eee;
}
.input-item input {
  width: 100%;
  height: 80rpx;
  padding-left: 60rpx;
  font-size: 28rpx;
}
.input-item .iconfont {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 36rpx;
}
.code-item {
  position: relative;
}
.code-btn {
  position: absolute;
  right: 0;
  top: 10rpx;
  height: 60rpx;
  line-height: 60rpx;
  background: transparent;
  color: #409eff;
  border: none;
  font-size: 28rpx;
  padding: 0 20rpx;
  z-index: 10;
}
.code-btn[disabled] {
  color: #c0c4cc;
}
.slider-container {
  width: 100%;
  margin: 40rpx 0;
}
.slider-track {
  position: relative;
  height: 80rpx;
  background: #e4e7ed;
  border-radius: 40rpx;
  line-height: 80rpx;
  text-align: center;
  color: #909399;
  user-select: none;
  overflow: hidden;
}
.slider-track.success {
  background: #67c23a;
  color: #fff;
}
.slider-progress {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #409eff, #66b1ff);
  border-radius: 40rpx;
  transition: width 0.1s;
}
.slider-track.success .slider-progress {
  display: none;
}
.slider-button {
  position: absolute;
  top: 0;
  width: 80rpx;
  height: 80rpx;
  background: #fff;
  border-radius: 50%;
  border: 2rpx solid #dcdfe6;
  cursor: pointer;
  z-index: 2;
}
.register-btn, .home-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  font-size: 32rpx;
  margin-top: 30rpx;
  border: none;
  color: #fff;
}
.register-btn {
  background: #3edeb3;
}
.home-btn {
  background: #31d071;
}
.agreement {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  margin-top: 30rpx;
}
.agreement text {
  color: #409eff;
}
.more-sign {
  margin-top: 60rpx;
  text-align: center;
}
.more-sign .h6 {
  color: #999;
  font-size: 28rpx;
  position: relative;
  display: inline-block;
  padding: 0 30rpx;
  background: #fff;
}
.more-sign .icons {
  display: flex;
  justify-content: center;
  margin-top: 30rpx;
}
.more-sign .icons view {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20rpx;
}
.more-sign .icons .weixin .iconfont {
  color: #09bb07;
  font-size: 48rpx;
}
.more-sign .icons .qq .iconfont {
  color: #12b7f5;
  font-size: 48rpx;
}
</style>