<script setup lang="ts">
import { computed } from 'vue'
import { useChineseStore } from '@/store/chinese'

const chineseStore = useChineseStore()

const totalScore = computed(() => chineseStore.progress?.totalScore ?? 0)
const streakDays = computed(() => chineseStore.progress?.streakDays ?? 0)
</script>

<template>
  <view class="page-header">
    <view class="header-bg">
      <view class="bg-circle circle-1"></view>
      <view class="bg-circle circle-2"></view>
    </view>
    <view class="header-content">
      <view class="header-title">
        <text class="title-emoji">📚</text>
        <text class="title-text">语文课后巩固</text>
      </view>
      <view class="header-stats">
        <view class="stat-card">
          <text class="stat-value">{{ totalScore }}</text>
          <text class="stat-label">总积分</text>
        </view>
        <view class="stat-card">
          <text class="stat-value">{{ streakDays }}</text>
          <text class="stat-label">连续天数</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-header {
  position: relative;
  background: linear-gradient(135deg, var(--secondary-color), var(--success-color));
  padding: var(--spacing-lg) var(--spacing-md);
  padding-top: calc(var(--spacing-lg) + var(--status-bar-height, 44rpx));
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

.circle-1 {
  width: 200rpx;
  height: 200rpx;
  top: -60rpx;
  right: 40rpx;
}

.circle-2 {
  width: 120rpx;
  height: 120rpx;
  bottom: -30rpx;
  left: 60rpx;
}

.header-content {
  position: relative;
  z-index: 1;
}

.header-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.title-emoji {
  font-size: 48rpx;
}

.title-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-white);
}

.header-stats {
  display: flex;
  gap: var(--spacing-md);
}

.stat-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10rpx);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  text-align: center;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.stat-value {
  display: block;
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-white);
  line-height: 1.2;
}

.stat-label {
  display: block;
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.9);
}
</style>
