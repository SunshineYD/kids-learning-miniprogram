import { useSettingsStore } from '@/store/settings'

export const audio = {
  playCorrect() {
    const settings = useSettingsStore()
    if (!settings.soundEnabled) return
    
    try {
      const innerAudioContext = uni.createInnerAudioContext()
      innerAudioContext.src = '/static/sounds/correct.mp3'
      innerAudioContext.play()
      innerAudioContext.onEnded(() => {
        innerAudioContext.destroy()
      })
    } catch (e) {
      console.error('播放音效失败:', e)
    }
  },

  playWrong() {
    const settings = useSettingsStore()
    if (!settings.soundEnabled) return
    
    try {
      const innerAudioContext = uni.createInnerAudioContext()
      innerAudioContext.src = '/static/sounds/wrong.mp3'
      innerAudioContext.play()
      innerAudioContext.onEnded(() => {
        innerAudioContext.destroy()
      })
    } catch (e) {
      console.error('播放音效失败:', e)
    }
  },

  playClick() {
    const settings = useSettingsStore()
    if (!settings.soundEnabled) return
    
    try {
      const innerAudioContext = uni.createInnerAudioContext()
      innerAudioContext.src = '/static/sounds/click.mp3'
      innerAudioContext.play()
      innerAudioContext.onEnded(() => {
        innerAudioContext.destroy()
      })
    } catch (e) {
      console.error('播放音效失败:', e)
    }
  },

  playSuccess() {
    const settings = useSettingsStore()
    if (!settings.soundEnabled) return
    
    try {
      const innerAudioContext = uni.createInnerAudioContext()
      innerAudioContext.src = '/static/sounds/success.mp3'
      innerAudioContext.play()
      innerAudioContext.onEnded(() => {
        innerAudioContext.destroy()
      })
    } catch (e) {
      console.error('播放音效失败:', e)
    }
  }
}
