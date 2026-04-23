<template>
  <view class="study-report-page">
    <view class="header">
      <view class="title">学习报告</view>
      <view class="refresh-btn" @click="refreshReport">
        <text>🔄</text>
      </view>
    </view>

    <view v-if="!studyReportStore.hasReport || studyReportStore.state.loading" class="loading-state">
      <text class="loading-icon">📊</text>
      <text class="loading-text">{{ studyReportStore.state.loading ? '生成报告中...' : '暂无报告数据' }}</text>
    </view>

    <template v-else>
      <view class="period-tabs">
        <view
          v-for="tab in ['daily', 'weekly', 'monthly']"
          :key="tab"
          class="period-tab"
          :class="{ active: activePeriod === tab }"
          @click="activePeriod = tab"
        >
          {{ getPeriodLabel(tab) }}
        </view>
      </view>

      <view class="overview-cards">
        <view class="overview-card">
          <view class="overview-icon">⏱️</view>
          <view class="overview-info">
            <text class="overview-value">{{ report.totalStudyTime }}</text>
            <text class="overview-label">学习时长(分钟)</text>
          </view>
        </view>
        <view class="overview-card">
          <view class="overview-icon">📝</view>
          <view class="overview-info">
            <text class="overview-value">{{ report.totalQuestions }}</text>
            <text class="overview-label">答题总数</text>
          </view>
        </view>
        <view class="overview-card">
          <view class="overview-icon">✅</view>
          <view class="overview-info">
            <text class="overview-value">{{ report.accuracy }}%</text>
            <text class="overview-label">正确率</text>
          </view>
        </view>
        <view class="overview-card">
          <view class="overview-icon">🔥</view>
          <view class="overview-info">
            <text class="overview-value">{{ report.checkInStreak }}</text>
            <text class="overview-label">连续打卡</text>
          </view>
        </view>
      </view>

      <view class="ability-section">
        <view class="section-title">能力评分</view>
        <view class="ability-list">
          <view
            v-for="ability in report.abilityScores"
            :key="ability.subject"
            class="ability-item"
          >
            <view class="ability-header">
              <view class="ability-subject">
                <text class="subject-icon">{{ getSubjectIcon(ability.subject) }}</text>
                <text class="subject-name">{{ getSubjectName(ability.subject) }}</text>
              </view>
              <view class="ability-score">
                <text class="score-value">{{ ability.score }}</text>
                <text class="score-max">/{{ ability.maxScore }}</text>
              </view>
            </view>
            <view class="ability-bar">
              <view
                class="ability-fill"
                :style="{
                  width: `${(ability.score / ability.maxScore) * 100}%`,
                  backgroundColor: getSubjectColor(ability.subject)
                }"
              ></view>
            </view>
            <view class="ability-trend">
              <text class="trend-icon">{{ getTrendIcon(ability.trend) }}</text>
              <text class="trend-text">{{ getTrendText(ability.trend) }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="weakness-section">
        <view class="section-title">
          <text>{{ activePeriod === 'daily' ? '本周' : activePeriod === 'weekly' ? '本周' : '本月' }}薄弱环节</text>
        </view>
        <view class="weakness-list">
          <view
            v-for="weakness in currentWeaknesses"
            :key="weakness.id"
            class="weakness-item"
          >
            <view class="weakness-header">
              <view class="weakness-subject">
                <text class="subject-icon">{{ getSubjectIcon(weakness.subject) }}</text>
                <text class="weakness-name">{{ weakness.name }}</text>
              </view>
              <view class="weakness-error-rate">
                <text class="error-rate-value">{{ weakness.errorRate }}%</text>
                <text class="error-rate-label">错误率</text>
              </view>
            </view>
            <view class="weakness-stats">
              <text class="stat-item">错误 {{ weakness.wrongCount }}/{{ weakness.totalCount }}</text>
            </view>
            <view class="weakness-suggestions">
              <view class="suggestion-label">💡 建议:</view>
              <view class="suggestion-list">
                <text v-for="(suggestion, index) in weakness.suggestions" :key="index" class="suggestion-item">
                  {{ suggestion }}
                </text>
              </view>
            </view>
          </view>

          <view v-if="currentWeaknesses.length === 0" class="empty-weakness">
            <text class="empty-icon">🎉</text>
            <text class="empty-text">太棒了！没有明显薄弱环节</text>
          </view>
        </view>
      </view>

      <view class="trend-section">
        <view class="section-title">学习趋势</view>
        <view class="trend-chart">
          <view class="chart-container">
            <view class="chart-y-axis">
              <text>100</text>
              <text>50</text>
              <text>0</text>
            </view>
            <view class="chart-area">
              <view class="chart-bars">
                <view
                  v-for="record in report.dailyRecords"
                  :key="record.date"
                  class="chart-bar-item"
                >
                  <view class="bar-wrapper">
                    <view
                      class="bar-fill"
                      :style="{ height: `${(record.correct / Math.max(...report.dailyRecords.map(r => r.questions))) * 100}%` }"
                    ></view>
                  </view>
                  <text class="bar-label">{{ record.date.split('-')[2] }}日</text>
                </view>
              </view>
            </view>
          </view>
          <view class="chart-legend">
            <view class="legend-item">
              <view class="legend-color correct"></view>
              <text>正确数</text>
            </view>
          </view>
        </view>
      </view>

      <view class="daily-records-section">
        <view class="section-title">每日详情</view>
        <view class="daily-records-list">
          <view
            v-for="record in report.dailyRecords"
            :key="record.date"
            class="daily-record-item"
          >
            <view class="record-date">{{ record.date }}</view>
            <view class="record-stats">
              <view class="stat-item">
                <text class="stat-icon">⏱️</text>
                <text>{{ record.studyTime }}分钟</text>
              </view>
              <view class="stat-item">
                <text class="stat-icon">📝</text>
                <text>{{ record.questions }}题</text>
              </view>
              <view class="stat-item">
                <text class="stat-icon">✅</text>
                <text>{{ record.correct }}正确</text>
              </view>
            </view>
            <view class="record-accuracy">
              {{ record.questions > 0 ? Math.round((record.correct / record.questions) * 100) : 0 }}%
            </view>
          </view>
        </view>
      </view>

      <view class="export-section">
        <view class="export-btn" @click="exportReport">
          📋 导出报告
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStudyReportStore } from '@/store/study-report'
import type { WrongQuestionSubject } from '@/types'

const studyReportStore = useStudyReportStore()
const activePeriod = ref<'daily' | 'weekly' | 'monthly'>('weekly')

const report = computed(() => studyReportStore.state.currentReport!)

const currentWeaknesses = computed(() => {
  if (!report.value) return []
  return activePeriod.value === 'monthly' ? report.value.monthlyWeaknesses : report.value.weeklyWeaknesses
})

function getPeriodLabel(period: string): string {
  const labels: Record<string, string> = {
    daily: '今日',
    weekly: '本周',
    monthly: '本月'
  }
  return labels[period] || period
}

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

function getTrendIcon(trend: string): string {
  const icons: Record<string, string> = {
    up: '📈',
    down: '📉',
    stable: '➡️'
  }
  return icons[trend] || '➡️'
}

function getTrendText(trend: string): string {
  const texts: Record<string, string> = {
    up: '上升',
    down: '下降',
    stable: '稳定'
  }
  return texts[trend] || '稳定'
}

function refreshReport() {
  studyReportStore.refreshReport()
}

function exportReport() {
  studyReportStore.exportReport()
}

onMounted(() => {
  studyReportStore.init()
})
</script>

<style scoped lang="scss">
.study-report-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0FFF9 0%, #FFFFFF 100%);
  padding: 20rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.refresh-btn {
  padding: 12rpx;
  font-size: 32rpx;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.loading-icon {
  font-size: 120rpx;
  margin-bottom: 20rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.period-tabs {
  display: flex;
  background: #F0F0F0;
  border-radius: 16rpx;
  padding: 6rpx;
  margin-bottom: 30rpx;
}

.period-tab {
  flex: 1;
  text-align: center;
  padding: 16rpx;
  font-size: 26rpx;
  color: #666;
  border-radius: 12rpx;
  transition: all 0.3s;

  &.active {
    background: #4ECDC4;
    color: #FFFFFF;
    font-weight: 500;
  }
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 30rpx;
}

.overview-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.overview-icon {
  font-size: 40rpx;
}

.overview-info {
  display: flex;
  flex-direction: column;
}

.overview-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.overview-label {
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
}

.ability-section,
.weakness-section,
.trend-section,
.daily-records-section {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
}

.ability-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.ability-item {
  padding: 20rpx;
  background: #F8F8F8;
  border-radius: 16rpx;
}

.ability-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.ability-subject {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.subject-icon {
  font-size: 32rpx;
}

.subject-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.ability-score {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}

.score-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #4ECDC4;
}

.score-max {
  font-size: 24rpx;
  color: #999;
}

.ability-bar {
  height: 12rpx;
  background: #E0E0E0;
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.ability-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.5s;
}

.ability-trend {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.trend-icon {
  font-size: 24rpx;
}

.trend-text {
  font-size: 22rpx;
  color: #999;
}

.weakness-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.weakness-item {
  padding: 24rpx;
  background: linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%);
  border-radius: 16rpx;
  border: 1rpx solid #FFE0E0;
}

.weakness-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.weakness-subject {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.weakness-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.weakness-error-rate {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error-rate-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #FF6B6B;
}

.error-rate-label {
  font-size: 22rpx;
  color: #999;
}

.weakness-stats {
  margin-bottom: 16rpx;
}

.stat-item {
  font-size: 24rpx;
  color: #666;
}

.weakness-suggestions {
  padding: 16rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
}

.suggestion-label {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.suggestion-item {
  font-size: 24rpx;
  color: #999;
  padding-left: 20rpx;
  position: relative;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #4ECDC4;
  }
}

.empty-weakness {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
}

.empty-text {
  font-size: 26rpx;
  color: #999;
}

.trend-chart {
  padding: 20rpx 0;
}

.chart-container {
  display: flex;
  height: 300rpx;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 16rpx;
  font-size: 20rpx;
  color: #999;
}

.chart-area {
  flex: 1;
  display: flex;
  align-items: flex-end;
  border-left: 1rpx solid #E0E0E0;
  border-bottom: 1rpx solid #E0E0E0;
  padding-left: 20rpx;
}

.chart-bars {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 100%;
}

.chart-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.bar-wrapper {
  width: 40rpx;
  height: 220rpx;
  display: flex;
  align-items: flex-end;
  background: #F0F0F0;
  border-radius: 8rpx;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #4ECDC4 0%, #95E1D3 100%);
  border-radius: 8rpx 8rpx 0 0;
  transition: height 0.5s;
}

.bar-label {
  font-size: 20rpx;
  color: #999;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  margin-top: 20rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 22rpx;
  color: #666;
}

.legend-color {
  width: 24rpx;
  height: 24rpx;
  border-radius: 4rpx;

  &.correct {
    background: #4ECDC4;
  }
}

.daily-records-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.daily-record-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #F8F8F8;
  border-radius: 12rpx;
}

.record-date {
  font-size: 26rpx;
  color: #333;
  width: 160rpx;
}

.record-stats {
  flex: 1;
  display: flex;
  gap: 24rpx;
}

.record-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 24rpx;
  color: #666;
}

.stat-icon {
  font-size: 20rpx;
}

.record-accuracy {
  font-size: 28rpx;
  font-weight: bold;
  color: #4ECDC4;
}

.export-section {
  padding: 20rpx 0 40rpx;
}

.export-btn {
  background: linear-gradient(90deg, #4ECDC4 0%, #95E1D3 100%);
  color: #FFFFFF;
  text-align: center;
  padding: 24rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
  font-weight: 500;
}
</style>
