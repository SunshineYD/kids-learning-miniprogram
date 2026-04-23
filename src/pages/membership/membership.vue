<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMembershipStore } from '@/store/membership'

const membershipStore = useMembershipStore()
const currentTab = ref('packages')
const selectedPackage = ref('')
const showInviteModal = ref(false)
const inviteCodeInput = ref('')
const showShareModal = ref(false)

onMounted(() => {
  membershipStore.init()
})

const handlePurchase = async (packageId: string) => {
  selectedPackage.value = packageId
  
  uni.showModal({
    title: '确认购买',
    content: `确定购买${membershipStore.packages.find(p => p.id === packageId)?.name}吗？`,
    success: async (res) => {
      if (res.confirm) {
        const success = await membershipStore.purchasePackage(packageId)
        if (success) {
          uni.showToast({
            title: '购买成功',
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: '购买失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

const handleUseInviteCode = async () => {
  if (!inviteCodeInput.value || inviteCodeInput.value.length !== 8) {
    uni.showToast({
      title: '请输入8位邀请码',
      icon: 'none'
    })
    return
  }
  
  const success = await membershipStore.useInviteCode(inviteCodeInput.value)
  if (success) {
    showInviteModal.value = false
    inviteCodeInput.value = ''
    uni.showToast({
      title: '邀请码使用成功，获得7天会员',
      icon: 'success'
    })
  } else {
    uni.showToast({
      title: '邀请码无效',
      icon: 'none'
    })
  }
}

const handleShare = () => {
  showShareModal.value = true
}

const copyInviteCode = () => {
  uni.setClipboardData({
    data: membershipStore.inviteCode,
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon: 'success'
      })
    }
  })
}
</script>

<template>
  <view class="membership">
    <view class="header">
      <view class="header-bg"></view>
      <view class="header-content">
        <view class="current-membership">
          <view class="membership-badge">
            {{ membershipStore.membershipTypeName }}
          </view>
          <view v-if="membershipStore.isMember" class="membership-days">
            剩余 {{ membershipStore.remainingDays }} 天
          </view>
        </view>
        <view class="membership-name">
          {{ membershipStore.isMember ? '尊享会员权益' : '开通会员，解锁更多功能' }}
        </view>
      </view>
    </view>

    <view class="tabs">
      <view 
        :class="['tab', { active: currentTab === 'packages' }]"
        @click="currentTab = 'packages'"
      >
        会员套餐
      </view>
      <view 
        :class="['tab', { active: currentTab === 'benefits' }]"
        @click="currentTab = 'benefits'"
      >
        会员权益
      </view>
      <view 
        :class="['tab', { active: currentTab === 'invite' }]"
        @click="currentTab = 'invite'"
      >
        邀请好友
      </view>
    </view>

    <view class="content">
      <view v-if="currentTab === 'packages'" class="packages-tab">
        <view class="packages-list">
          <view 
            v-for="pkg in membershipStore.packages.filter(p => p.type !== 'free')" 
            :key="pkg.id"
            :class="['package-card', { popular: pkg.popular }]"
          >
            <view v-if="pkg.popular" class="popular-tag">推荐</view>
            <view class="package-header">
              <view class="package-name">{{ pkg.name }}</view>
              <view class="package-desc">{{ pkg.description.join(' · ') }}</view>
            </view>
            <view class="package-price">
              <text class="price-symbol">¥</text>
              <text class="price-value">{{ pkg.price }}</text>
              <text class="price-original">¥{{ pkg.originalPrice }}</text>
            </view>
            <view class="package-features">
              <view v-for="feature in pkg.features" :key="feature" class="feature-item">
                <text class="feature-icon">✓</text>
                <text class="feature-text">{{ feature }}</text>
              </view>
            </view>
            <view class="package-action" @click="handlePurchase(pkg.id)">
              {{ membershipStore.membership?.type === pkg.type ? '已开通' : '立即开通' }}
            </view>
          </view>
        </view>
      </view>

      <view v-if="currentTab === 'benefits'" class="benefits-tab">
        <view class="benefits-list">
          <view 
            v-for="pkg in membershipStore.packages" 
            :key="pkg.id"
            :class="['benefit-section', { active: membershipStore.membership?.type === pkg.type }]"
          >
            <view class="benefit-header">
              <view class="benefit-name">{{ pkg.name }}</view>
              <view v-if="membershipStore.membership?.type === pkg.type" class="benefit-current">当前</view>
            </view>
            <view class="benefit-items">
              <view v-for="feature in pkg.features" :key="feature" class="benefit-item">
                <text class="benefit-icon">✓</text>
                <text class="benefit-text">{{ feature }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="feature-comparison">
          <view class="comparison-title">功能对比</view>
          <view class="comparison-table">
            <view class="comparison-row">
              <view class="comparison-cell header">功能</view>
              <view class="comparison-cell header">免费</view>
              <view class="comparison-cell header">月卡</view>
              <view class="comparison-cell header">季卡</view>
              <view class="comparison-cell header">年卡</view>
            </view>
            <view class="comparison-row">
              <view class="comparison-cell">口算练习</view>
              <view class="comparison-cell">30题/天</view>
              <view class="comparison-cell highlight">无限</view>
              <view class="comparison-cell highlight">无限</view>
              <view class="comparison-cell highlight">无限</view>
            </view>
            <view class="comparison-row">
              <view class="comparison-cell">单词背诵</view>
              <view class="comparison-cell">10个/天</view>
              <view class="comparison-cell highlight">无限</view>
              <view class="comparison-cell highlight">无限</view>
              <view class="comparison-cell highlight">无限</view>
            </view>
            <view class="comparison-row">
              <view class="comparison-cell">错题本</view>
              <view class="comparison-cell">基础</view>
              <view class="comparison-cell highlight">高级</view>
              <view class="comparison-cell highlight">高级</view>
              <view class="comparison-cell highlight">高级</view>
            </view>
            <view class="comparison-row">
              <view class="comparison-cell">孩子账号</view>
              <view class="comparison-cell">1个</view>
              <view class="comparison-cell highlight">3个</view>
              <view class="comparison-cell highlight">5个</view>
              <view class="comparison-cell highlight">无限</view>
            </view>
            <view class="comparison-row">
              <view class="comparison-cell">家长监督</view>
              <view class="comparison-cell">-</view>
              <view class="comparison-cell highlight">✓</view>
              <view class="comparison-cell highlight">✓</view>
              <view class="comparison-cell highlight">✓</view>
            </view>
            <view class="comparison-row">
              <view class="comparison-cell">学习报告</view>
              <view class="comparison-cell">-</view>
              <view class="comparison-cell highlight">✓</view>
              <view class="comparison-cell highlight">✓</view>
              <view class="comparison-cell highlight">✓</view>
            </view>
            <view class="comparison-row">
              <view class="comparison-cell">专属客服</view>
              <view class="comparison-cell">-</view>
              <view class="comparison-cell">-</view>
              <view class="comparison-cell highlight">✓</view>
              <view class="comparison-cell highlight">✓</view>
            </view>
            <view class="comparison-row">
              <view class="comparison-cell">邀请奖励</view>
              <view class="comparison-cell">-</view>
              <view class="comparison-cell">-</view>
              <view class="comparison-cell">-</view>
              <view class="comparison-cell highlight">✓</view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="currentTab === 'invite'" class="invite-tab">
        <view class="invite-banner">
          <view class="invite-title">邀请好友得奖励</view>
          <view class="invite-desc">每邀请一位好友，双方各得7天会员</view>
        </view>

        <view class="invite-actions">
          <view class="invite-action-card" @click="handleShare">
            <view class="action-icon">📤</view>
            <view class="action-title">分享邀请码</view>
            <view class="action-desc">分享给好友，双方都能获得奖励</view>
          </view>
          
          <view class="invite-action-card" @click="showInviteModal = true">
            <view class="action-icon">🎁</view>
            <view class="action-title">使用邀请码</view>
            <view class="action-desc">输入好友的邀请码领取奖励</view>
          </view>
        </view>

        <view class="my-invite-code">
          <view class="invite-code-label">我的邀请码</view>
          <view class="invite-code-wrapper">
            <text class="invite-code">{{ membershipStore.inviteCode }}</text>
            <view class="copy-btn" @click="copyInviteCode">复制</view>
          </view>
        </view>

        <view class="invite-records">
          <view class="records-title">邀请记录</view>
          <view class="records-list">
            <view v-if="membershipStore.inviteRecords.length === 0" class="empty-records">
              <text class="empty-icon">👥</text>
              <text class="empty-text">暂无邀请记录，快去邀请好友吧</text>
            </view>
            <view 
              v-for="record in membershipStore.inviteRecords" 
              :key="record.id"
              class="record-item"
            >
              <view class="record-info">
                <view class="record-avatar">👤</view>
                <view class="record-detail">
                  <view class="record-name">好友 {{ record.id }}</view>
                  <view class="record-time">{{ new Date(record.invitedAt).toLocaleDateString() }}</view>
                </view>
              </view>
              <view :class="['record-status', { claimed: record.rewardClaimed }]">
                {{ record.rewardClaimed ? '已领取' : '待领取' }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="showInviteModal" class="modal-mask" @click="showInviteModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <view class="modal-title">使用邀请码</view>
          <view class="modal-close" @click="showInviteModal = false">✕</view>
        </view>
        <view class="modal-body">
          <text class="invite-hint">请输入好友的8位邀请码</text>
          <input 
            class="invite-input" 
            type="text" 
            maxlength="8" 
            placeholder="请输入邀请码"
            v-model="inviteCodeInput"
          />
        </view>
        <view class="modal-footer">
          <view class="modal-btn" @click="showInviteModal = false">取消</view>
          <view class="modal-btn primary" @click="handleUseInviteCode">确认</view>
        </view>
      </view>
    </view>

    <view v-if="showShareModal" class="modal-mask" @click="showShareModal = false">
      <view class="modal-content share-content" @click.stop>
        <view class="modal-header">
          <view class="modal-title">分享给好友</view>
          <view class="modal-close" @click="showShareModal = false">✕</view>
        </view>
        <view class="modal-body">
          <view class="share-card">
            <view class="share-title">少儿课后学习</view>
            <view class="share-desc">邀请你一起学习，输入我的邀请码，双方各得7天会员</view>
            <view class="share-code">{{ membershipStore.inviteCode }}</view>
          </view>
          <view class="share-tips">
            提示：可以截图分享给好友
          </view>
        </view>
        <view class="modal-footer">
          <view class="modal-btn" @click="showShareModal = false">关闭</view>
          <view class="modal-btn primary" @click="copyInviteCode">复制邀请码</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.membership {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  position: relative;
  padding: 40rpx 30rpx 60rpx;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header-content {
  position: relative;
  z-index: 1;
}

.current-membership {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.membership-badge {
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 40rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #fff;
}

.membership-days {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.membership-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.tabs {
  display: flex;
  background: #fff;
  padding: 0 30rpx;
  margin: -30rpx 30rpx 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
}

.tab {
  flex: 1;
  padding: 30rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  position: relative;
  transition: all 0.3s;
}

.tab.active {
  color: #667eea;
  font-weight: 600;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 3rpx;
}

.content {
  padding: 0 30rpx 40rpx;
}

.packages-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.package-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  position: relative;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 3rpx solid transparent;
  transition: all 0.3s;

  &.popular {
    border-color: #667eea;
  }
}

.popular-tag {
  position: absolute;
  top: -12rpx;
  right: 30rpx;
  padding: 8rpx 24rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  font-size: 20rpx;
  color: #fff;
  font-weight: 600;
}

.package-header {
  margin-bottom: 30rpx;
}

.package-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 8rpx;
}

.package-desc {
  font-size: 24rpx;
  color: #999;
}

.package-price {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  margin-bottom: 30rpx;
}

.price-symbol {
  font-size: 28rpx;
  color: #667eea;
  font-weight: 600;
}

.price-value {
  font-size: 56rpx;
  color: #667eea;
  font-weight: 700;
}

.price-original {
  font-size: 24rpx;
  color: #ccc;
  text-decoration: line-through;
}

.package-features {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 30rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.feature-icon {
  color: #667eea;
  font-size: 28rpx;
  font-weight: 600;
}

.feature-text {
  font-size: 26rpx;
  color: #666;
}

.package-action {
  padding: 24rpx;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.benefit-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 3rpx solid transparent;
  transition: all 0.3s;

  &.active {
    border-color: #667eea;
  }
}

.benefit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.benefit-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.benefit-current {
  padding: 8rpx 16rpx;
  background: #667eea;
  border-radius: 24rpx;
  font-size: 20rpx;
  color: #fff;
}

.benefit-items {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.benefit-icon {
  color: #667eea;
  font-size: 24rpx;
  font-weight: 600;
}

.benefit-text {
  font-size: 24rpx;
  color: #666;
}

.feature-comparison {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.comparison-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
}

.comparison-table {
  display: flex;
  flex-direction: column;
  gap: 1rpx;
  background: #f0f0f0;
  border-radius: 12rpx;
  overflow: hidden;
}

.comparison-row {
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  background: #fff;
}

.comparison-cell {
  padding: 20rpx 12rpx;
  text-align: center;
  font-size: 22rpx;
  color: #666;

  &.header {
    font-weight: 600;
    color: #333;
    background: #f8f9fa;
  }

  &.highlight {
    color: #667eea;
    font-weight: 600;
  }
}

.invite-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 50rpx 40rpx;
  text-align: center;
  margin-bottom: 30rpx;
}

.invite-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12rpx;
}

.invite-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

.invite-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.invite-action-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.action-icon {
  font-size: 60rpx;
  margin-bottom: 16rpx;
}

.action-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.action-desc {
  font-size: 22rpx;
  color: #999;
}

.my-invite-code {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.invite-code-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.invite-code-wrapper {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.invite-code {
  flex: 1;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: #667eea;
  letter-spacing: 8rpx;
  text-align: center;
}

.copy-btn {
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #fff;
  font-weight: 600;
}

.invite-records {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.records-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.empty-records {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 40rpx;
  gap: 20rpx;
}

.empty-icon {
  font-size: 80rpx;
}

.empty-text {
  font-size: 26rpx;
  color: #999;
  text-align: center;
}

.record-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
}

.record-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.record-avatar {
  width: 60rpx;
  height: 60rpx;
  background: #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.record-detail {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.record-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
}

.record-time {
  font-size: 22rpx;
  color: #999;
}

.record-status {
  padding: 8rpx 20rpx;
  background: #f0f0f0;
  border-radius: 24rpx;
  font-size: 22rpx;
  color: #999;

  &.claimed {
    background: #e8f5e9;
    color: #667eea;
  }
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
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s;

  &.share-content {
    max-height: 70vh;
  }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
  padding: 10rpx;
  line-height: 1;
}

.modal-body {
  flex: 1;
  padding: 30rpx;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.modal-btn {
  flex: 1;
  padding: 24rpx;
  text-align: center;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  background: #f0f0f0;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
  }
}

.invite-hint {
  display: block;
  text-align: center;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 30rpx;
}

.invite-input {
  width: 100%;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  font-size: 32rpx;
  text-align: center;
  letter-spacing: 8rpx;
}

.share-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 50rpx 40rpx;
  text-align: center;
  margin-bottom: 30rpx;
}

.share-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20rpx;
}

.share-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30rpx;
  line-height: 1.6;
}

.share-code {
  display: inline-block;
  padding: 20rpx 50rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16rpx;
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: 12rpx;
}

.share-tips {
  text-align: center;
  font-size: 24rpx;
  color: #999;
}
</style>
