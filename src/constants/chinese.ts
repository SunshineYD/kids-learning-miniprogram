export interface Tab {
  id: 'textbook' | 'poem' | 'daily'
  name: string
  icon: string
}

export interface Semester {
  id: 1 | 2
  name: string
}

export type PracticeMode =
  | 'list'
  | 'dictation'
  | 'pinyin'
  | 'wordsentence'
  | 'poem-recite'
  | 'poem-write'
  | 'reading'
  | 'commonsense'

export const TABS: Tab[] = [
  { id: 'textbook', name: '课本同步', icon: '📚' },
  { id: 'poem', name: '古诗词', icon: '🏮' },
  { id: 'daily', name: '每日一练', icon: '☀️' },
] as const

export const SEMESTERS: Semester[] = [
  { id: 1, name: '上学期' },
  { id: 2, name: '下学期' },
] as const

export const GRADE_OPTIONS = [
  { id: 1, name: '一年级' },
  { id: 2, name: '二年级' },
  { id: 3, name: '三年级' },
  { id: 4, name: '四年级' },
] as const

export const PRACTICE_MODES = {
  LIST: 'list' as PracticeMode,
  DICTATION: 'dictation' as PracticeMode,
  PINYIN: 'pinyin' as PracticeMode,
  WORD_SENTENCE: 'wordsentence' as PracticeMode,
  POEM_RECITE: 'poem-recite' as PracticeMode,
  POEM_WRITE: 'poem-write' as PracticeMode,
  READING: 'reading' as PracticeMode,
  COMMON_SENSE: 'commonsense' as PracticeMode,
} as const
