<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string
  total: number
}

const props = defineProps<Props>()

const currentIndex = ref(0)

defineExpose({
  next: () => {
    if (currentIndex.value < props.total - 1) {
      currentIndex.value++
    }
  },
  prev: () => {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  },
  setIndex: (index: number) => {
    currentIndex.value = index
  }
})
</script>

<template>
  <view class="progress-header">
    <view class="progress-title">{{ title }}</view>
    <view class="progress-info">
      <text class="current">{{ currentIndex + 1 }}</text>
      <text class="separator">/</text>
      <text class="total">{{ total }}</text>
    </view>
  </view>
  <view class="progress-bar-container">
    <view class="progress-bar" :style="{ width: ((currentIndex + 1) / total * 100) + '%' }"></view>
  </view>
  <view class="progress-dots">
    <view
      v-for="i in total"
      :key="i"
      class="dot"
      :class="{ active: i - 1 <= currentIndex }"
    ></view>
  </view>
</template>

<style lang="scss" scoped>
.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.progress-title {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--text-primary);
}

.progress-info {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--secondary-color);
}

.current {
  font-size: var(--font-size-xl);
}

.separator {
  margin: 0 4rpx;
}

.progress-bar-container {
  width: 100%;
  height: 12rpx;
  background: #e8f5f2;
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: var(--spacing-sm);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--secondary-color), var(--success-color));
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 8rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #e8f5f2;
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--secondary-color);
}
</style>
