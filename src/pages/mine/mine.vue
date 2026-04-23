<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const showAccountSwitch = ref(false)

const menuItems = [
  { icon: '👨‍👩‍👧', title: '家长中心', color: '#667EEA', action: 'parent' },
  { icon: '💎', title: '会员中心', color: '#FF6B6B', action: 'membership' },
  { icon: '📊', title: '学习报告', color: '#4ECDC4' },
  { icon: '🏆', title: '我的成就', color: '#FFE66D' },
  { icon: '📚', title: '学习记录', color: '#95E1D3' },
  { icon: '👤', title: '切换账号', color: '#AA96DA', action: 'switch' },
  { icon: '⚙️', title: '设置', color: '#666', action: 'settings' },
  { icon: '💬', title: '意见反馈', color: '#667EEA', action: 'feedback' },
  { icon: '📖', title: '关于我们', color: '#4ECDC4', action: 'about' },
  { icon: '🚪', title: '退出登录', color: '#ff4d4f', action: 'logout' }
]

function formatLastLogin(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const handleMenuClick = async (item: any) => {
  if (item.action === 'logout') {
    uni.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          userStore.logout()
        }
      }
    })
    return
  }
  
  if (item.action === 'switch') {
    showAccountSwitch.value = true
    return
  }
  
  if (item.action === 'settings') {
    uni.navigateTo({
      url: '/pages/settings/settings'
    })
    return
  }
  
  if (item.action === 'parent') {
    uni.navigateTo({
      url: '/pages/parent-center/parent-center'
    })
    return
  }
  
  if (item.action === 'membership') {
    uni.navigateTo({
      url: '/pages/membership/membership'
    })
    return
  }
  
  if (item.action === 'feedback') {
    uni.navigateTo({
      url: '/pages/feedback/feedback'
    })
    return
  }
  
  if (item.action === 'about') {
    uni.navigateTo({
      url: '/pages/about/about'
    })
    return
  }
  
  uni.showToast({
    title: `${item.title}功能开发中`,
    icon: 'none'
  })
}

const handleSwitchAccount = async (accountId: number) => {
  const success = await userStore.switchAccount(accountId)
  if (success) {
    showAccountSwitch.value = false
  }
}

const handleAddAccount = async () => {
  showAccountSwitch.value = false
  const success = await userStore.loginWithWechat()
  if (success) {
    uni.switchTab({
      url: '/pages/index/index'
    })
  }
}
</script>

<template>
  <view class="mine-page">
    <view class="profile-header">
      <view class="profile-bg"></view>
      <view class="profile-info">
        <image class="avatar avatar-large" :src="userStore.user?.avatar" mode="aspectFill" />
        <view class="nickname">{{ userStore.user?.nickname }}</view>
        <view class="level-badge">
          <text class="badge badge-primary">{{ userStore.levelName }}</text>
        </view>
      </view>
    </view>

    <view class="stats-card card">
      <view class="stat-item">
        <view class="stat-value">{{ userStore.user?.points || 0 }}</view>
        <view class="stat-label">总积分</view>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <view class="stat-value">28</view>
        <view class="stat-label">学习天数</view>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <view class="stat-value">15</view>
        <view class="stat-label">完成课程</view>
      </view>
    </view>

    <view class="menu-list">
      <view
        v-for="(item, index) in menuItems"
        :key="index"
        class="menu-item card"
        @click="handleMenuClick(item)"
      >
        <view class="menu-icon" :style="{ background: item.color }">
          <text>{{ item.icon }}</text>
        </view>
        <view class="menu-title">{{ item.title }}</view>
        <view class="menu-arrow">›</view>
      </view>
    </view>

    <view v-if="showAccountSwitch" class="modal-mask" @click="showAccountSwitch = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择账号</text>
          <text class="modal-close" @click="showAccountSwitch = false">✕</text>
        </view>
        <view class="account-list">
          <view
            v-for="account in userStore.accounts"
            :key="account.id"
            class="account-item"
            @click="handleSwitchAccount(account.id)"
          >
            <image class="account-avatar" :src="account.avatar" mode="aspectFill" />
            <view class="account-info">
              <text class="account-name">{{ account.nickname }}</text>
              <text class="account-time">
                {{ formatLastLogin(account.lastLoginTime) }}
              </text>
            </view>
            <view class="account-check" v-if="userStore.user?.id === account.id">✓</view>
          </view>
          <view class="account-item add-account" @click="handleAddAccount">
            <view class="add-icon">+</view>
            <text class="add-text">添加新账号</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.mine-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: 40rpx;
}

.profile-header {
  position: relative;
  padding-top: 40rpx;
  padding-bottom: 80rpx;
}

.profile-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300rpx;
  background: linear-gradient(135deg, var(--success-color), var(--secondary-color));
  border-radius: 0 0 var(--border-radius-xl) var(--border-radius-xl);
}

.profile-info {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.avatar {
  background: #fff;
}

.nickname {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-white);
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.stats-card {
  margin: -40rpx var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
  z-index: 2;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-xxl);
  font-weight: 800;
  color: var(--primary-color);
  line-height: 1;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.stat-divider {
  width: 2rpx;
  height: 80rpx;
  background: var(--bg-primary);
}

.menu-list {
  padding: 0 var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  transition: all var(--transition-fast);

  &:active {
    transform: scale(0.98);
  }
}

.menu-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  flex-shrink: 0;
}

.menu-title {
  flex: 1;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.menu-arrow {
  font-size: var(--font-size-xl);
  color: var(--text-light);
  font-weight: 300;
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  width: 100%;
  background: #fff;
  border-radius: 40rpx 40rpx 0 0;
  padding: 40rpx;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40rpx;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
  line-height: 1;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.account-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx;
  background: #f8f8f8;
  border-radius: 24rpx;
  transition: all 0.3s;
  position: relative;

  &:active {
    background: #f0f0f0;
    transform: scale(0.98);
  }
}

.account-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: #ddd;
  flex-shrink: 0;
}

.account-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.account-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.account-time {
  font-size: 24rpx;
  color: #999;
}

.account-check {
  width: 40rpx;
  height: 40rpx;
  background: #07C160;
  border-radius: 50%;
  color: #fff;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.add-account {
  border: 2rpx dashed #ddd;
  background: transparent;
  justify-content: center;
}

.add-icon {
  width: 60rpx;
  height: 60rpx;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: #999;
  font-weight: 300;
}

.add-text {
  font-size: 28rpx;
  color: #666;
}
</style>
