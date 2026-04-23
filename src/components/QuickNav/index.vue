<script setup lang="ts">
import { useAppStore } from '@/store/app'
import type { QuickNavItem } from '@/types'

const appStore = useAppStore()

const handleNavClick = (item: QuickNavItem) => {
  uni.navigateTo({
    url: item.path,
    fail: () => {
      uni.showToast({
        title: `${item.name}开发中...`,
        icon: 'none'
      })
    }
  })
}
</script>

<template>
  <view class="quick-nav">
    <view class="nav-title">
      <text class="icon">🚀</text>
      <text>快捷入口</text>
    </view>
    <view class="nav-grid">
      <view
        v-for="item in appStore.quickNavItems"
        :key="item.id"
        class="nav-item"
        @click="handleNavClick(item)"
      >
        <view class="nav-icon" :style="{ background: item.color }">
          <text>{{ item.icon }}</text>
        </view>
        <view class="nav-name">{{ item.name }}</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.quick-nav {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  margin: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.nav-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);

  .icon {
    font-size: 40rpx;
  }
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-sm);
  transition: all var(--transition-fast);

  &:active {
    transform: scale(0.95);
  }
}

.nav-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-sm);
  border: 4rpx solid rgba(255, 255, 255, 0.5);
}

.nav-name {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  font-weight: 600;
  text-align: center;
}
</style>
