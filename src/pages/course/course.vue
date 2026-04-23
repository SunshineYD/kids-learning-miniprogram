<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCourseStore } from '@/store/course'

const courseStore = useCourseStore()

const activeCategory = ref('all')

const categories = ref([
  { id: 'all', name: '全部' },
  { id: '数学', name: '数学' },
  { id: '语文', name: '语文' },
  { id: '英语', name: '英语' },
  { id: '科学', name: '科学' }
])

const filteredCourses = computed(() => {
  if (activeCategory.value === 'all') {
    return courseStore.courses
  }
  return courseStore.courses.filter(c => c.category === activeCategory.value)
})

const handleStartCourse = (course: any) => {
  uni.showToast({
    title: `开始学习: ${course.title}`,
    icon: 'success'
  })
}
</script>

<template>
  <view class="course-page">
    <view class="category-tabs">
      <scroll-view scroll-x class="tabs-scroll">
        <view class="tabs">
          <view
            v-for="cat in categories"
            :key="cat.id"
            class="tab"
            :class="{ active: activeCategory === cat.id }"
            @click="activeCategory = cat.id"
          >
            {{ cat.name }}
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="course-grid">
      <view
        v-for="course in filteredCourses"
        :key="course.id"
        class="course-item card"
        @click="handleStartCourse(course)"
      >
        <view class="course-cover" :style="{ background: course.category === '数学' ? '#ffe5e5' : course.category === '语文' ? '#e5fff8' : course.category === '英语' ? '#fffde5' : '#e5fff5' }">
          <text class="emoji">{{ course.category === '数学' ? '🧮' : course.category === '语文' ? '📚' : course.category === '英语' ? '🎵' : '🔬' }}</text>
          <view class="difficulty-badge" :class="course.difficulty">
            {{ course.difficulty === 'easy' ? '简单' : course.difficulty === 'medium' ? '中等' : '困难' }}
          </view>
        </view>
        <view class="course-content">
          <view class="title">{{ course.title }}</view>
          <view class="desc">{{ course.description }}</view>
          <view class="meta">
            <text>⏱️ {{ course.duration }}分钟</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.course-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.category-tabs {
  background: var(--bg-white);
  padding: var(--spacing-md) 0;
  box-shadow: var(--shadow-sm);
}

.tabs-scroll {
  width: 100%;
  white-space: nowrap;
}

.tabs {
  display: inline-flex;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-md);
}

.tab {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-xl);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-primary);
  transition: all var(--transition-fast);
  white-space: nowrap;

  &.active {
    background: linear-gradient(135deg, var(--secondary-color), var(--success-color));
    color: var(--text-white);
    box-shadow: 0 4rpx 12rpx rgba(78, 205, 196, 0.3);
  }
}

.course-grid {
  padding: var(--spacing-md);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.course-item {
  overflow: hidden;
  padding: 0;
}

.course-cover {
  width: 100%;
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.emoji {
  font-size: 100rpx;
}

.difficulty-badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  padding: 4rpx 12rpx;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;

  &.easy {
    background: #52c41a;
    color: white;
  }

  &.medium {
    background: #fa8c16;
    color: white;
  }

  &.hard {
    background: #ff4d4f;
    color: white;
  }
}

.course-content {
  padding: var(--spacing-md);
}

.title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
}

.desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.meta {
  font-size: var(--font-size-xs);
  color: var(--text-light);
  margin-top: var(--spacing-sm);
}
</style>
