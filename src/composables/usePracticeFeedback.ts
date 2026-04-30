import { ref, computed } from 'vue'
import { audio } from '@/utils/audio'

export function usePracticeFeedback() {
  const showFeedback = ref(false)
  const isCorrect = ref(false)
  const correctAnswer = ref('')

  const showCorrect = (answer: string) => {
    showFeedback.value = true
    isCorrect.value = true
    correctAnswer.value = answer
    audio.playCorrect()
  }

  const showWrong = (answer: string) => {
    showFeedback.value = true
    isCorrect.value = false
    correctAnswer.value = answer
    audio.playWrong()
  }

  const reset = () => {
    showFeedback.value = false
    isCorrect.value = false
    correctAnswer.value = ''
  }

  const checkAnswer = (userAnswer: string, rightAnswer: string) => {
    if (userAnswer.trim() === rightAnswer) {
      showCorrect(rightAnswer)
      return true
    } else {
      showWrong(rightAnswer)
      return false
    }
  }

  return {
    showFeedback,
    isCorrect,
    correctAnswer,
    checkAnswer,
    showCorrect,
    showWrong,
    reset
  }
}
