<template>
  <view class="order-detail">
    <Header />
    <view class="content" v-if="order">
      <text>订单号：{{ order.orderNo }}</text>
      <text>总金额：{{ order.totalFee }}</text>
      <button @click="toPay">去支付</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Header from '@/components/Header.vue'
import { orderApi } from '@/api'

const order = ref(null)
const orderNo = ref('')

onLoad((query) => {
  if (query.id) {
    orderNo.value = query.id
    fetchOrder()
  }
})

const fetchOrder = async () => {
  try {
    const res = await orderApi.getOrder(orderNo.value)
    if (res.code === 20000) {
      order.value = res.data
    }
  } catch (err) {
    console.error(err)
  }
}

const toPay = () => {
  uni.navigateTo({ url: `/pages/pay/detail?id=${orderNo.value}` })
}
</script>

<style scoped>
.order-detail {
  background: #f8f8f8;
  min-height: 100vh;
}
.content {
  padding: 30rpx;
}
.order-title {
  display: flex;
  justify-content: space-between;
  background: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
}
.order-no {
  font-size: 28rpx;
  color: #666;
}
.order-status {
  font-size: 28rpx;
  color: #f60;
}
.course-info {
  background: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  display: flex;
}
.cover {
  width: 200rpx;
  height: 150rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}
.details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.course-title {
  font-size: 30rpx;
  font-weight: bold;
}
.teacher {
  font-size: 26rpx;
  color: #999;
}
.price {
  font-size: 32rpx;
  color: #f60;
}
.total {
  background: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  text-align: right;
  font-size: 28rpx;
}
.total-price {
  font-size: 36rpx;
  color: #f60;
  margin-left: 20rpx;
}
.agreement {
  background: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  font-size: 28rpx;
}
.pay-btn {
  background: #f60;
  color: #fff;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 32rpx;
}
.pay-btn[disabled] {
  opacity: 0.6;
}
.loading {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}
</style>