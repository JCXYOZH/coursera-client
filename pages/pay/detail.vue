<!-- pages/pay/detail.vue -->
<template>
  <view class="pay-detail">
    <Header />
    <view class="content" v-if="payInfo">
      <view class="order-info">
        <text class="label">订单号：</text>
        <text class="value">{{ payInfo.out_trade_no }}</text>
      </view>
      <view class="amount">
        <text class="label">应付金额：</text>
        <text class="value">￥{{ payInfo.total_fee }}</text>
      </view>
      <view class="qrcode">
        <canvas canvas-id="qrcode" style="width: 400rpx; height: 400rpx;"></canvas>
        <text class="tip">请使用微信扫一扫</text>
      </view>
    </view>
    <view v-else class="loading">生成支付二维码中...</view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Header from '@/components/Header.vue'
import { orderApi } from '@/api'
import uQRCode from 'weapp-qrcode'

const payInfo = ref(null)
const orderNo = ref('')
let timer = null

onLoad((query) => {
  if (query.id) {
    orderNo.value = query.id
    createNative()
  }
})

const createNative = async () => {
  try {
    const res = await orderApi.createNative(orderNo.value)
    if (res.code === 20000) {
      payInfo.value = res.data
      // 生成二维码
      nextTick(() => {
        uQRCode.make({
          canvasId: 'qrcode',
          text: payInfo.value.code_url, // 微信支付链接
          size: 400,
          margin: 10,
          success: () => {
            console.log('二维码生成成功')
          },
          fail: (err) => {
            console.error('二维码生成失败', err)
          }
        })
      })
    }
  } catch (err) {
    uni.showToast({ title: '生成支付码失败', icon: 'none' })
  }
}

// 轮询支付状态
const startPolling = () => {
  timer = setInterval(async () => {
    try {
      const res = await orderApi.queryOrderStatus(orderNo.value)
      if (res.code === 20000) {
        // 支付成功
        clearInterval(timer)
        uni.showToast({ title: '支付成功', icon: 'success' })
        // 跳转到课程详情
        setTimeout(() => {
          uni.navigateTo({ url: `/pages/course/detail?id=${payInfo.value.course_id}` })
        }, 1500)
      }
    } catch (err) {
      // 可能支付中，继续轮询
    }
  }, 3000)
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.pay-detail {
  background: #f8f8f8;
  min-height: 100vh;
}
.content {
  padding: 30rpx;
}
.order-info, .amount {
  background: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  display: flex;
  font-size: 28rpx;
}
.label {
  width: 150rpx;
  color: #999;
}
.value {
  flex: 1;
  color: #333;
}
.qrcode {
  background: #fff;
  padding: 60rpx;
  border-radius: 16rpx;
  text-align: center;
}
.qrcode image, .qrcode canvas {
  width: 400rpx;
  height: 400rpx;
  margin: 0 auto;
}
.tip {
  display: block;
  margin-top: 30rpx;
  font-size: 28rpx;
  color: #999;
}
.loading {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}
</style>