<script setup lang="ts">
import type { PracticeMode } from '@/types'

interface Props {
  mode: PracticeMode
  title: string
  description: string
  icon: string
  color: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <view class="mode-card" :style="{ background: `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -20)} 100%)` }" @click="handleClick">
    <view class="mode-icon">{{ icon }}</view>
    <view class="mode-content">
      <text class="mode-title">{{ title }}</text>
      <text class="mode-desc">{{ description }}</text>
    </view>
    <view class="mode-arrow">→</view>
  </view>
</template>

<script lang="ts">
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const num = parseInt(hex, 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount))
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount))
  return '#' + (0x1000000 + (r * 0x10000) + (g * 0x100) + b).toString(16).slice(1)
}
</script>

<style lang="scss" scoped>
.mode-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  margin: 16rpx 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.mode-icon {
  font-size: 56rpx;
  min-width: 80rpx;
  text-align: center;
}

.mode-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.mode-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
}

.mode-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.mode-arrow {
  font-size: 40rpx;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
}
</style>
