<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMathStore } from '@/store/math'
import { useAppStore } from '@/store/app'
import MathSelector from '@/components/math/MathSelector.vue'
import QuestionCard from '@/components/math/QuestionCard.vue'
import PracticeResult from '@/components/math/PracticeResult.vue'

enum PageState {
  Select,
  Practice,
  Result
}

const mathStore = useMathStore()
const appStore = useAppStore()

const pageState = ref(PageState.Select)
const showAnswer = ref(false)
const questionStartTime = ref(Date.now())

const currentQuestion = computed(() => {
  if (!mathStore.currentSession) return null
  return mathStore.currentSession.questions[mathStore.currentSession.currentIndex]
})

const currentAnswer = computed(() => {
  if (!mathStore.currentSession || !currentQuestion.value) return null
  return mathStore.currentSession.answers.get(currentQuestion.value.id)
})

const progress = computed(() => {
  if (!mathStore.currentSession) return 0
  return ((mathStore.currentSession.currentIndex + 1) / mathStore.currentSession.totalQuestions) * 100
})

const formatTime = (seconds?: number) => {
  if (seconds === undefined) return '--'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  mathStore.init()
  appStore.init()
})

function handleStart(options: any) {
  mathStore.startSession(
    options.grade,
    options.type,
    options.difficulty,
    options.mode,
    options.count
  )
  pageState.value = PageState.Practice
  questionStartTime.value = Date.now()
  showAnswer.value = false
}

function handleSubmit(answer: string | number) {
  if (!currentQuestion.value) return
  const timeSpent = Date.now() - questionStartTime.value
  mathStore.submitAnswer(currentQuestion.value.id, answer, timeSpent)
  showAnswer.value = true

  setTimeout(() => {
    if (mathStore.settings.autoNext) {
      handleNext()
    }
  }, 1000)
}

function handleNext() {
  if (!mathStore.nextQuestion()) {
    pageState.value = PageState.Result
  } else {
    showAnswer.value = false
    questionStartTime.value = Date.now()
  }
}

function handleAgain() {
  pageState.value = PageState.Select
  mathStore.clearSession()
}

function handleClose() {
  pageState.value = PageState.Select
  mathStore.clearSession()
  uni.navigateBack()
}
</script>

<template>
  <view class="math-practice-page">
    <view v-if="pageState === PageState.Select" class="select-page">
      <view class="page-header">
        <text class="header-title">🧮 口算练习</text>
        <text class="header-subtitle">每天练习，进步看得见！</text>
      </view>

      <view class="stats-row">
        <view class="stat-card">
          <text class="stat-emoji">📊</text>
          <text class="stat-value">{{ mathStore.correctRate }}%</text>
          <text class="stat-label">总正确率</text>
        </view>
        <view class="stat-card">
          <text class="stat-emoji">📝</text>
          <text class="stat-value">{{ mathStore.totalPracticesToday.length }}</text>
          <text class="stat-label">今日练习</text>
        </view>
        <view class="stat-card">
          <text class="stat-emoji">❌</text>
          <text class="stat-value">{{ mathStore.unmasteredWrongQuestions.length }}</text>
          <text class="stat-label">待复习</text>
        </view>
      </view>

      <scroll-view class="selector-scroll" scroll-y>
        <MathSelector :grade="appStore.currentGrade" @start="handleStart" />
      </scroll-view>
    </view>

    <view v-if="pageState === PageState.Practice" class="practice-page">
      <view class="practice-header">
        <view class="header-left" @click="handleClose">
          <text class="back-icon">←</text>
        </view>
        <view class="header-center">
          <view class="progress-track">
            <view class="progress-fill" :style="{ width: progress + '%' }"></view>
          </view>
          <text class="progress-text">{{ mathStore.currentSession?.currentIndex + 1 }} / {{ mathStore.currentSession?.totalQuestions }}</text>
        </view>
        <view v-if="mathStore.currentSession?.timeLimit" class="header-right">
          <text class="timer-icon">⏱️</text>
          <text class="timer-text" :class="{ urgent: mathStore.currentSession?.timeRemaining && mathStore.currentSession.timeRemaining <= 10 }">
            {{ formatTime(mathStore.currentSession?.timeRemaining) }}
          </text>
        </view>
      </view>

      <view class="score-bar">
        <text class="score-label">得分</text>
        <text class="score-value">{{ mathStore.currentSession?.score }}</text>
        <text class="correct-count">✓ {{ mathStore.currentSession?.correctCount }}</text>
      </view>

      <scroll-view class="question-scroll" scroll-y>
        <QuestionCard
          v-if="currentQuestion"
          :question="currentQuestion"
          :show-result="showAnswer"
          :user-answer="currentAnswer?.userAnswer"
          :correct="currentAnswer?.correct"
          @submit="handleSubmit"
        />
      </scroll-view>

      <view v-if="showAnswer && !mathStore.settings.autoNext" class="next-btn-container">
        <view class="next-btn" @click="handleNext">
          <text>{{ mathStore.currentSession?.currentIndex === mathStore.currentSession?.totalQuestions - 1 ? '完成练习' : '下一题' }}</text>
        </view>
      </view>
    </view>

    <view v-if="pageState === PageState.Result && mathStore.currentSession" class="result-page">
      <PracticeResult
        :session="mathStore.currentSession"
        @again="handleAgain"
        @close="handleClose"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.math-practice-page {
  min-height: 100vh;
  background: #FFF5F5;
}

.select-page {
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #FF6B6B, #EE5A5A);
  padding: 60rpx 30rpx 40rpx;
  padding-top: calc(60rpx + var(--status-bar-height, 44rpx));
  border-radius: 0 0 40rpx 40rpx;
}

.header-title {
  display: block;
  font-size: 44rpx;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8rpx;
}

.header-subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.stats-row {
  display: flex;
  gap: 16rpx;
  padding: 20rpx;
  margin-top: -40rpx;
  position: relative;
  z-index: 1;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
}

.stat-emoji {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #FF6B6B;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #999;
}

.selector-scroll {
  height: calc(100vh - 400rpx);
}

.practice-page {
  min-height: 100vh;
  background: #FFF5F5;
}

.practice-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  padding-top: calc(20rpx + var(--status-bar-height, 44rpx));
  background: #fff;
}

.header-left {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 44rpx;
  color: #666;
}

.header-center {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.progress-track {
  flex: 1;
  height: 12rpx;
  background: #F5F7FA;
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ECDC4, #44A08D);
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 26rpx;
  color: #666;
  font-weight: 600;
  min-width: 80rpx;
  text-align: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 30rpx;
}

.timer-icon {
  font-size: 28rpx;
}

.timer-text {
  font-size: 28rpx;
  color: #FF6B6B;
  font-weight: 700;
  font-family: monospace;

  &.urgent {
    color: #FF3B30;
    animation: pulse 0.5s ease infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.score-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
  padding: 20rpx;
  background: #fff;
  border-bottom: 1rpx solid #F0F0F0;
}

.score-label {
  font-size: 26rpx;
  color: #999;
}

.score-value {
  font-size: 44rpx;
  font-weight: 800;
  color: #FF6B6B;
}

.correct-count {
  font-size: 28rpx;
  color: #4ECDC4;
  font-weight: 600;
}

.question-scroll {
  flex: 1;
  height: calc(100vh - 300rpx);
}

.next-btn-container {
  padding: 20rpx;
  background: #fff;
}

.next-btn {
  padding: 28rpx;
  background: linear-gradient(135deg, #FF6B6B, #EE5A5A);
  border-radius: 20rpx;
  text-align: center;
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 107, 0.3);

  text {
    font-size: 32rpx;
    color: #fff;
    font-weight: 700;
  }

  &:active {
    transform: scale(0.98);
  }
}

.result-page {
  min-height: 100vh;
}
</style>
