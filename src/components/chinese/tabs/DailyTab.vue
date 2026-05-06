<script setup lang="ts">
import type { ReadingArticle } from '@/types'
import DailyTaskCard from '@/components/chinese/DailyTaskCard.vue'

interface Props {
  dailyPracticeCompleted: boolean
  todayReading: ReadingArticle | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  startReading: [article: ReadingArticle]
  startCommonSense: []
}>()

const handleReadingClick = () => {
  if (props.todayReading) {
    emit('startReading', props.todayReading)
  }
}
</script>

<template>
  <view class="daily-tab">
    <view v-if="dailyPracticeCompleted" class="completed-banner">
      <text class="banner-emoji">🎉</text>
      <text class="banner-text">今日练习已完成！明天继续加油！</text>
    </view>
    <view v-else class="daily-tasks">
      <DailyTaskCard
        icon="📖"
        title="课外阅读"
        :desc="todayReading?.title || '今日阅读'"
        gradient="linear-gradient(135deg, #e0f7fa, #b2ebf2)"
        @click="handleReadingClick"
      />
      <DailyTaskCard
        icon="🧠"
        title="语文常识"
        desc="5道趣味题目"
        gradient="linear-gradient(135deg, #fff3e0, #ffe0b2)"
        @click="emit('startCommonSense')"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.daily-tab {
  display: flex;
  flex-direction: column;
}

.completed-banner {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  box-shadow: var(--shadow-md);
}

.banner-emoji {
  font-size: 80rpx;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.banner-text {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-white);
}

.daily-tasks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
</style>
