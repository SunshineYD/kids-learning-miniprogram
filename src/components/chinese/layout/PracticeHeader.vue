<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()

const emit = defineEmits<{
  back: []
}>()

const handleBack = () => {
  emit('back')
}
</script>

<template>
  <view class="practice-header">
    <view class="back-btn" @click="handleBack">←</view>
    <view class="practice-title">{{ title }}</view>
  </view>
</template>

<style lang="scss" scoped>
.practice-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  padding-top: calc(var(--spacing-md) + var(--status-bar-height, 44rpx));
  background: linear-gradient(135deg, var(--secondary-color), var(--success-color));
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: var(--text-white);
  font-weight: 700;
  margin-right: var(--spacing-md);
}

.practice-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-white);
}
</style>
