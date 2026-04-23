<script setup lang="ts">
import { useAppStore } from '@/store/app'
import type { Grade } from '@/types'

const appStore = useAppStore()

const grades = [
  { value: 1 as Grade, label: '一年级' },
  { value: 2 as Grade, label: '二年级' },
  { value: 3 as Grade, label: '三年级' },
  { value: 4 as Grade, label: '四年级' }
]

const handleSelect = (grade: Grade) => {
  appStore.setGrade(grade)
  uni.showToast({
    title: `已切换到${grades.find(g => g.value === grade)?.label}`,
    icon: 'success'
  })
}
</script>

<template>
  <view class="grade-selector">
    <view class="grade-title">
      <text class="icon">🎓</text>
      <text>选择年级</text>
    </view>
    <view class="grade-list">
      <view
        v-for="item in grades"
        :key="item.value"
        class="grade-item"
        :class="{ active: appStore.currentGrade === item.value }"
        @click="handleSelect(item.value)"
      >
        <view class="grade-label">{{ item.label }}</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.grade-selector {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  margin: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.grade-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);

  .icon {
    font-size: 40rpx;
  }
}

.grade-list {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.grade-item {
  flex: 1;
  min-width: 140rpx;
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(135deg, #F5F5F5, #E8E8E8);
  border-radius: var(--border-radius-md);
  text-align: center;
  transition: all var(--transition-fast);
  border: 4rpx solid transparent;

  &:active {
    transform: scale(0.96);
  }

  &.active {
    background: linear-gradient(135deg, var(--primary-color), var(--warning-color));
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 8rpx 20rpx rgba(255, 107, 107, 0.3);

    .grade-label {
      color: var(--text-white);
      font-weight: 700;
    }
  }
}

.grade-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 600;
}
</style>
