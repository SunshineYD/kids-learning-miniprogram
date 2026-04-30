<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  show: boolean
  score: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  confirm: []
}>()

const resultEmoji = computed(() => {
  if (props.score >= 90) return '🎉'
  if (props.score >= 70) return '👍'
  if (props.score >= 60) return '😊'
  return '💪'
})

const resultMessage = computed(() => {
  if (props.score >= 90) return '太棒了！你是最棒的！'
  if (props.score >= 70) return '做得很好！继续加油！'
  if (props.score >= 60) return '及格了！再努力一点！'
  return '别灰心，再试一次！'
})

const handleConfirm = () => {
  emit('confirm')
}
</script>

<template>
  <view v-if="show" class="result-overlay">
    <view class="result-card">
      <view class="result-emoji">{{ resultEmoji }}</view>
      <view class="result-score">{{ score }}分</view>
      <view class="result-message">{{ resultMessage }}</view>
      <view class="result-buttons">
        <view class="result-btn" @click="handleConfirm">返回列表</view>
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
}

.result-card {
  background: var(--bg-white);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  margin: var(--spacing-lg);
  text-align: center;
  box-shadow: var(--shadow-md);
  width: 80%;
  max-width: 600rpx;
}

.result-emoji {
  font-size: 100rpx;
  margin-bottom: var(--spacing-sm);
}

.result-score {
  font-size: 80rpx;
  font-weight: 700;
  color: var(--secondary-color);
  margin-bottom: var(--spacing-sm);
}

.result-message {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.result-buttons {
  display: flex;
  gap: var(--spacing-md);
}

.result-btn {
  flex: 1;
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--secondary-color), var(--success-color));
  color: var(--text-white);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: 700;
}
</style>
