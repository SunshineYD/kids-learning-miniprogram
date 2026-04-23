import { storage } from './storage'
import type { LoginResult, User } from '@/types'

const BASE_URL = 'https://api.example.com'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  needToken?: boolean
}

interface CloudSyncData {
  userId: number
  user: User
  updatedAt: number
}

export const api = {
  async request<T>(options: RequestOptions): Promise<T> {
    const { url, method = 'GET', data, needToken = true } = options
    const header: any = {
      'Content-Type': 'application/json'
    }

    if (needToken) {
      const token = storage.get<string>('token')
      if (token) {
        header['Authorization'] = `Bearer ${token}`
      }
    }

    return new Promise((resolve, reject) => {
      uni.request({
        url: BASE_URL + url,
        method,
        data,
        header,
        success: (res: any) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error(res.data?.message || '请求失败'))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  async wechatLogin(code: string, userInfo?: any): Promise<LoginResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: Date.now(),
          nickname: userInfo?.nickName || '小朋友',
          avatar: userInfo?.avatarUrl || '/static/avatar.png',
          level: 0,
          points: 0,
          openId: `openid_${code}`,
          lastLoginTime: Date.now()
        }
        resolve({
          code: 200,
          message: '登录成功',
          data: {
            token: `token_${Date.now()}`,
            user,
            isNewUser: true
          }
        })
      }, 500)
    })
  },

  async syncToCloud(data: CloudSyncData): Promise<void> {
    return new Promise((resolve) => {
      storage.set(`cloud_user_${data.userId}`, data)
      setTimeout(() => {
        resolve()
      }, 300)
    })
  },

  async syncFromCloud(userId: number): Promise<CloudSyncData | null> {
    return new Promise((resolve) => {
      const data = storage.get<CloudSyncData>(`cloud_user_${userId}`)
      setTimeout(() => {
        resolve(data)
      }, 300)
    })
  },

  async getUserInfo(): Promise<User> {
    return this.request({
      url: '/user/info',
      method: 'GET'
    })
  },

  async updateUserInfo(data: Partial<User>): Promise<User> {
    return this.request({
      url: '/user/info',
      method: 'PUT',
      data
    })
  }
}
