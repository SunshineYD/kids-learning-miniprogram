<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Grade, MathQuestionType, MathDifficulty, PracticeMode } from '@/types'
import { mathQuestionTypes, mathDifficulties } from '@/data/math-questions'
import { useAppStore } from '@/store/app'

interface Props {
  grade?: Grade
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  (e: 'start', options: {
    grade: Grade
    type: MathQuestionType
    difficulty: MathDifficulty
    mode: PracticeMode
    count: number
  }): void
}>()

const appStore = useAppStore()

const selectedGrade = ref<Grade>(props.grade || appStore.currentGrade)
const selectedType = ref<MathQuestionType>('addition')
const selectedDifficulty = ref<MathDifficulty>('basic')
const selectedMode = ref<PracticeMode>('free')
const questionCount = ref(10)

const availableTypes = computed(() => {
  return mathQuestionTypes.filter(t => !t.minGrade || selectedGrade.value >= t.minGrade)
})

const modes = [
  { key: 'free', name: '自由练习', icon: '🎯' },
  { key: 'timed-1min', name: '1分钟挑战', icon: '⏱️' },
  { key: 'timed-3min', name: '3分钟挑战', icon: '⏲️' }
]

const counts = [5, 10, 15, 20]

function handleStart() {
  emit('start', {
    grade: selectedGrade.value,
    type: selectedType.value,
    difficulty: selectedDifficulty.value,
    mode: selectedMode.value,
    count: questionCount.value
  })
}
</script>

<template>
  <view class="math-selector">
    <view class="section">
      <view class="section-title">
        <text>📚 选择年级</text>
      </view>
      <view class="option-grid">
        <view
          v-for="g in [1, 2, 3, 4]"
          :key="g"
          class="option-item"
          :class="{ active: selectedGrade === g }"
          @click="selectedGrade = g as Grade"
        >
          <text>{{ g }}年级</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">
        <text>🔢 选择题型</text>
      </view>
      <view class="option-grid">
        <view
          v-for="t in availableTypes"
          :key="t.key"
          class="option-item"
          :class="{ active: selectedType === t.key }"
          @click="selectedType = t.key as MathQuestionType"
        >
          <text class="option-icon">{{ t.icon }}</text>
          <text>{{ t.name }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">
        <text>⭐ 选择难度</text>
      </view>
      <view class="difficulty-row">
        <view
          v-for="d in mathDifficulties"
          :key="d.key"
          class="difficulty-item"
          :class="{ active: selectedDifficulty === d.key }"
          :style="{ '--color': d.color }"
          @click="selectedDifficulty = d.key as MathDifficulty"
        >
          <text>{{ d.name }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">
        <text>🎮 选择模式</text>
      </view>
      <view class="mode-list">
        <view
          v-for="m in modes"
          :key="m.key"
          class="mode-item"
          :class="{ active: selectedMode === m.key }"
          @click="selectedMode = m.key as PracticeMode"
        >
          <text class="mode-icon">{{ m.icon }}</text>
          <text class="mode-name">{{ m.name }}</text>
        </view>
      </view>
    </view>

    <view class="section" v-if="selectedMode === 'free'">
      <view class="section-title">
        <text>📋 题量设置</text>
      </view>
      <view class="count-row">
        <view
          v-for="c in counts"
          :key="c"
          class="count-item"
          :class="{ active: questionCount === c }"
          @click="questionCount = c"
        >
          <text>{{ c }}题</text>
        </view>
      </view>
    </view>

    <view class="start-btn" @click="handleStart">
      <text>开始练习</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.math-selector {
  padding: 20rpx;
}

.section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.option-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 24rpx 16rpx;
  background: #F5F7FA;
  border-radius: 16rpx;
  border: 3rpx solid transparent;
  transition: all 0.3s;

  &.active {
    background: rgba(255, 107, 107, 0.1);
    border-color: #FF6B6B;
  }

  text {
    font-size: 28rpx;
    color: #666;

    .active & {
      color: #FF6B6B;
      font-weight: 600;
    }
  }
}

.option-icon {
  font-size: 36rpx;
}

.difficulty-row {
  display: flex;
  gap: 16rpx;
}

.difficulty-item {
  flex: 1;
  padding: 24rpx;
  background: #F5F7FA;
  border-radius: 16rpx;
  text-align: center;
  border: 3rpx solid transparent;
  transition: all 0.3s;

  &.active {
    background: var(--color);
    border-color: var(--color);
    text {
      color: #fff;
      font-weight: 600;
    }
  }

  text {
    font-size: 30rpx;
    color: #666;
  }
}

.mode-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.mode-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 24rpx;
  background: #F5F7FA;
  border-radius: 16rpx;
  border: 3rpx solid transparent;
  transition: all 0.3s;

  &.active {
    background: rgba(78, 205, 196, 0.1);
    border-color: #4ECDC4;
  }

  &:active {
    transform: scale(0.98);
  }
}

.mode-icon {
  font-size: 40rpx;
}

.mode-name {
  flex: 1;
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.count-row {
  display: flex;
  gap: 16rpx;
}

.count-item {
  flex: 1;
  padding: 24rpx;
  background: #F5F7FA;
  border-radius: 16rpx;
  text-align: center;
  border: 3rpx solid transparent;
  transition: all 0.3s;

  &.active {
    background: rgba(170, 150, 218, 0.1);
    border-color: #AA96DA;
  }

  text {
    font-size: 30rpx;
    color: #666;

    .active & {
      color: #AA96DA;
      font-weight: 600;
    }
  }
}

.start-btn {
  margin-top: 40rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, #FF6B6B, #EE5A5A);
  border-radius: 24rpx;
  text-align: center;
  box-shadow: 0 12rpx 24rpx rgba(255, 107, 107, 0.3);

  text {
    font-size: 36rpx;
    color: #fff;
    font-weight: 700;
  }

  &:active {
    transform: scale(0.98);
  }
}
</style>
