<template>
  <view class="header">
    <view class="header-top">
      <!-- Logo -->
      <view class="logo" @click="goHome">
        <image src="/static/logo.png" mode="aspectFit"></image>
      </view>

      <!-- 励志话语 -->
      <view class="motto-container">
        <text class="motto-text">{{ currentMotto }}</text>
      </view>

      <!-- 右侧图标（消息、搜索触发）移动端显示 -->
      <view class="header-icons" @click="toggleSearch">
        <text class="iconfont icon-search"></text>
      </view>
    </view>

    <!-- 导航栏 + 搜索框（PC风格，移动端可折叠） -->
    <view class="header-bottom" :class="{ 'search-active': showSearch }">
      <view class="nav">
        <text class="nav-item" :class="{ active: currentTab === 'index' }" @click="switchTab('index')">首页</text>
        <text class="nav-item" :class="{ active: currentTab === 'course' }" @click="switchTab('course')">课程</text>
        <text class="nav-item" :class="{ active: currentTab === 'teacher' }" @click="switchTab('teacher')">讲师</text>
      </view>

      <view class="search-box">
        <input type="text" v-model="keyword" placeholder="输入你想学的课程" @confirm="handleSearch" />
        <text class="iconfont icon-search" @click="handleSearch"></text>
      </view>

      <!-- 用户信息 -->
      <view class="user-info" v-if="loginInfo.id">
        <image :src="getFullUrl(loginInfo.avatar)" mode="aspectFill" class="avatar" @click="showUserMenu = !showUserMenu"></image>
        <text class="nickname">{{ loginInfo.nickname }}</text>
        <view class="user-menu" v-if="showUserMenu">
          <view class="menu-item" @click="checkLoginAndNavigate('/pages/ucenter/basic')">基本信息</view>
          <view class="menu-item" @click="checkLoginAndNavigate('/pages/ucenter/password')">修改密码</view>
          <view class="menu-item" @click="checkLoginAndNavigate('/pages/ucenter/collect')">收藏课程</view>
          <view class="menu-item" @click="checkLoginAndNavigate('/pages/ucenter/study')">学习记录</view>
          <view class="menu-item" @click="logout">退出</view>
        </view>
      </view>
      <view class="user-info" v-else>
        <text class="login" @click="goTo('/pages/login/login')">登录</text>
        <text class="register" @click="goTo('/pages/register/register')">注册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getFullUrl } from '@/utils/tools'

// 励志话语列表（从原项目复制）
const mottoList = [
  "凡事趁早，没有那么多来日方长",
  "稍微不努力，就会被后者反超",
  "你始终欠自己一个努力的模样",
  "你羡慕的成绩背后都是你没熬过的苦",
  "一定要站在你所热爱的世界里闪闪发光",
  "上帝只会给挺过去的人考验",
  "从来只有拼出来的美丽，没有等出来的辉煌",
  "你要相信，你是被上帝选中的孩子",
  "你偷过的懒，都会在日后成为遗憾",
  "你只有非常努力，才能看起来毫不费力",
  "你未来的样子藏在你现在的努力里",
  "你要知道你讨厌的人也在努力",
  "半山腰总是挤的，你得去山顶看看",
  "同是风华正茂，何甘他人之后",
  "停下休息的时候，别忘了他人还在前行",
  "你总是书读的不多而想太多",
  "你可以迷茫，但请你不要虚度",
  "你需要的是一直变好，而不是一直后悔",
  "失败不是悲剧，放弃才是",
  "幸运是不存在的，努力才是硬道理",
  "我们各自努力，最高处见",
  "当你在夜晚孤军奋战 ，满天星光都因你而闪烁",
  "上岸的路是用卷子铺出来的",
  "你要暗自努力，然后惊艳所有人",
  "没死就不要把自己当成废物",
  "跌入低谷并不意味着要一直在那",
  "别说学习没用，是你没用",
  "阳光依然明亮，未来也会闪闪发光",
  "奇迹是努力的另外一个名字",
  "努力只能及格，拼命才会优秀",
  "没人嘲笑你的梦想，他们只是嘲笑你的实力",
  "不努力的人听到的永远是别人的好消息",
  "你一定要走，走到灯火通明",
  "我们没有退缩的选择，只有前进的使命",
  "要么出众，要么出局",
  "你只管努力，剩下的交给时间",
  "每一个优秀的人，都有一段沉默的时光",
  "最好的年纪，不要辜负最美的自己",
  "不努力的话，是会被合并同项的",
  "该来的都在路上了",
  "仅有一次的人生当然要活得比谁都炽热",
  "不去努力争取，那你连失败的资格都没有",
  "抬起头来做人，低下头来做事",
  "如果你想赢，这些都不算什么",
  "撑住，才有后来的一切",
  "总有一天，你的苦会照亮你走的路",
  "你所有的焦虑都来源于原地不动",
  "愿你以渺小启程以伟大结束",
  "别人能做到的事情，我也能做到",
  "生活的理想，是为了理想的生活",
  "尽管眼下十分困难，但日后必定会开花结果",
  "趁现在，一切都来得及",
  "你凭什么不努力，又什么都想得到",
  "受这些苦，一定是为了什么值得的东西",
  "比你差的人还没放弃，比你好的人还在努力",
  "不想被别人否定，自己就要更加努力",
  "世界那么大，我应该让父母去看看",
  "莫问前程凶吉，但求落幕无悔",
  "你不如现实一点，先把书读好",
  "努力是会上瘾的，特别是尝到甜头之后",
  "你多学一样本事，就少说一句求人的话",
  "你觉得这条路很难走的时候，一定是上坡路",
  "你要明白，学习不难，是你努力不够",
  "在破浪之前它需要沉淀",
  "不要让未来的你，讨厌现在的自己",
  "只要放弃一次，就会滋生放弃的习性",
  "我荒废了时间，时间便把我荒废了",
  "愿你相对辛苦，但绝对优秀",
  "抱怨身处黑暗，不如提灯前行",
  "没有人要求得了你输，除非你自己不想赢",
  "总不能把这个世界让给那些你讨厌的人吧",
  "你当然可以自欺欺人，但成绩不会无中生有",
  "你曾经也是第一名啊！",
  "总有人会赢，为什么不是我呢？",
  "能为梦想吃苦这是多么酷的一件事情啊",
  "你一定要优秀，去堵住那些悠悠众口",
  "不走心的努力，都是在敷衍自己",
  "自己想上的大学不能让给别人",
  "他们都假装颓废，你别上当",
  "越是一无所有，越要奋力一搏",
  "请不要假装努力，因为结局不会陪你演戏",
  "现在不玩命，将来命玩我",
  "任何值得到达的地方，都没有捷径",
  "老天明目张胆地不公平，但凡人保留偏执的权利",
  "今年很难，可我偏要考上",
  "当你觉得为时已晚的时候，恰恰是最早的时候",
  "累吗，累就对了，舒服是留给死人的",
  "世人皆苦，都在对抗，你也不能认输",
  "每一次努力，都是幸运的伏笔",
  "成功靠努力，爱拼才会赢",
  "学习给我压力，我必还你奇迹",
  "努力尽今夕，少年犹可夸",
  "哪个伟大的人不是从平凡中脱颖而出",
  "鸟欲高飞先振翅，人求上进先读书",
  "这世上哪有从天而降的运气，都是不为人知的努力",
  "身边比你优秀的人比你还努力",
  "该来的都在路上，早晚苦尽甘来",
  "考得上的，你可以的，绝对行的!"
]
const currentMotto = ref('')
const dayCheckInterval = ref(null)

const keyword = ref('')
const showSearch = ref(false)
const currentTab = ref('index')
const loginInfo = ref({})
const showUserMenu = ref(false)

// 初始化励志话语
const initMotto = () => {
  const startDate = new Date('2026-01-01')
  const today = new Date()
  const diffTime = today - startDate
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const mottoIndex = diffDays % mottoList.length
  currentMotto.value = mottoList[mottoIndex]
}

// 每日更新检查
const startDayCheck = () => {
  dayCheckInterval.value = setInterval(() => {
    const now = new Date()
    const lastUpdate = uni.getStorageSync('lastMottoUpdate')
    const today = now.toDateString()
    if (now.getHours() === 0 && now.getMinutes() === 0 && lastUpdate !== today) {
      const currentIndex = mottoList.indexOf(currentMotto.value)
      const nextIndex = (currentIndex + 1) % mottoList.length
      currentMotto.value = mottoList[nextIndex]
      uni.setStorageSync('lastMottoUpdate', today)
    }
  }, 60000)
}

// 获取用户信息
const getUserInfo = () => {
  const userStr = uni.getStorageSync('oes_ucenter')
  if (userStr) {
    try {
      loginInfo.value = JSON.parse(userStr)
    } catch (e) {
      loginInfo.value = {}
    }
  } else {
    loginInfo.value = {}
  }
}

onMounted(() => {
  initMotto()
  startDayCheck()
  getUserInfo()
})

onShow(() => {
  // 每次页面显示重新获取用户信息（登录后）
  getUserInfo()
  // 根据当前页面路径设置高亮tab
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const route = currentPage.route
  if (route.includes('index')) currentTab.value = 'index'
  else if (route.includes('course/index')) currentTab.value = 'course'
  else if (route.includes('teacher/index')) currentTab.value = 'teacher'
})

onUnmounted(() => {
  if (dayCheckInterval.value) clearInterval(dayCheckInterval.value)
})

const goHome = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

const switchTab = (tab) => {
  currentTab.value = tab
  if (tab === 'index') uni.switchTab({ url: '/pages/index/index' })
  else if (tab === 'course') uni.switchTab({ url: '/pages/course/index' })
  else if (tab === 'teacher') uni.switchTab({ url: '/pages/teacher/index' })
}

const toggleSearch = () => {
  showSearch.value = !showSearch.value
}

// const handleSearch = () => {
//   if (keyword.value.trim()) {
//     uni.navigateTo({
//       url: `/pages/course/index?keyword=${encodeURIComponent(keyword.value.trim())}`
//     })
//     keyword.value = ''
//     showSearch.value = false
//   }
// }

const goTo = (url) => {
  uni.navigateTo({ url })
  showUserMenu.value = false
}

const checkLoginAndNavigate = (url) => {
  const token = uni.getStorageSync('oes_token')
  if (!token) {
    uni.navigateTo({ url: '/pages/login/login' })
    return
  }
  uni.navigateTo({ url })
}

const logout = () => {
  uni.removeStorageSync('oes_token')
  uni.removeStorageSync('oes_ucenter')
  loginInfo.value = {}
  showUserMenu.value = false
  uni.showToast({ title: '已退出', icon: 'success' })
  // 跳转到首页
  uni.switchTab({ url: '/pages/index/index' })
}

const handleSearch = () => {
  uni.showToast({
    title: '功能开发中，敬请期待！',
    icon: 'none',
    duration: 2000
  })
}
</script>

<style scoped>
.header {
  background: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  padding: 20rpx 30rpx;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.logo {
  width: 150rpx;
  height: 60rpx;
}
.logo image {
  width: 100%;
  height: 100%;
}
.motto-container {
  flex: 1;
  margin: 0 30rpx;
  padding: 10rpx 20rpx;
  background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
  border-radius: 40rpx;
  text-align: center;
}
.motto-text {
  color: #fff;
  font-size: 24rpx;
  font-weight: bold;
}
.header-icons {
  display: none;
}
.header-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav {
  display: flex;
  gap: 40rpx;
}
.nav-item {
  font-size: 28rpx;
  color: #666;
  padding: 10rpx 0;
}
.nav-item.active {
  color: #3edeb3;
  font-weight: bold;
  border-bottom: 4rpx solid #3edeb3;
}
.search-box {
  flex: 1;
  max-width: 400rpx;
  margin: 0 30rpx;
  position: relative;
}
.search-box input {
  width: 100%;
  height: 60rpx;
  background: #f5f5f5;
  border-radius: 30rpx;
  padding: 0 60rpx 0 30rpx;
  font-size: 26rpx;
}
.search-box .iconfont {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 32rpx;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  position: relative;
}
.avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
}
.nickname {
  font-size: 28rpx;
  color: #333;
}
.login, .register {
  font-size: 28rpx;
  color: #3edeb3;
}
.user-menu {
  position: absolute;
  top: 80rpx;
  right: 0;
  background: #fff;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
  border-radius: 8rpx;
  width: 200rpx;
  z-index: 200;
}
.menu-item {
  padding: 20rpx;
  font-size: 26rpx;
  border-bottom: 1rpx solid #f0f0f0;
  text-align: center;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item:active {
  background: #f5f5f5;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .header-icons {
    display: block;
    font-size: 40rpx;
  }
  .header-bottom {
    flex-direction: column;
    align-items: stretch;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s;
  }
  .header-bottom.search-active {
    max-height: 300rpx;
  }
  .nav {
    justify-content: space-around;
    margin-bottom: 20rpx;
  }
  .search-box {
    max-width: 100%;
    margin: 0 0 20rpx 0;
  }
  .user-info {
    justify-content: flex-end;
  }
}
</style>