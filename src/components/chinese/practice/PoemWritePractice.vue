<script setup lang="ts">
import type { AncientPoem } from '@/types'
import PracticeHeader from '@/components/chinese/layout/PracticeHeader.vue'

interface Props {
  poem: AncientPoem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  back: []
  complete: [score: number]
}>()

const handleComplete = () => {
  emit('complete', 100)
}

const handleBack = () => {
  emit('back')
}
</script>

<template>
  <view class="practice-container">
    <PracticeHeader title="古诗默写" @back="handleBack" />
    <view class="practice-content poem-content">
      <view class="poem-write-card">
        <view class="poem-title-large">{{ poem.title }}</view>
        <view class="poem-author-large">
          <text>{{ poem.author }}</text>
          <text class="dot">·</text>
          <text>{{ poem.dynasty }}代</text>
        </view>
        <view class="poem-write-hint">请在纸上默写这首诗，完成后点击下方按钮</view>
        <view class="poem-content-mini">
          <text
            v-for="(line, index) in poem.content"
            :key="index"
            class="poem-line-mini"
          >
            {{ line }}
          </text>
        </view>
      </view>
      <view class="complete-btn" @click="handleComplete">
        <text class="btn-icon">✅</text>
        <text class="btn-text">默写完成</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.practice-container {
  min-height: 100vh;
  background: var(--bg-primary);
}

.practice-content {
  padding: var(--spacing-md);
}

.poem-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 150rpx);
}

.poem-write-card {
  flex: 1;
  background: linear-gradient(135deg, #fffaf0, #fff5e6);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-md);
  box-shadow: var(--shadow-md);
  border: 3rpx solid #ffe4b5;
}

.poem-title-large {
  font-size: var(--font-size-xxl);
  font-weight: 700;
  color: #8B4513;
  text-align: center;
  margin-bottom: var(--spacing-sm);
}

.poem-author-large {
  font-size: var(--font-size-md);
  color: #a0522d;
  text-align: center;
  margin-bottom: var(--spacing-lg);

  .dot {
    margin: 0 8rpx;
  }
}

.poem-write-hint {
  font-size: var(--font-size-md);
  color: #8B4513;
  text-align: center;
  margin-bottom: var(--spacing-lg);
  font-weight: 600;
}

.poem-content-mini {
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}

.poem-line-mini {
  display: block;
  font-size: var(--font-size-md);
  color: #a0522d;
  line-height: 1.8;
  text-align: center;
  opacity: 0.6;
}

.complete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);

  &:active {
    transform: scale(0.98);
  }
}

.btn-icon {
  font-size: 40rpx;
}

.btn-text {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-white);
}
</style>
