<script setup lang="ts">
interface Props {
  canPrev?: boolean
  canNext?: boolean
  prevText?: string
  nextText: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canPrev: true,
  canNext: true,
  prevText: '上一题',
  disabled: false
})

const emit = defineEmits<{
  prev: []
  next: []
}>()

const handlePrev = () => {
  if (props.canPrev) emit('prev')
}

const handleNext = () => {
  if (props.canNext && !props.disabled) emit('next')
}
</script>

<template>
  <view class="nav-buttons">
    <view
      class="nav-btn prev"
      :class="{ disabled: !canPrev }"
      @click="handlePrev"
    >
      {{ prevText }}
    </view>
    <view class="nav-btn next" :class="{ disabled }" @click="handleNext">
      {{ nextText }}
    </view>
  </view>
</template>

<style lang="scss" scoped>
.nav-buttons {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.nav-btn {
  flex: 1;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: 700;
  text-align: center;
  transition: all var(--transition-fast);
}

.nav-btn.prev {
  background: #e8f5f2;
  color: var(--text-secondary);
}

.nav-btn.next {
  background: linear-gradient(135deg, var(--secondary-color), var(--success-color));
  color: var(--text-white);
}

.nav-btn.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
