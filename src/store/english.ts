import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Grade,
  TextbookVersion,
  EnglishWord,
  WordProgress,
  WordMasteryLevel,
  EnglishPracticeRecord,
  EnglishState,
  PracticeMode,
  PracticeQuestion
} from '@/types'
import { getWordsByGrade, getWordsByUnit, getWordById, englishWords } from '@/data/english-words'
import { storage } from '@/utils/storage'

const STORAGE_KEY = 'english_state'

const EBBINGHAUS_INTERVALS = [
  5 * 60 * 1000,
  30 * 60 * 1000,
  12 * 60 * 60 * 1000,
  1 * 24 * 60 * 60 * 1000,
  2 * 24 * 60 * 60 * 1000,
  4 * 24 * 60 * 60 * 1000,
  7 * 24 * 60 * 60 * 1000,
  15 * 24 * 60 * 60 * 1000
]

function loadInitialState(): EnglishState {
  const saved = storage.get<EnglishState>(STORAGE_KEY)
  if (saved) {
    return saved
  }
  return {
    currentVersion: 'renjiao',
    currentGrade: 1,
    currentUnit: 1,
    wordProgress: {},
    practiceRecords: [],
    currentPracticeMode: null,
    currentPracticeWords: [],
    currentWordIndex: 0,
    dailyGoal: 10
  }
}

function getTodayDate(): string {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

export const useEnglishStore = defineStore('english', () => {
  const state = ref<EnglishState>(loadInitialState())

  const currentVersion = computed(() => state.value.currentVersion)
  const currentGrade = computed(() => state.value.currentGrade)
  const currentUnit = computed(() => state.value.currentUnit)
  const wordProgress = computed(() => state.value.wordProgress)
  const practiceRecords = computed(() => state.value.practiceRecords)
  const currentPracticeMode = computed(() => state.value.currentPracticeMode)
  const currentPracticeWords = computed(() => state.value.currentPracticeWords)
  const currentWordIndex = computed(() => state.value.currentWordIndex)
  const dailyGoal = computed(() => state.value.dailyGoal)

  const currentWords = computed(() => {
    return getWordsByUnit(state.value.currentGrade, state.value.currentUnit, state.value.currentVersion)
  })

  const todayRecord = computed(() => {
    const today = getTodayDate()
    return state.value.practiceRecords.find(record => record.date === today)
  })

  const masteredWords = computed(() => {
    return Object.values(state.value.wordProgress).filter(p => p.masteryLevel === 'mastered').length
  })

  const reviewWords = computed(() => {
    return Object.values(state.value.wordProgress).filter(p => p.masteryLevel === 'review').length
  })

  const learningWords = computed(() => {
    return Object.values(state.value.wordProgress).filter(p => p.masteryLevel === 'learning').length
  })

  const unlearnedWords = computed(() => {
    const learnedIds = Object.keys(state.value.wordProgress).map(Number)
    return englishWords.filter(word => !learnedIds.includes(word.id)).length
  })

  const wordsToReview = computed(() => {
    const now = Date.now()
    return Object.values(state.value.wordProgress).filter(p =>
      p.masteryLevel === 'review' &&
      p.nextReviewTime &&
      p.nextReviewTime <= now
    )
  })

  function saveState() {
    storage.set(STORAGE_KEY, state.value)
  }

  function setVersion(version: TextbookVersion) {
    state.value.currentVersion = version
    saveState()
  }

  function setGrade(grade: Grade) {
    state.value.currentGrade = grade
    state.value.currentUnit = 1
    saveState()
  }

  function setUnit(unit: number) {
    state.value.currentUnit = unit
    saveState()
  }

  function setDailyGoal(goal: number) {
    state.value.dailyGoal = goal
    saveState()
  }

  function getWordProgress(wordId: number): WordProgress {
    if (!state.value.wordProgress[wordId]) {
      state.value.wordProgress[wordId] = {
        wordId,
        masteryLevel: 'unlearned',
        studyCount: 0,
        correctCount: 0,
        lastReviewTime: null,
        nextReviewTime: null,
        reviewHistory: []
      }
    }
    return state.value.wordProgress[wordId]
  }

  function updateWordProgress(wordId: number, isCorrect: boolean) {
    const progress = getWordProgress(wordId)
    const now = Date.now()

    progress.studyCount++
    if (isCorrect) {
      progress.correctCount++
    }
    progress.lastReviewTime = now
    progress.reviewHistory.push(isCorrect ? 1 : 0)

    if (progress.masteryLevel === 'unlearned') {
      progress.masteryLevel = 'learning'
    }

    const reviewIndex = Math.min(progress.correctCount, EBBINGHAUS_INTERVALS.length - 1)
    if (isCorrect && progress.masteryLevel === 'learning') {
      if (progress.correctCount >= 5) {
        progress.masteryLevel = 'review'
      }
      progress.nextReviewTime = now + EBBINGHAUS_INTERVALS[reviewIndex]
    } else if (isCorrect && progress.masteryLevel === 'review') {
      if (progress.correctCount >= 8) {
        progress.masteryLevel = 'mastered'
        progress.nextReviewTime = null
      } else {
        progress.nextReviewTime = now + EBBINGHAUS_INTERVALS[reviewIndex]
      }
    } else if (!isCorrect) {
      progress.masteryLevel = 'learning'
      progress.nextReviewTime = now + EBBINGHAUS_INTERVALS[0]
    }

    saveState()
  }

  function updateTodayRecord(learned: number, reviewed: number, correct: number, total: number) {
    const today = getTodayDate()
    let record = state.value.practiceRecords.find(r => r.date === today)

    if (!record) {
      record = {
        id: Date.now(),
        date: today,
        totalWords: 0,
        learnedWords: 0,
        reviewedWords: 0,
        accuracy: 0
      }
      state.value.practiceRecords.push(record)
    }

    record.totalWords += total
    record.learnedWords += learned
    record.reviewedWords += reviewed
    const newCorrect = record.accuracy * (record.totalWords - total) + correct
    record.accuracy = total > 0 ? newCorrect / record.totalWords : 0

    saveState()
  }

  function startPractice(mode: PracticeMode, words: EnglishWord[]) {
    state.value.currentPracticeMode = mode
    state.value.currentPracticeWords = [...words]
    state.value.currentWordIndex = 0
    saveState()
  }

  function nextWord() {
    if (state.value.currentWordIndex < state.value.currentPracticeWords.length - 1) {
      state.value.currentWordIndex++
      saveState()
      return true
    }
    return false
  }

  function generateQuestion(word: EnglishWord, mode: PracticeMode): PracticeQuestion {
    const question: PracticeQuestion = {
      id: Date.now() + Math.random(),
      type: mode,
      word,
      options: []
    }

    const otherWords = englishWords.filter(w => w.id !== word.id)
    const shuffled = otherWords.sort(() => Math.random() - 0.5).slice(0, 3)

    switch (mode) {
      case 'listen':
      case 'translate':
        question.options = [word.translation, ...shuffled.map(w => w.translation)].sort(() => Math.random() - 0.5)
        break
      case 'image':
        question.options = [word.word, ...shuffled.map(w => w.word)].sort(() => Math.random() - 0.5)
        break
      case 'spell':
        question.options = word.word.split('')
        break
    }

    return question
  }

  function playWordAudio(word: string) {
    try {
      uni.showToast({
        title: '播放发音: ' + word,
        icon: 'none',
        duration: 1000
      })
    } catch (e) {
      console.error('Audio playback failed:', e)
    }
  }

  function endPractice(correctCount: number, totalCount: number) {
    const learnedWords = state.value.currentPracticeWords.filter(w => {
      const progress = state.value.wordProgress[w.id]
      return progress && progress.masteryLevel === 'unlearned'
    }).length

    const reviewedWords = state.value.currentPracticeWords.filter(w => {
      const progress = state.value.wordProgress[w.id]
      return progress && (progress.masteryLevel === 'learning' || progress.masteryLevel === 'review')
    }).length

    updateTodayRecord(learnedWords, reviewedWords, correctCount, totalCount)

    state.value.currentPracticeMode = null
    state.value.currentPracticeWords = []
    state.value.currentWordIndex = 0
    saveState()
  }

  function resetProgress() {
    if (confirm('确定要重置所有学习进度吗？此操作不可撤销。')) {
      state.value.wordProgress = {}
      state.value.practiceRecords = []
      saveState()
      uni.showToast({
        title: '进度已重置',
        icon: 'success'
      })
    }
  }

  return {
    currentVersion,
    currentGrade,
    currentUnit,
    wordProgress,
    practiceRecords,
    currentPracticeMode,
    currentPracticeWords,
    currentWordIndex,
    dailyGoal,
    currentWords,
    todayRecord,
    masteredWords,
    reviewWords,
    learningWords,
    unlearnedWords,
    wordsToReview,
    setVersion,
    setGrade,
    setUnit,
    setDailyGoal,
    getWordProgress,
    updateWordProgress,
    updateTodayRecord,
    startPractice,
    nextWord,
    generateQuestion,
    playWordAudio,
    endPractice,
    resetProgress
  }
})
