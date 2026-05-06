<script setup lang="ts">
import { useChineseStore } from '@/store/chinese'
import ResultDisplay from '@/components/chinese/layout/ResultDisplay.vue'
import DictationPractice from '@/components/chinese/practice/DictationPractice.vue'
import PinyinPractice from '@/components/chinese/practice/PinyinPractice.vue'
import WordSentencePractice from '@/components/chinese/practice/WordSentencePractice.vue'
import PoemRecitePractice from '@/components/chinese/practice/PoemRecitePractice.vue'
import PoemWritePractice from '@/components/chinese/practice/PoemWritePractice.vue'
import OptionPractice from '@/components/chinese/practice/OptionPractice.vue'
import type { ChineseLesson, AncientPoem, ReadingArticle } from '@/types'
import type { PracticeMode } from '@/constants/chinese'
import { PRACTICE_MODES } from '@/constants/chinese'

interface Props {
  mode: PracticeMode
  currentLesson: ChineseLesson | null
  currentPoem: AncientPoem | null
  currentArticle: ReadingArticle | null
  showResult: boolean
  resultScore: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  back: []
  complete: [score: number]
  confirm: []
}>()

const chineseStore = useChineseStore()

const handleReadingSubmit = () => {
  if (props.currentArticle) {
    chineseStore.submitReading(props.currentArticle)
    emit('complete', chineseStore.currentReading?.score ?? 0)
  }
}

const handleCommonSenseSubmit = () => {
  chineseStore.submitCommonSense()
  emit('complete', chineseStore.currentCommonSense?.score ?? 0)
}
</script>

<template>
  <view v-if="mode === PRACTICE_MODES.DICTATION">
    <DictationPractice @back="emit('back')" @complete="emit('complete')" />
  </view>

  <view v-else-if="mode === PRACTICE_MODES.PINYIN">
    <PinyinPractice @back="emit('back')" @complete="emit('complete')" />
  </view>

  <view v-else-if="mode === PRACTICE_MODES.WORD_SENTENCE">
    <WordSentencePractice @back="emit('back')" @complete="emit('complete')" />
  </view>

  <view v-else-if="mode === PRACTICE_MODES.POEM_RECITE && currentPoem">
    <PoemRecitePractice
      :poem="currentPoem"
      @back="emit('back')"
      @complete="emit('complete')"
    />
  </view>

  <view v-else-if="mode === PRACTICE_MODES.POEM_WRITE && currentPoem">
    <PoemWritePractice
      :poem="currentPoem"
      @back="emit('back')"
      @complete="emit('complete')"
    />
  </view>

  <view v-else-if="mode === PRACTICE_MODES.READING && currentArticle && chineseStore.currentReading">
    <OptionPractice
      title="课外阅读"
      :article="currentArticle"
      :questions="currentArticle.questions"
      :current-index="chineseStore.currentReading.currentQuestionIndex"
      :user-answers="chineseStore.currentReading.userAnswers"
      @back="emit('back')"
      @complete="emit('complete')"
      @save-answer="(idx, ans) => chineseStore.saveReadingAnswer(idx, ans)"
      @next-question="chineseStore.nextReadingQuestion"
      @prev-question="chineseStore.prevReadingQuestion"
      @submit="handleReadingSubmit"
    />
  </view>

  <view v-else-if="mode === PRACTICE_MODES.COMMON_SENSE && chineseStore.currentCommonSense">
    <OptionPractice
      title="语文常识"
      :questions="chineseStore.currentCommonSense.questions"
      :current-index="chineseStore.currentCommonSense.currentIndex"
      :user-answers="chineseStore.currentCommonSense.userAnswers"
      @back="emit('back')"
      @complete="emit('complete')"
      @save-answer="(idx, ans) => chineseStore.saveCommonSenseAnswer(idx, ans)"
      @next-question="chineseStore.nextCommonSense"
      @prev-question="chineseStore.prevCommonSense"
      @submit="handleCommonSenseSubmit"
    />
  </view>

  <ResultDisplay
    :show="showResult"
    :score="resultScore"
    @confirm="emit('confirm')"
  />
</template>
