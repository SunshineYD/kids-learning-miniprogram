<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import PracticeProgress from '@/components/chinese/PracticeProgress.vue'
import NavigationButtons from '@/components/chinese/shared/NavigationButtons.vue'
import PracticeHeader from '@/components/chinese/layout/PracticeHeader.vue'

interface Question {
  question: string
  options: string[]
  answer?: string
}

interface Props {
  title: string
  questions: Question[]
  article?: any
  currentIndex: number
  userAnswers: number[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  back: []
  complete: [score: number]
  saveAnswer: [index: number, answerIndex: number]
  nextQuestion: []
  prevQuestion: []
  submit: []
}>()

const selectedOption = ref(-1)
const progressRef = ref()

const total = computed(() => props.questions.length)
const currentQuestion = computed(() => props.questions[props.currentIndex])
const isLastQuestion = computed(() => props.currentIndex === total.value - 1)
const nextButtonText = computed(() => 
  isLastQuestion.value ? '提交' : '下一题'
)

watch(() => props.currentIndex, (newIndex) => {
  selectedOption.value = props.userAnswers[newIndex] ?? -1
})

const handleSelectOption = (index: number) => {
  selectedOption.value = index
  emit('saveAnswer', props.currentIndex, index)
}

const handleNext = () => {
  if (isLastQuestion.value) {
    emit('submit')
  } else {
    emit('nextQuestion')
    progressRef.value?.next()
  }
}

const handlePrev = () => {
  if (props.currentIndex > 0) {
    emit('prevQuestion')
    progressRef.value?.prev()
  }
}

const handleBack = () => {
  emit('back')
}
</script>

<template>
  <view class="practice-container">
    <PracticeHeader :title="title" @back="handleBack" />
    <view class="practice-content reading-content">
      <PracticeProgress
        ref="progressRef"
        :title="title"
        :total="total"
      />
      <view v-if="article" class="reading-card">
        <view v-if="article.title" class="article-title">{{ article.title }}</view>
        <view v-if="article.content" class="article-content">{{ article.content }}</view>
        <view class="question-card">
          <view class="question-text">{{ currentQuestion?.question }}</view>
          <view class="options-list">
            <view
              v-for="(option, index) in currentQuestion?.options || []"
              :key="index"
              class="option-item"
              :class="{ selected: selectedOption === index }"
              @click="handleSelectOption(index)"
            >
              <text class="option-letter">{{ String.fromCharCode(65 + index) }}.</text>
              <text class="option-text">{{ option }}</text>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="commonsense-card">
        <view class="question-text">{{ currentQuestion?.question }}</view>
        <view class="options-list">
          <view
            v-for="(option, index) in currentQuestion?.options || []"
            :key="index"
            class="option-item"
            :class="{ selected: selectedOption === index }"
            @click="handleSelectOption(index)"
          >
            <text class="option-letter">{{ String.fromCharCode(65 + index) }}.</text>
            <text class="option-text">{{ option }}</text>
          </view>
        </view>
      </view>
      <NavigationButtons
        @prev="handlePrev"
        @next="handleNext"
        :can-prev="currentIndex > 0"
        :can-next="selectedOption !== -1"
        :next-text="nextButtonText"
        :disabled="selectedOption === -1"
      />
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

.reading-content {
  height: calc(100vh - 150rpx);
  overflow-y: auto;
}

.reading-card,
.commonsense-card {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-md);
  box-shadow: var(--shadow-md);
}

.article-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.article-content {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  line-height: 1.8;
  padding: var(--spacing-md);
  background: #f5fffd;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
}

.question-card {
  background: #e8f5f2;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}

.question-text {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--bg-white);
  border-radius: var(--border-radius-md);
  border: 3rpx solid transparent;
  transition: all var(--transition-fast);
}

.option-item.selected {
  border-color: var(--secondary-color);
  background: #f5fffd;
}

.option-letter {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--secondary-color);
  min-width: 32rpx;
}

.option-text {
  font-size: var(--font-size-md);
  color: var(--text-primary);
  flex: 1;
}
</style>
