import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Course } from '@/types'

export const useCourseStore = defineStore('course', () => {
  const courses = ref<Course[]>([
    {
      id: 1,
      title: '趣味数学',
      description: '让孩子爱上数学的奇妙世界',
      cover: '/static/course/math.png',
      category: '数学',
      duration: 30,
      difficulty: 'easy'
    },
    {
      id: 2,
      title: '语文阅读',
      description: '培养阅读兴趣，提升表达能力',
      cover: '/static/course/chinese.png',
      category: '语文',
      duration: 25,
      difficulty: 'easy'
    },
    {
      id: 3,
      title: '英语启蒙',
      description: '轻松学英语，快乐每一天',
      cover: '/static/course/english.png',
      category: '英语',
      duration: 20,
      difficulty: 'easy'
    },
    {
      id: 4,
      title: '科学探索',
      description: '探索科学，发现未知',
      cover: '/static/course/science.png',
      category: '科学',
      duration: 35,
      difficulty: 'medium'
    }
  ])

  const currentCourse = ref<Course | null>(null)

  const setCurrentCourse = (course: Course) => {
    currentCourse.value = course
  }

  return {
    courses,
    currentCourse,
    setCurrentCourse
  }
})
