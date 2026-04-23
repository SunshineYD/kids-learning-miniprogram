import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  ChineseProgress,
  DictationPractice,
  PinyinPractice,
  WordSentencePractice,
  PoemPractice,
  ReadingPractice,
  CommonSensePractice,
  ChineseDailyPractice,
  ChineseLesson,
  AncientPoem,
  ReadingArticle,
  ChineseCommonSense,
  Grade
} from '@/types'
import {
  chineseLessons,
  ancientPoems,
  readingArticles,
  chineseCommonSenses,
  getLessonsByGrade,
  getPoemsByGrade,
  getReadingByGrade,
  getRandomCommonSense
} from '@/data/chinese-content'
import { storage } from '@/utils/storage'

const STORAGE_KEY = 'chinese-progress'

export const useChineseStore = defineStore('chinese', () => {
  const progress = ref<ChineseProgress | null>(null)
  const currentSemester = ref<1 | 2>(1)
  const currentPracticeType = ref<'textbook' | 'poem' | 'daily'>('textbook')

  const currentDictation = ref<DictationPractice | null>(null)
  const currentPinyin = ref<PinyinPractice | null>(null)
  const currentWordSentence = ref<WordSentencePractice | null>(null)
  const currentPoem = ref<PoemPractice | null>(null)
  const currentReading = ref<ReadingPractice | null>(null)
  const currentCommonSense = ref<CommonSensePractice | null>(null)

  function init() {
    const saved = storage.get<ChineseProgress>(STORAGE_KEY)
    if (saved) {
      progress.value = saved
    } else {
      progress.value = {
        grade: 1,
        currentLesson: 0,
        lessonsCompleted: [],
        poemsCompleted: [],
        dailyPractices: [],
        totalScore: 0,
        streakDays: 0
      }
      saveProgress()
    }
  }

  function saveProgress() {
    if (progress.value) {
      storage.set(STORAGE_KEY, progress.value)
    }
  }

  function setGrade(grade: Grade) {
    if (progress.value) {
      progress.value.grade = grade
      progress.value.currentLesson = 0
      saveProgress()
    }
  }

  function setSemester(semester: 1 | 2) {
    currentSemester.value = semester
  }

  function setPracticeType(type: 'textbook' | 'poem' | 'daily') {
    currentPracticeType.value = type
  }

  const lessons = computed(() => {
    if (!progress.value) return []
    return getLessonsByGrade(progress.value.grade).filter(l => l.semester === currentSemester.value)
  })

  const poems = computed(() => {
    if (!progress.value) return []
    return getPoemsByGrade(progress.value.grade).filter(p => p.semester === currentSemester.value)
  })

  const readings = computed(() => {
    if (!progress.value) return []
    return getReadingByGrade(progress.value.grade)
  })

  const todayDailyPractice = computed(() => {
    if (!progress.value) return null
    const today = new Date().toISOString().split('T')[0]
    return progress.value.dailyPractices.find(p => p.date === today)
  })

  function startDictation(lesson: ChineseLesson): DictationPractice {
    const practice: DictationPractice = {
      id: `dictation-${Date.now()}`,
      lessonId: lesson.id,
      characters: lesson.characters,
      currentIndex: 0,
      userAnswers: new Array(lesson.characters.length).fill(''),
      completed: false,
      score: 0
    }
    currentDictation.value = practice
    return practice
  }

  function saveDictationAnswer(index: number, answer: string) {
    if (currentDictation.value) {
      currentDictation.value.userAnswers[index] = answer
    }
  }

  function nextDictation() {
    if (currentDictation.value && currentDictation.value.currentIndex < currentDictation.value.characters.length - 1) {
      currentDictation.value.currentIndex++
    }
  }

  function prevDictation() {
    if (currentDictation.value && currentDictation.value.currentIndex > 0) {
      currentDictation.value.currentIndex--
    }
  }

  function submitDictation() {
    if (!currentDictation.value || !progress.value) return

    let correct = 0
    currentDictation.value.characters.forEach((char, index) => {
      if (currentDictation.value!.userAnswers[index] === char.character) {
        correct++
      }
    })

    currentDictation.value.score = Math.round((correct / currentDictation.value.characters.length) * 100)
    currentDictation.value.completed = true

    progress.value.totalScore += currentDictation.value.score

    const lessonIndex = lessons.value.findIndex(l => l.id === currentDictation.value.lessonId)
    if (lessonIndex !== -1 && !progress.value.lessonsCompleted.includes(lessonIndex)) {
      progress.value.lessonsCompleted.push(lessonIndex)
    }

    saveProgress()
  }

  function startPinyin(lesson: ChineseLesson): PinyinPractice {
    const practice: PinyinPractice = {
      id: `pinyin-${Date.now()}`,
      lessonId: lesson.id,
      characters: lesson.characters,
      currentIndex: 0,
      userAnswers: new Array(lesson.characters.length).fill(''),
      completed: false,
      score: 0
    }
    currentPinyin.value = practice
    return practice
  }

  function savePinyinAnswer(index: number, answer: string) {
    if (currentPinyin.value) {
      currentPinyin.value.userAnswers[index] = answer
    }
  }

  function nextPinyin() {
    if (currentPinyin.value && currentPinyin.value.currentIndex < currentPinyin.value.characters.length - 1) {
      currentPinyin.value.currentIndex++
    }
  }

  function prevPinyin() {
    if (currentPinyin.value && currentPinyin.value.currentIndex > 0) {
      currentPinyin.value.currentIndex--
    }
  }

  function submitPinyin() {
    if (!currentPinyin.value || !progress.value) return

    let correct = 0
    currentPinyin.value.characters.forEach((char, index) => {
      if (currentPinyin.value!.userAnswers[index] === char.pinyin) {
        correct++
      }
    })

    currentPinyin.value.score = Math.round((correct / currentPinyin.value.characters.length) * 100)
    currentPinyin.value.completed = true

    progress.value.totalScore += currentPinyin.value.score
    saveProgress()
  }

  function startWordSentence(lesson: ChineseLesson): WordSentencePractice {
    const practice: WordSentencePractice = {
      id: `wordsentence-${Date.now()}`,
      lessonId: lesson.id,
      words: lesson.words,
      currentIndex: 0,
      userAnswers: new Array(lesson.words.length).fill(''),
      completed: false,
      score: 0
    }
    currentWordSentence.value = practice
    return practice
  }

  function saveWordSentenceAnswer(index: number, answer: string) {
    if (currentWordSentence.value) {
      currentWordSentence.value.userAnswers[index] = answer
    }
  }

  function nextWordSentence() {
    if (currentWordSentence.value && currentWordSentence.value.currentIndex < currentWordSentence.value.words.length - 1) {
      currentWordSentence.value.currentIndex++
    }
  }

  function prevWordSentence() {
    if (currentWordSentence.value && currentWordSentence.value.currentIndex > 0) {
      currentWordSentence.value.currentIndex--
    }
  }

  function submitWordSentence() {
    if (!currentWordSentence.value || !progress.value) return

    let correct = 0
    currentWordSentence.value.words.forEach((word, index) => {
      const answer = currentWordSentence.value!.userAnswers[index].trim()
      if (answer && answer.length > 0) {
        correct++
      }
    })

    currentWordSentence.value.score = Math.round((correct / currentWordSentence.value.words.length) * 100)
    currentWordSentence.value.completed = true

    progress.value.totalScore += currentWordSentence.value.score
    saveProgress()
  }

  function startPoem(poem: AncientPoem, type: 'recite' | 'write'): PoemPractice {
    const practice: PoemPractice = {
      id: `poem-${Date.now()}`,
      poemId: poem.id,
      type,
      completed: false,
      score: 0,
      attempts: 0
    }
    currentPoem.value = practice
    return practice
  }

  function completePoem(score: number) {
    if (!currentPoem.value || !progress.value) return

    currentPoem.value.score = score
    currentPoem.value.completed = true
    currentPoem.value.attempts++

    progress.value.totalScore += score

    if (!progress.value.poemsCompleted.includes(currentPoem.value.poemId)) {
      progress.value.poemsCompleted.push(currentPoem.value.poemId)
    }

    saveProgress()
  }

  function startReading(article: ReadingArticle): ReadingPractice {
    const practice: ReadingPractice = {
      id: `reading-${Date.now()}`,
      articleId: article.id,
      currentQuestionIndex: 0,
      userAnswers: new Array(article.questions.length).fill(-1),
      completed: false,
      score: 0
    }
    currentReading.value = practice
    return practice
  }

  function saveReadingAnswer(index: number, answer: number) {
    if (currentReading.value) {
      currentReading.value.userAnswers[index] = answer
    }
  }

  function nextReadingQuestion() {
    if (currentReading.value) {
      currentReading.value.currentQuestionIndex++
    }
  }

  function prevReadingQuestion() {
    if (currentReading.value && currentReading.value.currentQuestionIndex > 0) {
      currentReading.value.currentQuestionIndex--
    }
  }

  function submitReading(article: ReadingArticle) {
    if (!currentReading.value || !progress.value) return

    let correct = 0
    article.questions.forEach((q, index) => {
      if (currentReading.value!.userAnswers[index] === q.answer) {
        correct++
      }
    })

    currentReading.value.score = Math.round((correct / article.questions.length) * 100)
    currentReading.value.completed = true

    progress.value.totalScore += currentReading.value.score

    checkDailyPractice()
    saveProgress()
  }

  function startCommonSense(): CommonSensePractice {
    const questions = getRandomCommonSense(5)
    const practice: CommonSensePractice = {
      id: `commonsense-${Date.now()}`,
      questions,
      currentIndex: 0,
      userAnswers: new Array(questions.length).fill(-1),
      completed: false,
      score: 0
    }
    currentCommonSense.value = practice
    return practice
  }

  function saveCommonSenseAnswer(index: number, answer: number) {
    if (currentCommonSense.value) {
      currentCommonSense.value.userAnswers[index] = answer
    }
  }

  function nextCommonSense() {
    if (currentCommonSense.value && currentCommonSense.value.currentIndex < currentCommonSense.value.questions.length - 1) {
      currentCommonSense.value.currentIndex++
    }
  }

  function prevCommonSense() {
    if (currentCommonSense.value && currentCommonSense.value.currentIndex > 0) {
      currentCommonSense.value.currentIndex--
    }
  }

  function submitCommonSense() {
    if (!currentCommonSense.value || !progress.value) return

    let correct = 0
    currentCommonSense.value.questions.forEach((q, index) => {
      if (currentCommonSense.value!.userAnswers[index] === q.answer) {
        correct++
      }
    })

    currentCommonSense.value.score = Math.round((correct / currentCommonSense.value.questions.length) * 100)
    currentCommonSense.value.completed = true

    progress.value.totalScore += currentCommonSense.value.score

    checkDailyPractice()
    saveProgress()
  }

  function checkDailyPractice() {
    if (!progress.value) return

    const today = new Date().toISOString().split('T')[0]
    let dailyPractice = progress.value.dailyPractices.find(p => p.date === today)

    if (!dailyPractice) {
      dailyPractice = {
        date: today,
        reading: null,
        commonSense: null,
        completed: false
      }
      progress.value.dailyPractices.push(dailyPractice)
    }

    if (currentReading.value && currentReading.value.completed) {
      dailyPractice.reading = currentReading.value
    }

    if (currentCommonSense.value && currentCommonSense.value.completed) {
      dailyPractice.commonSense = currentCommonSense.value
    }

    if (dailyPractice.reading && dailyPractice.commonSense) {
      dailyPractice.completed = true

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      const yesterdayPractice = progress.value.dailyPractices.find(p => p.date === yesterdayStr)

      if (yesterdayPractice && yesterdayPractice.completed) {
        progress.value.streakDays++
      } else {
        progress.value.streakDays = 1
      }
    }
  }

  function resetPractice() {
    currentDictation.value = null
    currentPinyin.value = null
    currentWordSentence.value = null
    currentPoem.value = null
    currentReading.value = null
    currentCommonSense.value = null
  }

  return {
    progress,
    currentSemester,
    currentPracticeType,
    currentDictation,
    currentPinyin,
    currentWordSentence,
    currentPoem,
    currentReading,
    currentCommonSense,
    lessons,
    poems,
    readings,
    todayDailyPractice,
    init,
    setGrade,
    setSemester,
    setPracticeType,
    startDictation,
    saveDictationAnswer,
    nextDictation,
    prevDictation,
    submitDictation,
    startPinyin,
    savePinyinAnswer,
    nextPinyin,
    prevPinyin,
    submitPinyin,
    startWordSentence,
    saveWordSentenceAnswer,
    nextWordSentence,
    prevWordSentence,
    submitWordSentence,
    startPoem,
    completePoem,
    startReading,
    saveReadingAnswer,
    nextReadingQuestion,
    prevReadingQuestion,
    submitReading,
    startCommonSense,
    saveCommonSenseAnswer,
    nextCommonSense,
    prevCommonSense,
    submitCommonSense,
    resetPractice
  }
})
