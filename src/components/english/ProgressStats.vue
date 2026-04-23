<script setup lang="ts">
import { useEnglishStore } from '@/store/english'

const englishStore = useEnglishStore()
</script>

<template>
  <view class="progress-stats">
    <view class="stats-title">📊 学习进度</view>
    <view class="stats-grid">
      <view class="stat-item mastered">
        <text class="stat-icon">✅</text>
        <text class="stat-number">{{ englishStore.masteredWords }}</text>
        <text class="stat-label">已掌握</text>
      </view>
      <view class="stat-item review">
        <text class="stat-icon">🔄</text>
        <text class="stat-number">{{ englishStore.reviewWords }}</text>
        <text class="stat-label">待复习</text>
      </view>
      <view class="stat-item learning">
        <text class="stat-icon">📚</text>
        <text class="stat-number">{{ englishStore.learningWords }}</text>
        <text class="stat-label">学习中</text>
      </view>
      <view class="stat-item unlearned">
        <text class="stat-icon">❓</text>
        <text class="stat-number">{{ englishStore.unlearnedWords }}</text>
        <text class="stat-label">未学习</text>
      </view>
    </view>
    <view class="today-progress" v-if="englishStore.todayRecord">
      <view class="today-title">📅 今日学习</view>
      <view class="today-detail">
        <text class="today-text">新学: {{ englishStore.todayRecord.learnedWords }}</text>
        <text class="today-text">复习: {{ englishStore.todayRecord.reviewedWords }}</text>
        <text class="today-text">正确率: {{ Math.round(englishStore.todayRecord.accuracy * 100) }}%</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.progress-stats {
  background: linear-gradient(135deg, #FFFDF5 0%, #FFF8E1 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 193, 7, 0.15);
}

.stats-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 30rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 16rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.8);
}

.stat-icon {
  font-size: 36rpx;
  margin-bottom: 8rpx;
}

.stat-number {
  font-size: 36rpx;
  font-weight: 800;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #666;
}

.mastered .stat-number {
  color: #4ECDC4;
}

.review .stat-number {
  color: #FFE66D;
}

.learning .stat-number {
  color: #FF6B6B;
}

.unlearned .stat-number {
  color: #999;
}

.today-progress {
  margin-top: 30rpx;
  padding-top: 24rpx;
  border-top: 2rpx dashed rgba(255, 193, 7, 0.3);
}

.today-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.today-detail {
  display: flex;
  justify-content: space-around;
}

.today-text {
  font-size: 24rpx;
  color: #666;
}
</style>
