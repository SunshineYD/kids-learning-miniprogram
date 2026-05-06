<script setup lang="ts">
import type { ChineseLesson } from '@/types'
import type { Semester } from '@/constants/chinese'
import LessonCard from '@/components/chinese/LessonCard.vue'

interface Props {
  semesters: Semester[]
  currentSemester: 1 | 2
  lessons: ChineseLesson[]
  isLessonCompleted: (lesson: ChineseLesson) => boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  switchSemester: [semester: 1 | 2]
  startDictation: [lesson: ChineseLesson]
  startPinyin: [lesson: ChineseLesson]
  startWordSentence: [lesson: ChineseLesson]
}>()
</script>

<template>
  <view class="textbook-tab">
    <view class="semester-selector">
      <view
        v-for="sem in semesters"
        :key="sem.id"
        class="semester-btn"
        :class="{ active: currentSemester === sem.id }"
        @click="emit('switchSemester', sem.id)"
      >
        {{ sem.name }}
      </view>
    </view>
    <scroll-view class="lessons-list" scroll-y>
      <LessonCard
        v-for="lesson in lessons"
        :key="lesson.id"
        :lesson="lesson"
        :completed="isLessonCompleted(lesson)"
        @start-dictation="(l) => emit('startDictation', l)"
        @start-pinyin="(l) => emit('startPinyin', l)"
        @start-word-sentence="(l) => emit('startWordSentence', l)"
      />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.textbook-tab {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.semester-selector {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.semester-btn {
  flex: 1;
  text-align: center;
  padding: var(--spacing-sm);
  background: var(--bg-white);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-secondary);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.semester-btn.active {
  background: linear-gradient(135deg, var(--secondary-color), var(--success-color));
  color: var(--text-white);
}

.lessons-list {
  flex: 1;
}
</style>
