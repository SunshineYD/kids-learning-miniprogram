<script setup lang="ts">
import { ref } from 'vue'

const feedbackType = ref('bug')
const feedbackContent = ref('')
const contactInfo = ref('')
const isSubmitting = ref(false)

const typeOptions = [
  { label: '问题反馈', value: 'bug' },
  { label: '功能建议', value: 'feature' },
  { label: '其他', value: 'other' }
]

const handleSubmit = async () => {
  if (!feedbackContent.value.trim()) {
    uni.showToast({
      title: '请输入反馈内容',
      icon: 'none'
    })
    return
  }

  isSubmitting.value = true
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  uni.showToast({
    title: '反馈提交成功',
    icon: 'success'
  })
  
  feedbackContent.value = ''
  contactInfo.value = ''
  isSubmitting.value = false
}
</script>

<template>
  <view class="feedback">
    <view class="header">
      <view class="header-title">意见反馈</view>
      <view class="header-desc">您的建议对我们很重要</view>
    </view>

    <view class="content">
      <view class="form-section">
        <view class="section-title">反馈类型</view>
        <view class="type-options">
          <view 
            v-for="option in typeOptions" 
            :key="option.value"
            :class="['type-option', { active: feedbackType === option.value }]"
            @click="feedbackType = option.value"
          >
            {{ option.label }}
          </view>
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">
          反馈内容
          <text class="required">*</text>
        </view>
        <textarea 
          class="content-textarea" 
          v-model="feedbackContent"
          placeholder="请详细描述您遇到的问题或建议..."
          :maxlength="500"
        />
        <view class="char-count">
          {{ feedbackContent.length }} / 500
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">联系方式（选填）</view>
        <input 
          class="contact-input" 
          v-model="contactInfo"
          placeholder="请留下您的手机号或微信，方便我们联系您"
        />
      </view>

      <view class="form-section">
        <view class="section-title">上传图片（选填）</view>
        <view class="upload-area">
          <view class="upload-btn">
            <text class="upload-icon">+</text>
            <text class="upload-text">添加图片</text>
          </view>
        </view>
      </view>

      <view class="submit-btn" :class="{ disabled: isSubmitting }" @click="handleSubmit">
        {{ isSubmitting ? '提交中...' : '提交反馈' }}
      </view>
    </view>

    <view class="tips">
      <view class="tips-title">温馨提示</view>
      <view class="tips-item">• 请详细描述问题，最好能说明操作步骤</view>
      <view class="tips-item">• 您可以上传截图帮助我们更好地理解问题</view>
      <view class="tips-item">• 我们会尽快处理您的反馈</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.feedback {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 50rpx 30rpx 60rpx;
  text-align: center;
}

.header-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12rpx;
}

.header-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

.content {
  padding: 30rpx;
}

.form-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.required {
  color: #ff4d4f;
}

.type-options {
  display: flex;
  gap: 16rpx;
}

.type-option {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  background: #f8f9fa;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #666;
  transition: all 0.3s;
  border: 2rpx solid transparent;
}

.type-option.active {
  background: #f0f3ff;
  color: #667eea;
  border-color: #667eea;
  font-weight: 600;
}

.content-textarea {
  width: 100%;
  min-height: 240rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  font-size: 28rpx;
  line-height: 1.6;
}

.char-count {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 12rpx;
}

.contact-input {
  width: 100%;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  font-size: 28rpx;
}

.upload-area {
  display: flex;
  gap: 16rpx;
}

.upload-btn {
  width: 160rpx;
  height: 160rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  border: 2rpx dashed #ddd;
}

.upload-icon {
  font-size: 48rpx;
  color: #999;
  font-weight: 300;
}

.upload-text {
  font-size: 24rpx;
  color: #999;
}

.submit-btn {
  width: 100%;
  padding: 28rpx;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
  margin-top: 20rpx;
  transition: all 0.3s;

  &.disabled {
    opacity: 0.6;
  }
}

.tips {
  margin: 30rpx;
  padding: 30rpx;
  background: #fffbe6;
  border-radius: 16rpx;
}

.tips-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #faad14;
  margin-bottom: 16rpx;
}

.tips-item {
  font-size: 24rpx;
  color: #997b14;
  margin-bottom: 8rpx;
  line-height: 1.6;
}
</style>
