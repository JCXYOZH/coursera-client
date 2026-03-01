<template>
  <view class="teacher-index">
    <Header />

    <view class="teacher-list" v-if="teacherList.length">
      <view 
        class="teacher-item" 
        v-for="teacher in teacherList" 
        :key="teacher.id"
        @click="goToDetail(teacher.id)"
      >
        <image :src="getFullUrl(teacher.avatar)" mode="aspectFill" class="avatar" />
        <text class="name">{{ teacher.name }}</text>
        <text class="career">{{ teacher.career }}</text>
        <text class="intro">{{ teacher.intro }}</text>
      </view>
    </view>

    <view class="empty" v-else>
      <text>暂无讲师数据</text>
    </view>

    <!-- 分页加载（上拉加载更多） -->
    <view class="load-more" v-if="hasMore" @click="loadMore">加载更多</view>
    <view class="no-more" v-else-if="teacherList.length > 0">没有更多了</view>

    <view class="footer-placeholder"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import { getFullUrl } from '@/utils/tools'
import { teacherApi } from '@/api'

const teacherList = ref([])
const page = ref(1)
const limit = 8
const total = ref(0)
const hasMore = ref(false)

const fetchTeachers = async (reset = false) => {
  if (reset) {
    page.value = 1
    teacherList.value = []
  }
  try {
    const res = await teacherApi.pageQueryTeacher(page.value, limit)
    if (res.code === 20000) {
      const data = res.data
      const records = data.records || []
      if (reset) {
        teacherList.value = records
      } else {
        teacherList.value = [...teacherList.value, ...records]
      }
      total.value = data.total || 0
      hasMore.value = records.length === limit && teacherList.value.length < total.value
    }
  } catch (err) {
    console.error('加载讲师列表失败', err)
  }
}

const loadMore = () => {
  if (hasMore.value) {
    page.value++
    fetchTeachers()
  }
}

const goToDetail = (id) => {
  uni.navigateTo({ url: `/pages/teacher/detail?id=${id}` })
}

onMounted(() => {
  fetchTeachers()
})
</script>

<style scoped>
.teacher-index {
  background: #f8f8f8;
  min-height: 100vh;
}
.teacher-list {
  padding: 30rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 30rpx;
}
.teacher-item {
  width: calc(50% - 15rpx);
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  margin: 0 auto 20rpx;
}
.name {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}
.career {
  font-size: 26rpx;
  color: #999;
  display: block;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.intro {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}
.load-more, .no-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 26rpx;
}
.footer-placeholder {
  height: 120rpx;
}
</style>