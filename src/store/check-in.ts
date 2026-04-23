import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CheckInState, CheckInRecord, CheckInTask, CheckInSubject } from '@/types'
import { storage } from '@/utils/storage'
import { useUserStore } from './user'

const STORAGE_KEY = 'check_in'

function getTodayDate(): string {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function isHoliday(date: string): boolean {
  const d = new Date(date)
  const day = d.getDay()
  return day === 0 || day === 6
}

function createDefaultTasks(): CheckInTask[] {
  return [
    { id: 'math', subject: 'math', name: '口算练习', icon: '🧮', color: '#FF6B6B', completed: false },
    { id: 'english', subject: 'english', name: '单词背诵', icon: '📚', color: '#FFE66D', completed: false },
    { id: 'chinese', subject: 'chinese', name: '语文巩固', icon: '📝', color: '#4ECDC4', completed: false }
  ]
}

export const useCheckInStore = defineStore('check-in', () => {
  const state = ref<CheckInState>({
    todayRecord: null,
    historyRecords: [],
    streakDays: 0,
    maxStreakDays: 0,
    totalPoints: 0,
    usedSupplementCount: 0,
    maxSupplementCount: 3,
    streakRewards: [
      { days: 7, points: 50, name: '一周达人', icon: '🏆' },
      { days: 14, points: 100, name: '两周坚持', icon: '🌟' },
      { days: 30, points: 200, name: '月度冠军', icon: '👑' },
      { days: 60, points: 500, name: '百日之星', icon: '🎖️' },
      { days: 100, points: 1000, name: '学习王者', icon: '💎' }
    ]
  })

  const todayDate = computed(() => getTodayDate())

  const todayCompletedCount = computed(() => {
    if (!state.value.todayRecord) return 0
    return state.value.todayRecord.completedCount
  })

  const todayIsCompleted = computed(() => {
    return state.value.todayRecord?.isCompleted || false
  })

  const canSupplement = computed(() => {
    return state.value.usedSupplementCount < state.value.maxSupplementCount
  })

  const availableRewards = computed(() => {
    return state.value.streakRewards.filter(r => state.value.streakDays >= r.days)
  })

  const nextReward = computed(() => {
    return state.value.streakRewards.find(r => state.value.streakDays < r.days)
  })

  function loadFromStorage() {
    const saved = storage.get<CheckInState>(STORAGE_KEY)
    if (saved) {
      state.value = { ...state.value, ...saved }
    }
    initTodayRecord()
  }

  function saveToStorage() {
    storage.set(STORAGE_KEY, state.value)
  }

  function initTodayRecord() {
    const today = getTodayDate()
    const existingToday = state.value.historyRecords.find(r => r.date === today)

    if (existingToday) {
      state.value.todayRecord = existingToday
    } else {
      const tasks = createDefaultTasks()
      const holiday = isHoliday(today)
      state.value.todayRecord = {
        date: today,
        tasks,
        completedCount: 0,
        isCompleted: false,
        isHoliday: holiday,
        holidayBonus: holiday ? 20 : 0
      }
      state.value.historyRecords.push(state.value.todayRecord)
    }
    saveToStorage()
  }

  function completeTask(subject: CheckInSubject) {
    if (!state.value.todayRecord) return

    const task = state.value.todayRecord.tasks.find(t => t.subject === subject)
    if (task && !task.completed) {
      task.completed = true
      task.completedTime = Date.now()
      state.value.todayRecord.completedCount++

      if (state.value.todayRecord.completedCount >= 2) {
        state.value.todayRecord.isCompleted = true
        handleCheckInComplete()
      }

      saveToStorage()
    }
  }

  function handleCheckInComplete() {
    const userStore = useUserStore()
    let points = 10

    if (state.value.todayRecord?.isHoliday && state.value.todayRecord.holidayBonus) {
      points += state.value.todayRecord.holidayBonus
    }

    calculateStreak()
    state.value.totalPoints += points
    userStore.updatePoints(points)

    checkStreakRewards()
  }

  function calculateStreak() {
    const sortedRecords = [...state.value.historyRecords]
      .filter(r => r.isCompleted)
      .sort((a, b) => b.date.localeCompare(a.date))

    if (sortedRecords.length === 0) {
      state.value.streakDays = 0
      return
    }

    let streak = 1
    let prevDate = new Date(sortedRecords[0].date)

    for (let i = 1; i < sortedRecords.length; i++) {
      const currentDate = new Date(sortedRecords[i].date)
      const dayDiff = (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)

      if (dayDiff === 1) {
        streak++
        prevDate = currentDate
      } else {
        break
      }
    }

    state.value.streakDays = streak
    if (streak > state.value.maxStreakDays) {
      state.value.maxStreakDays = streak
    }
  }

  function checkStreakRewards() {
    const userStore = useUserStore()
    const rewards = state.value.streakRewards.filter(r => r.days === state.value.streakDays)

    rewards.forEach(reward => {
      state.value.totalPoints += reward.points
      userStore.updatePoints(reward.points)
      uni.showToast({
        title: `恭喜获得${reward.name}！+${reward.points}积分`,
        icon: 'none',
        duration: 2000
      })
    })
  }

  function supplementCheckIn(date: string) {
    if (!canSupplement.value) {
      uni.showToast({
        title: '补签次数已用完',
        icon: 'none'
      })
      return
    }

    const record = state.value.historyRecords.find(r => r.date === date)
    if (!record || record.isCompleted) {
      uni.showToast({
        title: '该日期无需补签',
        icon: 'none'
      })
      return
    }

    uni.showModal({
      title: '分享补签',
      content: '分享给好友即可补签',
      success: (res) => {
        if (res.confirm) {
          uni.share({
            provider: 'weixin',
            scene: 'WXSceneSession',
            type: 0,
            href: '',
            title: '快来一起打卡学习吧！',
            summary: '我在少儿课后学习小程序，快来一起打卡吧',
            imageUrl: '',
            success: () => {
              record.isCompleted = true
              record.tasks.forEach(t => t.completed = true)
              record.completedCount = 3
              state.value.usedSupplementCount++
              calculateStreak()
              saveToStorage()
              uni.showToast({
                title: '补签成功！',
                icon: 'success'
              })
            },
            fail: () => {
              uni.showToast({
                title: '分享失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  }

  function getCalendarData(): { date: string; isToday: boolean; isCompleted: boolean; isHoliday: boolean }[] {
    const result = []
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const record = state.value.historyRecords.find(r => r.date === dateStr)
      result.push({
        date: dateStr,
        isToday: dateStr === getTodayDate(),
        isCompleted: record?.isCompleted || false,
        isHoliday: isHoliday(dateStr)
      })
    }
    return result
  }

  function init() {
    loadFromStorage()
  }

  return {
    state,
    todayDate,
    todayCompletedCount,
    todayIsCompleted,
    canSupplement,
    availableRewards,
    nextReward,
    completeTask,
    supplementCheckIn,
    getCalendarData,
    init
  }
})
