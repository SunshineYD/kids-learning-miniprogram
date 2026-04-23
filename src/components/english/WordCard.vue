<script setup lang="ts">
import { useEnglishStore } from '@/store/english'
import type { EnglishWord } from '@/types'

interface Props {
  word: EnglishWord
  showTranslation?: boolean
  showExample?: boolean
  showPhrases?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTranslation: true,
  showExample: true,
  showPhrases: true
})

const englishStore = useEnglishStore()

const playAudio = () => {
  englishStore.playWordAudio(props.word.word)
}
</script>

<template>
  <view class="word-card">
    <view class="word-header" @click="playAudio">
      <text class="word-text">{{ word.word }}</text>
      <view class="audio-icon">🔊</view>
    </view>
    <text class="phonetic" v-if="word.phonetic">{{ word.phonetic }}</text>
    <text class="translation" v-if="showTranslation">{{ word.translation }}</text>
    <view class="example" v-if="showExample && word.example">
      <text class="example-text">{{ word.example }}</text>
      <text class="example-translation" v-if="word.exampleTranslation">{{ word.exampleTranslation }}</text>
    </view>
    <view class="phrases" v-if="showPhrases && word.phrases && word.phrases.length > 0">
      <view class="phrase-item" v-for="(phrase, index) in word.phrases" :key="index">
        <text class="phrase-text">{{ phrase }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.word-card {
  background: linear-gradient(135deg, #FFFDF5 0%, #FFF8E1 100%);
  border-radius: 20rpx;
  padding: 40rpx;
  margin: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 193, 7, 0.15);
  border: 3rpx solid rgba(255, 193, 7, 0.2);
}

.word-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.word-text {
  font-size: 56rpx;
  font-weight: 800;
  color: #FF6B6B;
  letter-spacing: 2rpx;
}

.audio-icon {
  font-size: 40rpx;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(1.2);
  }
}

.phonetic {
  display: block;
  text-align: center;
  font-size: 32rpx;
  color: #95E1D3;
  margin-bottom: 20rpx;
  font-family: 'Arial', sans-serif;
}

.translation {
  display: block;
  text-align: center;
  font-size: 36rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 30rpx;
}

.example {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.example-text {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 8rpx;
  font-style: italic;
}

.example-translation {
  display: block;
  font-size: 26rpx;
  color: #999;
}

.phrases {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.phrase-item {
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  border-radius: 20rpx;
  padding: 12rpx 24rpx;
}

.phrase-text {
  font-size: 24rpx;
  color: #5D4E37;
  font-weight: 500;
}
</style>
