export const storage = {
  set<T>(key: string, value: T): void {
    try {
      uni.setStorageSync(key, JSON.stringify(value))
    } catch (e) {
      console.error('Storage set error:', e)
    }
  },

  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const data = uni.getStorageSync(key)
      if (data) {
        return JSON.parse(data) as T
      }
    } catch (e) {
      console.error('Storage get error:', e)
    }
    return defaultValue
  },

  remove(key: string): void {
    try {
      uni.removeStorageSync(key)
    } catch (e) {
      console.error('Storage remove error:', e)
    }
  },

  clear(): void {
    try {
      uni.clearStorageSync()
    } catch (e) {
      console.error('Storage clear error:', e)
    }
  }
}
