import { ref, computed } from 'vue'
import { useChineseStore } from '@/store/chinese'
import type { ChineseLesson, AncientPoem, ReadingArticle } from '@/types'
import type { PracticeMode } from '@/constants/chinese'
import { PRACTICE_MODES } from '@/constants/chinese'
import { getReadingByGrade } from '@/data/chinese-content'

export function useChinesePractice() {
  const chineseStore = useChineseStore()

  const activeTab = ref<'textbook' | 'poem' | 'daily'>('textbook')
  const practiceMode = ref<PracticeMode>(PRACTICE_MODES.LIST)
  const currentLesson = ref<ChineseLesson | null>(null)
  const currentPoem = ref<AncientPoem | null>(null)
  const currentArticle = ref<ReadingArticle | null>(null)
  const showResult = ref(false)
  const resultScore = ref(0)

  const todayReading = computed(() => {
    if (!chineseStore.progress) return null
    const readings = getReadingByGrade(chineseStore.progress.grade)
    return readings[0] || null
  })

  const dailyPracticeCompleted = computed(() => {
    return chineseStore.todayDailyPractice?.completed ?? false
  })

  const switchTab = (tabId: string) => {
    const validTabs = ['textbook', 'poem', 'daily'] as const
    if (validTabs.includes(tabId as any)) {
      activeTab.value = tabId as any
      practiceMode.value = PRACTICE_MODES.LIST
      chineseStore.setPracticeType(tabId as any)
      resetPractice()
    }
  }

  const switchSemester = (semester: 1 | 2) => {
    chineseStore.setSemester(semester)
  }

  // Helper function for starting lesson practice modes
  const startLessonPractice = (lesson: ChineseLesson, mode: PracticeMode, storeAction: (lesson: ChineseLesson) => void) => {
    currentLesson.value = lesson
    storeAction(lesson)
    practiceMode.value = mode
  }

  // Helper function for starting poem practice modes
  const startPoemPractice = (poem: AncientPoem, mode: PracticeMode, poemMode: 'recite' | 'write') => {
    currentPoem.value = poem
    chineseStore.startPoem(poem, poemMode)
    practiceMode.value = mode
  }

  const startDictation = (lesson: ChineseLesson) => {
    startLessonPractice(lesson, PRACTICE_MODES.DICTATION, chineseStore.startDictation)
  }

  const startPinyin = (lesson: ChineseLesson) => {
    startLessonPractice(lesson, PRACTICE_MODES.PINYIN, chineseStore.startPinyin)
  }

  const startWordSentence = (lesson: ChineseLesson) => {
    startLessonPractice(lesson, PRACTICE_MODES.WORD_SENTENCE, chineseStore.startWordSentence)
  }

  const startPoemRecite = (poem: AncientPoem) => {
    startPoemPractice(poem, PRACTICE_MODES.POEM_RECITE, 'recite')
  }

  const startPoemWrite = (poem: AncientPoem) => {
    startPoemPractice(poem, PRACTICE_MODES.POEM_WRITE, 'write')
  }

  const startReading = (article: ReadingArticle) => {
    currentArticle.value = article
    chineseStore.startReading(article)
    practiceMode.value = PRACTICE_MODES.READING
  }

  const startCommonSense = () => {
    chineseStore.startCommonSense()
    practiceMode.value = PRACTICE_MODES.COMMON_SENSE
  }

  const handlePracticeComplete = (score: number) => {
    resultScore.value = score
    showResult.value = true
  }

  const resetPractice = () => {
    practiceMode.value = PRACTICE_MODES.LIST
    currentLesson.value = null
    currentPoem.value = null
    currentArticle.value = null
    showResult.value = false
    chineseStore.resetPractice()
  }

  const backToList = () => {
    resetPractice()
  }

  const isLessonCompleted = (lesson: ChineseLesson): boolean => {
    if (!chineseStore.progress) return false
    const index = chineseStore.lessons.findIndex((l) => l.id === lesson.id)
    return chineseStore.progress.lessonsCompleted.includes(index)
  }

  const isPoemCompleted = (poem: AncientPoem): boolean => {
    if (!chineseStore.progress) return false
    return chineseStore.progress.poemsCompleted.includes(poem.id)
  }

  return {
    activeTab,
    practiceMode,
    currentLesson,
    currentPoem,
    currentArticle,
    showResult,
    resultScore,
    todayReading,
    dailyPracticeCompleted,
    switchTab,
    switchSemester,
    startDictation,
    startPinyin,
    startWordSentence,
    startPoemRecite,
    startPoemWrite,
    startReading,
    startCommonSense,
    handlePracticeComplete,
    resetPractice,
    backToList,
    isLessonCompleted,
    isPoemCompleted,
  }
}
