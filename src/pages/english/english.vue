<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useEnglishStore } from '@/store/english'
import { useAppStore } from '@/store/app'
import type { PracticeMode } from '@/types'
import { getWordById } from '@/data/english-words'
import WordCard from '@/components/english/WordCard.vue'
import ProgressStats from '@/components/english/ProgressStats.vue'
import PracticeModeCard from '@/components/english/PracticeModeCard.vue'
import PracticeQuestion from '@/components/english/PracticeQuestion.vue'
import VersionSelector from '@/components/english/VersionSelector.vue'
import UnitSelector from '@/components/english/UnitSelector.vue'
import GradeSelector from '@/components/GradeSelector/index.vue'

const englishStore = useEnglishStore()
const appStore = useAppStore()

const currentView = ref<'main' | 'learn' | 'practice' | 'review' | 'result'>('main')
const currentWordIndex = ref(0)
const correctCount = ref(0)
const totalCount = ref(0)
const learnWords = ref<any[]>([])

const currentQuestion = computed(() => {
  if (currentView.value !== 'practice' || !englishStore.currentPracticeWords.length) {
    return null
  }
  const word = englishStore.currentPracticeWords[englishStore.currentWordIndex]
  if (!word || !englishStore.currentPracticeMode) {
    return null
  }
  return englishStore.generateQuestion(word, englishStore.currentPracticeMode)
})

const practiceProgress = computed(() => {
  if (!englishStore.currentPracticeWords.length) return 0
  return Math.round(((englishStore.currentWordIndex + 1) / englishStore.currentPracticeWords.length) * 100)
})

const startLearn = () => {
  learnWords.value = [...englishStore.currentWords]
  currentWordIndex.value = 0
  currentView.value = 'learn'
}

const nextWord = () => {
  const word = learnWords.value[currentWordIndex.value]
  englishStore.updateWordProgress(word.id, true)

  if (currentWordIndex.value < learnWords.value.length - 1) {
    currentWordIndex.value++
  } else {
    finishLearn()
  }
}

const previousWord = () => {
  if (currentWordIndex.value > 0) {
    currentWordIndex.value--
  }
}

const finishLearn = () => {
  englishStore.updateTodayRecord(learnWords.value.length, 0, learnWords.value.length, learnWords.value.length)
  currentView.value = 'result'
}

const startPractice = (mode: PracticeMode) => {
  correctCount.value = 0
  totalCount.value = 0
  englishStore.startPractice(mode, englishStore.currentWords)
  currentView.value = 'practice'
}

const startReview = () => {
  const reviewWordIds = englishStore.wordsToReview.map(p => p.wordId)
  const reviewWords = reviewWordIds.map(id => getWordById(id)).filter(Boolean) as any[]

  if (reviewWords.length === 0) {
    uni.showToast({
      title: '暂无需复习的单词',
      icon: 'none'
    })
    return
  }

  correctCount.value = 0
  totalCount.value = 0
  englishStore.startPractice('translate', reviewWords)
  currentView.value = 'practice'
}

const handleAnswer = (isCorrect: boolean) => {
  totalCount.value++
  if (isCorrect) {
    correctCount.value++
  }
}

const handleNext = () => {
  const hasNext = englishStore.nextWord()
  if (!hasNext) {
    englishStore.endPractice(correctCount.value, totalCount.value)
    currentView.value = 'result'
  }
}

const backToMain = () => {
  currentView.value = 'main'
  currentWordIndex.value = 0
  correctCount.value = 0
  totalCount.value = 0
}

const handleGradeChange = (grade: number) => {
  appStore.setGrade(grade as any)
  englishStore.setGrade(grade as any)
}

onMounted(() => {
  englishStore.setGrade(appStore.currentGrade)
})
</script>

<template>
  <view class="english-page">
    <view class="page-content">
      <template v-if="currentView === 'main'">
        <scroll-view scroll-y class="main-scroll">
          <ProgressStats />
          <VersionSelector />
          <view class="grade-section">
            <view class="section-title">🎓 选择年级</view>
            <GradeSelector @change="handleGradeChange" />
          </view>
          <UnitSelector />

          <view class="word-preview" v-if="englishStore.currentWords.length > 0">
            <view class="preview-title">📖 本单元单词预览</view>
            <scroll-view scroll-x class="word-list">
              <view class="word-list-inner">
                <view
                  v-for="word in englishStore.currentWords"
                  :key="word.id"
                  class="word-preview-item"
                >
                  <text class="preview-item-word">{{ word.word }}</text>
                  <text class="preview-item-trans">{{ word.translation }}</text>
                </view>
              </view>
            </scroll-view>
          </view>

          <view class="practice-modes">
            <view class="section-title">🎮 练习模式</view>
            <PracticeModeCard
              mode="translate"
              title="单词学习"
              description="认识新单词，学习发音和含义"
              icon="📚"
              color="#FF6B6B"
              @click="startLearn"
            />
            <PracticeModeCard
              mode="listen"
              title="听力听写"
              description="听发音，选择正确的意思"
              icon="🎧"
              color="#4ECDC4"
              @click="startPractice('listen')"
            />
            <PracticeModeCard
              mode="translate"
              title="中英互译"
              description="看中文说英文，看英文说中文"
              icon="🔤"
              color="#AA96DA"
              @click="startPractice('translate')"
            />
            <PracticeModeCard
              mode="spell"
              title="拼写闯关"
              description="练习单词拼写，加深记忆"
              icon="✍️"
              color="#FFE66D"
              @click="startPractice('spell')"
            />
            <PracticeModeCard
              mode="translate"
              title="艾宾浩斯复习"
              description="科学复习，巩固记忆"
              icon="🔄"
              color="#95E1D3"
              @click="startReview"
            />
          </view>

          <view class="bottom-space"></view>
        </scroll-view>
      </template>

      <template v-else-if="currentView === 'learn'">
        <view class="learn-view">
          <view class="learn-progress">
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: `${((currentWordIndex + 1) / learnWords.length) * 100}%` }"></view>
            </view>
            <text class="progress-text">{{ currentWordIndex + 1 }} / {{ learnWords.length }}</text>
          </view>

          <WordCard
            v-if="learnWords[currentWordIndex]"
            :word="learnWords[currentWordIndex]"
            :show-translation="true"
            :show-example="true"
            :show-phrases="true"
          />

          <view class="learn-actions">
            <view
              class="action-btn prev-btn"
              :class="{ 'btn-disabled': currentWordIndex === 0 }"
              @click="previousWord"
            >
              上一个
            </view>
            <view class="action-btn next-btn" @click="nextWord">
              {{ currentWordIndex < learnWords.length - 1 ? '下一个' : '完成学习' }}
            </view>
          </view>

          <view class="back-btn" @click="backToMain">返回</view>
        </view>
      </template>

      <template v-else-if="currentView === 'practice'">
        <view class="practice-view">
          <view class="practice-progress">
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: `${practiceProgress}%` }"></view>
            </view>
            <text class="progress-text">{{ englishStore.currentWordIndex + 1 }} / {{ englishStore.currentPracticeWords.length }}</text>
            <text class="score-text">{{ correctCount }} 正确</text>
          </view>

          <PracticeQuestion
            v-if="currentQuestion"
            :question="currentQuestion"
            @answer="handleAnswer"
          />

          <view class="practice-actions" v-if="currentQuestion">
            <view
              class="action-btn next-btn"
              @click="handleNext"
            >
              {{ englishStore.currentWordIndex < englishStore.currentPracticeWords.length - 1 ? '下一题' : '完成练习' }}
            </view>
          </view>

          <view class="back-btn" @click="backToMain">返回</view>
        </view>
      </template>

      <template v-else-if="currentView === 'result'">
        <view class="result-view">
          <view class="result-icon">🎉</view>
          <view class="result-title">太棒了！</view>
          <view class="result-stats">
            <view class="stat-row">
              <text class="stat-label">完成单词</text>
              <text class="stat-value">{{ totalCount }}</text>
            </view>
            <view class="stat-row">
              <text class="stat-label">正确数量</text>
              <text class="stat-value correct">{{ correctCount }}</text>
            </view>
            <view class="stat-row">
              <text class="stat-label">正确率</text>
              <text class="stat-value">{{ totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0 }}%</text>
            </view>
          </view>
          <view class="result-actions">
            <view class="action-btn back-btn" @click="backToMain">返回首页</view>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.english-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFFDF5 0%, #FFF8E1 100%);
}

.page-content {
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.main-scroll {
  height: 100vh;
}

.grade-section {
  margin: 0 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin: 20rpx 20rpx 10rpx;
}

.word-preview {
  margin: 20rpx;
  background: linear-gradient(135deg, #FFFDF5 0%, #FFF8E1 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 193, 7, 0.15);
}

.preview-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.word-list {
  white-space: nowrap;
}

.word-list-inner {
  display: inline-flex;
  gap: 16rpx;
}

.word-preview-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 24rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12rpx;
  min-width: 140rpx;
}

.preview-item-word {
  font-size: 28rpx;
  font-weight: 700;
  color: #FF6B6B;
  margin-bottom: 6rpx;
}

.preview-item-trans {
  font-size: 22rpx;
  color: #999;
}

.practice-modes {
  margin-top: 20rpx;
}

.bottom-space {
  height: 120rpx;
}

.learn-view,
.practice-view,
.result-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20rpx;
}

.learn-progress,
.practice-progress {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  margin-bottom: 10rpx;
}

.progress-bar {
  flex: 1;
  height: 12rpx;
  background: rgba(255, 193, 7, 0.2);
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFE66D 0%, #FFD93D 100%);
  border-radius: 6rpx;
  transition: width 0.3s;
}

.progress-text {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
  min-width: 100rpx;
  text-align: right;
}

.score-text {
  font-size: 24rpx;
  color: #4ECDC4;
  font-weight: 600;
  min-width: 100rpx;
  text-align: right;
}

.learn-actions,
.practice-actions {
  display: flex;
  gap: 20rpx;
  padding: 0 20rpx;
  margin-top: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 28rpx;
  text-align: center;
  border-radius: 50rpx;
  font-size: 30rpx;
  font-weight: 600;
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.prev-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #666;
  border: 3rpx solid rgba(255, 193, 7, 0.3);

  &.btn-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.next-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #EE5A5A 100%);
  color: #fff;
}

.back-btn {
  margin: 30rpx auto;
  padding: 20rpx 60rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50rpx;
  font-size: 26rpx;
  color: #666;
  text-align: center;
  border: 3rpx solid rgba(255, 193, 7, 0.3);
}

.result-view {
  justify-content: center;
  align-items: center;
}

.result-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.result-title {
  font-size: 48rpx;
  font-weight: 800;
  color: #333;
  margin-bottom: 40rpx;
}

.result-stats {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  width: 100%;
  max-width: 500rpx;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 2rpx solid rgba(255, 193, 7, 0.2);

  &:last-child {
    border-bottom: none;
  }
}

.stat-label {
  font-size: 28rpx;
  color: #666;
}

.stat-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;

  &.correct {
    color: #4ECDC4;
  }
}

.result-actions {
  width: 100%;
  max-width: 500rpx;
}
</style>
