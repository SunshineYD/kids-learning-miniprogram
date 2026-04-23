import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Membership, MembershipPackage, InviteRecord, MembershipState, MembershipType } from '@/types'
import { storage } from '@/utils/storage'

const STORAGE_KEYS = {
  MEMBERSHIP_STATE: 'membership_state'
}

const DEFAULT_PACKAGES: MembershipPackage[] = [
  {
    id: 'free',
    type: 'free',
    name: '免费版',
    price: 0,
    originalPrice: 0,
    duration: 0,
    description: ['基础功能体验'],
    features: [
      '每日30道口算练习',
      '每周10个单词背诵',
      '基础错题本',
      '1个孩子账号'
    ]
  },
  {
    id: 'monthly',
    type: 'monthly',
    name: '月卡',
    price: 29,
    originalPrice: 49,
    duration: 30,
    description: ['适合短期使用'],
    features: [
      '无限量口算练习',
      '无限量单词背诵',
      '高级错题本',
      '3个孩子账号',
      '家长监督功能',
      '学习报告'
    ],
    popular: true
  },
  {
    id: 'quarterly',
    type: 'quarterly',
    name: '季卡',
    price: 69,
    originalPrice: 147,
    duration: 90,
    description: ['更划算的选择'],
    features: [
      '无限量口算练习',
      '无限量单词背诵',
      '高级错题本',
      '5个孩子账号',
      '家长监督功能',
      '学习报告',
      '专属客服',
      '优先体验新功能'
    ]
  },
  {
    id: 'yearly',
    type: 'yearly',
    name: '年卡',
    price: 199,
    originalPrice: 588,
    duration: 365,
    description: ['最超值的选择'],
    features: [
      '无限量口算练习',
      '无限量单词背诵',
      '高级错题本',
      '无限孩子账号',
      '家长监督功能',
      '学习报告',
      '专属客服',
      '优先体验新功能',
      '专属学习规划',
      '邀请好友得奖励'
    ]
  }
]

export const useMembershipStore = defineStore('membership', () => {
  const membership = ref<Membership | null>(null)
  const packages = ref<MembershipPackage[]>(DEFAULT_PACKAGES)
  const inviteRecords = ref<InviteRecord[]>([])
  const inviteCode = ref('')
  const isLoading = ref(false)

  const isMember = computed(() => {
    if (!membership.value) return false
    if (!membership.value.isActive) return false
    return membership.value.endDate > Date.now()
  })

  const currentPackage = computed(() => {
    if (!membership.value) return packages.value[0]
    return packages.value.find(p => p.type === membership.value.type) || packages.value[0]
  })

  const remainingDays = computed(() => {
    if (!membership.value || !isMember.value) return 0
    const now = Date.now()
    const diff = membership.value.endDate - now
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  })

  const membershipTypeName = computed(() => {
    const names: Record<MembershipType, string> = {
      free: '免费版',
      monthly: '月卡',
      quarterly: '季卡',
      yearly: '年卡'
    }
    return names[membership.value?.type || 'free']
  })

  function saveToStorage() {
    const state: MembershipState = {
      membership: membership.value,
      packages: packages.value,
      inviteRecords: inviteRecords.value,
      inviteCode: inviteCode.value
    }
    storage.set(STORAGE_KEYS.MEMBERSHIP_STATE, state)
  }

  function loadFromStorage() {
    const savedState = storage.get<MembershipState>(STORAGE_KEYS.MEMBERSHIP_STATE)
    if (savedState) {
      membership.value = savedState.membership
      packages.value = savedState.packages
      inviteRecords.value = savedState.inviteRecords
      inviteCode.value = savedState.inviteCode
    }
  }

  async function purchasePackage(packageId: string): Promise<boolean> {
    isLoading.value = true
    try {
      const pkg = packages.value.find(p => p.id === packageId)
      if (!pkg) return false

      await new Promise(resolve => setTimeout(resolve, 1500))

      let endDate: number
      if (pkg.type === 'free') {
        endDate = Date.now() + 1000 * 60 * 60 * 24 * 365 * 100
      } else {
        const now = Date.now()
        const existingEndDate = (membership.value?.isActive && membership.value.endDate > now) 
          ? membership.value.endDate 
          : now
        endDate = existingEndDate + 1000 * 60 * 60 * 24 * pkg.duration
      }

      membership.value = {
        id: Date.now(),
        userId: 0,
        type: pkg.type,
        startDate: Date.now(),
        endDate,
        isActive: true
      }

      saveToStorage()
      return true
    } catch (error) {
      console.error('购买失败:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function restorePurchase(): Promise<boolean> {
    isLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (membership.value && membership.value.endDate > Date.now()) {
        membership.value.isActive = true
        saveToStorage()
        return true
      }
      return false
    } catch (error) {
      console.error('恢复购买失败:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  function generateInviteCode() {
    if (!inviteCode.value) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let code = ''
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      inviteCode.value = code
      saveToStorage()
    }
    return inviteCode.value
  }

  async function useInviteCode(code: string): Promise<boolean> {
    isLoading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (code.length === 8 && code !== inviteCode.value) {
        const record: InviteRecord = {
          id: Date.now(),
          inviterId: 0,
          inviteeId: 0,
          invitedAt: Date.now(),
          rewardClaimed: false
        }
        inviteRecords.value.push(record)
        
        if (membership.value) {
          membership.value.endDate += 1000 * 60 * 60 * 24 * 7
        }
        
        saveToStorage()
        return true
      }
      return false
    } catch (error) {
      console.error('使用邀请码失败:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function claimInviteReward(recordId: number): Promise<boolean> {
    const record = inviteRecords.value.find(r => r.id === recordId)
    if (!record || record.rewardClaimed) return false

    record.rewardClaimed = true
    
    if (membership.value) {
      membership.value.endDate += 1000 * 60 * 60 * 24 * 7
    }
    
    saveToStorage()
    return true
  }

  function hasFeature(feature: string): boolean {
    if (!isMember.value) {
      const freeFeatures = packages.value[0].features
      return freeFeatures.includes(feature)
    }
    return currentPackage.value.features.includes(feature)
  }

  function init() {
    loadFromStorage()
    
    if (!inviteCode.value) {
      generateInviteCode()
    }
    
    if (!membership.value) {
      membership.value = {
        id: 1,
        userId: 0,
        type: 'free',
        startDate: Date.now(),
        endDate: Date.now() + 1000 * 60 * 60 * 24 * 365 * 100,
        isActive: true
      }
      saveToStorage()
    }
  }

  return {
    membership,
    packages,
    inviteRecords,
    inviteCode,
    isLoading,
    isMember,
    currentPackage,
    remainingDays,
    membershipTypeName,
    purchasePackage,
    restorePurchase,
    generateInviteCode,
    useInviteCode,
    claimInviteReward,
    hasFeature,
    init
  }
})
