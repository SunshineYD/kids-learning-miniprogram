<script setup lang="ts">
import { useSettingsStore } from '@/store/settings'
import ThemeToggle from '@/components/ThemeToggle/index.vue'

const settings = useSettingsStore()

function toggleSound() {
  settings.toggleSound()
}
</script>

<template>
  <view class="settings-page">
    <view class="settings-header">
      <view class="header-icon">⚙️</view>
      <view class="header-title">设置中心</view>
    </view>

    <view class="settings-content">
      <view class="settings-section">
        <view class="section-title">
          <view class="title-icon">🎨</view>
          <view class="title-text">主题设置</view>
        </view>
        <view class="section-card">
          <view class="section-desc">选择适合你的主题模式</view>
          <ThemeToggle />
        </view>
      </view>

      <view class="settings-section">
        <view class="section-title">
          <view class="title-icon">🔊</view>
          <view class="title-text">音效设置</view>
        </view>
        <view class="section-card">
          <view class="setting-item">
            <view class="setting-info">
              <view class="setting-icon">🎵</view>
              <view class="setting-text">
                <view class="setting-name">答题音效</view>
                <view class="setting-desc">开启后答题会播放音效提示</view>
              </view>
            </view>
            <view
              class="switch-btn"
              :class="{ active: settings.soundEnabled }"
              @tap="toggleSound"
            >
              <view class="switch-dot"></view>
            </view>
          </view>
        </view>
      </view>

      <view class="settings-section">
        <view class="section-title">
          <view class="title-icon">💡</view>
          <view class="title-text">温馨提示</view>
        </view>
        <view class="section-card tips-card">
          <view class="tip-item">
            <view class="tip-icon">👀</view>
            <view class="tip-text">每学习30分钟，建议休息5分钟，保护眼睛哦～</view>
          </view>
          <view class="tip-item">
            <view class="tip-icon">📱</view>
            <view class="tip-text">保持适当距离，手机离眼睛至少30厘米</view>
          </view>
          <view class="tip-item">
            <view class="tip-icon">💡</view>
            <view class="tip-text">护眼模式可以减少蓝光伤害，更适合长时间学习</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background-color: var(--bg-page);
  padding-bottom: 40rpx;
  transition: background-color 0.3s ease;
}

.settings-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 32rpx 40rpx;
  background: linear-gradient(135deg, #FF6B6B 0%, #FCBAD3 100%);
}

.header-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
}

.header-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.settings-content {
  padding: 32rpx 24rpx;
}

.settings-section {
  margin-bottom: 32rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 0 8rpx 16rpx;
}

.title-icon {
  font-size: 36rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.section-card {
  background-color: var(--bg-card);
  border-radius: 24rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.section-desc {
  font-size: 28rpx;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 24rpx;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}

.setting-icon {
  font-size: 48rpx;
  width: 80rpx;
  text-align: center;
}

.setting-text {
  flex: 1;
}

.setting-name {
  font-size: 30rpx;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.setting-desc {
  font-size: 24rpx;
  color: var(--text-light);
}

.switch-btn {
  width: 100rpx;
  height: 56rpx;
  background-color: #E0E0E0;
  border-radius: 28rpx;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.switch-btn.active {
  background-color: #4ECDC4;
}

.switch-dot {
  width: 48rpx;
  height: 48rpx;
  background-color: #FFFFFF;
  border-radius: 50%;
  position: absolute;
  top: 4rpx;
  left: 4rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.switch-btn.active .switch-dot {
  left: 48rpx;
}

.tips-card {
  background: linear-gradient(135deg, #FAF6EB 0%, #F0FFF9 100%);
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 16rpx 0;
}

.tip-item:not(:last-child) {
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);
}

.tip-icon {
  font-size: 32rpx;
  flex-shrink: 0;
  margin-top: 4rpx;
}

.tip-text {
  font-size: 26rpx;
  color: #5C5C4B;
  line-height: 1.6;
  flex: 1;
}
</style>
