import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WrongQuestionsState, WrongQuestionItem, WrongQuestionSubject, WrongQuestionTag } from '@/types'
import { storage } from '@/utils/storage'

const STORAGE_KEY = 'wrong_questions'

const defaultTags: WrongQuestionTag[] = [
  { id: 'tag1', name: '重点', color: '#FF6B6B' },
  { id: 'tag2', name: '难点', color: '#4ECDC4' },
  { id: 'tag3', name: '易错', color: '#FFE66D' },
  { id: 'tag4', name: '已掌握', color: '#95E1D3' }
]

export const useWrongQuestionsStore = defineStore('wrong-questions', () => {
  const state = ref<WrongQuestionsState>({
    questions: [],
    filters: {},
    tags: defaultTags
  })

  const filteredQuestions = computed(() => {
    let result = [...state.value.questions]

    if (state.value.filters.subject) {
      result = result.filter(q => q.subject === state.value.filters.subject)
    }

    if (state.value.filters.type) {
      result = result.filter(q => q.type === state.value.filters.type)
    }

    if (state.value.filters.mastered !== undefined) {
      result = result.filter(q => q.mastered === state.value.filters.mastered)
    }

    if (state.value.filters.searchKeyword) {
      const keyword = state.value.filters.searchKeyword.toLowerCase()
      result = result.filter(q => q.question.toLowerCase().includes(keyword))
    }

    return result.sort((a, b) => b.wrongTime - a.wrongTime)
  })

  const subjectStats = computed(() => {
    const stats: Record<WrongQuestionSubject, { total: number; mastered: number }> = {
      math: { total: 0, mastered: 0 },
      english: { total: 0, mastered: 0 },
      chinese: { total: 0, mastered: 0 }
    }

    state.value.questions.forEach(q => {
      stats[q.subject].total++
      if (q.mastered) {
        stats[q.subject].mastered++
      }
    })

    return stats
  })

  function loadFromStorage() {
    const saved = storage.get<WrongQuestionsState>(STORAGE_KEY)
    if (saved) {
      state.value = { ...state.value, ...saved }
    }
  }

  function saveToStorage() {
    storage.set(STORAGE_KEY, state.value)
  }

  function addWrongQuestion(question: Omit<WrongQuestionItem, 'id' | 'wrongTime' | 'wrongCount' | 'tags' | 'mastered'>) {
    const existing = state.value.questions.find(
      q => q.question === question.question && q.subject === question.subject
    )

    if (existing) {
      existing.wrongCount++
      existing.wrongTime = Date.now()
      existing.userAnswer = question.userAnswer
    } else {
      const newQuestion: WrongQuestionItem = {
        ...question,
        id: `wq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        wrongTime: Date.now(),
        wrongCount: 1,
        tags: [],
        mastered: false
      }
      state.value.questions.push(newQuestion)
    }

    saveToStorage()
  }

  function removeWrongQuestion(id: string) {
    const index = state.value.questions.findIndex(q => q.id === id)
    if (index > -1) {
      state.value.questions.splice(index, 1)
      saveToStorage()
    }
  }

  function markAsMastered(id: string) {
    const question = state.value.questions.find(q => q.id === id)
    if (question) {
      question.mastered = true
      question.masteredTime = Date.now()
      saveToStorage()
    }
  }

  function unmarkAsMastered(id: string) {
    const question = state.value.questions.find(q => q.id === id)
    if (question) {
      question.mastered = false
      question.masteredTime = undefined
      saveToStorage()
    }
  }

  function addTagToQuestion(questionId: string, tagId: string) {
    const question = state.value.questions.find(q => q.id === questionId)
    const tag = state.value.tags.find(t => t.id === tagId)

    if (question && tag && !question.tags.find(t => t.id === tagId)) {
      question.tags.push(tag)
      saveToStorage()
    }
  }

  function removeTagFromQuestion(questionId: string, tagId: string) {
    const question = state.value.questions.find(q => q.id === questionId)
    if (question) {
      question.tags = question.tags.filter(t => t.id !== tagId)
      saveToStorage()
    }
  }

  function addCustomTag(name: string, color: string) {
    const newTag: WrongQuestionTag = {
      id: `tag_${Date.now()}`,
      name,
      color
    }
    state.value.tags.push(newTag)
    saveToStorage()
  }

  function setFilter(key: keyof WrongQuestionsState['filters'], value: any) {
    state.value.filters[key] = value
  }

  function clearFilters() {
    state.value.filters = {}
  }

  function updateNotes(id: string, notes: string) {
    const question = state.value.questions.find(q => q.id === id)
    if (question) {
      question.notes = notes
      saveToStorage()
    }
  }

  function getQuestionsBySubject(subject: WrongQuestionSubject) {
    return state.value.questions.filter(q => q.subject === subject)
  }

  function getUnmasteredQuestions() {
    return state.value.questions.filter(q => !q.mastered)
  }

  function init() {
    loadFromStorage()
  }

  return {
    state,
    filteredQuestions,
    subjectStats,
    addWrongQuestion,
    removeWrongQuestion,
    markAsMastered,
    unmarkAsMastered,
    addTagToQuestion,
    removeTagFromQuestion,
    addCustomTag,
    setFilter,
    clearFilters,
    updateNotes,
    getQuestionsBySubject,
    getUnmasteredQuestions,
    init
  }
})
