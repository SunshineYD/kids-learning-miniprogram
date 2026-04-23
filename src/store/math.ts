import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Grade,
  MathQuestion,
  MathQuestionType,
  MathDifficulty,
  PracticeMode,
  PracticeSession,
  WrongQuestion,
  MathPracticeRecord,
  MathState
} from '@/types'
import { storage } from '@/utils/storage'
import { generateQuestions, generateSimilarQuestions } from '@/data/math-questions'
import { useAppStore } from './app'
import { useUserStore } from './user'

const STORAGE_KEYS = {
  WRONG_QUESTIONS: 'math_wrong_questions',
  PRACTICE_RECORDS: 'math_practice_records',
  SETTINGS: 'math_settings'
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const useMathStore = defineStore('math', () => {
  const currentSession = ref<PracticeSession | null>(null)
  const wrongQuestions = ref<WrongQuestion[]>([])
  const practiceRecords = ref<MathPracticeRecord[]>([])
  const settings = ref<MathState['settings']>({
    autoNext: true,
    showAnswer: true,
    soundEnabled: true
  })
  const timerRef = ref<number | null>(null)

  const unmasteredWrongQuestions = computed(() => {
    return wrongQuestions.value.filter(q => !q.mastered)
  })

  const totalPracticesToday = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return practiceRecords.value.filter(r => r.date === today)
  })

  const correctRate = computed(() => {
    if (practiceRecords.value.length === 0) return 0
    const totalCorrect = practiceRecords.value.reduce((sum, r) => sum + r.correctCount, 0)
    const totalQuestions = practiceRecords.value.reduce((sum, r) => sum + r.totalQuestions, 0)
    return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  })

  function loadFromStorage() {
    const savedWrongQuestions = storage.get<WrongQuestion[]>(STORAGE_KEYS.WRONG_QUESTIONS, [])
    const savedRecords = storage.get<MathPracticeRecord[]>(STORAGE_KEYS.PRACTICE_RECORDS, [])
    const savedSettings = storage.get<MathState['settings']>(STORAGE_KEYS.SETTINGS, settings.value)
    wrongQuestions.value = savedWrongQuestions
    practiceRecords.value = savedRecords
    settings.value = savedSettings
  }

  function saveToStorage() {
    storage.set(STORAGE_KEYS.WRONG_QUESTIONS, wrongQuestions.value)
    storage.set(STORAGE_KEYS.PRACTICE_RECORDS, practiceRecords.value)
    storage.set(STORAGE_KEYS.SETTINGS, settings.value)
  }

  function startSession(
    grade: Grade,
    type: MathQuestionType,
    difficulty: MathDifficulty,
    mode: PracticeMode,
    questionCount: number = 10
  ) {
    const questions = generateQuestions(grade, type, difficulty, questionCount)
    const session: PracticeSession = {
      id: generateId(),
      startTime: Date.now(),
      mode,
      grade,
      type,
      difficulty,
      questions,
      currentIndex: 0,
      answers: new Map(),
      score: 0,
      totalQuestions: questions.length,
      correctCount: 0,
      timeLimit: mode === 'timed-1min' ? 60 : mode === 'timed-3min' ? 180 : undefined,
      timeRemaining: mode === 'timed-1min' ? 60 : mode === 'timed-3min' ? 180 : undefined
    }
    currentSession.value = session

    if (session.timeLimit) {
      startTimer()
    }
  }

  function startTimer() {
    if (!currentSession.value || !currentSession.value.timeLimit) return
    stopTimer()
    timerRef.value = setInterval(() => {
      if (currentSession.value) {
        currentSession.value.timeRemaining = currentSession.value.timeRemaining! - 1
        if (currentSession.value.timeRemaining <= 0) {
          endSession()
          uni.showToast({
            title: '时间到！',
            icon: 'none'
          })
        }
      }
    }, 1000) as unknown as number
  }

  function stopTimer() {
    if (timerRef.value) {
      clearInterval(timerRef.value)
      timerRef.value = null
    }
  }

  function submitAnswer(questionId: string, userAnswer: string | number, timeSpent: number) {
    if (!currentSession.value) return
    const question = currentSession.value.questions.find(q => q.id === questionId)
    if (!question) return

    const correct = String(question.answer) === String(userAnswer)

    currentSession.value.answers.set(questionId, {
      userAnswer,
      correct,
      timeSpent
    })

    if (correct) {
      currentSession.value.correctCount++
      currentSession.value.score += 10
    } else {
      addWrongQuestion(question, userAnswer, question.answer)
    }
  }

  function nextQuestion(): boolean {
    if (!currentSession.value) return false
    if (currentSession.value.currentIndex < currentSession.value.totalQuestions - 1) {
      currentSession.value.currentIndex++
      return true
    }
    endSession()
    return false
  }

  function endSession() {
    if (!currentSession.value) return
    stopTimer()
    currentSession.value.endTime = Date.now()

    const record: MathPracticeRecord = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      grade: currentSession.value.grade,
      type: currentSession.value.type,
      mode: currentSession.value.mode,
      score: currentSession.value.score,
      totalQuestions: currentSession.value.totalQuestions,
      correctCount: currentSession.value.correctCount,
      timeSpent: currentSession.value.endTime - currentSession.value.startTime
    }

    const appStore = useAppStore()
    if (appStore.checkIn()) {
      record.checkInId = generateId()
    }

    const userStore = useUserStore()
    userStore.updatePoints(record.correctCount * 2)

    practiceRecords.value.unshift(record)
    saveToStorage()
  }

  function addWrongQuestion(question: MathQuestion, wrongAnswer: string | number, correctAnswer: string | number) {
    const existingIndex = wrongQuestions.value.findIndex(wq => wq.question.id === question.id)
    if (existingIndex >= 0) {
      wrongQuestions.value[existingIndex].wrongTime = Date.now()
      wrongQuestions.value[existingIndex].retryCount++
      wrongQuestions.value[existingIndex].wrongAnswer = wrongAnswer
    } else {
      const wrongQuestion: WrongQuestion = {
        id: generateId(),
        question,
        wrongAnswer,
        correctAnswer,
        wrongTime: Date.now(),
        retryCount: 1,
        mastered: false
      }
      wrongQuestions.value.unshift(wrongQuestion)
    }
    saveToStorage()
  }

  function retryWrongQuestion(wrongQuestionId: string) {
    const wrongQuestion = wrongQuestions.value.find(wq => wq.id === wrongQuestionId)
    if (!wrongQuestion) return
    const similarQuestions = generateSimilarQuestions(wrongQuestion.question, 5)
    const session: PracticeSession = {
      id: generateId(),
      startTime: Date.now(),
      mode: 'free',
      grade: wrongQuestion.question.grade,
      type: wrongQuestion.question.type,
      difficulty: wrongQuestion.question.difficulty,
      questions: similarQuestions,
      currentIndex: 0,
      answers: new Map(),
      score: 0,
      totalQuestions: similarQuestions.length,
      correctCount: 0
    }
    currentSession.value = session
  }

  function markAsMastered(wrongQuestionId: string) {
    const index = wrongQuestions.value.findIndex(wq => wq.id === wrongQuestionId)
    if (index >= 0) {
      wrongQuestions.value[index].mastered = true
      wrongQuestions.value[index].lastRetryTime = Date.now()
      saveToStorage()
    }
  }

  function removeWrongQuestion(wrongQuestionId: string) {
    wrongQuestions.value = wrongQuestions.value.filter(wq => wq.id !== wrongQuestionId)
    saveToStorage()
  }

  function updateSettings(newSettings: Partial<MathState['settings']>) {
    settings.value = { ...settings.value, ...newSettings }
    saveToStorage()
  }

  function clearSession() {
    stopTimer()
    currentSession.value = null
  }

  function init() {
    loadFromStorage()
  }

  return {
    currentSession,
    wrongQuestions,
    practiceRecords,
    settings,
    unmasteredWrongQuestions,
    totalPracticesToday,
    correctRate,
    startSession,
    submitAnswer,
    nextQuestion,
    endSession,
    retryWrongQuestion,
    markAsMastered,
    removeWrongQuestion,
    updateSettings,
    clearSession,
    init
  }
})
