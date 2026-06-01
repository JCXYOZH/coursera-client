<template>
  <view class="password-container">
    <Header />
    <view class="form">
      <view class="item">
        <text class="label">手机号</text>
        <input v-model="mobile" type="number" placeholder="请输入手机号（可修改）" maxlength="11" />
      </view>
      <view class="item code-item">
        <text class="label">验证码</text>
        <input v-model="code" type="number" placeholder="验证码" maxlength="6" />
        <button class="code-btn" :disabled="!canSend" @click="sendCode">{{ codeText }}</button>
      </view>
      <view class="item">
        <text class="label">新密码</text>
        <input v-model="password" type="password" placeholder="填写新密码" />
      </view>
      <button class="submit-btn" @click="submitChange">修改</button>
    </view>
    <view v-if="isUseWeChat" class="wechat-tip">您使用的是微信登录，无需在此平台修改密码。</view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import { loginApi, registerApi } from '@/api'
import md5 from 'js-md5'

const mobile = ref('')
const code = ref('')
const password = ref('')
const canSend = ref(true)
const codeText = ref('获取验证码')
const isUseWeChat = ref(false)

onMounted(() => {
  // 检查登录状态
  const token = uni.getStorageSync('oes_token')
  if (!token) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }
  const userStr = uni.getStorageSync('oes_ucenter')
  if (userStr) {
    const user = JSON.parse(userStr)
    isUseWeChat.value = !!user.openid
    mobile.value = user.mobile || ''
  }
})

// 发送验证码
const sendCode = async () => {
  if (!mobile.value) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  try {
    const res = await registerApi.sendVerificationCode(mobile.value)
	if (res.code === 20000) {
		uni.showToast({ title: '验证码发送成功', icon: 'success' })
		canSend.value = false
		let second = 600 // 10分钟倒计时（实际后端限制24小时）
		const timer = setInterval(() => {
		  second--
		  codeText.value = `${second}秒后重试`
		  if (second <= 0) {
		    clearInterval(timer)
		    canSend.value = true
		    codeText.value = '获取验证码'
		  }
		}, 1000)
	} else {
		uni.showToast({ title: res.message || '发送失败', icon: 'none' })
	}
  } catch (err) {
	console.error('发送验证码错误', err)
    uni.showToast({ title: '发送失败', icon: 'none' })
  }
}

// 提交修改
const submitChange = async () => {
  // if (!mobile.value || !code.value) {
  //   uni.showToast({ title: '请填写手机号和验证码', icon: 'none' })
  //   return
  // }
  // if (!password.value || !password.value.trim()) {
  //   uni.showToast({ title: '请输入新密码', icon: 'none' })
  //   return
  // }
  if (!mobile.value || !code.value || !password.value) {
      uni.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
  const data = {
    mobile: mobile.value,
    code: code.value,
	password: password.value
  };
  try {
    const res = await loginApi.updatePassword(data)
    if (res.code === 20000) {
      // 清除本地登录信息，强制重新登录
      uni.removeStorageSync('oes_token')
      uni.removeStorageSync('oes_ucenter')
      uni.showToast({ title: '修改成功，请重新登录', icon: 'success' })
      setTimeout(() => {
        uni.navigateTo({ url: '/pages/login/login' })
      }, 1500)
    } else {
      uni.showToast({ title: res.message || '修改失败', icon: 'none' })
    }
  } catch (err) {
    console.error('修改错误', err)
    uni.showToast({ title: '网络错误', icon: 'none' })
  }
}
</script>

<style scoped>
.password-container {
  background: #f8f8f8;
  min-height: 100vh;
}
.form {
  padding: 30rpx;
  background: #fff;
  margin: 30rpx;
  border-radius: 16rpx;
}
.item {
  margin-bottom: 40rpx;
  display: flex;
  align-items: center;
  border-bottom: 2rpx solid #f5f5f5;
  padding: 20rpx 0;
  position: relative;
}
.label {
  width: 150rpx;
  font-size: 28rpx;
  color: #666;
}
.item input {
  flex: 1;
  font-size: 28rpx;
}
.code-item input {
  padding-right: 180rpx;
}
.code-btn {
  position: absolute;
  right: 0;
  background: transparent;
  color: #409eff;
  border: none;
  font-size: 28rpx;
  padding: 0 20rpx;
  height: 60rpx;
  line-height: 60rpx;
}
.code-btn[disabled] {
  color: #c0c4cc;
}
.submit-btn {
  width: 100%;
  height: 80rpx;
  background: #3edeb3;
  color: #fff;
  border-radius: 40rpx;
  font-size: 32rpx;
  margin-top: 60rpx;
}
.wechat-tip {
  font-size: 30rpx;
  color: #999;
  text-align: center;
  margin-top: 100rpx;
}
</style>