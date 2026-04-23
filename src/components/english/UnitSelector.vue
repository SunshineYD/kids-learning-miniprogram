<script setup lang="ts">
import { computed } from 'vue'
import { useEnglishStore } from '@/store/english'
import { getUnitsByGrade } from '@/data/english-words'

const englishStore = useEnglishStore()

const units = computed(() => {
  return getUnitsByGrade(englishStore.currentGrade, englishStore.currentVersion)
})

const selectUnit = (unit: number) => {
  englishStore.setUnit(unit)
}
</script>

<template>
  <view class="unit-selector">
    <view class="selector-title">📝 选择单元</view>
    <view class="unit-options">
      <view
        v-for="unit in units"
        :key="unit"
        class="unit-option"
        :class="{ 'unit-active': englishStore.currentUnit === unit }"
        @click="selectUnit(unit)"
      >
        <text class="unit-number">{{ unit }}</text>
        <text class="unit-label">单元</text>
      </view>
    </view>
    <view class="unit-info">
      <text class="info-text">当前单元共 {{ englishStore.currentWords.length }} 个单词</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.unit-selector {
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

.unit-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.unit-option {
  flex: 0 0 calc(25% - 10rpx);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 16rpx;
  background: rgba(255, 255, 255, 0.8);
  border: 3rpx solid rgba(255, 193, 7, 0.2);
  border-radius: 12rpx;
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
  }
}

.unit-active {
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  border-color: #FFD93D;
}

.unit-number {
  font-size: 32rpx;
  font-weight: 800;
  color: #333;
  line-height: 1;
}

.unit-active .unit-number {
  color: #5D4E37;
}

.unit-label {
  font-size: 20rpx;
  color: #999;
  margin-top: 4rpx;
}

.unit-active .unit-label {
  color: #8B7355;
}

.unit-info {
  text-align: center;
  padding-top: 16rpx;
  border-top: 2rpx dashed rgba(255, 193, 7, 0.3);
}

.info-text {
  font-size: 24rpx;
  color: #666;
}
</style>
