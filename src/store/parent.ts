import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChildAccount, StudyData, CustomReminder, StudyReport, ParentState } from '@/types'
import { storage } from '@/utils/storage'

const STORAGE_KEYS = {
  PARENT_STATE: 'parent_state',
  VERIFICATION_CODE: 'parent_verification_code'
}

export const useParentStore = defineStore('parent', () => {
  const isVerified = ref(false)
  const children = ref<ChildAccount[]>([])
  const currentChildId = ref<number | null>(null)
  const studyData = ref<StudyData[]>([])
  const reminders = ref<CustomReminder[]>([])
  const reports = ref<StudyReport[]>([])
  const isLoading = ref(false)

  const currentChild = computed(() => {
    if (!currentChildId.value) return null
    return children.value.find(c => c.id === currentChildId.value) || null
  })

  const currentChildStudyData = computed(() => {
    if (!currentChildId.value) return []
    return studyData.value.filter(d => d.childId === currentChildId.value)
  })

  const currentChildReminders = computed(() => {
    if (!currentChildId.value) return []
    return reminders.value.filter(r => r.childId === currentChildId.value)
  })

  const currentChildReports = computed(() => {
    if (!currentChildId.value) return []
    return reports.value.filter(r => r.childId === currentChildId.value)
  })

  function saveToStorage() {
    const state: ParentState = {
      isVerified: isVerified.value,
      children: children.value,
      currentChildId: currentChildId.value,
      studyData: studyData.value,
      reminders: reminders.value,
      reports: reports.value
    }
    storage.set(STORAGE_KEYS.PARENT_STATE, state)
  }

  function loadFromStorage() {
    const savedState = storage.get<ParentState>(STORAGE_KEYS.PARENT_STATE)
    if (savedState) {
      isVerified.value = savedState.isVerified
      children.value = savedState.children
      currentChildId.value = savedState.currentChildId
      studyData.value = savedState.studyData
      reminders.value = savedState.reminders
      reports.value = savedState.reports
    }
  }

  async function verifyParent(code: string): Promise<boolean> {
    isLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (code === '123456' || code.length === 6) {
        isVerified.value = true
        storage.set(STORAGE_KEYS.VERIFICATION_CODE, code)
        saveToStorage()
        return true
      }
      return false
    } catch (error) {
      console.error('验证失败:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function addChild(childData: Omit<ChildAccount, 'id' | 'parentId' | 'createdAt'>): Promise<ChildAccount | null> {
    isLoading.value = true
    try {
      const newChild: ChildAccount = {
        ...childData,
        id: Date.now(),
        parentId: 0,
        createdAt: Date.now()
      }
      children.value.push(newChild)
      
      if (children.value.length === 1) {
        currentChildId.value = newChild.id
      }
      
      saveToStorage()
      return newChild
    } catch (error) {
      console.error('添加孩子失败:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  function switchChild(childId: number) {
    const child = children.value.find(c => c.id === childId)
    if (child) {
      currentChildId.value = childId
      saveToStorage()
    }
  }

  function updateChild(childId: number, updates: Partial<ChildAccount>) {
    const index = children.value.findIndex(c => c.id === childId)
    if (index >= 0) {
      children.value[index] = { ...children.value[index], ...updates }
      saveToStorage()
    }
  }

  function removeChild(childId: number) {
    children.value = children.value.filter(c => c.id !== childId)
    studyData.value = studyData.value.filter(d => d.childId !== childId)
    reminders.value = reminders.value.filter(r => r.childId !== childId)
    reports.value = reports.value.filter(r => r.childId !== childId)
    
    if (currentChildId.value === childId) {
      currentChildId.value = children.value.length > 0 ? children.value[0].id : null
    }
    
    saveToStorage()
  }

  async function addStudyData(data: Omit<StudyData, 'id'>): Promise<StudyData | null> {
    try {
      const newData: StudyData = {
        ...data,
        id: Date.now().toString()
      }
      studyData.value.push(newData)
      saveToStorage()
      return newData
    } catch (error) {
      console.error('添加学习数据失败:', error)
      return null
    }
  }

  async function addReminder(reminder: Omit<CustomReminder, 'id'>): Promise<CustomReminder | null> {
    try {
      const newReminder: CustomReminder = {
        ...reminder,
        id: Date.now()
      }
      reminders.value.push(newReminder)
      saveToStorage()
      return newReminder
    } catch (error) {
      console.error('添加提醒失败:', error)
      return null
    }
  }

  function updateReminder(reminderId: number, updates: Partial<CustomReminder>) {
    const index = reminders.value.findIndex(r => r.id === reminderId)
    if (index >= 0) {
      reminders.value[index] = { ...reminders.value[index], ...updates }
      saveToStorage()
    }
  }

  function removeReminder(reminderId: number) {
    reminders.value = reminders.value.filter(r => r.id !== reminderId)
    saveToStorage()
  }

  async function generateReport(childId: number, startDate: string, endDate: string): Promise<StudyReport | null> {
    isLoading.value = true
    try {
      const childStudyData = studyData.value.filter(d => 
        d.childId === childId && 
        d.date >= startDate && 
        d.date <= endDate
      )

      const subjectStatsMap = new Map<string, { completedCount: number; accuracy: number; timeSpent: number; totalAccuracy: number }>()
      const dailyStatsMap = new Map<string, { completedCount: number; accuracy: number; totalAccuracy: number }>()

      childStudyData.forEach(data => {
        const subjectStat = subjectStatsMap.get(data.subject) || { completedCount: 0, accuracy: 0, timeSpent: 0, totalAccuracy: 0 }
        subjectStat.completedCount += data.completedCount
        subjectStat.totalAccuracy += data.accuracy
        subjectStat.timeSpent += data.timeSpent
        subjectStatsMap.set(data.subject, subjectStat)

        const dailyStat = dailyStatsMap.get(data.date) || { completedCount: 0, accuracy: 0, totalAccuracy: 0 }
        dailyStat.completedCount += data.completedCount
        dailyStat.totalAccuracy += data.accuracy
        dailyStatsMap.set(data.date, dailyStat)
      })

      const subjectStats = Array.from(subjectStatsMap.entries()).map(([subject, stat]) => ({
        subject: subject as any,
        completedCount: stat.completedCount,
        accuracy: stat.completedCount > 0 ? Math.round(stat.totalAccuracy / stat.completedCount) : 0,
        timeSpent: stat.timeSpent
      }))

      const dailyStats = Array.from(dailyStatsMap.entries()).map(([date, stat]) => ({
        date,
        completedCount: stat.completedCount,
        accuracy: stat.completedCount > 0 ? Math.round(stat.totalAccuracy / stat.completedCount) : 0
      }))

      const totalQuestions = childStudyData.reduce((sum, d) => sum + d.totalCount, 0)
      const correctQuestions = childStudyData.reduce((sum, d) => sum + Math.round(d.totalCount * d.accuracy / 100), 0)
      const studyDays = new Set(childStudyData.map(d => d.date)).size
      const totalDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1

      const report: StudyReport = {
        id: Date.now().toString(),
        childId,
        startDate,
        endDate,
        totalDays,
        studyDays,
        totalQuestions,
        correctQuestions,
        accuracy: totalQuestions > 0 ? Math.round(correctQuestions / totalQuestions * 100) : 0,
        subjectStats,
        dailyStats
      }

      reports.value.push(report)
      saveToStorage()
      return report
    } catch (error) {
      console.error('生成报告失败:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  function init() {
    loadFromStorage()
    
    if (children.value.length === 0) {
      children.value = [
        {
          id: 1,
          nickname: '小明',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming',
          grade: 2,
          parentId: 0,
          createdAt: Date.now()
        }
      ]
      currentChildId.value = 1
      
      const today = new Date()
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        if (Math.random() > 0.3) {
          const subjects: any[] = ['math', 'english', 'chinese']
          subjects.forEach(subject => {
            if (Math.random() > 0.4) {
              const completedCount = Math.floor(Math.random() * 30) + 10
              const totalCount = completedCount + Math.floor(Math.random() * 10)
              studyData.value.push({
                id: `data_${i}_${subject}`,
                childId: 1,
                date: dateStr,
                subject,
                completedCount,
                totalCount,
                accuracy: Math.floor(Math.random() * 30) + 70,
                timeSpent: Math.floor(Math.random() * 30) + 10,
                score: Math.floor(Math.random() * 50) + 50
              })
            }
          })
        }
      }
      
      saveToStorage()
    }
  }

  return {
    isVerified,
    children,
    currentChildId,
    studyData,
    reminders,
    reports,
    isLoading,
    currentChild,
    currentChildStudyData,
    currentChildReminders,
    currentChildReports,
    verifyParent,
    addChild,
    switchChild,
    updateChild,
    removeChild,
    addStudyData,
    addReminder,
    updateReminder,
    removeReminder,
    generateReport,
    init
  }
})
