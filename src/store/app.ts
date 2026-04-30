import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Grade, DailyTask, Medal, CheckInRecord, AppState, QuickNavItem } from '@/types'
import { storage } from '@/utils/storage'

const STORAGE_KEY = 'app_state'

function generateDailyTasks(grade: Grade): DailyTask[] {
  const tasks: DailyTask[] = [
    {
      id: 1,
      subject: 'chinese',
      title: '语文练习',
      description: '完成10道字词练习',
      icon: '📚',
      color: '#4ECDC4',
      completed: false,
      progress: 0,
      total: 10
    },
    {
      id: 2,
      subject: 'math',
      title: '数学练习',
      description: '完成15道口算题',
      icon: '🧮',
      color: '#FF6B6B',
      completed: false,
      progress: 8,
      total: 15
    },
    {
      id: 3,
      subject: 'english',
      title: '英语练习',
      description: '背诵8个新单词',
      icon: '🎵',
      color: '#FFE66D',
      completed: true,
      progress: 8,
      total: 8
    }
  ]
  return tasks
}

function generateMedals(): Medal[] {
  return [
    { id: 1, name: '初学乍练', icon: '🌱', description: '连续打卡3天', unlocked: true },
    { id: 2, name: '坚持不懈', icon: '⭐', description: '连续打卡7天', unlocked: false },
    { id: 3, name: '学习达人', icon: '🏆', description: '连续打卡30天', unlocked: false },
    { id: 4, name: '学霸之星', icon: '👑', description: '连续打卡100天', unlocked: false }
  ]
}

export const quickNavItems: QuickNavItem[] = [
  { id: 1, name: '口算练习', icon: '🧮', color: '#FF6B6B', path: '/pages/math-practice/math-practice' },
  { id: 2, name: '单词背诵', icon: '🎵', color: '#FFE66D', path: '/pages/english/english' },
  { id: 3, name: '语文巩固', icon: '📚', color: '#4ECDC4', path: '/pages/chinese-practice/chinese-practice' },
  { id: 4, name: '错题本', icon: '📝', color: '#AA96DA', path: '/pages/wrong/wrong' },
  { id: 5, name: '学习报告', icon: '📊', color: '#95E1D3', path: '/pages/report/report' },
  { id: 6, name: '排行榜', icon: '🏅', color: '#FCBAD3', path: '/pages/ranking/ranking' }
]

export const useAppStore = defineStore('app', () => {
  const currentGrade = ref<Grade>(1)
  const dailyTasks = ref<DailyTask[]>(generateDailyTasks(1))
  const checkInDays = ref(0)
  const checkInRecords = ref<CheckInRecord[]>([])
  const medals = ref<Medal[]>(generateMedals())
  const lastCheckInDate = ref<string | null>(null)

  const gradeName = computed(() => {
    const names = ['', '一年级', '二年级', '三年级', '四年级']
    return names[currentGrade.value] || '一年级'
  })

  const todayDate = computed(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })

  const isCheckedInToday = computed(() => {
    return lastCheckInDate.value === todayDate.value
  })

  const completedTasks = computed(() => {
    return dailyTasks.value.filter(t => t.completed).length
  })

  const totalTasks = computed(() => {
    return dailyTasks.value.length
  })

  function saveToStorage() {
    const state: AppState = {
      currentGrade: currentGrade.value,
      dailyTasks: dailyTasks.value,
      checkInDays: checkInDays.value,
      checkInRecords: checkInRecords.value,
      medals: medals.value,
      lastCheckInDate: lastCheckInDate.value
    }
    storage.set(STORAGE_KEY, state)
  }

  function loadFromStorage() {
    const saved = storage.get<AppState>(STORAGE_KEY)
    if (saved) {
      currentGrade.value = saved.currentGrade
      checkInDays.value = saved.checkInDays
      checkInRecords.value = saved.checkInRecords
      medals.value = saved.medals
      lastCheckInDate.value = saved.lastCheckInDate

      const savedDate = saved.lastCheckInDate
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

      if (savedDate !== todayDate.value && savedDate !== yesterdayStr) {
        dailyTasks.value = generateDailyTasks(currentGrade.value)
      } else {
        dailyTasks.value = saved.dailyTasks
      }
    }
  }

  function setGrade(grade: Grade) {
    currentGrade.value = grade
    dailyTasks.value = generateDailyTasks(grade)
    saveToStorage()
  }

  function updateTaskProgress(taskId: number, progress: number) {
    const task = dailyTasks.value.find(t => t.id === taskId)
    if (task) {
      task.progress = progress
      task.completed = progress >= task.total
      saveToStorage()
    }
  }

  function completeTask(taskId: number) {
    const task = dailyTasks.value.find(t => t.id === taskId)
    if (task) {
      task.progress = task.total
      task.completed = true
      saveToStorage()
    }
  }

  function checkIn(): boolean {
    if (isCheckedInToday.value) {
      return false
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

    if (lastCheckInDate.value === yesterdayStr) {
      checkInDays.value++
    } else {
      checkInDays.value = 1
    }

    lastCheckInDate.value = todayDate.value

    checkInRecords.value.push({
      date: todayDate.value,
      completed: true
    })

    updateMedals()
    saveToStorage()
    return true
  }

  function updateMedals() {
    if (checkInDays.value >= 3) {
      const medal = medals.value.find(m => m.id === 2)
      if (medal) medal.unlocked = true
    }
    if (checkInDays.value >= 7) {
      const medal = medals.value.find(m => m.id === 3)
      if (medal) medal.unlocked = true
    }
    if (checkInDays.value >= 30) {
      const medal = medals.value.find(m => m.id === 4)
      if (medal) medal.unlocked = true
    }
  }

  function init() {
    loadFromStorage()
  }

  return {
    currentGrade,
    dailyTasks,
    checkInDays,
    checkInRecords,
    medals,
    lastCheckInDate,
    gradeName,
    isCheckedInToday,
    completedTasks,
    totalTasks,
    quickNavItems,
    setGrade,
    updateTaskProgress,
    completeTask,
    checkIn,
    init
  }
})
