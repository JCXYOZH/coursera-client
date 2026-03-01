<script>
import { checkVersion } from '@/utils/version'

export default {
  onLaunch: function() {
    console.log('App Launch')
    // #ifdef APP-PLUS
    this.checkAppVersion()
    // #endif
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  methods: {
    async checkAppVersion() {
      try {
        // 获取当前版本号
        const currentVersion = plus.runtime.versionName || '1.0.0'
        const res = await checkVersion(currentVersion)
        if (res.code === 20000 && res.data) {
          const latestVersion = res.data.versionName
          // 比较版本号（这里简单字符串比较，可按需使用 semver 比较）
          if (this.compareVersion(latestVersion, currentVersion) > 0) {
            // 需要更新
            this.showVersionUpdate(res.data)
          }
        }
      } catch (err) {
        console.error('版本检测失败', err)
      }
    },
    compareVersion(v1, v2) {
      // 简单版本比较，例如 "1.2.3" 转数字数组比较
      const arr1 = v1.split('.').map(Number)
      const arr2 = v2.split('.').map(Number)
      for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
        const n1 = arr1[i] || 0
        const n2 = arr2[i] || 0
        if (n1 > n2) return 1
        if (n1 < n2) return -1
      }
      return 0
    },
    showVersionUpdate(versionInfo) {
      // 动态导入组件并显示
      import('@/components/VersionUpdate.vue').then(module => {
        const VersionUpdate = module.default
        const updateComponent = new VersionUpdate({
          propsData: { versionInfo }
        })
        updateComponent.$mount()
        uni.$emit('version-update', versionInfo)
      })
    }
  }
}
</script>

<style>
/* 全局样式 */
/* 图标字体（若加入iconfont） */
/* 必须放在最前面 */
@import './static/iconfont/iconfont.css';
page {
	background-color: #f8f8f8;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
/* 清除默认边距 */
view, text, image, input, button {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
</style>