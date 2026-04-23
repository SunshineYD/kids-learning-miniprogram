<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MathQuestion } from '@/types'

interface Props {
  question: MathQuestion
  showResult?: boolean
  userAnswer?: string | number
  correct?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showResult: false
})

const emit = defineEmits<{
  (e: 'submit', answer: string | number): void
}>()

const inputValue = ref('')
const startTime = ref(Date.now())

watch(() => props.question, () => {
  inputValue.value = ''
  startTime.value = Date.now()
}, { immediate: true })

function handleSubmit() {
  if (!inputValue.value.trim()) return
  const answer = !isNaN(Number(inputValue.value)) ? Number(inputValue.value) : inputValue.value
  emit('submit', answer)
}
</script>

<template>
  <view class="question-card">
    <view class="question-type-badge" :class="question.type">
      {{ question.type === 'addition' ? '加法' : question.type === 'subtraction' ? '减法' : question.type === 'multiplication' ? '乘法' : question.type === 'division' ? '除法' : question.type === 'mixed' ? '混合' : '单位换算' }}
    </view>
    
    <view class="question-content">
      <text class="question-text">{{ question.expression }}</text>
    </view>

    <view v-if="!showResult" class="answer-section">
      <input
        v-model="inputValue"
        type="number"
        class="answer-input"
        placeholder="输入答案"
        placeholder-class="placeholder"
        @confirm="handleSubmit"
      />
      <view class="submit-btn" @click="handleSubmit">
        <text>确认</text>
      </view>
    </view>

    <view v-else class="result-section" :class="correct ? 'correct' : 'wrong'">
      <view class="result-icon">{{ correct ? '✓' : '✗' }}</view>
      <view class="result-text">
        <text class="your-answer">你的答案：{{ userAnswer }}</text>
        <text class="correct-answer">正确答案：{{ question.answer }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.question-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  margin: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
  position: relative;
}

.question-type-badge {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #fff;

  &.addition {
    background: linear-gradient(135deg, #4ECDC4, #44A08D);
  }
  &.subtraction {
    background: linear-gradient(135deg, #FFE66D, #F7D76A);
    color: #666;
  }
  &.multiplication {
    background: linear-gradient(135deg, #FF6B6B, #EE5A5A);
  }
  &.division {
    background: linear-gradient(135deg, #AA96DA, #9B86CB);
  }
  &.mixed {
    background: linear-gradient(135deg, #FCBAD3, #FAA6BD);
  }
  &.unit-conversion {
    background: linear-gradient(135deg, #95E1D3, #85D4C6);
  }
}

.question-content {
  text-align: center;
  padding: 40rpx 20rpx;
}

.question-text {
  font-size: 56rpx;
  font-weight: 700;
  color: #333;
  letter-spacing: 4rpx;
}

.answer-section {
  display: flex;
  gap: 20rpx;
  align-items: center;
  margin-top: 20rpx;
}

.answer-input {
  flex: 1;
  height: 96rpx;
  background: #F5F7FA;
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 36rpx;
  text-align: center;
  color: #333;
}

.placeholder {
  color: #999;
}

.submit-btn {
  width: 160rpx;
  height: 96rpx;
  background: linear-gradient(135deg, #FF6B6B, #EE5A5A);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;

  &:active {
    transform: scale(0.95);
  }
}

.result-section {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-top: 20rpx;

  &.correct {
    background: rgba(78, 205, 196, 0.1);
  }
  &.wrong {
    background: rgba(255, 107, 107, 0.1);
  }
}

.result-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  font-weight: 700;

  .correct & {
    background: #4ECDC4;
    color: #fff;
  }
  .wrong & {
    background: #FF6B6B;
    color: #fff;
  }
}

.result-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.your-answer {
  font-size: 28rpx;
  color: #666;
}

.correct-answer {
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
}
</style>
