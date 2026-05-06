<script setup lang="ts">
interface Props {
  icon: string
  title: string
  desc: string
  gradient: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <view 
    class="task-card" 
    :style="{ background: props.gradient }"
    @click="emit('click')"
  >
    <view class="task-icon">{{ icon }}</view>
    <view class="task-info">
      <view class="task-title">{{ title }}</view>
      <view class="task-desc">{{ desc }}</view>
    </view>
    <view class="task-arrow">→</view>
  </view>
</template>

<style lang="scss" scoped>
.task-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);

  &:active {
    transform: scale(0.95);
  }
}

.task-icon {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
}

.task-info {
  flex: 1;
}

.task-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.task-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.task-arrow {
  font-size: 32rpx;
  color: var(--text-light);
}
</style>
