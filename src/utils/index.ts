export * from './storage'

export const formatTime = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${[year, month, day].map(n => n.toString().padStart(2, '0')).join('-')}`
}

export const showToast = (title: string, icon: 'success' | 'error' | 'loading' | 'none' = 'none'): void => {
  uni.showToast({
    title,
    icon,
    duration: 2000
  })
}

export const showLoading = (title: string = '加载中...'): void => {
  uni.showLoading({
    title,
    mask: true
  })
}

export const hideLoading = (): void => {
  uni.hideLoading()
}
