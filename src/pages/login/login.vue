<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useUserStore } from '@/store/user'

  const userStore = useUserStore()
  const showAccountSwitch = ref(false)

  function formatLastLogin(timestamp : number) : string {
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

  const handleLogin = async () => {
    const success = await userStore.loginWithWechat()
    if (success) {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  }

  const handleSwitchAccount = async (accountId : number) => {
    const success = await userStore.switchAccount(accountId)
    if (success) {
      showAccountSwitch.value = false
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  }

  const handleAddAccount = () => {
    showAccountSwitch.value = false
    handleLogin()
  }

  onMounted(() => {
    userStore.init()
    if (userStore.isLoggedIn) {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  })
</script>

<template>
  <view class="login-page">
    <view class="login-container">
      <view class="logo-section">
        <view class="logo-icon">🎈</view>
        <view class="app-name">快乐学习</view>
        <view class="app-slogan">让学习更有趣</view>
      </view>

      <view class="illustration-section">
        <view class="bubble bubble-1">📚</view>
        <view class="bubble bubble-2">✏️</view>
        <view class="bubble bubble-3">🎨</view>
        <view class="bubble bubble-4">🧩</view>
        <view class="bubble bubble-5">🌟</view>
      </view>

      <view class="login-section">
        <view class="welcome-text">
          <text class="title">欢迎回来！</text>
          <text class="subtitle">点击下方按钮登录开始学习</text>
        </view>

        <button class="wechat-login-btn" :class="{ loading: userStore.isLoading }" @click="handleLogin"
          :disabled="userStore.isLoading" open-type="getUserProfile">
          <view class="btn-content">
            <text class="wechat-icon">微信</text>
            <text class="btn-text">{{ userStore.isLoading ? '登录中...' : '微信一键登录' }}</text>
          </view>
        </button>

        <view class="switch-account" v-if="userStore.accounts.length > 0">
          <text class="switch-text" @click="showAccountSwitch = true">
            切换账号 ({{ userStore.accounts.length }})
          </text>
        </view>
      </view>

      <view class="footer-text">
        登录即表示同意《用户协议》和《隐私政策》
      </view>
    </view>

    <view v-if="showAccountSwitch" class="modal-mask" @click="showAccountSwitch = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择账号</text>
          <text class="modal-close" @click="showAccountSwitch = false">✕</text>
        </view>
        <view class="account-list">
          <view v-for="account in userStore.accounts" :key="account.id" class="account-item"
            @click="handleSwitchAccount(account.id)">
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
  .login-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #FFE66D 0%, #FF6B6B 50%, #AA96DA 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx;
  }

  .login-container {
    width: 100%;
    max-width: 600rpx;
    background: #fff;
    border-radius: 40rpx;
    padding: 80rpx 60rpx 60rpx;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
  }

  .logo-section {
    text-align: center;
    margin-bottom: 60rpx;
  }

  .logo-icon {
    font-size: 120rpx;
    margin-bottom: 20rpx;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {

    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-20rpx);
    }
  }

  .app-name {
    font-size: 48rpx;
    font-weight: 800;
    background: linear-gradient(135deg, #FF6B6B, #AA96DA);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 10rpx;
  }

  .app-slogan {
    font-size: 28rpx;
    color: #999;
  }

  .illustration-section {
    height: 200rpx;
    position: relative;
    margin-bottom: 40rpx;
  }

  .bubble {
    position: absolute;
    font-size: 50rpx;
    animation: float 3s ease-in-out infinite;
    opacity: 0.8;
  }

  .bubble-1 {
    top: 20rpx;
    left: 40rpx;
    animation-delay: 0s;
  }

  .bubble-2 {
    top: 60rpx;
    right: 60rpx;
    animation-delay: 0.5s;
  }

  .bubble-3 {
    top: 120rpx;
    left: 80rpx;
    animation-delay: 1s;
  }

  .bubble-4 {
    top: 100rpx;
    right: 40rpx;
    animation-delay: 1.5s;
  }

  .bubble-5 {
    top: 160rpx;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 2s;
  }

  @keyframes float {

    0%,
    100% {
      transform: translateY(0) scale(1);
    }

    50% {
      transform: translateY(-20rpx) scale(1.1);
    }
  }

  .login-section {
    margin-bottom: 40rpx;
  }

  .welcome-text {
    text-align: center;
    margin-bottom: 60rpx;
  }

  .title {
    display: block;
    font-size: 40rpx;
    font-weight: 700;
    color: #333;
    margin-bottom: 16rpx;
  }

  .subtitle {
    display: block;
    font-size: 26rpx;
    color: #999;
  }

  .wechat-login-btn {
    width: 100%;
    height: 100rpx;
    background: #07C160;
    border-radius: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    padding: 0;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;

    &::after {
      border: none;
    }

    &:active {
      transform: scale(0.98);
      background: #06AD56;
    }

    &.loading {
      opacity: 0.7;
    }
  }

  .btn-content {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  .wechat-icon {
    font-size: 36rpx;
    font-weight: 600;
    color: #fff;
  }

  .btn-text {
    font-size: 32rpx;
    font-weight: 600;
    color: #fff;
  }

  .switch-account {
    text-align: center;
    margin-top: 40rpx;
  }

  .switch-text {
    font-size: 26rpx;
    color: #666;
    padding: 16rpx 32rpx;
    border-radius: 30rpx;
    background: #f5f5f5;
    display: inline-block;
    transition: all 0.3s;

    &:active {
      background: #e8e8e8;
    }
  }

  .footer-text {
    text-align: center;
    font-size: 22rpx;
    color: #ccc;
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
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
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
    from {
      transform: translateY(100%);
    }

    to {
      transform: translateY(0);
    }
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