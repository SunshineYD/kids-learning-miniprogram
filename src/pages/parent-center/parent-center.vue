<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useParentStore } from '@/store/parent'

const parentStore = useParentStore()
const currentTab = ref('overview')
const showVerifyModal = ref(false)
const verifyCode = ref('')
const showAddChildModal = ref(false)
const showChildSwitchModal = ref(false)
const showAddReminderModal = ref(false)
const showReportModal = ref(false)
const newChild = ref({
  nickname: '',
  avatar: '',
  grade: 1 as any
})
const newReminder = ref({
  title: '',
  time: '18:00',
  enabled: true,
  repeatDays: [1, 2, 3, 4, 5]
})
const reportDateRange = ref({
  start: '',
  end: ''
})

const gradeOptions = [
  { label: '一年级', value: 1 },
  { label: '二年级', value: 2 },
  { label: '三年级', value: 3 },
  { label: '四年级', value: 4 }
]

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const subjectNames: Record<string, string> = {
  math: '数学',
  english: '英语',
  chinese: '语文'
}

const subjectColors: Record<string, string> = {
  math: '#FF6B6B',
  english: '#FFE66D',
  chinese: '#4ECDC4'
}

const overviewStats = computed(() => {
  const data = parentStore.currentChildStudyData
  const today = new Date().toISOString().split('T')[0]
  const todayData = data.filter(d => d.date === today)
  const weekData = data.filter(d => {
    const date = new Date(d.date)
    const now = new Date()
    const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 7
  })

  return {
    todayCompleted: todayData.reduce((sum, d) => sum + d.completedCount, 0),
    todayAccuracy: todayData.length > 0 
      ? Math.round(todayData.reduce((sum, d) => sum + d.accuracy, 0) / todayData.length)
      : 0,
    weekStudyDays: new Set(weekData.map(d => d.date)).size,
    weekTotalQuestions: weekData.reduce((sum, d) => sum + d.totalCount, 0)
  }
})

const weeklyChartData = computed(() => {
  const data = parentStore.currentChildStudyData
  const result = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dayData = data.filter(d => d.date === dateStr)
    result.push({
      date: dateStr,
      day: weekDays[date.getDay()],
      completed: dayData.reduce((sum, d) => sum + d.completedCount, 0),
      accuracy: dayData.length > 0 
        ? Math.round(dayData.reduce((sum, d) => sum + d.accuracy, 0) / dayData.length)
        : 0
    })
  }
  return result
})

const maxCompleted = computed(() => {
  return Math.max(...weeklyChartData.value.map(d => d.completed), 10)
})

onMounted(() => {
  parentStore.init()
  if (!parentStore.isVerified) {
    showVerifyModal.value = true
  }
  
  const today = new Date()
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 6)
  reportDateRange.value.start = weekAgo.toISOString().split('T')[0]
  reportDateRange.value.end = today.toISOString().split('T')[0]
})

const handleVerify = async () => {
  if (verifyCode.value.length !== 6) {
    uni.showToast({
      title: '请输入6位验证码',
      icon: 'none'
    })
    return
  }
  
  const success = await parentStore.verifyParent(verifyCode.value)
  if (success) {
    showVerifyModal.value = false
    uni.showToast({
      title: '验证成功',
      icon: 'success'
    })
  } else {
    uni.showToast({
      title: '验证失败',
      icon: 'none'
    })
  }
}

const handleAddChild = async () => {
  if (!newChild.value.nickname) {
    uni.showToast({
      title: '请输入孩子昵称',
      icon: 'none'
    })
    return
  }
  
  if (!newChild.value.avatar) {
    newChild.value.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newChild.value.nickname}`
  }
  
  const child = await parentStore.addChild(newChild.value)
  if (child) {
    showAddChildModal.value = false
    newChild.value = { nickname: '', avatar: '', grade: 1 }
    uni.showToast({
      title: '添加成功',
      icon: 'success'
    })
  }
}

const handleSwitchChild = (childId: number) => {
  parentStore.switchChild(childId)
  showChildSwitchModal.value = false
}

const handleAddReminder = async () => {
  if (!newReminder.value.title) {
    uni.showToast({
      title: '请输入提醒标题',
      icon: 'none'
    })
    return
  }
  
  if (!parentStore.currentChildId) return
  
  const reminder = await parentStore.addReminder({
    ...newReminder.value,
    childId: parentStore.currentChildId
  })
  
  if (reminder) {
    showAddReminderModal.value = false
    newReminder.value = {
      title: '',
      time: '18:00',
      enabled: true,
      repeatDays: [1, 2, 3, 4, 5]
    }
    uni.showToast({
      title: '添加成功',
      icon: 'success'
    })
  }
}

const toggleReminder = (reminderId: number) => {
  const reminder = parentStore.reminders.find(r => r.id === reminderId)
  if (reminder) {
    parentStore.updateReminder(reminderId, { enabled: !reminder.enabled })
  }
}

const deleteReminder = (reminderId: number) => {
  uni.showModal({
    title: '提示',
    content: '确定删除这个提醒吗？',
    success: (res) => {
      if (res.confirm) {
        parentStore.removeReminder(reminderId)
      }
    }
  })
}

const toggleWeekDay = (day: number) => {
  const index = newReminder.value.repeatDays.indexOf(day)
  if (index >= 0) {
    newReminder.value.repeatDays.splice(index, 1)
  } else {
    newReminder.value.repeatDays.push(day)
    newReminder.value.repeatDays.sort((a, b) => a - b)
  }
}

const handleGenerateReport = async () => {
  if (!parentStore.currentChildId) return
  
  const report = await parentStore.generateReport(
    parentStore.currentChildId,
    reportDateRange.value.start,
    reportDateRange.value.end
  )
  
  if (report) {
    showReportModal.value = true
    uni.showToast({
      title: '报告生成成功',
      icon: 'success'
    })
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}
</script>

<template>
  <view class="parent-center">
    <view class="header">
      <view class="header-top">
        <view class="header-title">家长中心</view>
        <view class="child-selector" @click="showChildSwitchModal = true">
          <image class="child-avatar" :src="parentStore.currentChild?.avatar" mode="aspectFill" />
          <text class="child-name">{{ parentStore.currentChild?.nickname }}</text>
          <text class="arrow">›</text>
        </view>
      </view>
      
      <view class="tabs">
        <view 
          v-for="tab in ['overview', 'data', 'reminder', 'report']" 
          :key="tab"
          :class="['tab', { active: currentTab === tab }]"
          @click="currentTab = tab"
        >
          {{ tab === 'overview' ? '总览' : tab === 'data' ? '学习数据' : tab === 'reminder' ? '提醒设置' : '学习报告' }}
        </view>
      </view>
    </view>

    <view class="content">
      <view v-if="currentTab === 'overview'" class="overview-tab">
        <view class="stats-grid">
          <view class="stat-card">
            <view class="stat-value">{{ overviewStats.todayCompleted }}</view>
            <view class="stat-label">今日完成</view>
          </view>
          <view class="stat-card">
            <view class="stat-value">{{ overviewStats.todayAccuracy }}%</view>
            <view class="stat-label">今日正确率</view>
          </view>
          <view class="stat-card">
            <view class="stat-value">{{ overviewStats.weekStudyDays }}</view>
            <view class="stat-label">本周学习天数</view>
          </view>
          <view class="stat-card">
            <view class="stat-value">{{ overviewStats.weekTotalQuestions }}</view>
            <view class="stat-label">本周总题数</view>
          </view>
        </view>

        <view class="section">
          <view class="section-title">本周学习趋势</view>
          <view class="chart-container">
            <view class="chart-bars">
              <view v-for="(item, index) in weeklyChartData" :key="index" class="chart-bar-item">
                <view class="bar-wrapper">
                  <view 
                    class="bar" 
                    :style="{ height: `${(item.completed / maxCompleted) * 200}rpx` }"
                  ></view>
                </view>
                <view class="bar-label">{{ item.day }}</view>
              </view>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="section-title">最近学习记录</view>
          <view class="record-list">
            <view 
              v-for="record in parentStore.currentChildStudyData.slice(0, 10)" 
              :key="record.id"
              class="record-item"
            >
              <view class="record-subject" :style="{ background: subjectColors[record.subject] }">
                {{ subjectNames[record.subject] }}
              </view>
              <view class="record-info">
                <view class="record-date">{{ formatDate(record.date) }}</view>
                <view class="record-detail">
                  完成 {{ record.completedCount }} 题 · 正确率 {{ record.accuracy }}% · 用时 {{ record.timeSpent }}分钟
                </view>
              </view>
              <view class="record-score">{{ record.score }}分</view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="currentTab === 'data'" class="data-tab">
        <view class="section">
          <view class="section-title">各科目学习情况</view>
          <view class="subject-stats">
            <view 
              v-for="subject in ['math', 'english', 'chinese']" 
              :key="subject"
              class="subject-stat-card"
              :style="{ borderColor: subjectColors[subject] }"
            >
              <view class="subject-header">
                <view class="subject-icon" :style="{ background: subjectColors[subject] }">
                  {{ subjectNames[subject] }}
                </view>
              </view>
              <view class="subject-data">
                <view class="data-item">
                  <view class="data-value">{{ parentStore.currentChildStudyData.filter(d => d.subject === subject).length }}</view>
                  <view class="data-label">练习天数</view>
                </view>
                <view class="data-item">
                  <view class="data-value">{{ parentStore.currentChildStudyData.filter(d => d.subject === subject).reduce((sum, d) => sum + d.completedCount, 0) }}</view>
                  <view class="data-label">完成题数</view>
                </view>
                <view class="data-item">
                  <view class="data-value">
                    {{ parentStore.currentChildStudyData.filter(d => d.subject === subject).length > 0 
                      ? Math.round(parentStore.currentChildStudyData.filter(d => d.subject === subject).reduce((sum, d) => sum + d.accuracy, 0) / parentStore.currentChildStudyData.filter(d => d.subject === subject).length)
                      : 0 }}%
                  </view>
                  <view class="data-label">平均正确率</view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="section">
          <view class="section-title">详细学习记录</view>
          <view class="record-list">
            <view 
              v-for="record in parentStore.currentChildStudyData" 
              :key="record.id"
              class="record-item"
            >
              <view class="record-subject" :style="{ background: subjectColors[record.subject] }">
                {{ subjectNames[record.subject] }}
              </view>
              <view class="record-info">
                <view class="record-date">{{ formatDate(record.date) }}</view>
                <view class="record-detail">
                  完成 {{ record.completedCount }}/{{ record.totalCount }} 题 · 正确率 {{ record.accuracy }}%
                </view>
              </view>
              <view class="record-score">{{ record.score }}分</view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="currentTab === 'reminder'" class="reminder-tab">
        <view class="add-btn" @click="showAddReminderModal = true">
          <text class="add-icon">+</text>
          添加提醒
        </view>

        <view class="reminder-list">
          <view 
            v-for="reminder in parentStore.currentChildReminders" 
            :key="reminder.id"
            class="reminder-item"
          >
            <view class="reminder-toggle" @click="toggleReminder(reminder.id)">
              <view :class="['toggle-dot', { active: reminder.enabled }]"></view>
            </view>
            <view class="reminder-info">
              <view class="reminder-title">{{ reminder.title }}</view>
              <view class="reminder-time">
                {{ reminder.time }} · 每周{{ reminder.repeatDays.map(d => weekDays[d]).join('、') }}
              </view>
            </view>
            <view class="reminder-delete" @click="deleteReminder(reminder.id)">
              删除
            </view>
          </view>
          
          <view v-if="parentStore.currentChildReminders.length === 0" class="empty-state">
            <text class="empty-icon">⏰</text>
            <text class="empty-text">暂无提醒，点击上方添加</text>
          </view>
        </view>
      </view>

      <view v-if="currentTab === 'report'" class="report-tab">
        <view class="section">
          <view class="section-title">生成学习报告</view>
          <view class="date-picker">
            <view class="date-item">
              <text class="date-label">开始日期</text>
              <input 
                class="date-input" 
                type="text" 
                placeholder="YYYY-MM-DD" 
                v-model="reportDateRange.start"
              />
            </view>
            <view class="date-separator">~</view>
            <view class="date-item">
              <text class="date-label">结束日期</text>
              <input 
                class="date-input" 
                type="text" 
                placeholder="YYYY-MM-DD" 
                v-model="reportDateRange.end"
              />
            </view>
          </view>
          <view class="generate-btn" @click="handleGenerateReport">生成报告</view>
        </view>

        <view class="section">
          <view class="section-title">历史报告</view>
          <view class="report-list">
            <view 
              v-for="report in parentStore.currentChildReports" 
              :key="report.id"
              class="report-item"
              @click="showReportModal = true"
            >
              <view class="report-date-range">
                {{ formatDate(report.startDate) }} - {{ formatDate(report.endDate) }}
              </view>
              <view class="report-summary">
                <view class="summary-item">
                  <view class="summary-value">{{ report.studyDays }}/{{ report.totalDays }}</view>
                  <view class="summary-label">学习天数</view>
                </view>
                <view class="summary-item">
                  <view class="summary-value">{{ report.accuracy }}%</view>
                  <view class="summary-label">正确率</view>
                </view>
                <view class="summary-item">
                  <view class="summary-value">{{ report.totalQuestions }}</view>
                  <view class="summary-label">总题数</view>
                </view>
              </view>
            </view>
            
            <view v-if="parentStore.currentChildReports.length === 0" class="empty-state">
              <text class="empty-icon">📊</text>
              <text class="empty-text">暂无报告，生成第一个报告吧</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="showVerifyModal" class="modal-mask" @click="showVerifyModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <view class="modal-title">家长验证</view>
          <view class="modal-close" @click="showVerifyModal = false">✕</view>
        </view>
        <view class="modal-body">
          <text class="verify-hint">请输入6位验证码进行家长身份验证</text>
          <input 
            class="verify-input" 
            type="number" 
            maxlength="6" 
            placeholder="请输入验证码"
            v-model="verifyCode"
          />
          <text class="verify-tip">提示：输入任意6位数字即可体验</text>
        </view>
        <view class="modal-footer">
          <view class="modal-btn primary" @click="handleVerify">验证</view>
        </view>
      </view>
    </view>

    <view v-if="showChildSwitchModal" class="modal-mask" @click="showChildSwitchModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <view class="modal-title">选择孩子</view>
          <view class="modal-close" @click="showChildSwitchModal = false">✕</view>
        </view>
        <view class="modal-body">
          <view class="child-list">
            <view 
              v-for="child in parentStore.children" 
              :key="child.id"
              :class="['child-option', { active: child.id === parentStore.currentChildId }]"
              @click="handleSwitchChild(child.id)"
            >
              <image class="child-option-avatar" :src="child.avatar" mode="aspectFill" />
              <view class="child-option-info">
                <view class="child-option-name">{{ child.nickname }}</view>
                <view class="child-option-grade">{{ gradeOptions.find(g => g.value === child.grade)?.label }}</view>
              </view>
              <view v-if="child.id === parentStore.currentChildId" class="child-option-check">✓</view>
            </view>
            <view class="add-child-option" @click="showAddChildModal = true; showChildSwitchModal = false;">
              <view class="add-child-icon">+</view>
              <text class="add-child-text">添加孩子</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="showAddChildModal" class="modal-mask" @click="showAddChildModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <view class="modal-title">添加孩子</view>
          <view class="modal-close" @click="showAddChildModal = false">✕</view>
        </view>
        <view class="modal-body">
          <view class="form-item">
            <text class="form-label">昵称</text>
            <input class="form-input" placeholder="请输入昵称" v-model="newChild.nickname" />
          </view>
          <view class="form-item">
            <text class="form-label">年级</text>
            <picker 
              mode="selector" 
              :range="gradeOptions" 
              range-key="label"
              @change="(e: any) => newChild.grade = gradeOptions[e.detail.value].value"
            >
              <view class="picker-input">
                {{ gradeOptions.find(g => g.value === newChild.grade)?.label || '请选择年级' }}
              </view>
            </picker>
          </view>
        </view>
        <view class="modal-footer">
          <view class="modal-btn" @click="showAddChildModal = false">取消</view>
          <view class="modal-btn primary" @click="handleAddChild">添加</view>
        </view>
      </view>
    </view>

    <view v-if="showAddReminderModal" class="modal-mask" @click="showAddReminderModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <view class="modal-title">添加提醒</view>
          <view class="modal-close" @click="showAddReminderModal = false">✕</view>
        </view>
        <view class="modal-body">
          <view class="form-item">
            <text class="form-label">提醒标题</text>
            <input class="form-input" placeholder="例如：该学习了" v-model="newReminder.title" />
          </view>
          <view class="form-item">
            <text class="form-label">提醒时间</text>
            <input class="form-input" placeholder="例如：18:00" v-model="newReminder.time" />
          </view>
          <view class="form-item">
            <text class="form-label">重复日期</text>
            <view class="week-days">
              <view 
                v-for="(day, index) in weekDays" 
                :key="index"
                :class="['week-day', { active: newReminder.repeatDays.includes(index) }]"
                @click="toggleWeekDay(index)"
              >
                {{ day }}
              </view>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <view class="modal-btn" @click="showAddReminderModal = false">取消</view>
          <view class="modal-btn primary" @click="handleAddReminder">添加</view>
        </view>
      </view>
    </view>

    <view v-if="showReportModal" class="modal-mask fullscreen" @click="showReportModal = false">
      <view class="modal-content fullscreen" @click.stop>
        <view class="modal-header">
          <view class="modal-title">学习报告</view>
          <view class="modal-close" @click="showReportModal = false">✕</view>
        </view>
        <scroll-view class="modal-body" scroll-y>
          <view v-if="parentStore.currentChildReports.length > 0" class="report-detail">
            <view class="report-detail-header">
              <view class="report-detail-date">
                {{ formatDate(parentStore.currentChildReports[parentStore.currentChildReports.length - 1].startDate) }} - 
                {{ formatDate(parentStore.currentChildReports[parentStore.currentChildReports.length - 1].endDate) }}
              </view>
            </view>
            
            <view class="report-detail-stats">
              <view class="report-stat-item">
                <view class="report-stat-value">{{ parentStore.currentChildReports[parentStore.currentChildReports.length - 1].studyDays }}</view>
                <view class="report-stat-label">学习天数</view>
              </view>
              <view class="report-stat-item">
                <view class="report-stat-value">{{ parentStore.currentChildReports[parentStore.currentChildReports.length - 1].totalQuestions }}</view>
                <view class="report-stat-label">总题数</view>
              </view>
              <view class="report-stat-item">
                <view class="report-stat-value">{{ parentStore.currentChildReports[parentStore.currentChildReports.length - 1].correctQuestions }}</view>
                <view class="report-stat-label">正确题数</view>
              </view>
              <view class="report-stat-item">
                <view class="report-stat-value">{{ parentStore.currentChildReports[parentStore.currentChildReports.length - 1].accuracy }}%</view>
                <view class="report-stat-label">正确率</view>
              </view>
            </view>

            <view class="report-section">
              <view class="report-section-title">各科目统计</view>
              <view class="subject-report-list">
                <view 
                  v-for="stat in parentStore.currentChildReports[parentStore.currentChildReports.length - 1].subjectStats" 
                  :key="stat.subject"
                  class="subject-report-item"
                >
                  <view class="subject-report-name" :style="{ background: subjectColors[stat.subject] }">
                    {{ subjectNames[stat.subject] }}
                  </view>
                  <view class="subject-report-data">
                    <view class="subject-report-data-item">
                      <text class="data-value">{{ stat.completedCount }}</text>
                      <text class="data-label">题</text>
                    </view>
                    <view class="subject-report-data-item">
                      <text class="data-value">{{ stat.accuracy }}%</text>
                      <text class="data-label">正确率</text>
                    </view>
                    <view class="subject-report-data-item">
                      <text class="data-value">{{ stat.timeSpent }}</text>
                      <text class="data-label">分钟</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.parent-center {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20rpx 30rpx 30rpx;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.header-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
}

.child-selector {
  display: flex;
  align-items: center;
  gap: 12rpx;
  background: rgba(255, 255, 255, 0.2);
  padding: 12rpx 20rpx;
  border-radius: 40rpx;
}

.child-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #ddd;
}

.child-name {
  font-size: 28rpx;
  color: #fff;
}

.arrow {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.7);
}

.tabs {
  display: flex;
  gap: 20rpx;
}

.tab {
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.tab.active {
  background: #fff;
  color: #667eea;
  font-weight: 600;
}

.content {
  padding: 30rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.stat-card {
  background: #fff;
  padding: 40rpx 30rpx;
  border-radius: 20rpx;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 48rpx;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 30rpx;
}

.chart-container {
  padding: 20rpx 0;
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 240rpx;
}

.chart-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-wrapper {
  width: 40rpx;
  height: 200rpx;
  background: #f0f0f0;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  transition: height 0.5s;
}

.bar-label {
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #999;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
}

.record-subject {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.record-info {
  flex: 1;
  min-width: 0;
}

.record-date {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.record-detail {
  font-size: 24rpx;
  color: #999;
}

.record-score {
  font-size: 32rpx;
  font-weight: 700;
  color: #667eea;
  flex-shrink: 0;
}

.subject-stats {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.subject-stat-card {
  padding: 30rpx;
  border-radius: 16rpx;
  border: 2rpx solid;
}

.subject-header {
  margin-bottom: 24rpx;
}

.subject-icon {
  display: inline-flex;
  padding: 12rpx 24rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #fff;
}

.subject-data {
  display: flex;
  justify-content: space-around;
}

.data-item {
  text-align: center;
}

.data-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 8rpx;
}

.data-label {
  font-size: 24rpx;
  color: #999;
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 30rpx;
}

.add-icon {
  font-size: 36rpx;
  font-weight: 300;
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.reminder-toggle {
  padding: 8rpx;
}

.toggle-dot {
  width: 48rpx;
  height: 28rpx;
  background: #ddd;
  border-radius: 14rpx;
  position: relative;
  transition: all 0.3s;

  &::after {
    content: '';
    position: absolute;
    width: 24rpx;
    height: 24rpx;
    background: #fff;
    border-radius: 50%;
    top: 2rpx;
    left: 2rpx;
    transition: all 0.3s;
  }

  &.active {
    background: #667eea;

    &::after {
      left: 22rpx;
    }
  }
}

.reminder-info {
  flex: 1;
}

.reminder-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.reminder-time {
  font-size: 24rpx;
  color: #999;
}

.reminder-delete {
  padding: 12rpx 20rpx;
  color: #ff4d4f;
  font-size: 24rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 40rpx;
  gap: 20rpx;
}

.empty-icon {
  font-size: 80rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.date-picker {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.date-item {
  flex: 1;
}

.date-label {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 12rpx;
}

.date-input {
  width: 100%;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.date-separator {
  font-size: 32rpx;
  color: #999;
  margin-top: 30rpx;
}

.generate-btn {
  padding: 24rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  text-align: center;
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}

.report-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.report-item {
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
}

.report-date-range {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.report-summary {
  display: flex;
  justify-content: space-around;
}

.summary-item {
  text-align: center;
}

.summary-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8rpx;
}

.summary-label {
  font-size: 24rpx;
  color: #999;
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s;

  &.fullscreen {
    align-items: stretch;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  width: 100%;
  background: #fff;
  border-radius: 40rpx 40rpx 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s;

  &.fullscreen {
    border-radius: 0;
    max-height: 100vh;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
  line-height: 1;
}

.modal-body {
  flex: 1;
  padding: 30rpx;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.modal-btn {
  flex: 1;
  padding: 24rpx;
  text-align: center;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  background: #f0f0f0;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
  }
}

.verify-hint {
  display: block;
  text-align: center;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 30rpx;
}

.verify-input {
  width: 100%;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  font-size: 36rpx;
  text-align: center;
  letter-spacing: 8rpx;
  margin-bottom: 20rpx;
}

.verify-tip {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #999;
}

.child-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.child-option {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  position: relative;
}

.child-option.active {
  background: #f0f3ff;
  border: 2rpx solid #667eea;
}

.child-option-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #ddd;
  flex-shrink: 0;
}

.child-option-info {
  flex: 1;
}

.child-option-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.child-option-grade {
  font-size: 24rpx;
  color: #999;
}

.child-option-check {
  width: 40rpx;
  height: 40rpx;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24rpx;
  font-weight: 600;
}

.add-child-option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 30rpx;
  border: 2rpx dashed #ddd;
  border-radius: 16rpx;
}

.add-child-icon {
  width: 48rpx;
  height: 48rpx;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #999;
  font-weight: 300;
}

.add-child-text {
  font-size: 28rpx;
  color: #666;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
}

.form-input {
  width: 100%;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.picker-input {
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333;
}

.week-days {
  display: flex;
  gap: 16rpx;
}

.week-day {
  flex: 1;
  padding: 16rpx;
  text-align: center;
  background: #f0f0f0;
  border-radius: 12rpx;
  font-size: 24rpx;
  color: #666;
  transition: all 0.3s;

  &.active {
    background: #667eea;
    color: #fff;
  }
}

.report-detail {
  padding-bottom: 40rpx;
}

.report-detail-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.report-detail-date {
  font-size: 28rpx;
  color: #666;
}

.report-detail-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.report-stat-item {
  padding: 30rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  text-align: center;
}

.report-stat-value {
  font-size: 40rpx;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8rpx;
}

.report-stat-label {
  font-size: 24rpx;
  color: #999;
}

.report-section {
  margin-bottom: 40rpx;
}

.report-section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.subject-report-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.subject-report-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.subject-report-name {
  padding: 12rpx 20rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.subject-report-data {
  flex: 1;
  display: flex;
  justify-content: space-around;
}

.subject-report-data-item {
  text-align: center;
}
</style>
