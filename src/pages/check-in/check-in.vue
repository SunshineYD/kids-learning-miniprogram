<template>
  <view class="check-in-page">
    <view class="header">
      <view class="streak-card">
        <view class="streak-icon">🔥</view>
        <view class="streak-info">
          <text class="streak-days">{{ checkInStore.state.streakDays }}</text>
          <text class="streak-label">连续打卡</text>
        </view>
        <view class="streak-max">
          <text class="streak-max-label">最高</text>
          <text class="streak-max-days">{{ checkInStore.state.maxStreakDays }}天</text>
        </view>
      </view>

      <view class="points-card">
        <view class="points-icon">⭐</view>
        <view class="points-info">
          <text class="points-count">{{ checkInStore.state.totalPoints }}</text>
          <text class="points-label">累计积分</text>
        </view>
      </view>
    </view>

    <view class="today-tasks">
      <view class="section-title">今日打卡</view>
      <view class="tasks-list">
        <view
          v-for="task in checkInStore.state.todayRecord?.tasks"
          :key="task.id"
          class="task-item"
          :class="{ completed: task.completed }"
          @click="handleTaskClick(task)"
        >
          <view class="task-icon" :style="{ backgroundColor: task.color }">
            {{ task.icon }}
          </view>
          <view class="task-content">
            <text class="task-name">{{ task.name }}</text>
            <text v-if="task.completed" class="task-status">已完成</text>
          </view>
          <view class="task-check" v-if="task.completed">
            ✓
          </view>
        </view>
      </view>

      <view v-if="checkInStore.state.todayRecord?.isHoliday" class="holiday-banner">
        🎉 节假日专属福利！完成打卡额外+{{ checkInStore.state.todayRecord?.holidayBonus }}积分
      </view>

      <view class="progress-info">
        <text class="progress-text">
          已完成 {{ checkInStore.todayCompletedCount }}/2
        </text>
        <view class="progress-bar">
          <view
            class="progress-fill"
            :style="{ width: `${Math.min(checkInStore.todayCompletedCount / 2 * 100, 100)}%` }"
          ></view>
        </view>
      </view>
    </view>

    <view class="calendar-section">
      <view class="section-title">打卡日历</view>
      <view class="calendar">
        <view class="calendar-weekdays">
          <text v-for="day in ['一', '二', '三', '四', '五', '六', '日']" :key="day" class="weekday">
            {{ day }}
          </text>
        </view>
        <view class="calendar-days">
          <view
            v-for="day in calendarData"
            :key="day.date"
            class="calendar-day"
            :class="{
              today: day.isToday,
              completed: day.isCompleted,
              holiday: day.isHoliday
            }"
            @click="handleDayClick(day)"
          >
            <text class="day-number">{{ day.date.split('-')[2] }}</text>
            <view v-if="day.isCompleted" class="day-dot"></view>
          </view>
        </view>
      </view>
    </view>

    <view class="rewards-section">
      <view class="section-title">连续打卡奖励</view>
      <view class="rewards-list">
        <view
          v-for="reward in checkInStore.state.streakRewards"
          :key="reward.days"
          class="reward-item"
          :class="{ unlocked: checkInStore.state.streakDays >= reward.days }"
        >
          <view class="reward-icon">{{ reward.icon }}</view>
          <view class="reward-info">
            <text class="reward-name">{{ reward.name }}</text>
            <text class="reward-condition">连续{{ reward.days }}天</text>
          </view>
          <view class="reward-points">+{{ reward.points }}</view>
        </view>
      </view>
    </view>

    <view class="supplement-section">
      <view class="section-title">补签</view>
      <view class="supplement-info">
        <text class="supplement-count">
          剩余补签次数: {{ checkInStore.state.maxSupplementCount - checkInStore.state.usedSupplementCount }}/{{ checkInStore.state.maxSupplementCount }}
        </text>
        <text class="supplement-tip">分享给好友即可补签</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useCheckInStore } from '@/store/check-in'
import type { CheckInTask } from '@/types'

const checkInStore = useCheckInStore()

const calendarData = computed(() => checkInStore.getCalendarData())

function handleTaskClick(task: CheckInTask) {
  if (task.completed) return

  const pagePaths: Record<string, string> = {
    math: '/pages/math-practice/math-practice',
    english: '/pages/english/english',
    chinese: '/pages/chinese-practice/chinese-practice'
  }

  if (pagePaths[task.subject]) {
    uni.navigateTo({
      url: pagePaths[task.subject],
      success: () => {
        setTimeout(() => {
          checkInStore.completeTask(task.subject)
        }, 100)
      }
    })
  }
}

function handleDayClick(day: { date: string; isToday: boolean; isCompleted: boolean; isHoliday: boolean }) {
  if (day.isToday || day.isCompleted) return
  checkInStore.supplementCheckIn(day.date)
}

onMounted(() => {
  checkInStore.init()
})
</script>

<style scoped lang="scss">
.check-in-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF5F5 0%, #FFFFFF 100%);
  padding: 20rpx;
}

.header {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.streak-card,
.points-card {
  flex: 1;
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.streak-icon,
.points-icon {
  font-size: 48rpx;
}

.streak-info,
.points-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.streak-days,
.points-count {
  font-size: 36rpx;
  font-weight: bold;
  color: #FF6B6B;
}

.streak-label,
.points-label {
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
}

.streak-max {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.streak-max-label {
  font-size: 20rpx;
  color: #999;
}

.streak-max-days {
  font-size: 24rpx;
  color: #FF6B6B;
  font-weight: bold;
}

.today-tasks,
.calendar-section,
.rewards-section,
.supplement-section {
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
  margin-bottom: 20rpx;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #F8F8F8;
  border-radius: 16rpx;
  transition: all 0.3s;

  &.completed {
    opacity: 0.6;
  }
}

.task-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
}

.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.task-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.task-status {
  font-size: 22rpx;
  color: #4ECDC4;
  margin-top: 4rpx;
}

.task-check {
  font-size: 40rpx;
  color: #4ECDC4;
  font-weight: bold;
}

.holiday-banner {
  background: linear-gradient(90deg, #FFE66D 0%, #FFF5CC 100%);
  border-radius: 12rpx;
  padding: 20rpx;
  text-align: center;
  font-size: 26rpx;
  color: #8B7500;
  margin-bottom: 20rpx;
}

.progress-info {
  margin-top: 20rpx;
}

.progress-text {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}

.progress-bar {
  height: 12rpx;
  background: #F0F0F0;
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6B6B 0%, #FF8E8E 100%);
  border-radius: 6rpx;
  transition: width 0.5s;
}

.calendar-weekdays {
  display: flex;
  margin-bottom: 16rpx;
}

.weekday {
  flex: 1;
  text-align: center;
  font-size: 24rpx;
  color: #999;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10rpx;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  position: relative;
  font-size: 24rpx;

  &.today {
    background: #FF6B6B;
    color: #FFFFFF;
  }

  &.completed {
    background: #4ECDC4;
    color: #FFFFFF;
  }

  &.holiday:not(.completed):not(.today) {
    color: #FF6B6B;
  }
}

.day-number {
  font-size: 24rpx;
}

.day-dot {
  width: 8rpx;
  height: 8rpx;
  background: #FFFFFF;
  border-radius: 50%;
  margin-top: 4rpx;
}

.rewards-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.reward-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #F8F8F8;
  border-radius: 12rpx;
  opacity: 0.5;

  &.unlocked {
    opacity: 1;
    background: linear-gradient(90deg, #FFF5F5 0%, #FFFFFF 100%);
  }
}

.reward-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}

.reward-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.reward-name {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.reward-condition {
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
}

.reward-points {
  font-size: 28rpx;
  color: #FF6B6B;
  font-weight: bold;
}

.supplement-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.supplement-count {
  font-size: 26rpx;
  color: #333;
}

.supplement-tip {
  font-size: 22rpx;
  color: #999;
}
</style>
