<template>
  <view class="login-container">
    <view class="title">
      <text class="active">登录</text>
      <text class="separator">·</text>
      <text @click="goToRegister">注册</text>
    </view>

    <view class="form">
      <view class="input-item">
        <input type="number" v-model="user.mobile" placeholder="手机号" maxlength="11" />
        <text class="iconfont icon-phone"></text>
      </view>
      <view class="input-item">
        <input type="password" v-model="user.password" placeholder="密码" />
        <text class="iconfont icon-password"></text>
      </view>

      <button class="login-btn" @click="submitLogin" :disabled="loading">登录</button>
      <button class="home-btn" @click="goHome">返回首页</button>
    </view>

    <!-- 社交登录（仅示意，保留样式） -->
    <view class="more-sign">
      <text class="h6">社交帐号登录</text>
      <view class="icons">
        <view class="weixin" @click="wxLogin"><text class="iconfont icon-weixin"></text></view>
        <view class="qq" @click="showQQTip"><text class="iconfont icon-qq"></text></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { loginApi } from '@/api'
import md5 from 'js-md5'

const user = ref({ mobile: '', password: '' })
const loading = ref(false)

// const submitLogin = async () => {
//   if (!user.value.mobile || !user.value.password) {
//     uni.showToast({ title: '请填写手机号和密码', icon: 'none' })
//     return
//   }
//   loading.value = true
//   try {
//     // 密码MD5加密（与原项目一致）
//     const loginVO = {
//       mobile: user.value.mobile,
//       password: md5(user.value.password)
//     }
//     const res = await loginApi.submitLogin(loginVO)
//     if (res.code === 20000) {
//       uni.setStorageSync('oes_token', res.data)
//       // 获取用户信息
//       const userRes = await loginApi.getUserInfo()
//       if (userRes.code === 20000) {
//         uni.setStorageSync('oes_ucenter', JSON.stringify(userRes.data))
//         uni.showToast({ title: '登录成功', icon: 'success' })
//         setTimeout(() => {
//           uni.switchTab({ url: '/pages/index/index' })
//         }, 1500)
//       }
//     } else {
//       uni.showToast({ title: res.message || '登录失败', icon: 'none' })
//     }
//   } catch (err) {
//     uni.showToast({ title: '网络错误', icon: 'none' })
//   } finally {
//     loading.value = false
//   }
// }

const submitLogin = async () => {
  if (!user.value.mobile || !user.value.password) {
    uni.showToast({ title: '请填写手机号和密码', icon: 'none' })
    return
  }
  loading.value = true
  try {
    const loginData = {
      mobile: user.value.mobile,
      password: md5(user.value.password)
    }
    const res = await loginApi.submitLogin(loginData)
    if (res.code === 20000) {
      uni.setStorageSync('oes_token', res.data)
      // 获取用户信息
      const userRes = await loginApi.getUserInfo()
      if (userRes.code === 20000) {
        uni.setStorageSync('oes_ucenter', JSON.stringify(userRes.data))
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          uni.switchTab({ url: '/pages/index/index' })
        }, 1500)
      }
    } else {
      uni.showToast({ title: res.message || '登录失败', icon: 'none' })
    }
  } catch (err) {
    console.error('登录错误', err)
    uni.showToast({ title: '网络错误', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  uni.navigateTo({ url: '/pages/register/register' })
}

const goHome = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

const wxLogin = () => {
  // 实际开发中应跳转微信授权页
  uni.showToast({ title: '微信登录开发中', icon: 'none' })
}

const showQQTip = () => {
  uni.showToast({ title: 'QQ登录开发中', icon: 'none' })
}
</script>

<style scoped>
.login-container {
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
.login-btn {
  width: 100%;
  height: 80rpx;
  background: #3edeb3;
  color: #fff;
  border-radius: 40rpx;
  font-size: 32rpx;
  margin-top: 60rpx;
  border: none;
}
.login-btn[disabled] {
  opacity: 0.6;
}
.home-btn {
  width: 100%;
  height: 80rpx;
  background: #31d071;
  color: #fff;
  border-radius: 40rpx;
  font-size: 32rpx;
  margin-top: 30rpx;
  border: none;
}
.more-sign {
  margin-top: 80rpx;
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