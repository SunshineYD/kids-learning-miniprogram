<script setup lang="ts">
import { computed } from 'vue'
import type { AncientPoem } from '@/types'
import AudioPlayer from '@/components/AudioPlayer.vue'
import PracticeHeader from '@/components/chinese/layout/PracticeHeader.vue'

interface Props {
  poem: AncientPoem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  back: []
  complete: [score: number]
}>()

const fullText = computed(() => 
  props.poem.title + '，' + props.poem.author + '，' + props.poem.content.join('，')
)

const handleComplete = () => {
  emit('complete', 100)
}

const handleBack = () => {
  emit('back')
}
</script>

<template>
  <view class="practice-container">
    <PracticeHeader title="古诗背诵" @back="handleBack" />
    <view class="practice-content poem-content">
      <view class="poem-display-card">
        <view class="poem-title-row">
          <view class="poem-title-large">{{ poem.title }}</view>
          <AudioPlayer
            :text="fullText"
            size="small"
            color="#8B4513"
          />
        </view>
        <view class="poem-author-large">
          <text>{{ poem.author }}</text>
          <text class="dot">·</text>
          <text>{{ poem.dynasty }}代</text>
        </view>
        <view class="poem-content-large">
          <text
            v-for="(line, index) in poem.content"
            :key="index"
            class="poem-line-large"
          >
            {{ line }}
          </text>
        </view>
        <view class="poem-translation">{{ poem.translation }}</view>
      </view>
      <view class="complete-btn" @click="handleComplete">
        <text class="btn-icon">✅</text>
        <text class="btn-text">我已经会背了</text>
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

.poem-display-card {
  flex: 1;
  background: linear-gradient(135deg, #fffaf0, #fff5e6);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-md);
  box-shadow: var(--shadow-md);
  border: 3rpx solid #ffe4b5;
}

.poem-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.poem-title-large {
  font-size: var(--font-size-xxl);
  font-weight: 700;
  color: #8B4513;
  text-align: center;
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

.poem-content-large {
  margin-bottom: var(--spacing-lg);
}

.poem-line-large {
  display: block;
  font-size: var(--font-size-xl);
  color: #5c4033;
  line-height: 2;
  text-align: center;
}

.poem-translation {
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  font-size: var(--font-size-md);
  color: #8B4513;
  line-height: 1.6;
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
