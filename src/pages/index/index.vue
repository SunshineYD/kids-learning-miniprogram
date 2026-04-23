<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useUserStore } from '@/store/user'
  import { useAppStore } from '@/store/app'
  import GradeSelector from '@/components/GradeSelector/index.vue'
  import DailyTask from '@/components/DailyTask/index.vue'
  import CheckInCard from '@/components/CheckInCard/index.vue'
  import QuickNav from '@/components/QuickNav/index.vue'

  const userStore = useUserStore()
  const appStore = useAppStore()

  const handleParentCenter = () => {
    uni.showToast({
      title: '进入家长中心',
      icon: 'none'
    })
  }

  onMounted(() => {
    appStore.init()
    userStore.init()
  })
</script>

<template>
  <view class="index-page">
    <view class="header">
      <view class="header-bg">
        <view class="bg-circle circle-1"></view>
        <view class="bg-circle circle-2"></view>
        <view class="bg-circle circle-3"></view>
      </view>
      <view class="header-content">
        <view class="user-info">
          <image class="avatar" :src="userStore.user?.avatar || '/static/default-avatar.png'" mode="aspectFill" />
          <view class="info">
            <view class="greeting">你好呀 👋</view>
            <view class="nickname">{{ userStore.user?.nickname || '小朋友' }}</view>
          </view>
        </view>
        <view class="header-actions">
          <view class="points-card">
            <view class="points">{{ userStore.user?.points || 0 }}</view>
            <view class="label">积分</view>
          </view>
          <view class="parent-btn" @click="handleParentCenter">
            <text>👨‍👩‍👧</text>
          </view>
        </view>
      </view>
    </view>

    <scroll-view class="content-scroll" scroll-y>
      <view class="content">
        <GradeSelector />

        <CheckInCard />

        <DailyTask />

        <QuickNav />

        <view class="parent-center">
          <view class="parent-card" @click="handleParentCenter">
            <view class="parent-icon">👨‍👩‍👧</view>
            <view class="parent-info">
              <view class="parent-title">家长中心</view>
              <view class="parent-desc">查看学习报告和设置</view>
            </view>
            <view class="parent-arrow">→</view>
          </view>
        </view>

        <view class="bottom-space"></view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
  .index-page {
    min-height: 100vh;
    background: var(--bg-page);
  }

  .header {
    position: relative;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--warning-color) 50%, #FFB6B6 100%);
    border-radius: 0 0 var(--border-radius-xl) var(--border-radius-xl);
    overflow: hidden;
    padding: var(--spacing-lg) var(--spacing-md);
    padding-top: calc(var(--spacing-lg) + var(--status-bar-height, 44rpx));
  }

  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
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
    width: 140rpx;
    height: 140rpx;
    top: 80rpx;
    right: 160rpx;
    background: rgba(255, 255, 255, 0.1);
  }

  .circle-3 {
    width: 100rpx;
    height: 100rpx;
    bottom: -30rpx;
    left: 60rpx;
    background: rgba(255, 255, 255, 0.12);
  }

  .header-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .avatar {
    width: 110rpx;
    height: 110rpx;
    border-radius: 50%;
    border: 6rpx solid rgba(255, 255, 255, 0.4);
    background: #fff;
    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
  }

  .info {
    .greeting {
      font-size: var(--font-size-sm);
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 4rpx;
    }

    .nickname {
      font-size: var(--font-size-xl);
      font-weight: 800;
      color: var(--text-white);
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .points-card {
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10rpx);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-xl);
    text-align: center;
    min-width: 110rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.3);

    .points {
      font-size: var(--font-size-xl);
      font-weight: 800;
      color: var(--text-white);
      line-height: 1;
    }

    .label {
      font-size: var(--font-size-xs);
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .parent-btn {
    width: 80rpx;
    height: 80rpx;
    background: rgba(255, 255, 255, 0.3);
    border-radius: var(--border-radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.3);
    transition: all var(--transition-fast);

    &:active {
      transform: scale(0.95);
      background: rgba(255, 255, 255, 0.4);
    }
  }

  .content-scroll {
    height: calc(100vh - 300rpx);
  }

  .content {
    padding-bottom: 40rpx;
  }

  .parent-center {
    padding: 0 var(--spacing-md);
    margin-top: var(--spacing-sm);
  }

  .parent-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: linear-gradient(135deg, #AA96DA 0%, #C4B5E6 100%);
    border-radius: var(--border-radius-lg);
    box-shadow: 0 8rpx 24rpx rgba(170, 150, 218, 0.3);
    border: 4rpx solid rgba(255, 255, 255, 0.3);
    transition: all var(--transition-fast);

    &:active {
      transform: scale(0.98);
    }
  }

  .parent-icon {
    width: 80rpx;
    height: 80rpx;
    background: rgba(255, 255, 255, 0.3);
    border-radius: var(--border-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 44rpx;
  }

  .parent-info {
    flex: 1;
  }

  .parent-title {
    font-size: var(--font-size-md);
    font-weight: 700;
    color: var(--text-white);
  }

  .parent-desc {
    font-size: var(--font-size-sm);
    color: rgba(255, 255, 255, 0.85);
    margin-top: 4rpx;
  }

  .parent-arrow {
    font-size: 40rpx;
    color: rgba(255, 255, 255, 0.7);
  }

  .bottom-space {
    height: 60rpx;
  }
</style>