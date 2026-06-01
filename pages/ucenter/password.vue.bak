<template>
  <view class="password-container">
    <view class="form">
      <view class="item">
        <text class="label">手机号</text>
        <input v-model="params.mobile" type="number" placeholder="请输入手机号" maxlength="11" />
      </view>
      <view class="item code-item">
        <text class="label">验证码</text>
        <input v-model="params.code" type="number" placeholder="验证码" maxlength="6" />
        <button class="code-btn" :disabled="!canSend" @click="sendCode">{{ codeText }}</button>
      </view>
      <view class="item">
        <text class="label">新密码</text>
        <input v-model="params.password" type="password" placeholder="请输入新密码" />
      </view>
      <button class="submit-btn" @click="submitChange">修改</button>
    </view>
    <view v-if="isUseWeChat" class="wechat-tip">您使用的是微信登录，无需在此平台修改密码。</view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { loginApi, registerApi } from '@/api'
import md5 from 'js-md5'

const params = ref({ mobile: '', code: '', password: '' })
const canSend = ref(true)
const codeText = ref('获取验证码')
const isUseWeChat = ref(false)

onMounted(() => {
  const userStr = uni.getStorageSync('oes_ucenter')
  if (userStr) {
    const user = JSON.parse(userStr)
    isUseWeChat.value = !!user.openid
  }
})

const sendCode = async () => {
  if (!params.value.mobile) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return
  }
  try {
	// TO DO
    // await registerApi.sendVerificationCode(params.value.mobile)
    await registerApi.getVerificationCode(params.value.mobile)
    uni.showToast({ title: '验证码发送成功', icon: 'success' })
    canSend.value = false
    let second = 600
    const timer = setInterval(() => {
      second--
      codeText.value = `${second}秒后重试`
      if (second <= 0) {
        clearInterval(timer)
        canSend.value = true
        codeText.value = '获取验证码'
      }
    }, 1000)
  } catch (err) {
    uni.showToast({ title: '发送失败', icon: 'none' })
  }
}

// const submitChange = async () => {
//   if (!params.value.mobile || !params.value.code || !params.value.password) {
//     uni.showToast({ title: '请填写完整信息', icon: 'none' })
//     return
//   }
//   const data = {
//     mobile: params.value.mobile,
//     code: params.value.code,
//     password: md5(params.value.password)
//   }
//   try {
//     const res = await loginApi.updatePassword(data)
//     if (res.code === 20000) {
//       uni.showToast({ title: '修改密码成功', icon: 'success' })
//       setTimeout(() => {
//         uni.navigateTo({ url: '/pages/login/login' })
//       }, 1500)
//     } else {
//       uni.showToast({ title: res.message || '修改失败', icon: 'none' })
//     }
//   } catch (err) {
//     uni.showToast({ title: '网络错误', icon: 'none' })
//   }
// }

const submitChange = async () => {
  // ...
  const res = await loginApi.updatePassword(data)
  if (res.code === 20000) {
    uni.removeStorageSync('oes_token')
    uni.removeStorageSync('oes_ucenter')
    uni.showToast({ title: '修改成功，请重新登录', icon: 'success' })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/login/login' })
    }, 1500)
  }
}
</script>

<style scoped>
.password-container {
  padding: 30rpx;
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