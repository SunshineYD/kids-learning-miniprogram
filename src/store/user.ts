import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Account, WechatUserInfo } from '@/types'
import { storage } from '@/utils/storage'
import { api } from '@/utils/api'

const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  ACCOUNTS: 'accounts',
  CURRENT_ACCOUNT_ID: 'current_account_id'
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const accounts = ref<Account[]>([])
  const isLoading = ref(false)

  const levelName = computed(() => {
    const levels = ['幼儿园', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级']
    return levels[user.value?.level || 0] || '未知'
  })

  const isLoggedIn = computed(() => !!user.value && !!token.value)

  function saveToStorage() {
    if (user.value) {
      storage.set(STORAGE_KEYS.USER, user.value)
    }
    if (token.value) {
      storage.set(STORAGE_KEYS.TOKEN, token.value)
    }
  }

  function loadFromStorage() {
    const savedUser = storage.get<User>(STORAGE_KEYS.USER)
    const savedToken = storage.get<string>(STORAGE_KEYS.TOKEN)
    const savedAccounts = storage.get<Account[]>(STORAGE_KEYS.ACCOUNTS, [])
    if (savedUser) {
      user.value = savedUser
    }
    if (savedToken) {
      token.value = savedToken
    }
    if (savedAccounts) {
      accounts.value = savedAccounts
    }
  }

  function saveAccount(account: Account) {
    const existingIndex = accounts.value.findIndex(a => a.openId === account.openId)
    if (existingIndex >= 0) {
      accounts.value[existingIndex] = account
    } else {
      accounts.value.push(account)
    }
    storage.set(STORAGE_KEYS.ACCOUNTS, accounts.value)
  }

  async function loginWithWechat(): Promise<boolean> {
    isLoading.value = true
    try {
      const loginRes = await uni.login({
        provider: 'weixin'
      })

      if (!loginRes.code) {
        throw new Error('获取微信登录凭证失败')
      }

      let userInfo: WechatUserInfo | undefined
      try {
        const profileRes = await uni.getUserProfile({
          desc: '用于完善用户资料'
        })
        userInfo = profileRes.userInfo as WechatUserInfo
      } catch (e) {
        console.log('获取用户信息取消或失败，使用默认信息')
      }

      const result = await api.wechatLogin(loginRes.code, userInfo)
      
      if (result.code === 200) {
        user.value = result.data.user
        token.value = result.data.token
        
        const account: Account = {
          id: result.data.user.id,
          nickname: result.data.user.nickname,
          avatar: result.data.user.avatar,
          openId: result.data.user.openId || '',
          lastLoginTime: Date.now()
        }
        saveAccount(account)
        saveToStorage()
        
        await syncToCloud()
        
        return true
      }
      throw new Error(result.message)
    } catch (error) {
      console.error('登录失败:', error)
      uni.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function switchAccount(accountId: number): Promise<boolean> {
    const account = accounts.value.find(a => a.id === accountId)
    if (!account) {
      uni.showToast({
        title: '账号不存在',
        icon: 'none'
      })
      return false
    }

    isLoading.value = true
    try {
      const cloudData = await api.syncFromCloud(accountId)
      
      if (cloudData) {
        user.value = cloudData.user
      } else {
        user.value = {
          id: account.id,
          nickname: account.nickname,
          avatar: account.avatar,
          level: 0,
          points: 0,
          openId: account.openId,
          lastLoginTime: Date.now()
        }
      }
      
      token.value = `token_${accountId}`
      saveToStorage()
      
      account.lastLoginTime = Date.now()
      saveAccount(account)
      
      return true
    } catch (error) {
      console.error('切换账号失败:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function syncToCloud() {
    if (!user.value) return
    
    try {
      await api.syncToCloud({
        userId: user.value.id,
        user: user.value,
        updatedAt: Date.now()
      })
    } catch (error) {
      console.error('云同步失败:', error)
    }
  }

  function logout() {
    user.value = null
    token.value = null
    storage.remove(STORAGE_KEYS.USER)
    storage.remove(STORAGE_KEYS.TOKEN)
    uni.reLaunch({
      url: '/pages/login/login'
    })
  }

  function updatePoints(delta: number) {
    if (user.value) {
      user.value.points += delta
      saveToStorage()
      syncToCloud()
    }
  }

  function updateNickname(nickname: string) {
    if (user.value) {
      user.value.nickname = nickname
      saveToStorage()
      syncToCloud()
      
      const account = accounts.value.find(a => a.id === user.value?.id)
      if (account) {
        account.nickname = nickname
        saveAccount(account)
      }
    }
  }

  function init() {
    loadFromStorage()
  }

  return {
    user,
    token,
    accounts,
    isLoading,
    levelName,
    isLoggedIn,
    loginWithWechat,
    switchAccount,
    logout,
    updatePoints,
    updateNickname,
    syncToCloud,
    init
  }
})
