<script setup lang="ts">
import type { AncientPoem } from '@/types'

interface Props {
  poem: AncientPoem
  completed?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  startRecite: [poem: AncientPoem]
  startWrite: [poem: AncientPoem]
}>()
</script>

<template>
  <view class="poem-card" :class="{ completed }">
    <view class="poem-header">
      <view class="poem-title">{{ poem.title }}</view>
      <view v-if="completed" class="completed-badge">✓ 已完成</view>
    </view>
    <view class="poem-author">
      <text class="author">{{ poem.author }}</text>
      <text class="dot">·</text>
      <text class="dynasty">{{ poem.dynasty }}代</text>
    </view>
    <view class="poem-content">
      <text v-for="(line, index) in poem.content" :key="index" class="poem-line">{{ line }}</text>
    </view>
    <view class="poem-actions">
      <view class="action-btn recite" @click="emit('startRecite', poem)">
        <text class="action-icon">📖</text>
        <text class="action-text">背诵</text>
      </view>
      <view class="action-btn write" @click="emit('startWrite', poem)">
        <text class="action-icon">✍️</text>
        <text class="action-text">默写</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.poem-card {
  background: linear-gradient(135deg, #fffaf0, #fff5e6);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  border: 3rpx solid #ffe4b5;
}

.poem-card.completed {
  border-color: var(--success-color);
  opacity: 0.9;
}

.poem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.poem-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: #8b4513;
}

.completed-badge {
  background: var(--success-color);
  color: var(--text-white);
  padding: 4rpx 12rpx;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.poem-author {
  font-size: var(--font-size-sm);
  color: #a0522d;
  margin-bottom: var(--spacing-md);
}

.author,
.dynasty {
  font-weight: 600;
}

.dot {
  margin: 0 8rpx;
}

.poem-content {
  background: rgba(255, 255, 255, 0.6);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.poem-line {
  display: block;
  font-size: var(--font-size-lg);
  color: #5c4033;
  line-height: 1.8;
  text-align: center;
}

.poem-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  transition: all var(--transition-fast);

  &:active {
    transform: scale(0.95);
  }
}

.action-btn.recite {
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
  color: #8b4513;
}

.action-btn.write {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  color: #2c5f5a;
}

.action-icon {
  font-size: 32rpx;
}

.action-text {
  font-size: var(--font-size-md);
}
</style>
