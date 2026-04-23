<script setup lang="ts">
interface Props {
  type?: 'primary' | 'secondary' | 'success' | 'warning'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'medium',
  disabled: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const handleClick = () => {
  if (!props.disabled) {
    emit('click')
  }
}

const typeColors = {
  primary: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
  secondary: 'linear-gradient(135deg, #4ecdc4, #7edcd6)',
  success: 'linear-gradient(135deg, #95e1d3, #b8ede6)',
  warning: 'linear-gradient(135deg, #ffe66d, #fff0a5)'
}

const sizeClasses = {
  small: 'height: 80rpx; font-size: 28rpx;',
  medium: 'height: 100rpx; font-size: 32rpx;',
  large: 'height: 120rpx; font-size: 36rpx;'
}
</script>

<template>
  <view
    class="kid-button"
    :class="{ disabled }"
    :style="{ background: typeColors[type], ...sizeStyles }"
    @click="handleClick"
  >
    <slot></slot>
  </view>
</template>

<style lang="scss" scoped>
.kid-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: var(--border-radius-xl);
  font-weight: 700;
  color: var(--text-white);
  border: 6rpx solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  transition: all var(--transition-fast);

  &:active:not(.disabled) {
    transform: scale(0.96);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
