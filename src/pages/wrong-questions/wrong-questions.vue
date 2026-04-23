<template>
  <view class="wrong-questions-page">
    <view class="search-bar">
      <view class="search-input" @click="showSearch = true">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索错题</text>
      </view>
      <view class="filter-btn" @click="showFilter = true">
        <text>筛选</text>
      </view>
    </view>

    <view class="stats-cards">
      <view class="stat-card" v-for="(stat, subject) in wrongQuestionsStore.subjectStats" :key="subject">
        <view class="stat-icon">{{ getSubjectIcon(subject) }}</view>
        <view class="stat-info">
          <text class="stat-count">{{ stat.total }}</text>
          <text class="stat-label">错题数</text>
        </view>
        <view class="stat-mastered">
          <text class="mastered-count">{{ stat.mastered }}</text>
          <text class="mastered-label">已掌握</text>
        </view>
      </view>
    </view>

    <view class="tags-filter" v-if="wrongQuestionsStore.state.tags.length > 0">
      <scroll-view scroll-x class="tags-scroll">
        <view class="tag-item" :class="{ active: !activeTag }" @click="activeTag = ''">
          全部
        </view>
        <view
          v-for="tag in wrongQuestionsStore.state.tags"
          :key="tag.id"
          class="tag-item"
          :class="{ active: activeTag === tag.id }"
          :style="{ backgroundColor: activeTag === tag.id ? tag.color : '#F0F0F0', color: activeTag === tag.id ? '#FFF' : '#333' }"
          @click="activeTag = tag.id"
        >
          {{ tag.name }}
        </view>
      </scroll-view>
    </view>

    <view class="questions-list">
      <view
        v-if="filteredQuestions.length === 0"
        class="empty-state"
      >
        <text class="empty-icon">📝</text>
        <text class="empty-text">暂无错题</text>
      </view>

      <view
        v-for="question in filteredQuestions"
        :key="question.id"
        class="question-card"
        :class="{ mastered: question.mastered }"
      >
        <view class="question-header">
          <view class="question-subject" :style="{ backgroundColor: getSubjectColor(question.subject) }">
            {{ getSubjectName(question.subject) }}
          </view>
          <view class="question-type">{{ question.type }}</view>
          <view v-if="question.mastered" class="mastered-badge">已掌握</view>
        </view>

        <view class="question-content">
          <text class="question-text">{{ question.question }}</text>
          <view v-if="question.options" class="question-options">
            <view
              v-for="(option, index) in question.options"
              :key="index"
              class="option-item"
            >
              {{ String.fromCharCode(65 + index) }}. {{ option }}
            </view>
          </view>
        </view>

        <view class="question-answers">
          <view class="answer-item">
            <text class="answer-label">你的答案:</text>
            <text class="answer-wrong">{{ question.userAnswer }}</text>
          </view>
          <view class="answer-item">
            <text class="answer-label">正确答案:</text>
            <text class="answer-correct">{{ question.correctAnswer }}</text>
          </view>
        </view>

        <view class="question-tags" v-if="question.tags.length > 0">
          <view
            v-for="tag in question.tags"
            :key="tag.id"
            class="question-tag"
            :style="{ backgroundColor: tag.color }"
          >
            {{ tag.name }}
          </view>
        </view>

        <view class="question-notes" v-if="question.notes">
          <text class="notes-label">笔记:</text>
          <text class="notes-text">{{ question.notes }}</text>
        </view>

        <view class="question-footer">
          <text class="wrong-time">错误 {{ question.wrongCount }}次 · {{ formatTime(question.wrongTime) }}</text>
          <view class="question-actions">
            <view class="action-btn" @click="toggleMastered(question)">
              {{ question.mastered ? '取消掌握' : '标记掌握' }}
            </view>
            <view class="action-btn secondary" @click="editNotes(question)">
              笔记
            </view>
            <view class="action-btn danger" @click="deleteQuestion(question.id)">
              删除
            </view>
          </view>
        </view>
      </view>
    </view>

    <uni-popup ref="searchPopup" type="center" :show="showSearch" @close="showSearch = false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">搜索错题</text>
        </view>
        <view class="popup-body">
          <input
            class="popup-input"
            v-model="searchKeyword"
            placeholder="输入关键词搜索"
            @confirm="doSearch"
          />
        </view>
        <view class="popup-footer">
          <view class="popup-btn" @click="showSearch = false">取消</view>
          <view class="popup-btn primary" @click="doSearch">搜索</view>
        </view>
      </view>
    </uni-popup>

    <uni-popup ref="filterPopup" type="bottom" :show="showFilter" @close="showFilter = false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">筛选</text>
        </view>
        <view class="popup-body">
          <view class="filter-group">
            <text class="filter-label">科目</text>
            <view class="filter-options">
              <view
                v-for="subject in ['math', 'english', 'chinese']"
                :key="subject"
                class="filter-option"
                :class="{ active: filterSubject === subject }"
                @click="filterSubject = filterSubject === subject ? undefined : subject"
              >
                {{ getSubjectName(subject) }}
              </view>
            </view>
          </view>
          <view class="filter-group">
            <text class="filter-label">掌握状态</text>
            <view class="filter-options">
              <view
                class="filter-option"
                :class="{ active: filterMastered === false }"
                @click="filterMastered = filterMastered === false ? undefined : false"
              >
                未掌握
              </view>
              <view
                class="filter-option"
                :class="{ active: filterMastered === true }"
                @click="filterMastered = filterMastered === true ? undefined : true"
              >
                已掌握
              </view>
            </view>
          </view>
        </view>
        <view class="popup-footer">
          <view class="popup-btn" @click="resetFilter">重置</view>
          <view class="popup-btn primary" @click="applyFilter">确定</view>
        </view>
      </view>
    </uni-popup>

    <uni-popup ref="notesPopup" type="center" :show="showNotes" @close="showNotes = false">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">添加笔记</text>
        </view>
        <view class="popup-body">
          <textarea
            class="popup-textarea"
            v-model="currentNotes"
            placeholder="记录你的解题思路..."
            :maxlength="500"
          />
        </view>
        <view class="popup-footer">
          <view class="popup-btn" @click="showNotes = false">取消</view>
          <view class="popup-btn primary" @click="saveNotes">保存</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWrongQuestionsStore } from '@/store/wrong-questions'
import type { WrongQuestionItem, WrongQuestionSubject } from '@/types'

const wrongQuestionsStore = useWrongQuestionsStore()

const showSearch = ref(false)
const showFilter = ref(false)
const showNotes = ref(false)
const searchKeyword = ref('')
const activeTag = ref('')
const filterSubject = ref<WrongQuestionSubject | undefined>()
const filterMastered = ref<boolean | undefined>()
const currentNotes = ref('')
const currentQuestion = ref<WrongQuestionItem | null>(null)

const filteredQuestions = computed(() => {
  let questions = wrongQuestionsStore.filteredQuestions

  if (activeTag.value) {
    questions = questions.filter(q => q.tags.some(t => t.id === activeTag.value))
  }

  return questions
})

function getSubjectIcon(subject: string): string {
  const icons: Record<string, string> = {
    math: '🧮',
    english: '📚',
    chinese: '📝'
  }
  return icons[subject] || '❓'
}

function getSubjectName(subject: string): string {
  const names: Record<string, string> = {
    math: '数学',
    english: '英语',
    chinese: '语文'
  }
  return names[subject] || subject
}

function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    math: '#FF6B6B',
    english: '#FFE66D',
    chinese: '#4ECDC4'
  }
  return colors[subject] || '#999'
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function doSearch() {
  wrongQuestionsStore.setFilter('searchKeyword', searchKeyword.value)
  showSearch.value = false
}

function applyFilter() {
  wrongQuestionsStore.setFilter('subject', filterSubject.value)
  wrongQuestionsStore.setFilter('mastered', filterMastered.value)
  showFilter.value = false
}

function resetFilter() {
  filterSubject.value = undefined
  filterMastered.value = undefined
  wrongQuestionsStore.clearFilters()
  showFilter.value = false
}

function toggleMastered(question: WrongQuestionItem) {
  if (question.mastered) {
    wrongQuestionsStore.unmarkAsMastered(question.id)
  } else {
    wrongQuestionsStore.markAsMastered(question.id)
  }
}

function editNotes(question: WrongQuestionItem) {
  currentQuestion.value = question
  currentNotes.value = question.notes || ''
  showNotes.value = true
}

function saveNotes() {
  if (currentQuestion.value) {
    wrongQuestionsStore.updateNotes(currentQuestion.value.id, currentNotes.value)
  }
  showNotes.value = false
}

function deleteQuestion(id: string) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这道错题吗？',
    success: (res) => {
      if (res.confirm) {
        wrongQuestionsStore.removeWrongQuestion(id)
      }
    }
  })
}

onMounted(() => {
  wrongQuestionsStore.init()
})
</script>

<style scoped lang="scss">
.wrong-questions-page {
  min-height: 100vh;
  background: #F8F8F8;
  padding: 20rpx;
}

.search-bar {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.search-input {
  flex: 1;
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border-radius: 30rpx;
  padding: 16rpx 24rpx;
  gap: 12rpx;
}

.search-icon {
  font-size: 28rpx;
}

.search-placeholder {
  font-size: 26rpx;
  color: #999;
}

.filter-btn {
  padding: 16rpx 24rpx;
  background: #FFFFFF;
  border-radius: 30rpx;
  font-size: 26rpx;
  color: #333;
}

.stats-cards {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.stat-card {
  flex: 1;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-icon {
  font-size: 36rpx;
}

.stat-info,
.stat-mastered {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-count,
.mastered-count {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.stat-label,
.mastered-label {
  font-size: 22rpx;
  color: #999;
}

.tags-filter {
  margin-bottom: 20rpx;
}

.tags-scroll {
  white-space: nowrap;
}

.tag-item {
  display: inline-block;
  padding: 12rpx 24rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  margin-right: 12rpx;
  transition: all 0.3s;

  &.active {
    font-weight: 500;
  }
}

.questions-list {
  padding-bottom: 40rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.question-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;

  &.mastered {
    opacity: 0.6;
  }
}

.question-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.question-subject {
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
  font-size: 22rpx;
  color: #FFFFFF;
}

.question-type {
  font-size: 22rpx;
  color: #999;
}

.mastered-badge {
  margin-left: auto;
  padding: 6rpx 16rpx;
  background: #4ECDC4;
  border-radius: 12rpx;
  font-size: 22rpx;
  color: #FFFFFF;
}

.question-content {
  margin-bottom: 20rpx;
}

.question-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.question-options {
  margin-top: 16rpx;
}

.option-item {
  font-size: 26rpx;
  color: #666;
  padding: 8rpx 0;
}

.question-answers {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 20rpx;
  padding: 16rpx;
  background: #F8F8F8;
  border-radius: 12rpx;
}

.answer-item {
  display: flex;
  gap: 12rpx;
}

.answer-label {
  font-size: 24rpx;
  color: #999;
}

.answer-wrong {
  font-size: 26rpx;
  color: #FF6B6B;
  text-decoration: line-through;
}

.answer-correct {
  font-size: 26rpx;
  color: #4ECDC4;
}

.question-tags {
  display: flex;
  gap: 8rpx;
  margin-bottom: 16rpx;
  flex-wrap: wrap;
}

.question-tag {
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
  font-size: 22rpx;
  color: #FFFFFF;
}

.question-notes {
  margin-bottom: 16rpx;
  padding: 16rpx;
  background: #FFF9E6;
  border-radius: 12rpx;
  display: flex;
  gap: 12rpx;
}

.notes-label {
  font-size: 24rpx;
  color: #999;
}

.notes-text {
  flex: 1;
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
}

.question-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16rpx;
  border-top: 1rpx solid #F0F0F0;
}

.wrong-time {
  font-size: 22rpx;
  color: #999;
}

.question-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  color: #4ECDC4;

  &.secondary {
    color: #999;
  }

  &.danger {
    color: #FF6B6B;
  }
}

.popup-content {
  background: #FFFFFF;
  border-radius: 20rpx;
  overflow: hidden;
  width: 600rpx;
  max-width: 90vw;
}

.popup-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
  text-align: center;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.popup-body {
  padding: 30rpx;
}

.popup-input {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid #E0E0E0;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.popup-textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 20rpx;
  border: 1rpx solid #E0E0E0;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.filter-group {
  margin-bottom: 30rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.filter-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.filter-option {
  padding: 12rpx 24rpx;
  background: #F0F0F0;
  border-radius: 24rpx;
  font-size: 26rpx;
  color: #666;

  &.active {
    background: #4ECDC4;
    color: #FFFFFF;
  }
}

.popup-footer {
  display: flex;
  border-top: 1rpx solid #F0F0F0;
}

.popup-btn {
  flex: 1;
  padding: 30rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;

  &.primary {
    color: #4ECDC4;
    font-weight: 500;
  }
}
</style>
