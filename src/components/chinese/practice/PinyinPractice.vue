<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useChineseStore } from '@/store/chinese'
import PracticeProgress from '@/components/chinese/PracticeProgress.vue'
import NavigationButtons from '@/components/chinese/shared/NavigationButtons.vue'
import PracticeHeader from '@/components/chinese/layout/PracticeHeader.vue'

const chineseStore = useChineseStore()
const pinyinAnswer = ref('')
const progressRef = ref()

const emit = defineEmits<{
  back: []
  complete: [score: number]
}>()

const currentPinyin = computed(() => chineseStore.currentPinyin)
const currentChar = computed(() => 
  currentPinyin.value?.characters[currentPinyin.value.currentIndex]
)
const total = computed(() => currentPinyin.value?.characters.length || 0)
const currentIndex = computed(() => currentPinyin.value?.currentIndex || 0)
const isLastQuestion = computed(() => currentIndex.value === total.value - 1)
const nextButtonText = computed(() => 
  isLastQuestion.value ? '提交' : '下一题'
)

watch(() => chineseStore.currentPinyin?.currentIndex, (newIndex) => {
  if (chineseStore.currentPinyin && newIndex !== undefined) {
    pinyinAnswer.value = chineseStore.currentPinyin.userAnswers[newIndex] || ''
  }
})

const handleInput = (e: any) => {
  pinyinAnswer.value = e.detail.value
  if (chineseStore.currentPinyin) {
    chineseStore.savePinyinAnswer(
      chineseStore.currentPinyin.currentIndex,
      pinyinAnswer.value
    )
  }
}

const handleNext = () => {
  if (isLastQuestion.value) {
    chineseStore.submitPinyin()
    emit('complete', currentPinyin.value?.score || 0)
  } else {
    chineseStore.nextPinyin()
    progressRef.value?.next()
  }
}

const handlePrev = () => {
  if (currentPinyin.value && currentPinyin.value.currentIndex > 0) {
    chineseStore.prevPinyin()
    progressRef.value?.prev()
  }
}

const handleBack = () => {
  emit('back')
}
</script>

<template>
  <view class="practice-container">
    <PracticeHeader title="拼音认读" @back="handleBack" />
    <view class="practice-content">
      <PracticeProgress
        ref="progressRef"
        title="拼音练习"
        :total="total"
      />
      <view v-if="currentChar" class="pinyin-card">
        <view class="character-display">{{ currentChar.character }}</view>
        <view class="meaning">{{ currentChar.meaning }}</view>
        <view class="input-container">
          <input
            class="pinyin-input"
            type="text"
            v-model="pinyinAnswer"
            placeholder="请写出拼音"
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

.pinyin-card {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-md);
  box-shadow: var(--shadow-md);
}

.character-display {
  font-size: 120rpx;
  font-weight: 700;
  color: var(--secondary-color);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.meaning {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
  text-align: center;
}

.input-container {
  margin-top: var(--spacing-md);
}

.pinyin-input {
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
