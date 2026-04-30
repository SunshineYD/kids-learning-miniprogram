<script setup lang="ts">
import { ref, watch, computed, toValue } from 'vue'
import { useChineseStore } from '@/store/chinese'
import PracticeProgress from '@/components/chinese/PracticeProgress.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import FeedbackDisplay from '@/components/chinese/shared/FeedbackDisplay.vue'
import NavigationButtons from '@/components/chinese/shared/NavigationButtons.vue'
import PracticeHeader from '@/components/chinese/layout/PracticeHeader.vue'
import { usePracticeFeedback } from '@/composables/usePracticeFeedback'

const chineseStore = useChineseStore()
const feedback = usePracticeFeedback()

const dictationAnswer = ref('')
const progressRef = ref()

const emit = defineEmits<{
  back: []
  complete: [score: number]
}>()

const currentDictation = computed(() => chineseStore.currentDictation)
const currentChar = computed(() => 
  currentDictation.value?.characters[currentDictation.value.currentIndex]
)
const total = computed(() => currentDictation.value?.characters.length || 0)
const currentIndex = computed(() => currentDictation.value?.currentIndex || 0)
const isLastQuestion = computed(() => currentIndex.value === total.value - 1)
const nextButtonText = computed(() => {
  if (!feedback.showFeedback.value) return '确认答案'
  return isLastQuestion.value ? '提交' : '下一题'
})

// 用computed来确保传递的是值而不是ref对象
const showFeedback = computed(() => feedback.showFeedback.value)
const isCorrect = computed(() => feedback.isCorrect.value)
const correctAnswer = computed(() => feedback.correctAnswer.value)

watch(() => chineseStore.currentDictation?.currentIndex, (newIndex) => {
  if (chineseStore.currentDictation && newIndex !== undefined) {
    dictationAnswer.value = chineseStore.currentDictation.userAnswers[newIndex] || ''
    feedback.reset()
  }
})

const handleInput = (e: any) => {
  dictationAnswer.value = e.detail.value
  if (chineseStore.currentDictation) {
    chineseStore.saveDictationAnswer(
      chineseStore.currentDictation.currentIndex,
      dictationAnswer.value
    )
  }
}

const handleNext = () => {
  if (!showFeedback.value && currentChar.value) {
    feedback.checkAnswer(dictationAnswer.value, currentChar.value.character)
    return
  }

  feedback.reset()

  if (isLastQuestion.value) {
    chineseStore.submitDictation()
    emit('complete', currentDictation.value?.score || 0)
  } else {
    chineseStore.nextDictation()
    progressRef.value?.next()
  }
}

const handlePrev = () => {
  if (currentDictation.value && currentDictation.value.currentIndex > 0) {
    chineseStore.prevDictation()
    progressRef.value?.prev()
  }
}

const handleBack = () => {
  emit('back')
}
</script>

<template>
  <view class="practice-container">
    <PracticeHeader title="生字听写" @back="handleBack" />
    <view class="practice-content">
      <PracticeProgress
        ref="progressRef"
        title="听写练习"
        :total="total"
      />
      <view v-if="currentChar" class="dictation-card">
        <view class="character-info">
          <view class="pinyin-row">
            <view class="pinyin">{{ currentChar.pinyin }}</view>
            <AudioPlayer
              :text="currentChar.character + '，' + currentChar.meaning"
              size="medium"
              color="#4ECDC4"
            />
          </view>
          <view class="meaning">{{ currentChar.meaning }}</view>
          <view class="example">"{{ currentChar.example }}"</view>
        </view>
        <view class="input-container">
          <input
            class="dictation-input"
            type="text"
            v-model="dictationAnswer"
            placeholder="请写出这个字"
            maxlength="1"
            @input="handleInput"
            :disabled="showFeedback"
          />
        </view>
        <FeedbackDisplay
          :show="showFeedback"
          :is-correct="isCorrect"
          :correct-answer="correctAnswer"
        />
      </view>
      <NavigationButtons
        @prev="handlePrev"
        @next="handleNext"
        :can-prev="currentIndex > 0"
        :next-text="nextButtonText"
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

.dictation-card {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-md);
  box-shadow: var(--shadow-md);
}

.character-info {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.pinyin-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.pinyin {
  font-size: var(--font-size-xxl);
  font-weight: 700;
  color: var(--secondary-color);
}

.meaning {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.example {
  font-size: var(--font-size-md);
  color: var(--text-light);
  font-style: italic;
}

.input-container {
  margin-top: var(--spacing-md);
}

.dictation-input {
  width: 100%;
  height: 100rpx;
  background: #f5fffd;
  border: 3rpx solid var(--secondary-color);
  border-radius: var(--border-radius-md);
  text-align: center;
  font-size: var(--font-size-xxl);
  font-weight: 700;
  color: var(--text-primary);
}
</style>
