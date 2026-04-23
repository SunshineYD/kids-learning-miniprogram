<script setup lang="ts">
import { useEnglishStore } from '@/store/english'
import type { TextbookVersion } from '@/types'

const englishStore = useEnglishStore()

const selectVersion = (version: TextbookVersion) => {
  englishStore.setVersion(version)
}
</script>

<template>
  <view class="version-selector">
    <view class="selector-title">📚 选择教材版本</view>
    <view class="version-options">
      <view
        class="version-option"
        :class="{ 'version-active': englishStore.currentVersion === 'renjiao' }"
        @click="selectVersion('renjiao')"
      >
        <text class="version-icon">📖</text>
        <text class="version-name">人教版</text>
      </view>
      <view
        class="version-option"
        :class="{ 'version-active': englishStore.currentVersion === 'waiyan' }"
        @click="selectVersion('waiyan')"
      >
        <text class="version-icon">📗</text>
        <text class="version-name">外研版</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.version-selector {
  background: linear-gradient(135deg, #FFFDF5 0%, #FFF8E1 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 193, 7, 0.15);
}

.selector-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
  text-align: center;
}

.version-options {
  display: flex;
  gap: 16rpx;
}

.version-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.8);
  border: 3rpx solid rgba(255, 193, 7, 0.2);
  border-radius: 16rpx;
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.version-active {
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  border-color: #FFD93D;
}

.version-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.version-name {
  font-size: 26rpx;
  color: #333;
  font-weight: 600;
}

.version-active .version-name {
  color: #5D4E37;
}
</style>
