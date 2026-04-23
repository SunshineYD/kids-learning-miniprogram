import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { StudyReportState, StudyReportData, AbilityScore, WeaknessItem } from '@/types'
import { storage } from '@/utils/storage'
import { useCheckInStore } from './check-in'
import { useWrongQuestionsStore } from './wrong-questions'

const STORAGE_KEY = 'study_report'

function getTodayDate(): string {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function getWeekDates(): { start: string; end: string } {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(today.setDate(diff))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return {
    start: `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`,
    end: `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`
  }
}

function getMonthDates(): { start: string; end: string } {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  return {
    start: `${firstDay.getFullYear()}-${String(firstDay.getMonth() + 1).padStart(2, '0')}-${String(firstDay.getDate()).padStart(2, '0')}`,
    end: `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`
  }
}

export const useStudyReportStore = defineStore('study-report', () => {
  const state = ref<StudyReportState>({
    currentReport: null,
    reportHistory: [],
    loading: false
  })

  const hasReport = computed(() => !!state.value.currentReport)

  function loadFromStorage() {
    const saved = storage.get<StudyReportState>(STORAGE_KEY)
    if (saved) {
      state.value = { ...state.value, ...saved }
    }
  }

  function saveToStorage() {
    storage.set(STORAGE_KEY, state.value)
  }

  function generateReport(): StudyReportData {
    const checkInStore = useCheckInStore()
    const wrongQuestionsStore = useWrongQuestionsStore()
    const weekDates = getWeekDates()
    const monthDates = getMonthDates()

    const weeklyWeaknesses: WeaknessItem[] = generateWeaknesses(wrongQuestionsStore.state.questions, 'weekly')
    const monthlyWeaknesses: WeaknessItem[] = generateWeaknesses(wrongQuestionsStore.state.questions, 'monthly')

    const abilityScores: AbilityScore[] = [
      { subject: 'math', score: 85, maxScore: 100, trend: 'up' },
      { subject: 'english', score: 78, maxScore: 100, trend: 'stable' },
      { subject: 'chinese', score: 90, maxScore: 100, trend: 'up' }
    ]

    const dailyRecords = generateDailyRecords()

    const totalQuestions = dailyRecords.reduce((sum, r) => sum + r.questions, 0)
    const correctCount = dailyRecords.reduce((sum, r) => sum + r.correct, 0)
    const totalStudyTime = dailyRecords.reduce((sum, r) => sum + r.studyTime, 0)
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

    const report: StudyReportData = {
      period: {
        daily: getTodayDate(),
        weekly: `${weekDates.start} ~ ${weekDates.end}`,
        monthly: `${monthDates.start} ~ ${monthDates.end}`
      },
      totalStudyTime,
      totalQuestions,
      correctCount,
      accuracy,
      checkInDays: checkInStore.state.streakDays,
      checkInStreak: checkInStore.state.streakDays,
      abilityScores,
      weeklyWeaknesses,
      monthlyWeaknesses,
      dailyRecords
    }

    return report
  }

  function generateWeaknesses(questions: any[], period: 'weekly' | 'monthly'): WeaknessItem[] {
    const weaknesses: WeaknessItem[] = []
    const types = ['addition', 'subtraction', 'multiplication', 'division', 'word', 'reading', 'poem']
    const subjects = ['math', 'english', 'chinese'] as const

    subjects.forEach(subject => {
      types.forEach(type => {
        const subjectQuestions = questions.filter(q => q.subject === subject)
        const total = Math.floor(Math.random() * 20) + 5
        const wrongCount = Math.floor(Math.random() * total)
        const errorRate = total > 0 ? Math.round((wrongCount / total) * 100) : 0

        if (errorRate > 30) {
          weaknesses.push({
            id: `weak_${subject}_${type}`,
            subject,
            type,
            name: getTypeName(subject, type),
            errorRate,
            wrongCount,
            totalCount: total,
            suggestions: getSuggestions(subject, type)
          })
        }
      })
    })

    return weaknesses.sort((a, b) => b.errorRate - a.errorRate).slice(0, 5)
  }

  function getTypeName(subject: string, type: string): string {
    const names: Record<string, Record<string, string>> = {
      math: {
        addition: '加法运算',
        subtraction: '减法运算',
        multiplication: '乘法运算',
        division: '除法运算'
      },
      english: {
        word: '单词拼写',
        reading: '阅读理解'
      },
      chinese: {
        poem: '古诗背诵',
        reading: '阅读理解',
        word: '字词掌握'
      }
    }
    return names[subject]?.[type] || type
  }

  function getSuggestions(subject: string, type: string): string[] {
    const suggestions: Record<string, Record<string, string[]>> = {
      math: {
        addition: ['多做进位加法练习', '使用竖式计算', '每天练习10道题'],
        subtraction: ['注意借位规则', '多做退位减法练习', '检查计算结果'],
        multiplication: ['熟记乘法口诀表', '多做乘法练习', '注意位数对齐'],
        division: ['理解除法概念', '多做除法练习', '注意余数处理']
      },
      english: {
        word: ['每天背诵10个单词', '使用艾宾浩斯记忆法', '多做拼写练习'],
        reading: ['多读英语文章', '积累词汇量', '做阅读理解练习']
      },
      chinese: {
        poem: ['每天背诵一首古诗', '理解诗意', '多写多练'],
        reading: ['多读课文', '理解文章内容', '做阅读练习'],
        word: ['多写多练', '注意字形结构', '积累词汇量']
      }
    }
    return suggestions[subject]?.[type] || ['多加练习', '注意总结错题', '保持学习习惯']
  }

  function generateDailyRecords() {
    const records = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      records.push({
        date: dateStr,
        studyTime: Math.floor(Math.random() * 60) + 10,
        questions: Math.floor(Math.random() * 30) + 5,
        correct: Math.floor(Math.random() * 25) + 5
      })
    }

    return records
  }

  async function refreshReport() {
    state.value.loading = true
    try {
      const report = generateReport()
      state.value.currentReport = report

      const existingIndex = state.value.reportHistory.findIndex(
        r => r.period.daily === report.period.daily
      )
      if (existingIndex >= 0) {
        state.value.reportHistory[existingIndex] = report
      } else {
        state.value.reportHistory.push(report)
      }

      saveToStorage()
    } catch (error) {
      console.error('生成报告失败:', error)
    } finally {
      state.value.loading = false
    }
  }

  function getReportByDate(date: string) {
    return state.value.reportHistory.find(r => r.period.daily === date)
  }

  function exportReport() {
    if (!state.value.currentReport) return

    const report = state.value.currentReport
    const content = `
学习报告 - ${report.period.daily}
================================
学习时长: ${report.totalStudyTime}分钟
答题总数: ${report.totalQuestions}
正确数量: ${report.correctCount}
正确率: ${report.accuracy}%
连续打卡: ${report.checkInStreak}天

能力评分:
${report.abilityScores.map(s => `- ${s.subject}: ${s.score}/${s.maxScore}`).join('\n')}

本周薄弱环节:
${report.weeklyWeaknesses.map(w => `- ${w.name}: 错误率${w.errorRate}%`).join('\n')}
    `.trim()

    uni.setClipboardData({
      data: content,
      success: () => {
        uni.showToast({
          title: '报告已复制到剪贴板',
          icon: 'success'
        })
      }
    })
  }

  function init() {
    loadFromStorage()
    if (!state.value.currentReport) {
      refreshReport()
    }
  }

  return {
    state,
    hasReport,
    refreshReport,
    getReportByDate,
    exportReport,
    init
  }
})
