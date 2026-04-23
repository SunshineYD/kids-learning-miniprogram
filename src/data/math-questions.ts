import type { Grade, MathQuestion, MathQuestionType, MathDifficulty } from '@/types'

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function generateAddition(grade: Grade, difficulty: MathDifficulty, count: number): MathQuestion[] {
  const questions: MathQuestion[] = []
  for (let i = 0; i < count; i++) {
    let a: number, b: number, hasCarry = false
    if (grade === 1) {
      if (difficulty === 'basic') {
        a = Math.floor(Math.random() * 10)
        b = Math.floor(Math.random() * 10)
      } else if (difficulty === 'advanced') {
        a = Math.floor(Math.random() * 20)
        b = Math.floor(Math.random() * 20)
      } else {
        a = Math.floor(Math.random() * 30) + 10
        b = Math.floor(Math.random() * 30) + 10
        hasCarry = (a % 10) + (b % 10) >= 10
      }
    } else if (grade === 2) {
      if (difficulty === 'basic') {
        a = Math.floor(Math.random() * 50) + 10
        b = Math.floor(Math.random() * 50) + 10
      } else if (difficulty === 'advanced') {
        a = Math.floor(Math.random() * 100)
        b = Math.floor(Math.random() * 100)
        hasCarry = (a % 10) + (b % 10) >= 10
      } else {
        a = Math.floor(Math.random() * 200) + 100
        b = Math.floor(Math.random() * 200) + 100
        hasCarry = (a % 10) + (b % 10) >= 10 || (Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10) >= 10
      }
    } else if (grade === 3) {
      if (difficulty === 'basic') {
        a = Math.floor(Math.random() * 300) + 100
        b = Math.floor(Math.random() * 300) + 100
      } else if (difficulty === 'advanced') {
        a = Math.floor(Math.random() * 500) + 200
        b = Math.floor(Math.random() * 500) + 200
        hasCarry = true
      } else {
        a = Math.floor(Math.random() * 1000) + 500
        b = Math.floor(Math.random() * 1000) + 500
        hasCarry = true
      }
    } else {
      if (difficulty === 'basic') {
        a = Math.floor(Math.random() * 1000) + 500
        b = Math.floor(Math.random() * 1000) + 500
      } else if (difficulty === 'advanced') {
        a = Math.floor(Math.random() * 5000) + 1000
        b = Math.floor(Math.random() * 5000) + 1000
        hasCarry = true
      } else {
        a = Math.floor(Math.random() * 10000) + 5000
        b = Math.floor(Math.random() * 10000) + 5000
        hasCarry = true
      }
    }
    questions.push({
      id: generateId(),
      grade,
      type: 'addition',
      difficulty,
      expression: `${a} + ${b} = ?`,
      answer: a + b,
      hasCarry
    })
  }
  return questions
}

function generateSubtraction(grade: Grade, difficulty: MathDifficulty, count: number): MathQuestion[] {
  const questions: MathQuestion[] = []
  for (let i = 0; i < count; i++) {
    let a: number, b: number, hasBorrow = false
    if (grade === 1) {
      if (difficulty === 'basic') {
        a = Math.floor(Math.random() * 10) + 5
        b = Math.floor(Math.random() * a)
      } else if (difficulty === 'advanced') {
        a = Math.floor(Math.random() * 20) + 10
        b = Math.floor(Math.random() * a)
      } else {
        a = Math.floor(Math.random() * 30) + 20
        b = Math.floor(Math.random() * a)
        hasBorrow = (a % 10) < (b % 10)
      }
    } else if (grade === 2) {
      if (difficulty === 'basic') {
        a = Math.floor(Math.random() * 50) + 30
        b = Math.floor(Math.random() * a)
      } else if (difficulty === 'advanced') {
        a = Math.floor(Math.random() * 100) + 50
        b = Math.floor(Math.random() * a)
        hasBorrow = (a % 10) < (b % 10)
      } else {
        a = Math.floor(Math.random() * 200) + 150
        b = Math.floor(Math.random() * a)
        hasBorrow = (a % 10) < (b % 10) || (Math.floor(a / 10) % 10) < (Math.floor(b / 10) % 10)
      }
    } else if (grade === 3) {
      if (difficulty === 'basic') {
        a = Math.floor(Math.random() * 300) + 200
        b = Math.floor(Math.random() * a)
      } else if (difficulty === 'advanced') {
        a = Math.floor(Math.random() * 500) + 300
        b = Math.floor(Math.random() * a)
        hasBorrow = true
      } else {
        a = Math.floor(Math.random() * 1000) + 600
        b = Math.floor(Math.random() * a)
        hasBorrow = true
      }
    } else {
      if (difficulty === 'basic') {
        a = Math.floor(Math.random() * 1000) + 800
        b = Math.floor(Math.random() * a)
      } else if (difficulty === 'advanced') {
        a = Math.floor(Math.random() * 5000) + 2000
        b = Math.floor(Math.random() * a)
        hasBorrow = true
      } else {
        a = Math.floor(Math.random() * 10000) + 6000
        b = Math.floor(Math.random() * a)
        hasBorrow = true
      }
    }
    questions.push({
      id: generateId(),
      grade,
      type: 'subtraction',
      difficulty,
      expression: `${a} - ${b} = ?`,
      answer: a - b,
      hasBorrow
    })
  }
  return questions
}

function generateMultiplication(grade: Grade, difficulty: MathDifficulty, count: number): MathQuestion[] {
  const questions: MathQuestion[] = []
  if (grade < 2) return questions
  for (let i = 0; i < count; i++) {
    let a: number, b: number
    if (grade === 2) {
      if (difficulty === 'basic') {
        a = Math.floor(Math.random() * 5) + 1
        b = Math.floor(Math.random() * 5) + 1
      } else if (difficulty === 'advanced') {
        a = Math.floor(Math.random() * 9) + 1
        b = Math.floor(Math.random() * 9) + 1
      } else {
        a = Math.floor(Math.random() * 9) + 1
        b = Math.floor(Math.random() * 19) + 1
      }
    } else if (grade === 3) {
      if (difficulty === 'basic') {
        a = Math.floor(Math.random() * 9) + 1
        b = Math.floor(Math.random() * 29) + 10
      } else if (difficulty === 'advanced') {
        a = Math.floor(Math.random() * 19) + 10
        b = Math.floor(Math.random() * 19) + 10
      } else {
        a = Math.floor(Math.random() * 99) + 10
        b = Math.floor(Math.random() * 9) + 1
      }
    } else {
      if (difficulty === 'basic') {
        a = Math.floor(Math.random() * 99) + 10
        b = Math.floor(Math.random() * 19) + 1
      } else if (difficulty === 'advanced') {
        a = Math.floor(Math.random() * 99) + 10
        b = Math.floor(Math.random() * 99) + 10
      } else {
        a = Math.floor(Math.random() * 999) + 100
        b = Math.floor(Math.random() * 9) + 1
      }
    }
    questions.push({
      id: generateId(),
      grade,
      type: 'multiplication',
      difficulty,
      expression: `${a} × ${b} = ?`,
      answer: a * b
    })
  }
  return questions
}

function generateDivision(grade: Grade, difficulty: MathDifficulty, count: number): MathQuestion[] {
  const questions: MathQuestion[] = []
  if (grade < 2) return questions
  for (let i = 0; i < count; i++) {
    let a: number, b: number
    if (grade === 2) {
      if (difficulty === 'basic') {
        b = Math.floor(Math.random() * 5) + 1
        a = b * (Math.floor(Math.random() * 5) + 1)
      } else if (difficulty === 'advanced') {
        b = Math.floor(Math.random() * 9) + 1
        a = b * (Math.floor(Math.random() * 9) + 1)
      } else {
        b = Math.floor(Math.random() * 9) + 1
        a = b * (Math.floor(Math.random() * 19) + 1)
      }
    } else if (grade === 3) {
      if (difficulty === 'basic') {
        b = Math.floor(Math.random() * 9) + 1
        a = b * (Math.floor(Math.random() * 29) + 10)
      } else if (difficulty === 'advanced') {
        b = Math.floor(Math.random() * 19) + 1
        a = b * (Math.floor(Math.random() * 19) + 1)
      } else {
        b = Math.floor(Math.random() * 9) + 1
        a = b * (Math.floor(Math.random() * 99) + 10)
      }
    } else {
      if (difficulty === 'basic') {
        b = Math.floor(Math.random() * 19) + 1
        a = b * (Math.floor(Math.random() * 99) + 10)
      } else if (difficulty === 'advanced') {
        b = Math.floor(Math.random() * 99) + 1
        a = b * (Math.floor(Math.random() * 99) + 1)
      } else {
        b = Math.floor(Math.random() * 9) + 1
        a = b * (Math.floor(Math.random() * 999) + 100)
      }
    }
    questions.push({
      id: generateId(),
      grade,
      type: 'division',
      difficulty,
      expression: `${a} ÷ ${b} = ?`,
      answer: a / b
    })
  }
  return questions
}

function generateMixed(grade: Grade, difficulty: MathDifficulty, count: number): MathQuestion[] {
  const questions: MathQuestion[] = []
  const types = ['addition', 'subtraction', 'multiplication', 'division'] as MathQuestionType[]
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    let subQuestions: MathQuestion[] = []
    if (type === 'addition') {
      subQuestions = generateAddition(grade, difficulty, 1)
    } else if (type === 'subtraction') {
      subQuestions = generateSubtraction(grade, difficulty, 1)
    } else if (type === 'multiplication') {
      subQuestions = generateMultiplication(grade, difficulty, 1)
    } else if (type === 'division') {
      subQuestions = generateDivision(grade, difficulty, 1)
    }
    if (subQuestions.length > 0) {
      questions.push({
        ...subQuestions[0],
        type: 'mixed',
        id: generateId()
      })
    }
  }
  return questions
}

function generateUnitConversion(grade: Grade, difficulty: MathDifficulty, count: number): MathQuestion[] {
  const questions: MathQuestion[] = []
  const conversions = [
    { from: '米', to: '厘米', factor: 100 },
    { from: '厘米', to: '米', factor: 0.01 },
    { from: '分米', to: '厘米', factor: 10 },
    { from: '厘米', to: '分米', factor: 0.1 },
    { from: '米', to: '分米', factor: 10 },
    { from: '分米', to: '米', factor: 0.1 },
    { from: '千克', to: '克', factor: 1000 },
    { from: '克', to: '千克', factor: 0.001 },
    { from: '元', to: '角', factor: 10 },
    { from: '角', to: '元', factor: 0.1 },
    { from: '元', to: '分', factor: 100 },
    { from: '分', to: '元', factor: 0.01 },
    { from: '小时', to: '分钟', factor: 60 },
    { from: '分钟', to: '小时', factor: 1 / 60 },
    { from: '分钟', to: '秒', factor: 60 },
    { from: '秒', to: '分钟', factor: 1 / 60 }
  ]
  for (let i = 0; i < count; i++) {
    const conv = conversions[Math.floor(Math.random() * conversions.length)]
    let value: number
    if (difficulty === 'basic') {
      value = Math.floor(Math.random() * 10) + 1
    } else if (difficulty === 'advanced') {
      value = Math.floor(Math.random() * 50) + 10
    } else {
      value = Math.floor(Math.random() * 100) + 20
    }
    const answer = value * conv.factor
    questions.push({
      id: generateId(),
      grade,
      type: 'unit-conversion',
      difficulty,
      expression: `${value} ${conv.from} = ( ) ${conv.to}`,
      answer: Number.isInteger(answer) ? answer : answer.toFixed(2),
      unit: conv.to
    })
  }
  return questions
}

export function generateQuestions(
  grade: Grade,
  type: MathQuestionType,
  difficulty: MathDifficulty,
  count: number = 10
): MathQuestion[] {
  let questions: MathQuestion[] = []
  switch (type) {
    case 'addition':
      questions = generateAddition(grade, difficulty, count)
      break
    case 'subtraction':
      questions = generateSubtraction(grade, difficulty, count)
      break
    case 'multiplication':
      questions = generateMultiplication(grade, difficulty, count)
      break
    case 'division':
      questions = generateDivision(grade, difficulty, count)
      break
    case 'mixed':
      questions = generateMixed(grade, difficulty, count)
      break
    case 'unit-conversion':
      questions = generateUnitConversion(grade, difficulty, count)
      break
  }
  return questions.sort(() => Math.random() - 0.5)
}

export function generateSimilarQuestions(question: MathQuestion, count: number = 3): MathQuestion[] {
  return generateQuestions(question.grade, question.type, question.difficulty, count)
}

export const mathQuestionTypes = [
  { key: 'addition', name: '加法', icon: '➕' },
  { key: 'subtraction', name: '减法', icon: '➖' },
  { key: 'multiplication', name: '乘法', icon: '✖️', minGrade: 2 },
  { key: 'division', name: '除法', icon: '➗', minGrade: 2 },
  { key: 'mixed', name: '混合运算', icon: '🔢' },
  { key: 'unit-conversion', name: '单位换算', icon: '📏' }
]

export const mathDifficulties = [
  { key: 'basic', name: '基础', color: '#4ECDC4' },
  { key: 'advanced', name: '进阶', color: '#FFE66D' },
  { key: 'challenge', name: '挑战', color: '#FF6B6B' }
]
