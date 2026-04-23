<script setup lang="ts">
import { computed } from 'vue'
import type { ChineseLesson } from '@/types'

interface Props {
  lesson: ChineseLesson
  completed?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  startDictation: [lesson: ChineseLesson]
  startPinyin: [lesson: ChineseLesson]
  startWordSentence: [lesson: ChineseLesson]
}>()

const characterCount = computed(() => props.lesson.characters.length)
const wordCount = computed(() => props.lesson.words.length)
</script>

<template>
  <view class="lesson-card" :class="{ completed }">
    <view class="lesson-header">
      <view class="lesson-badge">第{{ lesson.unit }}单元 第{{ lesson.lesson }}课</view>
      <view v-if="completed" class="completed-badge">✓ 已完成</view>
    </view>
    <view class="lesson-title">{{ lesson.title }}</view>
    <view class="lesson-stats">
      <view class="stat-item">
        <text class="stat-icon">📝</text>
        <text class="stat-text">{{ characterCount }}个生字</text>
      </view>
      <view class="stat-item">
        <text class="stat-icon">🔤</text>
        <text class="stat-text">{{ wordCount }}个词语</text>
      </view>
    </view>
    <view class="lesson-actions">
      <view class="action-btn" @click="emit('startDictation', lesson)">
        <text class="action-icon">✍️</text>
        <text class="action-text">生字听写</text>
      </view>
      <view class="action-btn" @click="emit('startPinyin', lesson)">
        <text class="action-icon">🔤</text>
        <text class="action-text">拼音认读</text>
      </view>
      <view class="action-btn" @click="emit('startWordSentence', lesson)">
        <text class="action-icon">💬</text>
        <text class="action-text">组词造句</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.lesson-card {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  border: 3rpx solid transparent;
  transition: all var(--transition-fast);
}

.lesson-card.completed {
  border-color: var(--success-color);
  opacity: 0.9;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.lesson-badge {
  background: linear-gradient(135deg, var(--secondary-color), var(--info-color));
  color: var(--text-white);
  padding: 4rpx 12rpx;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.completed-badge {
  background: var(--success-color);
  color: var(--text-white);
  padding: 4rpx 12rpx;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.lesson-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.lesson-stats {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.stat-icon {
  font-size: 32rpx;
}

.stat-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.lesson-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-sm);
  background: linear-gradient(135deg, #e6fff8, #d5fcf2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);

  &:active {
    transform: scale(0.95);
  }
}

.action-icon {
  font-size: 40rpx;
  margin-bottom: 4rpx;
}

.action-text {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  font-weight: 600;
}
</style>
