<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task } from '@/types'

const dailyTasks = ref<Task[]>([
  { id: 1, title: '完成1个课程', description: '学习任意一个课程', points: 10, completed: true, type: 'daily' },
  { id: 2, title: '阅读10分钟', description: '进行阅读练习', points: 15, completed: false, type: 'daily' },
  { id: 3, title: '做5道数学题', description: '完成数学练习', points: 20, completed: false, type: 'daily' }
])

const weeklyTasks = ref<Task[]>([
  { id: 4, title: '完成5个课程', description: '本周累计学习5个课程', points: 100, completed: false, type: 'weekly' },
  { id: 5, title: '连续学习3天', description: '保持学习好习惯', points: 50, completed: false, type: 'weekly' }
])

const handleCompleteTask = (task: Task) => {
  if (!task.completed) {
    task.completed = true
    uni.showToast({
      title: `🎉 获得${task.points}积分!`,
      icon: 'success'
    })
  }
}

const dailyProgress = computed(() => {
  const completed = dailyTasks.value.filter(t => t.completed).length
  return {
    completed,
    total: dailyTasks.value.length,
    percentage: Math.round((completed / dailyTasks.value.length) * 100)
  }
})
</script>

<template>
  <view class="task-page">
    <view class="progress-card card">
      <view class="progress-header">
        <view>
          <view class="progress-title">今日进度</view>
          <view class="progress-subtitle">{{ dailyProgress.completed }} / {{ dailyProgress.total }}</view>
        </view>
        <view class="progress-circle">
          <text class="percentage">{{ dailyProgress.percentage }}%</text>
        </view>
      </view>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: dailyProgress.percentage + '%' }"></view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">
        <text>☀️</text>
        <text>每日任务</text>
      </view>
      <view class="task-list">
        <view
          v-for="task in dailyTasks"
          :key="task.id"
          class="task-item card"
          :class="{ completed: task.completed }"
          @click="handleCompleteTask(task)"
        >
          <view class="task-icon">
            <text>{{ task.completed ? '✅' : '⭐' }}</text>
          </view>
          <view class="task-content">
            <view class="task-title">{{ task.title }}</view>
            <view class="task-desc">{{ task.description }}</view>
          </view>
          <view class="task-points">
            <text class="points-badge">+{{ task.points }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">
        <text>📅</text>
        <text>每周任务</text>
      </view>
      <view class="task-list">
        <view
          v-for="task in weeklyTasks"
          :key="task.id"
          class="task-item card"
          :class="{ completed: task.completed }"
          @click="handleCompleteTask(task)"
        >
          <view class="task-icon">
            <text>{{ task.completed ? '✅' : '🎯' }}</text>
          </view>
          <view class="task-content">
            <view class="task-title">{{ task.title }}</view>
            <view class="task-desc">{{ task.description }}</view>
          </view>
          <view class="task-points">
            <text class="points-badge">+{{ task.points }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.task-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: 40rpx;
}

.progress-card {
  margin: var(--spacing-md);
  background: linear-gradient(135deg, var(--accent-color), #fff3a3);
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.progress-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-primary);
}

.progress-subtitle {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.progress-circle {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: var(--text-white);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}

.percentage {
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: var(--primary-color);
}

.progress-bar {
  width: 100%;
  height: 16rpx;
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--warning-color));
  border-radius: var(--border-radius-xl);
  transition: width 0.5s ease;
}

.section {
  padding: 0 var(--spacing-md);
  margin-bottom: var(--spacing-lg);
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
  transition: all var(--transition-fast);

  &.completed {
    opacity: 0.6;
  }

  &:active {
    transform: scale(0.98);
  }
}

.task-icon {
  font-size: 60rpx;
  flex-shrink: 0;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
}

.task-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.task-points {
  flex-shrink: 0;
}

.points-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs) var(--spacing-md);
  background: linear-gradient(135deg, var(--primary-color), var(--warning-color));
  color: var(--text-white);
  border-radius: var(--border-radius-xl);
  font-size: var(--font-size-md);
  font-weight: 700;
}
</style>
