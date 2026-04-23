<script setup lang="ts">
import { computed } from 'vue'
import type { PracticeSession } from '@/types'

interface Props {
  session: PracticeSession
}

const emit = defineEmits<{
  (e: 'again'): void
  (e: 'close'): void
}>()

const props = defineProps<Props>()

const accuracy = computed(() => {
  return props.session.totalQuestions > 0 
    ? Math.round((props.session.correctCount / props.session.totalQuestions) * 100) 
    : 0
})

const getTimeSpent = () => {
  if (!props.session.endTime) return '--'
  const seconds = Math.floor((props.session.endTime - props.session.startTime) / 1000)
  if (seconds < 60) return `${seconds}秒`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}

const getRating = () => {
  if (accuracy.value >= 90) return { emoji: '🌟', text: '太棒了！' }
  if (accuracy.value >= 70) return { emoji: '👍', text: '做得不错！' }
  if (accuracy.value >= 50) return { emoji: '💪', text: '继续加油！' }
  return { emoji: '📚', text: '多多练习！' }
}
</script>

<template>
  <view class="result-overlay">
    <view class="result-card">
      <view class="result-header">
        <text class="result-emoji">{{ getRating().emoji }}</text>
        <text class="result-text">{{ getRating().text }}</text>
      </view>

      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ session.score }}</text>
          <text class="stat-label">得分</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ session.correctCount }}/{{ session.totalQuestions }}</text>
          <text class="stat-label">正确题数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ accuracy }}%</text>
          <text class="stat-label">正确率</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ getTimeSpent() }}</text>
          <text class="stat-label">用时</text>
        </view>
      </view>

      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: accuracy + '%' }"></view>
      </view>

      <view class="result-actions">
        <view class="action-btn secondary" @click="emit('close')">
          <text>返回</text>
        </view>
        <view class="action-btn primary" @click="emit('again')">
          <text>再来一次</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40rpx;
}

.result-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 60rpx 40rpx 40rpx;
  width: 100%;
  max-width: 600rpx;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.result-emoji {
  font-size: 100rpx;
  display: block;
  margin-bottom: 16rpx;
}

.result-text {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 32rpx;
}

.stat-item {
  background: #F5F7FA;
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: #FF6B6B;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.progress-bar {
  height: 16rpx;
  background: #F5F7FA;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 40rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ECDC4, #44A08D);
  border-radius: 8rpx;
  transition: width 0.5s ease;
}

.result-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 28rpx;
  border-radius: 20rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;

  &.primary {
    background: linear-gradient(135deg, #FF6B6B, #EE5A5A);
    color: #fff;
  }

  &.secondary {
    background: #F5F7FA;
    color: #666;
  }

  &:active {
    transform: scale(0.98);
  }
}
</style>
