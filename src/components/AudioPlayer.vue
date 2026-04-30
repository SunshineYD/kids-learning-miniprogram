<script setup lang="ts">
import { ref } from 'vue'
import { audio } from '@/utils/audio'

interface Props {
  text: string
  size?: 'small' | 'medium' | 'large'
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  color: '#4ECDC4'
})

const isPlaying = ref(false)

const handlePlay = () => {
  if (isPlaying.value) {
    audio.stopSpeak()
    isPlaying.value = false
    return
  }
  
  isPlaying.value = true
  audio.speak(props.text, () => {
    isPlaying.value = false
  })
}

const getButtonSize = () => {
  const sizes = {
    small: 60,
    medium: 80,
    large: 100
  }
  return sizes[props.size]
}

const getIconSize = () => {
  const sizes = {
    small: 28,
    medium: 36,
    large: 44
  }
  return sizes[props.size]
}
</script>

<template>
  <view 
    class="audio-button"
    :style="{ 
      width: getButtonSize() + 'rpx', 
      height: getButtonSize() + 'rpx',
      background: isPlaying ? '#FFE66D' : color
    }"
    @click="handlePlay"
  >
    <text class="speaker-icon" :style="{ fontSize: getIconSize() + 'rpx' }">
      {{ isPlaying ? '🔊' : '🔊' }}
    </text>
  </view>
</template>

<style lang="scss" scoped>
.audio-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  cursor: pointer;
  position: relative;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  z-index: 1;
  flex-shrink: 0;
  
  &:active {
    transform: scale(0.95);
  }
}

.speaker-icon {
  z-index: 10;
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.2));
  position: relative;
}
</style>
