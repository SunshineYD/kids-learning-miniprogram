<script setup lang="ts">
import { computed } from 'vue'
import type { Course } from '@/types'

interface Props {
  course: Course
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'click', course: Course): void
}>()

const emoji = computed(() => {
  const map: Record<string, string> = {
    '数学': '🧮',
    '语文': '📚',
    '英语': '🎵',
    '科学': '🔬'
  }
  return map[props.course.category] || '📖'
})

const bgColor = computed(() => {
  const map: Record<string, string> = {
    '数学': '#ffe5e5',
    '语文': '#e5fff8',
    '英语': '#fffde5',
    '科学': '#e5fff5'
  }
  return map[props.course.category] || '#f5f5f5'
})

const handleClick = () => {
  emit('click', props.course)
}
</script>

<template>
  <view class="course-card card" @click="handleClick">
    <view class="cover" :style="{ background: bgColor }">
      <text class="emoji">{{ emoji }}</text>
    </view>
    <view class="info">
      <view class="title">{{ course.title }}</view>
      <view class="desc">{{ course.description }}</view>
      <view class="meta">
        <text class="duration">⏱️ {{ course.duration }}分钟</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.course-card {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  transition: all var(--transition-fast);

  &:active {
    transform: scale(0.98);
  }
}

.cover {
  width: 140rpx;
  height: 140rpx;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.emoji {
  font-size: 70rpx;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
}

.desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.meta {
  margin-top: var(--spacing-sm);
}

.duration {
  font-size: var(--font-size-xs);
  color: var(--text-light);
}
</style>
