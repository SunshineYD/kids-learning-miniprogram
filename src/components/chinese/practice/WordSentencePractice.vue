<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useChineseStore } from '@/store/chinese'
import PracticeProgress from '@/components/chinese/PracticeProgress.vue'
import NavigationButtons from '@/components/chinese/shared/NavigationButtons.vue'
import PracticeHeader from '@/components/chinese/layout/PracticeHeader.vue'

const chineseStore = useChineseStore()
const wordSentenceAnswer = ref('')
const progressRef = ref()

const emit = defineEmits<{
  back: []
  complete: [score: number]
}>()

const currentWordSentence = computed(() => chineseStore.currentWordSentence)
const currentWord = computed(() => 
  currentWordSentence.value?.words[currentWordSentence.value.currentIndex]
)
const total = computed(() => currentWordSentence.value?.words.length || 0)
const currentIndex = computed(() => currentWordSentence.value?.currentIndex || 0)
const isLastQuestion = computed(() => currentIndex.value === total.value - 1)
const nextButtonText = computed(() => 
  isLastQuestion.value ? '提交' : '下一题'
)

watch(() => chineseStore.currentWordSentence?.currentIndex, (newIndex) => {
  if (chineseStore.currentWordSentence && newIndex !== undefined) {
    wordSentenceAnswer.value = chineseStore.currentWordSentence.userAnswers[newIndex] || ''
  }
})

const handleInput = (e: any) => {
  wordSentenceAnswer.value = e.detail.value
  if (chineseStore.currentWordSentence) {
    chineseStore.saveWordSentenceAnswer(
      chineseStore.currentWordSentence.currentIndex,
      wordSentenceAnswer.value
    )
  }
}

const handleNext = () => {
  if (isLastQuestion.value) {
    chineseStore.submitWordSentence()
    emit('complete', currentWordSentence.value?.score || 0)
  } else {
    chineseStore.nextWordSentence()
    progressRef.value?.next()
  }
}

const handlePrev = () => {
  if (currentWordSentence.value && currentWordSentence.value.currentIndex > 0) {
    chineseStore.prevWordSentence()
    progressRef.value?.prev()
  }
}

const handleBack = () => {
  emit('back')
}
</script>

<template>
  <view class="practice-container">
    <PracticeHeader title="组词造句" @back="handleBack" />
    <view class="practice-content">
      <PracticeProgress
        ref="progressRef"
        title="词语练习"
        :total="total"
      />
      <view v-if="currentWord" class="wordsentence-card">
        <view class="word-display">{{ currentWord.word }}</view>
        <view class="word-meaning">{{ currentWord.meaning }}</view>
        <view class="hint">用这个词语造一个句子</view>
        <view class="input-container">
          <textarea
            class="wordsentence-input"
            v-model="wordSentenceAnswer"
            placeholder="请造句..."
            @input="handleInput"
          />
        </view>
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

.wordsentence-card {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-md);
  box-shadow: var(--shadow-md);
}

.word-display {
  font-size: 120rpx;
  font-weight: 700;
  color: var(--secondary-color);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.word-meaning {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.hint {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.input-container {
  margin-top: var(--spacing-md);
}

.wordsentence-input {
  width: 100%;
  min-height: 150rpx;
  background: #f5fffd;
  border: 3rpx solid var(--secondary-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm);
  font-size: var(--font-size-md);
  color: var(--text-primary);
  line-height: 1.6;
}
</style>
