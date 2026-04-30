<script setup lang="ts">
import { useAppStore } from '@/store/app'
import type { DailyTask as DailyTaskType } from '@/types'

const appStore = useAppStore()

const getSubjectPagePath = (subject: string) => {
  const paths = {
    chinese: '/pages/chinese-practice/chinese-practice',
    math: '/pages/math-practice/math-practice',
    english: '/pages/english/english'
  }
  return paths[subject as keyof typeof paths]
}

const handleTaskClick = (task: DailyTaskType) => {
  const pagePath = getSubjectPagePath(task.subject)
  
  if (task.completed) {
    uni.showModal({
      title: '任务已完成',
      content: '是否继续练习？',
      confirmText: '继续练习',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({ url: pagePath })
        }
      }
    })
  } else {
    uni.navigateTo({ url: pagePath })
  }
}

const getSubjectName = (subject: string) => {
  const names = { chinese: '语文', math: '数学', english: '英语' }
  return names[subject as keyof typeof names] || subject
}
</script>

<template>
  <view class="daily-task">
    <view class="task-header">
      <view class="task-title">
        <text class="icon">📋</text>
        <text>今日学习任务</text>
      </view>
      <view class="task-progress">
        <text class="progress-text">{{ appStore.completedTasks }}/{{ appStore.totalTasks }}</text>
      </view>
    </view>
    <view class="task-list">
      <view
        v-for="task in appStore.dailyTasks"
        :key="task.id"
        class="task-item"
        :class="{ completed: task.completed }"
        @click="handleTaskClick(task)"
      >
        <view class="task-icon" :style="{ background: task.color }">
          <text>{{ task.icon }}</text>
        </view>
        <view class="task-content">
          <view class="task-name">
            <text>{{ getSubjectName(task.subject) }}</text>
            <text v-if="task.completed" class="completed-badge">✓ 已完成</text>
          </view>
          <view class="task-desc">{{ task.description }}</view>
          <view class="task-progress-bar">
            <view class="progress-fill" :style="{ width: `${(task.progress / task.total) * 100}%`, background: task.color }"></view>
          </view>
          <view class="task-count">{{ task.progress }}/{{ task.total }}</view>
        </view>
        <view class="task-arrow">
          <text v-if="!task.completed">→</text>
          <text v-else class="check-icon">✓</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.daily-task {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  margin: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.task-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);

  .icon {
    font-size: 40rpx;
  }
}

.task-progress {
  background: linear-gradient(135deg, var(--primary-color), var(--warning-color));
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-xl);

  .progress-text {
    font-size: var(--font-size-sm);
    font-weight: 700;
    color: var(--text-white);
  }
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.task-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, #f8f8f8, #f0f0f0);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
  border: 4rpx solid transparent;

  &:active:not(.completed) {
    transform: scale(0.98);
  }

  &.completed {
    background: linear-gradient(135deg, #e8ffe8, #d8f5d8);
    border-color: #b8e8b8;
    opacity: 0.8;
  }
}

.task-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 48rpx;
  box-shadow: var(--shadow-sm);
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-name {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);

  .completed-badge {
    font-size: var(--font-size-xs);
    color: #52c41a;
    background: #e8ffe8;
    padding: 2rpx 10rpx;
    border-radius: var(--border-radius-sm);
    font-weight: 600;
  }
}

.task-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.task-progress-bar {
  width: 100%;
  height: 12rpx;
  background: #e5e5e5;
  border-radius: 6rpx;
  margin-top: var(--spacing-sm);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width var(--transition-normal);
}

.task-count {
  font-size: var(--font-size-xs);
  color: var(--text-light);
  margin-top: var(--spacing-xs);
}

.task-arrow {
  width: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: var(--text-light);

  .check-icon {
    color: #52c41a;
    font-size: 48rpx;
  }
}
</style>
