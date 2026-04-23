<script setup lang="ts">
import { ref } from 'vue'

const currentSection = ref('about')

const aboutContent = `
少儿课后学习是一款专为6-10岁儿童设计的学习辅助小程序，

我们致力于通过有趣的互动方式，帮助孩子巩固课堂知识，

培养良好的学习习惯，让学习变得更简单、更快乐。
`

const usageContent = `
1. 首页：查看今日学习任务和推荐内容
2. 课程：浏览和学习各学科课程
3. 练习：进行口算、单词、诗词等专项练习
4. 任务：完成每日任务获得奖励
5. 我的：查看个人学习数据和设置

使用建议：
• 每天坚持15-30分钟学习效果最佳
• 鼓励孩子独立完成练习
• 家长可以通过家长中心监督孩子学习进度
`

const privacyContent = `
我们非常重视您和孩子的隐私保护。

我们承诺：
• 不会收集不必要的个人信息
• 不会将您的数据分享给第三方
• 采用加密技术保护您的数据安全
• 您可以随时删除自己的数据

如需了解更多，请查看完整的隐私政策。
`

const sectionData = {
  about: { title: '关于我们', content: aboutContent },
  usage: { title: '使用说明', content: usageContent },
  privacy: { title: '隐私政策', content: privacyContent }
}

const menuItems = [
  { id: 'about', icon: '📖', label: '关于我们' },
  { id: 'usage', icon: '📝', label: '使用说明' },
  { id: 'privacy', icon: '🔒', label: '隐私政策' },
  { id: 'version', icon: 'ℹ️', label: '版本信息' }
]

const handleMenuClick = (id: string) => {
  if (id === 'version') {
    uni.showModal({
      title: '版本信息',
      content: '版本：1.0.0\n更新时间：2024年',
      showCancel: false
    })
  } else {
    currentSection.value = id
  }
}
</script>

<template>
  <view class="about">
    <view v-if="currentSection" class="detail-page">
      <view class="detail-header">
        <view class="back-btn" @click="currentSection = ''">‹</view>
        <view class="detail-title">{{ sectionData[currentSection]?.title }}</view>
        <view class="placeholder"></view>
      </view>
      <scroll-view class="detail-content" scroll-y>
        <view class="content-text">{{ sectionData[currentSection]?.content }}</view>
      </scroll-view>
    </view>

    <view v-else class="main-page">
      <view class="header">
        <view class="logo-area">
          <view class="logo">🎓</view>
          <view class="app-name">少儿课后学习</view>
          <view class="app-version">v1.0.0</view>
        </view>
      </view>

      <view class="content">
        <view class="menu-list">
          <view 
            v-for="item in menuItems" 
            :key="item.id"
            class="menu-item"
            @click="handleMenuClick(item.id)"
          >
            <view class="menu-icon">{{ item.icon }}</view>
            <view class="menu-label">{{ item.label }}</view>
            <view class="menu-arrow">›</view>
          </view>
        </view>

        <view class="contact-section">
          <view class="contact-title">联系我们</view>
          <view class="contact-item">
            <view class="contact-icon">📧</view>
            <view class="contact-label">邮箱</view>
            <view class="contact-value">support@kidslearning.com</view>
          </view>
          <view class="contact-item">
            <view class="contact-icon">💬</view>
            <view class="contact-label">微信</view>
            <view class="contact-value">kidslearning2024</view>
          </view>
        </view>

        <view class="copyright">
          © 2024 少儿课后学习 版权所有
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.about {
  min-height: 100vh;
  background: #f5f7fa;
}

.detail-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  color: #fff;
  font-weight: 300;
}

.detail-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
}

.placeholder {
  width: 60rpx;
}

.detail-content {
  flex: 1;
  padding: 30rpx;
}

.content-text {
  font-size: 28rpx;
  color: #333;
  line-height: 2;
  white-space: pre-wrap;
}

.main-page {
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60rpx 30rpx 80rpx;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.logo {
  width: 120rpx;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
}

.app-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.app-version {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}

.content {
  padding: 30rpx;
}

.menu-list {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background 0.3s;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #f8f9fa;
  }
}

.menu-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}

.menu-label {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.menu-arrow {
  font-size: 32rpx;
  color: #ccc;
}

.contact-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;
}

.contact-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 0;
}

.contact-icon {
  font-size: 32rpx;
}

.contact-label {
  font-size: 26rpx;
  color: #666;
  width: 100rpx;
}

.contact-value {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}

.copyright {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  padding: 20rpx 0;
}
</style>
