<template>
  <view class="course-index">
    <Header />

    <!-- 分类筛选 -->
    <view class="filter-bar">
      <!-- 一级分类 -->
      <scroll-view scroll-x class="level1-scroll">
        <view class="level1-list">
          <text 
            class="level1-item" 
            :class="{ active: currentSubjectId === '' }"
            @click="selectSubject('')"
          >全部</text>
          <text 
            v-for="(subject, index) in subjectList" 
            :key="subject.id"
            class="level1-item" 
            :class="{ active: currentSubjectId === subject.id }"
            @click="selectSubject(subject.id, index)"
          >{{ subject.title }}</text>
        </view>
      </scroll-view>

      <!-- 二级分类（如果有一级选中） -->
      <scroll-view scroll-x class="level2-scroll" v-if="typeList.length">
        <view class="level2-list">
          <text 
            v-for="(type, index) in typeList" 
            :key="type.id"
            class="level2-item" 
            :class="{ active: currentTypeId === type.id }"
            @click="selectType(type.id, index)"
          >{{ type.title }}</text>
        </view>
      </scroll-view>

      <!-- 排序 -->
      <view class="sort-bar">
        <text 
          class="sort-item" 
          :class="{ active: saleCountSort }"
          @click="sortBy('saleCount')"
        >销量 <text v-if="saleCountSort" class="arrow">↓</text></text>
        <text 
          class="sort-item" 
          :class="{ active: createTimeSort }"
          @click="sortBy('createTime')"
        >最新 <text v-if="createTimeSort" class="arrow">↓</text></text>
        <text 
          class="sort-item" 
          :class="{ active: priceSort }"
          @click="sortBy('price')"
        >价格 <text v-if="priceSort" class="arrow">↓</text></text>
      </view>
    </view>

    <!-- 课程列表 -->
    <view class="course-list" v-if="courseList.length">
      <view 
        class="course-item" 
        v-for="course in courseList" 
        :key="course.id"
        @click="goToDetail(course.id)"
      >
        <image :src="getFullUrl(course.cover)" mode="aspectFill" class="cover" />
        <view class="info">
          <text class="title">{{ course.title }}</text>
          <view class="stats">
            <text>{{ course.viewCount }}人学习</text>
            <text>|</text>
            <text>9634评论</text>
          </view>
          <text class="price" :class="{ free: course.price === 0 }">
            {{ course.price > 0 ? '￥' + course.price : '免费' }}
          </text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty" v-else>
      <text>没有相关课程</text>
    </view>

    <!-- 加载更多（上拉加载） -->
    <view class="load-more" v-if="hasMore" @click="loadMore">加载更多</view>
    <view class="no-more" v-else-if="courseList.length > 0">没有更多了</view>

    <!-- 底部占位 -->
    <view class="footer-placeholder"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import { getFullUrl } from '@/utils/tools'
import { courseApi, subjectApi } from '@/api'

// 数据
const subjectList = ref([])
const typeList = ref([])
const courseList = ref([])
const currentSubjectId = ref('')
const currentTypeId = ref('')
const saleCountSort = ref('')
const createTimeSort = ref('')
const priceSort = ref('')
const page = ref(1)
const limit = 8
const total = ref(0)
const hasMore = ref(false)

// 加载一级分类
const loadSubjects = async () => {
  try {
    const res = await subjectApi.getAllSubject()
    if (res.code === 20000) {
      subjectList.value = res.data || []
    }
  } catch (err) {
    console.error('加载分类失败', err)
  }
}

// 选择一级分类
const selectSubject = (subjectId, index) => {
  currentSubjectId.value = subjectId
  currentTypeId.value = ''
  typeList.value = []
  page.value = 1
  // 如果选中了具体分类，查找其二级分类
  if (subjectId) {
    const subject = subjectList.value.find(s => s.id === subjectId)
    if (subject && subject.children) {
      typeList.value = subject.children
    }
  }
  fetchCourses(true)
}

// 选择二级分类
const selectType = (typeId) => {
  currentTypeId.value = typeId
  page.value = 1
  fetchCourses(true)
}

// 排序
const sortBy = (type) => {
  // 重置其他排序
  saleCountSort.value = ''
  createTimeSort.value = ''
  priceSort.value = ''
  if (type === 'saleCount') saleCountSort.value = '1'
  else if (type === 'createTime') createTimeSort.value = '1'
  else if (type === 'price') priceSort.value = '1'
  page.value = 1
  fetchCourses(true)
}

// 构建查询条件
const buildQuery = () => {
  const query = {}
  if (currentSubjectId.value) query.subjectId = currentSubjectId.value
  if (currentTypeId.value) query.typeId = currentTypeId.value
  if (saleCountSort.value) query.saleCountSort = saleCountSort.value
  if (createTimeSort.value) query.createTimeSort = createTimeSort.value
  if (priceSort.value) query.priceSort = priceSort.value
  return query
}

// 获取课程列表
const fetchCourses = async (reset = false) => {
  if (reset) {
    page.value = 1
    courseList.value = []
  }
  try {
    const res = await courseApi.pageQueryCourse(page.value, limit, buildQuery())
    if (res.code === 20000) {
      const data = res.data
      const records = data.records || []
      if (reset) {
        courseList.value = records
      } else {
        courseList.value = [...courseList.value, ...records]
      }
      total.value = data.total || 0
      hasMore.value = records.length === limit && courseList.value.length < total.value
    }
  } catch (err) {
    console.error('加载课程失败', err)
  }
}

// 加载更多
const loadMore = () => {
  if (hasMore.value) {
    page.value++
    fetchCourses()
  }
}

// 跳转详情
const goToDetail = (id) => {
  uni.navigateTo({ url: `/pages/course/detail?id=${id}` })
}

onMounted(() => {
  loadSubjects()
  fetchCourses()
})
</script>

<style scoped>
.course-index {
  background: #f8f8f8;
  min-height: 100vh;
}
.filter-bar {
  background: #fff;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03);
}
.level1-scroll {
  white-space: nowrap;
  margin-bottom: 20rpx;
}
.level1-list {
  display: inline-flex;
  gap: 40rpx;
}
.level1-item {
  font-size: 28rpx;
  color: #666;
  padding: 10rpx 0;
  display: inline-block;
}
.level1-item.active {
  color: #3edeb3;
  font-weight: bold;
  border-bottom: 4rpx solid #3edeb3;
}
.level2-scroll {
  white-space: nowrap;
  margin-bottom: 20rpx;
}
.level2-list {
  display: inline-flex;
  gap: 30rpx;
}
.level2-item {
  font-size: 26rpx;
  color: #999;
  padding: 8rpx 0;
}
.level2-item.active {
  color: #3edeb3;
}
.sort-bar {
  display: flex;
  gap: 50rpx;
  border-top: 2rpx solid #f0f0f0;
  padding-top: 20rpx;
}
.sort-item {
  font-size: 28rpx;
  color: #666;
}
.sort-item.active {
  color: #3edeb3;
}
.arrow {
  font-size: 24rpx;
}
.course-list {
  padding: 0 30rpx;
}
.course-item {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.cover {
  width: 200rpx;
  height: 150rpx;
}
.info {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.title {
  font-size: 28rpx;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.stats {
  font-size: 22rpx;
  color: #999;
  display: flex;
  gap: 10rpx;
}
.price {
  font-size: 32rpx;
  color: #f60;
}
.price.free {
  color: #090;
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