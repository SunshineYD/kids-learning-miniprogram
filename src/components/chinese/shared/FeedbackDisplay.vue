<script setup lang="ts">
interface Props {
  show: boolean
  isCorrect: boolean
  correctAnswer: string
}

// 正确定义props
const props = defineProps<Props>()
</script>

<template>
  <view v-if="show" class="feedback-container" :class="{ correct: isCorrect, wrong: !isCorrect }">
    <view class="feedback-icon">{{ isCorrect ? '🎉' : '💪' }}</view>
    <view class="feedback-text">
      {{ isCorrect ? '太棒了！答对了！' : '再想想看，正确答案是：' }}
    </view>
    <view v-if="!isCorrect" class="correct-answer-display">{{ correctAnswer }}</view>
  </view>
</template>

<style lang="scss" scoped>
.feedback-container {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  text-align: center;
  transition: all 0.3s ease;
}

.feedback-container.correct {
  background: linear-gradient(135deg, #e8ffe8, #d8f5d8);
  border: 3rpx solid #52c41a;
}

.feedback-container.wrong {
  background: linear-gradient(135deg, #fff0f0, #ffe8e8);
  border: 3rpx solid #ff4d4f;
}

.feedback-icon {
  font-size: 60rpx;
  margin-bottom: var(--spacing-sm);
}

.feedback-text {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.correct-answer-display {
  font-size: 48rpx;
  font-weight: 700;
  color: #52c41a;
  background: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  display: inline-block;
}
</style>
