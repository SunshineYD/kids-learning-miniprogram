<script setup lang="ts">
import type { AncientPoem } from '@/types'
import type { Semester } from '@/constants/chinese'
import PoemCard from '@/components/chinese/PoemCard.vue'

interface Props {
  semesters: Semester[]
  currentSemester: 1 | 2
  poems: AncientPoem[]
  isPoemCompleted: (poem: AncientPoem) => boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  switchSemester: [semester: 1 | 2]
  startPoemRecite: [poem: AncientPoem]
  startPoemWrite: [poem: AncientPoem]
}>()
</script>

<template>
  <view class="poem-tab">
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
    <scroll-view class="poems-list" scroll-y>
      <PoemCard
        v-for="poem in poems"
        :key="poem.id"
        :poem="poem"
        :completed="isPoemCompleted(poem)"
        @start-recite="(p) => emit('startPoemRecite', p)"
        @start-write="(p) => emit('startPoemWrite', p)"
      />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.poem-tab {
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

.poems-list {
  flex: 1;
}
</style>
