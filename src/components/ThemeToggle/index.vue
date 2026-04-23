<script setup lang="ts">
import { useSettingsStore } from '@/store/settings'
import type { ThemeType } from '@/store/settings'

const settings = useSettingsStore()

interface ThemeOption {
  value: ThemeType
  label: string
  icon: string
  color: string
}

const themes: ThemeOption[] = [
  {
    value: 'light',
    label: '浅色',
    icon: '☀️',
    color: '#FFE66D'
  },
  {
    value: 'eye',
    label: '护眼',
    icon: '🌿',
    color: '#95E1D3'
  },
  {
    value: 'dark',
    label: '深色',
    icon: '🌙',
    color: '#AA96DA'
  }
]

function selectTheme(theme: ThemeType) {
  settings.setTheme(theme)
}
</script>

<template>
  <view class="theme-toggle">
    <view class="theme-options">
      <view
        v-for="item in themes"
        :key="item.value"
        class="theme-option"
        :class="{ active: settings.theme === item.value }"
        :style="{ '--theme-color': item.color }"
        @tap="selectTheme(item.value)"
      >
        <view class="theme-icon">{{ item.icon }}</view>
        <view class="theme-label">{{ item.label }}</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.theme-toggle {
  padding: 16rpx 0;
}

.theme-options {
  display: flex;
  gap: 16rpx;
  justify-content: center;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 24rpx 32rpx;
  border-radius: 24rpx;
  background-color: var(--bg-card);
  border: 3rpx solid var(--border-color);
  transition: all 0.3s ease;
  min-width: 140rpx;
}

.theme-option.active {
  border-color: var(--theme-color);
  background-color: color-mix(in srgb, var(--theme-color) 15%, var(--bg-card));
  transform: scale(1.05);
}

.theme-icon {
  font-size: 48rpx;
  line-height: 1;
}

.theme-label {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 500;
}
</style>
