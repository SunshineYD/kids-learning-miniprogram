<script setup lang="ts">
import type { Tab } from '@/constants/chinese'

interface Props {
  tabs: Tab[]
  activeTab: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  switchTab: [tabId: string]
}>()
</script>

<template>
  <view class="tabs-container">
    <view
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-item"
      :class="{ active: activeTab === tab.id }"
      @click="emit('switchTab', tab.id)"
    >
      <text class="tab-icon">{{ tab.icon }}</text>
      <text class="tab-text">{{ tab.name }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.tabs-container {
  display: flex;
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: 8rpx;
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.tab-item.active {
  background: linear-gradient(135deg, var(--secondary-color), var(--success-color));
}

.tab-icon {
  font-size: 40rpx;
  margin-bottom: 4rpx;
}

.tab-text {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
}

.tab-item.active .tab-text {
  color: var(--text-white);
}
</style>
