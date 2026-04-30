<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useChineseStore } from '@/store/chinese';
import { useAppStore } from '@/store/app';
import LessonCard from '@/components/chinese/LessonCard.vue';
import PoemCard from '@/components/chinese/PoemCard.vue';
import ResultDisplay from '@/components/chinese/layout/ResultDisplay.vue';
import DictationPractice from '@/components/chinese/practice/DictationPractice.vue';
import PinyinPractice from '@/components/chinese/practice/PinyinPractice.vue';
import WordSentencePractice from '@/components/chinese/practice/WordSentencePractice.vue';
import PoemRecitePractice from '@/components/chinese/practice/PoemRecitePractice.vue';
import PoemWritePractice from '@/components/chinese/practice/PoemWritePractice.vue';
import OptionPractice from '@/components/chinese/practice/OptionPractice.vue';
import type { ChineseLesson, AncientPoem, ReadingArticle } from '@/types';
import { getReadingByGrade } from '@/data/chinese-content';

const chineseStore = useChineseStore();
const appStore = useAppStore();

const activeTab = ref<'textbook' | 'poem' | 'daily'>('textbook');
const practiceMode = ref<
  | 'list'
  | 'dictation'
  | 'pinyin'
  | 'wordsentence'
  | 'poem-recite'
  | 'poem-write'
  | 'reading'
  | 'commonsense'
>('list');
const currentLesson = ref<ChineseLesson | null>(null);
const currentPoem = ref<AncientPoem | null>(null);
const currentArticle = ref<ReadingArticle | null>(null);
const showResult = ref(false);
const resultScore = ref(0);

const tabs = [
  { id: 'textbook', name: '课本同步', icon: '📚' },
  { id: 'poem', name: '古诗词', icon: '🏮' },
  { id: 'daily', name: '每日一练', icon: '☀️' },
];
const semesters = [
  { id: 1, name: '上学期' },
  { id: 2, name: '下学期' },
];

const todayReading = computed(() => {
  if (!chineseStore.progress) return null;
  const readings = getReadingByGrade(chineseStore.progress.grade);
  return readings[0] || null;
});

const dailyPracticeCompleted = computed(() => {
  return chineseStore.todayDailyPractice?.completed || false;
});

onMounted(() => {
  chineseStore.init();
});

const switchTab = (tab: 'textbook' | 'poem' | 'daily') => {
  activeTab.value = tab;
  practiceMode.value = 'list';
  chineseStore.setPracticeType(tab);
  resetPractice();
};

const switchSemester = (semester: 1 | 2) => {
  chineseStore.setSemester(semester);
};

const startDictation = (lesson: ChineseLesson) => {
  currentLesson.value = lesson;
  chineseStore.startDictation(lesson);
  practiceMode.value = 'dictation';
};

const startPinyin = (lesson: ChineseLesson) => {
  currentLesson.value = lesson;
  chineseStore.startPinyin(lesson);
  practiceMode.value = 'pinyin';
};

const startWordSentence = (lesson: ChineseLesson) => {
  currentLesson.value = lesson;
  chineseStore.startWordSentence(lesson);
  practiceMode.value = 'wordsentence';
};

const startPoemRecite = (poem: AncientPoem) => {
  currentPoem.value = poem;
  chineseStore.startPoem(poem, 'recite');
  practiceMode.value = 'poem-recite';
};

const startPoemWrite = (poem: AncientPoem) => {
  currentPoem.value = poem;
  chineseStore.startPoem(poem, 'write');
  practiceMode.value = 'poem-write';
};

const startReading = (article: ReadingArticle) => {
  currentArticle.value = article;
  chineseStore.startReading(article);
  practiceMode.value = 'reading';
};

const startCommonSense = () => {
  chineseStore.startCommonSense();
  practiceMode.value = 'commonsense';
};

const handlePracticeComplete = (score: number) => {
  resultScore.value = score;
  showResult.value = true;
};

const resetPractice = () => {
  practiceMode.value = 'list';
  currentLesson.value = null;
  currentPoem.value = null;
  currentArticle.value = null;
  showResult.value = false;
  chineseStore.resetPractice();
};

const backToList = () => {
  resetPractice();
};

const isLessonCompleted = (lesson: ChineseLesson): boolean => {
  if (!chineseStore.progress) return false;
  const index = chineseStore.lessons.findIndex((l) => l.id === lesson.id);
  return chineseStore.progress.lessonsCompleted.includes(index);
};

const isPoemCompleted = (poem: AncientPoem): boolean => {
  if (!chineseStore.progress) return false;
  return chineseStore.progress.poemsCompleted.includes(poem.id);
};
</script>

<template>
  <view v-if="practiceMode === 'list'" class="chinese-practice-page">
    <view class="page-header">
      <view class="header-bg">
        <view class="bg-circle circle-1"></view>
        <view class="bg-circle circle-2"></view>
      </view>
      <view class="header-content">
        <view class="header-title">
          <text class="title-emoji">📚</text>
          <text class="title-text">语文课后巩固</text>
        </view>
        <view class="header-stats">
          <view class="stat-card">
            <text class="stat-value">{{ chineseStore.progress?.totalScore || 0 }}</text>
            <text class="stat-label">总积分</text>
          </view>
          <view class="stat-card">
            <text class="stat-value">{{ chineseStore.progress?.streakDays || 0 }}</text>
            <text class="stat-label">连续天数</text>
          </view>
        </view>
      </view>
    </view>

    <view class="page-content">
      <view class="tabs-container">
        <view
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-item"
          :class="{ active: activeTab === tab.id }"
          @click="switchTab(tab.id as any)"
        >
          <text class="tab-icon">{{ tab.icon }}</text>
          <text class="tab-text">{{ tab.name }}</text>
        </view>
      </view>

      <view v-if="activeTab === 'textbook'" class="textbook-section">
        <view class="semester-selector">
          <view
            v-for="sem in semesters"
            :key="sem.id"
            class="semester-btn"
            :class="{ active: chineseStore.currentSemester === sem.id }"
            @click="switchSemester(sem.id as any)"
          >
            {{ sem.name }}
          </view>
        </view>
        <scroll-view class="lessons-list" scroll-y>
          <LessonCard
            v-for="lesson in chineseStore.lessons"
            :key="lesson.id"
            :lesson="lesson"
            :completed="isLessonCompleted(lesson)"
            @start-dictation="startDictation"
            @start-pinyin="startPinyin"
            @start-word-sentence="startWordSentence"
          />
        </scroll-view>
      </view>

      <view v-else-if="activeTab === 'poem'" class="poem-section">
        <view class="semester-selector">
          <view
            v-for="sem in semesters"
            :key="sem.id"
            class="semester-btn"
            :class="{ active: chineseStore.currentSemester === sem.id }"
            @click="switchSemester(sem.id as any)"
          >
            {{ sem.name }}
          </view>
        </view>
        <scroll-view class="poems-list" scroll-y>
          <PoemCard
            v-for="poem in chineseStore.poems"
            :key="poem.id"
            :poem="poem"
            :completed="isPoemCompleted(poem)"
            @start-recite="startPoemRecite"
            @start-write="startPoemWrite"
          />
        </scroll-view>
      </view>

      <view v-else-if="activeTab === 'daily'" class="daily-section">
        <view v-if="dailyPracticeCompleted" class="completed-banner">
          <text class="banner-emoji">🎉</text>
          <text class="banner-text">今日练习已完成！明天继续加油！</text>
        </view>
        <view v-else class="daily-tasks">
          <view
            class="task-card reading"
            @click="todayReading && startReading(todayReading)"
          >
            <view class="task-icon">📖</view>
            <view class="task-info">
              <view class="task-title">课外阅读</view>
              <view class="task-desc">{{ todayReading?.title || '今日阅读' }}</view>
            </view>
            <view class="task-arrow">→</view>
          </view>
          <view class="task-card commonsense" @click="startCommonSense">
            <view class="task-icon">🧠</view>
            <view class="task-info">
              <view class="task-title">语文常识</view>
              <view class="task-desc">5道趣味题目</view>
            </view>
            <view class="task-arrow">→</view>
          </view>
        </view>
      </view>
    </view>
  </view>

  <view v-else-if="practiceMode === 'dictation'">
    <DictationPractice
      @back="backToList"
      @complete="handlePracticeComplete"
    />
  </view>

  <view v-else-if="practiceMode === 'pinyin'">
    <PinyinPractice
      @back="backToList"
      @complete="handlePracticeComplete"
    />
  </view>

  <view v-else-if="practiceMode === 'wordsentence'">
    <WordSentencePractice
      @back="backToList"
      @complete="handlePracticeComplete"
    />
  </view>

  <view v-else-if="practiceMode === 'poem-recite' && currentPoem">
    <PoemRecitePractice
      :poem="currentPoem"
      @back="backToList"
      @complete="handlePracticeComplete"
    />
  </view>

  <view v-else-if="practiceMode === 'poem-write' && currentPoem">
    <PoemWritePractice
      :poem="currentPoem"
      @back="backToList"
      @complete="handlePracticeComplete"
    />
  </view>

  <view v-else-if="practiceMode === 'reading' && currentArticle && chineseStore.currentReading">
    <OptionPractice
      title="课外阅读"
      :article="currentArticle"
      :questions="currentArticle.questions"
      :current-index="chineseStore.currentReading.currentQuestionIndex"
      :user-answers="chineseStore.currentReading.userAnswers"
      @back="backToList"
      @complete="handlePracticeComplete"
      @save-answer="(idx, ans) => chineseStore.saveReadingAnswer(idx, ans)"
      @next-question="chineseStore.nextReadingQuestion"
      @prev-question="chineseStore.prevReadingQuestion"
      @submit="() => { chineseStore.submitReading(currentArticle); handlePracticeComplete(chineseStore.currentReading?.score || 0); }"
    />
  </view>

  <view v-else-if="practiceMode === 'commonsense' && chineseStore.currentCommonSense">
    <OptionPractice
      title="语文常识"
      :questions="chineseStore.currentCommonSense.questions"
      :current-index="chineseStore.currentCommonSense.currentIndex"
      :user-answers="chineseStore.currentCommonSense.userAnswers"
      @back="backToList"
      @complete="handlePracticeComplete"
      @save-answer="(idx, ans) => chineseStore.saveCommonSenseAnswer(idx, ans)"
      @next-question="chineseStore.nextCommonSense"
      @prev-question="chineseStore.prevCommonSense"
      @submit="() => { chineseStore.submitCommonSense(); handlePracticeComplete(chineseStore.currentCommonSense?.score || 0); }"
    />
  </view>

  <ResultDisplay
    :show="showResult"
    :score="resultScore"
    @confirm="backToList"
  />
</template>

<style lang="scss" scoped>
.chinese-practice-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.page-header {
  position: relative;
  background: linear-gradient(135deg, var(--secondary-color), var(--success-color));
  padding: var(--spacing-lg) var(--spacing-md);
  padding-top: calc(var(--spacing-lg) + var(--status-bar-height, 44rpx));
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

.circle-1 {
  width: 200rpx;
  height: 200rpx;
  top: -60rpx;
  right: 40rpx;
}

.circle-2 {
  width: 120rpx;
  height: 120rpx;
  bottom: -30rpx;
  left: 60rpx;
}

.header-content {
  position: relative;
  z-index: 1;
}

.header-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.title-emoji {
  font-size: 48rpx;
}

.title-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-white);
}

.header-stats {
  display: flex;
  gap: var(--spacing-md);
}

.stat-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10rpx);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  text-align: center;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.stat-value {
  display: block;
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-white);
  line-height: 1.2;
}

.stat-label {
  display: block;
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.9);
}

.page-content {
  padding: var(--spacing-md);
}

.tabs-container {
  display: flex;
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: 8rpx;
  margin-bottom: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.tab-item.active {
  background: linear-gradient(135deg, var(--secondary-color), var(--success-color));
}

.tab-icon {
  font-size: 40rpx;
  margin-bottom: 4rpx;
}

.tab-text {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
}

.tab-item.active .tab-text {
  color: var(--text-white);
}

.semester-selector {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.semester-btn {
  flex: 1;
  text-align: center;
  padding: var(--spacing-sm);
  background: var(--bg-white);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-secondary);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.semester-btn.active {
  background: linear-gradient(135deg, var(--secondary-color), var(--success-color));
  color: var(--text-white);
}

.lessons-list,
.poems-list {
  height: calc(100vh - 400rpx);
}

.daily-section {
  .completed-banner {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    text-align: center;
    box-shadow: var(--shadow-md);
  }

  .banner-emoji {
    font-size: 80rpx;
    display: block;
    margin-bottom: var(--spacing-sm);
  }

  .banner-text {
    font-size: var(--font-size-md);
    font-weight: 600;
    color: var(--text-white);
  }

  .daily-tasks {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .task-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--bg-white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-fast);

    &:active {
      transform: scale(0.98);
    }
  }

  .task-card.reading {
    background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
  }

  .task-card.commonsense {
    background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  }

  .task-icon {
    width: 80rpx;
    height: 80rpx;
    background: rgba(255, 255, 255, 0.8);
    border-radius: var(--border-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 44rpx;
  }

  .task-info {
    flex: 1;
  }

  .task-title {
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4rpx;
  }

  .task-desc {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .task-arrow {
    font-size: 32rpx;
    color: var(--text-light);
  }
}
</style>
