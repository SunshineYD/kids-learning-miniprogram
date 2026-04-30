import { useSettingsStore } from '@/store/settings'

let audioContext: any = null

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
  },

  speak(text: string, onEnd?: () => void) {
    const settings = useSettingsStore()
    if (!settings.soundEnabled) return

    try {
      if (audioContext) {
        audioContext.stop()
        audioContext.destroy()
      }

      if (typeof uni !== 'undefined') {
        if (typeof uni.showToast === 'function') {
          uni.showToast({
            title: '🔊 朗读功能开发中',
            icon: 'none',
            duration: 1500
          })
        }
        
        setTimeout(() => {
          if (onEnd) onEnd()
        }, 1000)
        
      } else if (typeof window !== 'undefined' && (window as any).speechSynthesis) {
        const utterance = new (window as any).SpeechSynthesisUtterance(text)
        utterance.lang = 'zh-CN'
        utterance.rate = 0.9
        utterance.pitch = 1.1
        utterance.volume = 1
        
        if (onEnd) {
          utterance.onend = onEnd
        }
        
        (window as any).speechSynthesis.speak(utterance)
      }
      
    } catch (e) {
      console.error('朗读失败:', e)
    }
  },

  stopSpeak() {
    try {
      if (typeof window !== 'undefined' && (window as any).speechSynthesis) {
        (window as any).speechSynthesis.cancel()
      }
      if (audioContext) {
        audioContext.stop()
        audioContext.destroy()
        audioContext = null
      }
    } catch (e) {
      console.error('停止朗读失败:', e)
    }
  }
}
