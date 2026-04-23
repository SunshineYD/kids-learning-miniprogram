export interface Course {
  id: number
  title: string
  description: string
  cover: string
  category: string
  duration: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface Task {
  id: number
  title: string
  description: string
  points: number
  completed: boolean
  type: 'daily' | 'weekly'
}

export interface User {
  id: number
  nickname: string
  avatar: string
  level: number
  points: number
  openId?: string
  unionId?: string
  lastLoginTime?: number
}

export interface Category {
  id: number
  name: string
  icon: string
  color: string
}

export interface LoginResult {
  code: number
  message: string
  data: {
    token: string
    user: User
    isNewUser?: boolean
  }
}

export interface WechatUserInfo {
  nickName: string
  avatarUrl: string
  gender: number
  city: string
  province: string
  country: string
  language: string
}

export interface Account {
  id: number
  nickname: string
  avatar: string
  openId: string
  lastLoginTime: number
}

export type Grade = 1 | 2 | 3 | 4

export type Subject = 'chinese' | 'math' | 'english'

export interface DailyTask {
  id: number
  subject: Subject
  title: string
  description: string
  icon: string
  color: string
  completed: boolean
  progress: number
  total: number
}

export interface CheckInRecord {
  date: string
  completed: boolean
}

export interface Medal {
  id: number
  name: string
  icon: string
  description: string
  unlocked: boolean
}

export interface QuickNavItem {
  id: number
  name: string
  icon: string
  color: string
  path: string
}

export interface AppState {
  currentGrade: Grade
  dailyTasks: DailyTask[]
  checkInDays: number
  checkInRecords: CheckInRecord[]
  medals: Medal[]
  lastCheckInDate: string | null
}

export interface ChineseCharacter {
  id: string
  character: string
  pinyin: string
  meaning: string
  strokes: number
  radicals: string
  example: string
}

export interface ChineseWord {
  id: string
  word: string
  pinyin: string
  meaning: string
  example: string
}

export interface ChineseSentence {
  id: string
  sentence: string
  pinyin: string
  meaning: string
}

export interface AncientPoem {
  id: string
  title: string
  author: string
  dynasty: string
  content: string[]
  translation: string
  appreciation: string
  grade: Grade
  semester: 1 | 2
}

export interface ChineseCommonSense {
  id: string
  question: string
  options: string[]
  answer: number
  explanation: string
}

export interface ReadingArticle {
  id: string
  title: string
  content: string
  questions: ReadingQuestion[]
  grade: Grade
}

export interface ReadingQuestion {
  id: string
  question: string
  options: string[]
  answer: number
  explanation: string
}

export type ChinesePracticeType = 'dictation' | 'pinyin' | 'word' | 'poem' | 'reading' | 'common-sense'

export interface ChineseLesson {
  id: string
  grade: Grade
  semester: 1 | 2
  unit: number
  lesson: number
  title: string
  characters: ChineseCharacter[]
  words: ChineseWord[]
  sentences: ChineseSentence[]
}

export interface DictationPractice {
  id: string
  lessonId: string
  characters: ChineseCharacter[]
  currentIndex: number
  userAnswers: string[]
  completed: boolean
  score: number
}

export interface PinyinPractice {
  id: string
  lessonId: string
  characters: ChineseCharacter[]
  currentIndex: number
  userAnswers: string[]
  completed: boolean
  score: number
}

export interface WordSentencePractice {
  id: string
  lessonId: string
  words: ChineseWord[]
  currentIndex: number
  userAnswers: string[]
  completed: boolean
  score: number
}

export interface PoemPractice {
  id: string
  poemId: string
  type: 'recite' | 'write'
  completed: boolean
  score: number
  attempts: number
}

export interface ReadingPractice {
  id: string
  articleId: string
  currentQuestionIndex: number
  userAnswers: number[]
  completed: boolean
  score: number
}

export interface CommonSensePractice {
  id: string
  questions: ChineseCommonSense[]
  currentIndex: number
  userAnswers: number[]
  completed: boolean
  score: number
}

export interface ChineseDailyPractice {
  date: string
  reading: ReadingPractice | null
  commonSense: CommonSensePractice | null
  completed: boolean
}

export interface ChineseProgress {
  grade: Grade
  currentLesson: number
  lessonsCompleted: number[]
  poemsCompleted: string[]
  dailyPractices: ChineseDailyPractice[]
  totalScore: number
  streakDays: number
}

export type MathQuestionType = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed' | 'unit-conversion'

export type MathDifficulty = 'basic' | 'advanced' | 'challenge'

export type PracticeMode = 'free' | 'timed-1min' | 'timed-3min'

export interface MathQuestion {
  id: string
  grade: Grade
  type: MathQuestionType
  difficulty: MathDifficulty
  expression: string
  answer: number | string
  options?: string[]
  unit?: string
  hasCarry?: boolean
  hasBorrow?: boolean
}

export interface PracticeSession {
  id: string
  startTime: number
  endTime?: number
  mode: PracticeMode
  grade: Grade
  type: MathQuestionType
  difficulty: MathDifficulty
  questions: MathQuestion[]
  currentIndex: number
  answers: Map<string, { userAnswer: string | number; correct: boolean; timeSpent: number }>
  score: number
  totalQuestions: number
  correctCount: number
  timeLimit?: number
  timeRemaining?: number
}

export interface WrongQuestion {
  id: string
  question: MathQuestion
  wrongAnswer: string | number
  correctAnswer: string | number
  wrongTime: number
  retryCount: number
  lastRetryTime?: number
  mastered: boolean
}

export interface MathPracticeRecord {
  id: string
  date: string
  grade: Grade
  type: MathQuestionType
  mode: PracticeMode
  score: number
  totalQuestions: number
  correctCount: number
  timeSpent: number
  checkInId?: string
}

export interface MathState {
  currentSession: PracticeSession | null
  wrongQuestions: WrongQuestion[]
  practiceRecords: MathPracticeRecord[]
  settings: {
    autoNext: boolean
    showAnswer: boolean
    soundEnabled: boolean
  }
}

export type TextbookVersion = 'renjiao' | 'waiyan'

export type WordMasteryLevel = 'unlearned' | 'learning' | 'review' | 'mastered'

export type PracticeMode = 'listen' | 'image' | 'translate' | 'spell'

export interface EnglishWord {
  id: number
  word: string
  phonetic: string
  translation: string
  image?: string
  audio?: string
  example?: string
  exampleTranslation?: string
  phrases?: string[]
  grade: Grade
  unit: number
  textbookVersion: TextbookVersion
}

export interface WordProgress {
  wordId: number
  masteryLevel: WordMasteryLevel
  studyCount: number
  correctCount: number
  lastReviewTime: number | null
  nextReviewTime: number | null
  reviewHistory: number[]
}

export interface EnglishPracticeRecord {
  id: number
  date: string
  totalWords: number
  learnedWords: number
  reviewedWords: number
  accuracy: number
}

export interface EnglishState {
  currentVersion: TextbookVersion
  currentGrade: Grade
  currentUnit: number
  wordProgress: Record<number, WordProgress>
  practiceRecords: EnglishPracticeRecord[]
  currentPracticeMode: PracticeMode | null
  currentPracticeWords: EnglishWord[]
  currentWordIndex: number
  dailyGoal: number
}

export interface PracticeQuestion {
  id: number
  type: PracticeMode
  word: EnglishWord
  options: string[]
  userAnswer?: string
  isCorrect?: boolean
}

export interface ChildAccount {
  id: number
  nickname: string
  avatar: string
  grade: Grade
  parentId: number
  createdAt: number
}

export interface StudyData {
  id: string
  childId: number
  date: string
  subject: Subject
  completedCount: number
  totalCount: number
  accuracy: number
  timeSpent: number
  score: number
}

export interface CustomReminder {
  id: number
  childId: number
  title: string
  time: string
  enabled: boolean
  repeatDays: number[]
}

export interface StudyReport {
  id: string
  childId: number
  startDate: string
  endDate: string
  totalDays: number
  studyDays: number
  totalQuestions: number
  correctQuestions: number
  accuracy: number
  subjectStats: {
    subject: Subject
    completedCount: number
    accuracy: number
    timeSpent: number
  }[]
  dailyStats: {
    date: string
    completedCount: number
    accuracy: number
  }[]
}

export interface ParentState {
  isVerified: boolean
  children: ChildAccount[]
  currentChildId: number | null
  studyData: StudyData[]
  reminders: CustomReminder[]
  reports: StudyReport[]
}

export type MembershipType = 'free' | 'monthly' | 'quarterly' | 'yearly'

export interface MembershipPackage {
  id: string
  type: MembershipType
  name: string
  price: number
  originalPrice: number
  duration: number
  description: string[]
  features: string[]
  popular?: boolean
}

export interface Membership {
  id: number
  userId: number
  type: MembershipType
  startDate: number
  endDate: number
  isActive: boolean
}

export interface InviteRecord {
  id: number
  inviterId: number
  inviteeId: number
  invitedAt: number
  rewardClaimed: boolean
}

export interface MembershipState {
  membership: Membership | null
  packages: MembershipPackage[]
  inviteRecords: InviteRecord[]
  inviteCode: string
}

export interface Feedback {
  id: string
  userId: number
  type: 'bug' | 'feature' | 'other'
  content: string
  contact?: string
  images?: string[]
  createdAt: number
  status: 'pending' | 'processing' | 'resolved'
}

export interface AboutSection {
  id: string
  title: string
  content: string
  type: 'about' | 'usage' | 'privacy'
}

export interface CheatingDetection {
  id: string
  userId: number
  practiceId: string
  detectionType: 'switch_app' | 'copy' | 'quick_answer'
  timestamp: number
  details: string
}

export type CheckInSubject = 'math' | 'english' | 'chinese'

export interface CheckInTask {
  id: string
  subject: CheckInSubject
  name: string
  icon: string
  color: string
  completed: boolean
  completedTime?: number
}

export interface CheckInRecord {
  date: string
  tasks: CheckInTask[]
  completedCount: number
  isCompleted: boolean
  isHoliday?: boolean
  holidayBonus?: number
}

export interface CheckInStreakReward {
  days: number
  points: number
  name: string
  icon: string
}

export interface CheckInState {
  todayRecord: CheckInRecord | null
  historyRecords: CheckInRecord[]
  streakDays: number
  maxStreakDays: number
  totalPoints: number
  usedSupplementCount: number
  maxSupplementCount: number
  streakRewards: CheckInStreakReward[]
}

export type WrongQuestionSubject = 'math' | 'english' | 'chinese'

export interface WrongQuestionTag {
  id: string
  name: string
  color: string
}

export interface WrongQuestionItem {
  id: string
  subject: WrongQuestionSubject
  type: string
  question: string
  options?: string[]
  userAnswer: string
  correctAnswer: string
  wrongTime: number
  wrongCount: number
  tags: WrongQuestionTag[]
  mastered: boolean
  masteredTime?: number
  notes?: string
}

export interface WrongQuestionsState {
  questions: WrongQuestionItem[]
  filters: {
    subject?: WrongQuestionSubject
    type?: string
    mastered?: boolean
    searchKeyword?: string
  }
  tags: WrongQuestionTag[]
}

export interface StudyReportPeriod {
  daily: string
  weekly: string
  monthly: string
}

export interface WeaknessItem {
  id: string
  subject: WrongQuestionSubject
  type: string
  name: string
  errorRate: number
  wrongCount: number
  totalCount: number
  suggestions: string[]
}

export interface AbilityScore {
  subject: WrongQuestionSubject
  score: number
  maxScore: number
  trend: 'up' | 'down' | 'stable'
}

export interface StudyReportData {
  period: StudyReportPeriod
  totalStudyTime: number
  totalQuestions: number
  correctCount: number
  accuracy: number
  checkInDays: number
  checkInStreak: number
  abilityScores: AbilityScore[]
  weeklyWeaknesses: WeaknessItem[]
  monthlyWeaknesses: WeaknessItem[]
  dailyRecords: {
    date: string
    studyTime: number
    questions: number
    correct: number
  }[]
}

export interface StudyReportState {
  currentReport: StudyReportData | null
  reportHistory: StudyReportData[]
  loading: boolean
}
