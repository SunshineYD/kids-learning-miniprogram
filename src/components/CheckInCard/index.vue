<script setup lang="ts">
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

const handleCheckIn = () => {
  const success = appStore.checkIn()
  if (success) {
    uni.showToast({
      title: '打卡成功！🎉',
      icon: 'success'
    })
  } else {
    uni.showToast({
      title: '今天已经打卡过啦~',
      icon: 'none'
    })
  }
}
</script>

<template>
  <view class="checkin-card">
    <view class="checkin-header">
      <view class="checkin-title">
        <text class="icon">📅</text>
        <text>连续打卡</text>
      </view>
      <view class="checkin-days">
        <text class="days-number">{{ appStore.checkInDays }}</text>
        <text class="days-label">天</text>
      </view>
    </view>

    <view class="checkin-progress">
      <view class="progress-dots">
        <view
          v-for="i in 7" :key="i"
          class="dot"
          :class="{ active: i <= Math.min(appStore.checkInDays, 7) }"
        >
          <text>{{ ['一', '二', '三', '四', '五', '六', '日'][i - 1] }}</text>
        </view>
      </view>
    </view>

    <view class="checkin-medals">
      <view class="medals-title">🏆 我的勋章</view>
      <view class="medals-list">
        <view
          v-for="medal in appStore.medals"
          :key="medal.id"
          class="medal-item"
          :class="{ unlocked: medal.unlocked }"
        >
          <view class="medal-icon">{{ medal.icon }}</view>
          <view class="medal-name">{{ medal.name }}</view>
        </view>
      </view>
    </view>

    <view class="checkin-button" @click="handleCheckIn">
      <text v-if="!appStore.isCheckedInToday" class="btn-text">立即打卡</text>
      <text v-else class="btn-text checked">✓ 今日已打卡</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.checkin-card {
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  margin: var(--spacing-md);
  box-shadow: 0 12rpx 32rpx rgba(255, 204, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300rpx;
    height: 300rpx;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    border-radius: 50%;
  }
}

.checkin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.checkin-title {
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: #8B6914;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);

  .icon {
    font-size: 44rpx;
  }
}

.checkin-days {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
  background: rgba(255, 255, 255, 0.4);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-xl);
  backdrop-filter: blur(10rpx);
}

.days-number {
  font-size: var(--font-size-xxl);
  font-weight: 800;
  color: #8B6914;
  line-height: 1;
}

.days-label {
  font-size: var(--font-size-sm);
  color: #8B6914;
  font-weight: 600;
}

.checkin-progress {
  margin-top: var(--spacing-md);
  position: relative;
  z-index: 1;
}

.progress-dots {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.dot {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.3);
  font-size: var(--font-size-sm);
  color: #8B6914;
  font-weight: 600;
  transition: all var(--transition-normal);

  &.active {
    background: #FF6B6B;
    color: var(--text-white);
    box-shadow: 0 6rpx 16rpx rgba(255, 107, 107, 0.4);
    transform: scale(1.05);
  }
}

.checkin-medals {
  margin-top: var(--spacing-md);
  position: relative;
  z-index: 1;
}

.medals-title {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: #8B6914;
  margin-bottom: var(--spacing-sm);
}

.medals-list {
  display: flex;
  gap: var(--spacing-sm);
}

.medal-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-md);
  opacity: 0.5;
  transition: all var(--transition-normal);

  &.unlocked {
    opacity: 1;
    background: rgba(255, 255, 255, 0.6);
  }
}

.medal-icon {
  font-size: 48rpx;
  margin-bottom: 4rpx;
}

.medal-name {
  font-size: var(--font-size-xs);
  color: #8B6914;
  font-weight: 600;
}

.checkin-button {
  margin-top: var(--spacing-md);
  height: 100rpx;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 107, 0.4);
  border: 6rpx solid rgba(255, 255, 255, 0.5);
  transition: all var(--transition-fast);
  position: relative;
  z-index: 1;

  &:active {
    transform: scale(0.96);
  }

  .btn-text {
    font-size: var(--font-size-lg);
    font-weight: 800;
    color: var(--text-white);

    &.checked {
      opacity: 0.9;
    }
  }
}
</style>
