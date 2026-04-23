<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEnglishStore } from '@/store/english'
import type { PracticeQuestion as PracticeQuestionType, PracticeMode } from '@/types'

interface Props {
  question: PracticeQuestionType
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'answer', isCorrect: boolean): void
}>()

const englishStore = useEnglishStore()
const userAnswer = ref('')
const answered = ref(false)
const isCorrect = ref(false)

const correctAnswer = computed(() => {
  switch (props.question.type) {
    case 'listen':
    case 'translate':
      return props.question.word.translation
    case 'image':
      return props.question.word.word
    case 'spell':
      return props.question.word.word
    default:
      return ''
  }
})

const selectOption = (option: string) => {
  if (answered.value) return

  answered.value = true
  userAnswer.value = option
  isCorrect.value = option === correctAnswer.value

  emit('answer', isCorrect.value)
  englishStore.updateWordProgress(props.question.word.id, isCorrect.value)
}

const playAudio = () => {
  englishStore.playWordAudio(props.question.word.word)
}

const shuffleLetters = (word: string): string[] => {
  return word.split('').sort(() => Math.random() - 0.5)
}

const shuffledLetters = computed(() => shuffleLetters(props.question.word.word))
const selectedLetters = ref<string[]>([])

const selectLetter = (letter: string, index: number) => {
  if (answered.value) return
  selectedLetters.value.push(letter)

  if (selectedLetters.value.length === props.question.word.word.length) {
    answered.value = true
    isCorrect.value = selectedLetters.value.join('') === props.question.word.word
    emit('answer', isCorrect.value)
    englishStore.updateWordProgress(props.question.word.id, isCorrect.value)
  }
}

const resetSpelling = () => {
  selectedLetters.value = []
}
</script>

<template>
  <view class="practice-question">
    <view class="question-header">
      <view class="question-type">
        <text v-if="question.type === 'listen'">🎧 听力听写</text>
        <text v-else-if="question.type === 'image'">🖼️ 看图认词</text>
        <text v-else-if="question.type === 'translate'">🔤 中英互译</text>
        <text v-else-if="question.type === 'spell'">✍️ 拼写闯关</text>
      </view>
      <view class="word-preview" @click="playAudio">
        <text class="preview-word">{{ question.word.word }}</text>
        <text class="preview-icon" v-if="question.type === 'listen'">🔊</text>
      </view>
    </view>

    <view class="question-content">
      <template v-if="question.type !== 'spell'">
        <view class="question-text">
          <text v-if="question.type === 'listen'">听发音，选择正确的意思</text>
          <text v-else-if="question.type === 'image'">看图片，选择正确的单词</text>
          <text v-else-if="question.type === 'translate'">
            「{{ question.word.translation }}」的英文是？
          </text>
        </view>
        <view class="options-grid">
          <view
            v-for="(option, index) in question.options"
            :key="index"
            class="option-item"
            :class="{
              'option-correct': answered && option === correctAnswer,
              'option-wrong': answered && option === userAnswer && !isCorrect
            }"
            @click="selectOption(option)"
          >
            <text class="option-text">{{ option }}</text>
            <text class="option-check" v-if="answered && option === correctAnswer">✓</text>
            <text class="option-cross" v-if="answered && option === userAnswer && !isCorrect">✗</text>
          </view>
        </view>
      </template>

      <template v-else>
        <view class="question-text">请拼写这个单词</view>
        <view class="spelling-area">
          <view class="word-slots">
            <view
              v-for="(letter, index) in question.word.word"
              :key="index"
              class="letter-slot"
              :class="{ 'slot-filled': selectedLetters[index] }"
            >
              <text class="slot-letter">{{ selectedLetters[index] || '' }}</text>
            </view>
          </view>
          <view class="letter-options">
            <view
              v-for="(letter, index) in shuffledLetters"
              :key="index"
              class="letter-option"
              :class="{ 'letter-selected': selectedLetters.includes(letter) }"
              @click="selectLetter(letter, index)"
            >
              <text class="letter-text">{{ letter }}</text>
            </view>
          </view>
          <view class="spelling-actions" v-if="!answered">
            <view class="reset-btn" @click="resetSpelling">🔄 重置</view>
          </view>
        </view>
        <view class="spelling-result" v-if="answered">
          <view class="result-icon">{{ isCorrect ? '🎉' : '😅' }}</view>
          <text class="result-text">{{ isCorrect ? '太棒了！拼写正确！' : '再想想，正确答案是: ' + question.word.word }}</text>
        </view>
      </template>
    </view>

    <view class="answer-feedback" v-if="answered && question.type !== 'spell'">
      <view class="feedback-icon">{{ isCorrect ? '🎉' : '😅' }}</view>
      <text class="feedback-text">{{ isCorrect ? '回答正确！' : '再想想哦～' }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.practice-question {
  background: linear-gradient(135deg, #FFFDF5 0%, #FFF8E1 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 20rpx;
}

.question-header {
  text-align: center;
  margin-bottom: 30rpx;
}

.question-type {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.word-preview {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 40rpx;
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  border-radius: 50rpx;
  cursor: pointer;
}

.preview-word {
  font-size: 40rpx;
  font-weight: 800;
  color: #5D4E37;
}

.preview-icon {
  font-size: 32rpx;
}

.question-content {
  margin-bottom: 20rpx;
}

.question-text {
  text-align: center;
  font-size: 32rpx;
  color: #333;
  margin-bottom: 30rpx;
  font-weight: 600;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 20rpx;
  background: rgba(255, 255, 255, 0.9);
  border: 3rpx solid rgba(255, 193, 7, 0.3);
  border-radius: 16rpx;
  position: relative;
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.option-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.option-correct {
  background: linear-gradient(135deg, #4ECDC4 0%, #44B3AA 100%);
  border-color: #4ECDC4;

  .option-text {
    color: #fff;
  }
}

.option-wrong {
  background: linear-gradient(135deg, #FF6B6B 0%, #EE5A5A 100%);
  border-color: #FF6B6B;

  .option-text {
    color: #fff;
  }
}

.option-check,
.option-cross {
  position: absolute;
  right: 16rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28rpx;
  color: #fff;
  font-weight: 800;
}

.spelling-area {
  margin-bottom: 20rpx;
}

.word-slots {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  margin-bottom: 30rpx;
}

.letter-slot {
  width: 70rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border: 3rpx solid rgba(255, 193, 7, 0.4);
  border-radius: 12rpx;
  transition: all 0.2s;
}

.slot-filled {
  background: linear-gradient(135deg, #4ECDC4 0%, #44B3AA 100%);
  border-color: #4ECDC4;
}

.slot-letter {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
}

.slot-filled .slot-letter {
  color: #fff;
}

.letter-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.letter-option {
  width: 70rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.2s;

  &:active {
    transform: scale(0.95);
  }
}

.letter-selected {
  opacity: 0.3;
  pointer-events: none;
}

.letter-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #5D4E37;
}

.spelling-actions {
  text-align: center;
}

.reset-btn {
  display: inline-block;
  padding: 16rpx 32rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #666;
}

.spelling-result {
  text-align: center;
  padding: 30rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
}

.result-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.result-text {
  font-size: 28rpx;
  color: #666;
}

.answer-feedback {
  text-align: center;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
}

.feedback-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.feedback-text {
  font-size: 28rpx;
  color: #666;
}
</style>
