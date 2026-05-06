<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useChineseStore } from '@/store/chinese'
import TextbookTab from '@/components/chinese/tabs/TextbookTab.vue'
import PoemTab from '@/components/chinese/tabs/PoemTab.vue'
import DailyTab from '@/components/chinese/tabs/DailyTab.vue'
import PageHeader from '@/components/chinese/PageHeader.vue'
import TabsContainer from '@/components/chinese/TabsContainer.vue'
import PracticeModeRouter from '@/components/chinese/PracticeModeRouter.vue'
import { TABS, SEMESTERS, PRACTICE_MODES } from '@/constants/chinese'
import { useChinesePractice } from '@/composables/useChinesePractice'

const chineseStore = useChineseStore()
const {
  activeTab,
  practiceMode,
  currentLesson,
  currentPoem,
  currentArticle,
  showResult,
  resultScore,
  switchTab,
  startDictation,
  startPinyin,
  startWordSentence,
  startPoemRecite,
  startPoemWrite,
  startReading,
  startCommonSense,
  handlePracticeComplete,
  backToList,
  isLessonCompleted,
  isPoemCompleted,
} = useChinesePractice()

const todayReading = computed(() => {
  if (!chineseStore.readings || chineseStore.readings.length === 0) return null
  return chineseStore.readings[0] || null
})

const dailyPracticeCompleted = computed(() => {
  return chineseStore.todayDailyPractice?.completed ?? false
})

onMounted(() => {
  chineseStore.init()
})
</script>

<template>
  <view v-if="practiceMode === PRACTICE_MODES.LIST" class="chinese-practice-page">
    <PageHeader />
    <view class="page-content">
      <TabsContainer
        :tabs="TABS"
        :active-tab="activeTab"
        @switch-tab="switchTab"
      />

      <TextbookTab
        v-if="activeTab === 'textbook'"
        :semesters="SEMESTERS"
        :current-semester="chineseStore.currentSemester"
        :lessons="chineseStore.lessons"
        :is-lesson-completed="isLessonCompleted"
        @switch-semester="chineseStore.setSemester"
        @start-dictation="startDictation"
        @start-pinyin="startPinyin"
        @start-word-sentence="startWordSentence"
      />

      <PoemTab
        v-else-if="activeTab === 'poem'"
        :semesters="SEMESTERS"
        :current-semester="chineseStore.currentSemester"
        :poems="chineseStore.poems"
        :is-poem-completed="isPoemCompleted"
        @switch-semester="chineseStore.setSemester"
        @start-poem-recite="startPoemRecite"
        @start-poem-write="startPoemWrite"
      />

      <DailyTab
        v-else-if="activeTab === 'daily'"
        :daily-practice-completed="dailyPracticeCompleted"
        :today-reading="todayReading"
        @start-reading="startReading"
        @start-common-sense="startCommonSense"
      />
    </view>
  </view>

  <PracticeModeRouter
    v-else
    :mode="practiceMode"
    :current-lesson="currentLesson"
    :current-poem="currentPoem"
    :current-article="currentArticle"
    :show-result="showResult"
    :result-score="resultScore"
    @back="backToList"
    @complete="handlePracticeComplete"
    @confirm="backToList"
  />
</template>

<style lang="scss" scoped>
.chinese-practice-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.page-content {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 280rpx);
}
</style>
