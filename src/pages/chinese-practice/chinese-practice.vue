<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useChineseStore } from '@/store/chinese';
import { useAppStore } from '@/store/app';
import LessonCard from '@/components/chinese/LessonCard.vue';
import PoemCard from '@/components/chinese/PoemCard.vue';
import PracticeProgress from '@/components/chinese/PracticeProgress.vue';
import type { ChineseLesson, AncientPoem, ReadingArticle } from '@/types';
import { getReadingByGrade } from '@/data/chinese-content';

const chineseStore = useChineseStore();
const appStore = useAppStore();

const activeTab = ref<'textbook' | 'poem' | 'daily'>('textbook');
const practiceMode = ref<'list' | 'dictation' | 'pinyin' | 'wordsentence' | 'poem-recite' | 'poem-write' | 'reading' | 'commonsense'>('list');
const currentLesson = ref<ChineseLesson | null>(null);
const currentPoem = ref<AncientPoem | null>(null);
const currentArticle = ref<ReadingArticle | null>(null);
const dictationAnswer = ref('');
const pinyinAnswer = ref('');
const wordSentenceAnswer = ref('');
const selectedOption = ref(-1);
const showResult = ref(false);

const progressRef = ref<InstanceType<typeof PracticeProgress>>();

onMounted(() => {
  chineseStore.init();
});

const tabs = [
  { id: 'textbook', name: '课本同步', icon: '📚' },
  { id: 'poem', name: '古诗词', icon: '🏮' },
  { id: 'daily', name: '每日一练', icon: '☀️' }
];

const semesters = [
  { id: 1, name: '上学期' },
  { id: 2, name: '下学期' }
];

function switchTab(tab: 'textbook' | 'poem' | 'daily') {
  activeTab.value = tab;
  practiceMode.value = 'list';
  chineseStore.setPracticeType(tab);
  resetPractice();
}

function switchSemester(semester: 1 | 2) {
  chineseStore.setSemester(semester);
}

function isLessonCompleted(lesson: ChineseLesson): boolean {
  if (!chineseStore.progress) return false;
  const index = chineseStore.lessons.findIndex(l => l.id === lesson.id);
  return chineseStore.progress.lessonsCompleted.includes(index);
}

function isPoemCompleted(poem: AncientPoem): boolean {
  if (!chineseStore.progress) return false;
  return chineseStore.progress.poemsCompleted.includes(poem.id);
}

function startDictation(lesson: ChineseLesson) {
  currentLesson.value = lesson;
  chineseStore.startDictation(lesson);
  practiceMode.value = 'dictation';
  dictationAnswer.value = '';
}

function startPinyin(lesson: ChineseLesson) {
  currentLesson.value = lesson;
  chineseStore.startPinyin(lesson);
  practiceMode.value = 'pinyin';
  pinyinAnswer.value = '';
}

function startWordSentence(lesson: ChineseLesson) {
  currentLesson.value = lesson;
  chineseStore.startWordSentence(lesson);
  practiceMode.value = 'wordsentence';
  wordSentenceAnswer.value = '';
}

function startPoemRecite(poem: AncientPoem) {
  currentPoem.value = poem;
  chineseStore.startPoem(poem, 'recite');
  practiceMode.value = 'poem-recite';
}

function startPoemWrite(poem: AncientPoem) {
  currentPoem.value = poem;
  chineseStore.startPoem(poem, 'write');
  practiceMode.value = 'poem-write';
}

function startReading(article: ReadingArticle) {
  currentArticle.value = article;
  chineseStore.startReading(article);
  practiceMode.value = 'reading';
  selectedOption.value = -1;
}

function startCommonSense() {
  chineseStore.startCommonSense();
  practiceMode.value = 'commonsense';
  selectedOption.value = -1;
}

function handleDictationInput(e: any) {
  dictationAnswer.value = e.detail.value;
  if (chineseStore.currentDictation) {
    chineseStore.saveDictationAnswer(chineseStore.currentDictation.currentIndex, dictationAnswer.value);
  }
}

function handlePinyinInput(e: any) {
  pinyinAnswer.value = e.detail.value;
  if (chineseStore.currentPinyin) {
    chineseStore.savePinyinAnswer(chineseStore.currentPinyin.currentIndex, pinyinAnswer.value);
  }
}

function handleWordSentenceInput(e: any) {
  wordSentenceAnswer.value = e.detail.value;
  if (chineseStore.currentWordSentence) {
    chineseStore.saveWordSentenceAnswer(chineseStore.currentWordSentence.currentIndex, wordSentenceAnswer.value);
  }
}

function nextDictation() {
  if (chineseStore.currentDictation) {
    if (chineseStore.currentDictation.currentIndex < chineseStore.currentDictation.characters.length - 1) {
      chineseStore.nextDictation();
      dictationAnswer.value = chineseStore.currentDictation.userAnswers[chineseStore.currentDictation.currentIndex] || '';
      progressRef.value?.next();
    } else {
      chineseStore.submitDictation();
      showResult.value = true;
    }
  }
}

function prevDictation() {
  if (chineseStore.currentDictation && chineseStore.currentDictation.currentIndex > 0) {
    chineseStore.prevDictation();
    dictationAnswer.value = chineseStore.currentDictation.userAnswers[chineseStore.currentDictation.currentIndex] || '';
    progressRef.value?.prev();
  }
}

function nextPinyin() {
  if (chineseStore.currentPinyin) {
    if (chineseStore.currentPinyin.currentIndex < chineseStore.currentPinyin.characters.length - 1) {
      chineseStore.nextPinyin();
      pinyinAnswer.value = chineseStore.currentPinyin.userAnswers[chineseStore.currentPinyin.currentIndex] || '';
      progressRef.value?.next();
    } else {
      chineseStore.submitPinyin();
      showResult.value = true;
    }
  }
}

function prevPinyin() {
  if (chineseStore.currentPinyin && chineseStore.currentPinyin.currentIndex > 0) {
    chineseStore.prevPinyin();
    pinyinAnswer.value = chineseStore.currentPinyin.userAnswers[chineseStore.currentPinyin.currentIndex] || '';
    progressRef.value?.prev();
  }
}

function nextWordSentence() {
  if (chineseStore.currentWordSentence) {
    if (chineseStore.currentWordSentence.currentIndex < chineseStore.currentWordSentence.words.length - 1) {
      chineseStore.nextWordSentence();
      wordSentenceAnswer.value = chineseStore.currentWordSentence.userAnswers[chineseStore.currentWordSentence.currentIndex] || '';
      progressRef.value?.next();
    } else {
      chineseStore.submitWordSentence();
      showResult.value = true;
    }
  }
}

function prevWordSentence() {
  if (chineseStore.currentWordSentence && chineseStore.currentWordSentence.currentIndex > 0) {
    chineseStore.prevWordSentence();
    wordSentenceAnswer.value = chineseStore.currentWordSentence.userAnswers[chineseStore.currentWordSentence.currentIndex] || '';
    progressRef.value?.prev();
  }
}

function completePoemRecite() {
  if (currentPoem.value) {
    chineseStore.completePoem(100);
    showResult.value = true;
  }
}

function selectOption(index: number) {
  selectedOption.value = index;
  if (practiceMode.value === 'reading' && chineseStore.currentReading && currentArticle.value) {
    chineseStore.saveReadingAnswer(chineseStore.currentReading.currentQuestionIndex, index);
  } else if (practiceMode.value === 'commonsense' && chineseStore.currentCommonSense) {
    chineseStore.saveCommonSenseAnswer(chineseStore.currentCommonSense.currentIndex, index);
  }
}

function nextReading() {
  if (chineseStore.currentReading && currentArticle.value) {
    if (chineseStore.currentReading.currentQuestionIndex < currentArticle.value.questions.length - 1) {
      chineseStore.nextReadingQuestion();
      selectedOption.value = chineseStore.currentReading.userAnswers[chineseStore.currentReading.currentQuestionIndex];
      progressRef.value?.next();
    } else {
      chineseStore.submitReading(currentArticle.value);
      showResult.value = true;
    }
  }
}

function prevReading() {
  if (chineseStore.currentReading && chineseStore.currentReading.currentQuestionIndex > 0) {
    chineseStore.prevReadingQuestion();
    selectedOption.value = chineseStore.currentReading.userAnswers[chineseStore.currentReading.currentQuestionIndex];
    progressRef.value?.prev();
  }
}

function nextCommonSense() {
  if (chineseStore.currentCommonSense) {
    if (chineseStore.currentCommonSense.currentIndex < chineseStore.currentCommonSense.questions.length - 1) {
      chineseStore.nextCommonSense();
      selectedOption.value = chineseStore.currentCommonSense.userAnswers[chineseStore.currentCommonSense.currentIndex];
      progressRef.value?.next();
    } else {
      chineseStore.submitCommonSense();
      showResult.value = true;
    }
  }
}

function prevCommonSense() {
  if (chineseStore.currentCommonSense && chineseStore.currentCommonSense.currentIndex > 0) {
    chineseStore.prevCommonSense();
    selectedOption.value = chineseStore.currentCommonSense.userAnswers[chineseStore.currentCommonSense.currentIndex];
    progressRef.value?.prev();
  }
}

function resetPractice() {
  practiceMode.value = 'list';
  currentLesson.value = null;
  currentPoem.value = null;
  currentArticle.value = null;
  dictationAnswer.value = '';
  pinyinAnswer.value = '';
  wordSentenceAnswer.value = '';
  selectedOption.value = -1;
  showResult.value = false;
  chineseStore.resetPractice();
}

function backToList() {
  resetPractice();
}

const todayReading = computed(() => {
  if (!chineseStore.progress) return null;
  const readings = getReadingByGrade(chineseStore.progress.grade);
  return readings[0] || null;
});

const dailyPracticeCompleted = computed(() => {
  return chineseStore.todayDailyPractice?.completed || false;
});

const resultScore = computed(() => {
  if (chineseStore.currentDictation?.completed) return chineseStore.currentDictation.score;
  if (chineseStore.currentPinyin?.completed) return chineseStore.currentPinyin.score;
  if (chineseStore.currentWordSentence?.completed) return chineseStore.currentWordSentence.score;
  if (chineseStore.currentPoem?.completed) return chineseStore.currentPoem.score;
  if (chineseStore.currentReading?.completed) return chineseStore.currentReading.score;
  if (chineseStore.currentCommonSense?.completed) return chineseStore.currentCommonSense.score;
  return 0;
});

const resultEmoji = computed(() => {
  if (resultScore.value >= 90) return '🎉';
  if (resultScore.value >= 70) return '👍';
  if (resultScore.value >= 60) return '😊';
  return '💪';
});

const resultMessage = computed(() => {
  if (resultScore.value >= 90) return '太棒了！你是最棒的！';
  if (resultScore.value >= 70) return '做得很好！继续加油！';
  if (resultScore.value >= 60) return '及格了！再努力一点！';
  return '别灰心，再试一次！';
});
</script>

<template>
  <view class="chinese-practice-page">
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

    <view v-if="practiceMode === 'list'" class="page-content">
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
          <view class="task-card reading" @click="todayReading && startReading(todayReading)">
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

    <view v-else-if="practiceMode === 'dictation'" class="practice-container">
      <view class="practice-header">
        <view class="back-btn" @click="backToList">←</view>
        <view class="practice-title">生字听写</view>
      </view>
      <view class="practice-content">
        <PracticeProgress
          ref="progressRef"
          title="听写练习"
          :total="chineseStore.currentDictation?.characters.length || 0"
        />
        <view v-if="chineseStore.currentDictation" class="dictation-card">
          <view class="character-info">
            <view class="pinyin">{{ chineseStore.currentDictation.characters[chineseStore.currentDictation.currentIndex].pinyin }}</view>
            <view class="meaning">{{ chineseStore.currentDictation.characters[chineseStore.currentDictation.currentIndex].meaning }}</view>
            <view class="example">"{{ chineseStore.currentDictation.characters[chineseStore.currentDictation.currentIndex].example }}"</view>
          </view>
          <view class="input-container">
            <input
              class="dictation-input"
              type="text"
              v-model="dictationAnswer"
              placeholder="请写出这个字"
              maxlength="1"
              @input="handleDictationInput"
            />
          </view>
        </view>
        <view class="nav-buttons">
          <view
            class="nav-btn prev"
            :class="{ disabled: chineseStore.currentDictation?.currentIndex === 0 }"
            @click="prevDictation"
          >
            上一题
          </view>
          <view class="nav-btn next" @click="nextDictation">
            {{ chineseStore.currentDictation?.currentIndex === (chineseStore.currentDictation?.characters.length || 0) - 1 ? '提交' : '下一题' }}
          </view>
        </view>
      </view>
    </view>

    <view v-else-if="practiceMode === 'pinyin'" class="practice-container">
      <view class="practice-header">
        <view class="back-btn" @click="backToList">←</view>
        <view class="practice-title">拼音认读</view>
      </view>
      <view class="practice-content">
        <PracticeProgress
          ref="progressRef"
          title="拼音练习"
          :total="chineseStore.currentPinyin?.characters.length || 0"
        />
        <view v-if="chineseStore.currentPinyin" class="pinyin-card">
          <view class="character-display">{{ chineseStore.currentPinyin.characters[chineseStore.currentPinyin.currentIndex].character }}</view>
          <view class="meaning">{{ chineseStore.currentPinyin.characters[chineseStore.currentPinyin.currentIndex].meaning }}</view>
          <view class="input-container">
            <input
              class="pinyin-input"
              type="text"
              v-model="pinyinAnswer"
              placeholder="请写出拼音"
              @input="handlePinyinInput"
            />
          </view>
        </view>
        <view class="nav-buttons">
          <view
            class="nav-btn prev"
            :class="{ disabled: chineseStore.currentPinyin?.currentIndex === 0 }"
            @click="prevPinyin"
          >
            上一题
          </view>
          <view class="nav-btn next" @click="nextPinyin">
            {{ chineseStore.currentPinyin?.currentIndex === (chineseStore.currentPinyin?.characters.length || 0) - 1 ? '提交' : '下一题' }}
          </view>
        </view>
      </view>
    </view>

    <view v-else-if="practiceMode === 'wordsentence'" class="practice-container">
      <view class="practice-header">
        <view class="back-btn" @click="backToList">←</view>
        <view class="practice-title">组词造句</view>
      </view>
      <view class="practice-content">
        <PracticeProgress
          ref="progressRef"
          title="词语练习"
          :total="chineseStore.currentWordSentence?.words.length || 0"
        />
        <view v-if="chineseStore.currentWordSentence" class="wordsentence-card">
          <view class="word-display">{{ chineseStore.currentWordSentence.words[chineseStore.currentWordSentence.currentIndex].word }}</view>
          <view class="word-meaning">{{ chineseStore.currentWordSentence.words[chineseStore.currentWordSentence.currentIndex].meaning }}</view>
          <view class="hint">用这个词语造一个句子</view>
          <view class="input-container">
            <textarea
              class="wordsentence-input"
              v-model="wordSentenceAnswer"
              placeholder="请造句..."
              @input="handleWordSentenceInput"
            />
          </view>
        </view>
        <view class="nav-buttons">
          <view
            class="nav-btn prev"
            :class="{ disabled: chineseStore.currentWordSentence?.currentIndex === 0 }"
            @click="prevWordSentence"
          >
            上一题
          </view>
          <view class="nav-btn next" @click="nextWordSentence">
            {{ chineseStore.currentWordSentence?.currentIndex === (chineseStore.currentWordSentence?.words.length || 0) - 1 ? '提交' : '下一题' }}
          </view>
        </view>
      </view>
    </view>

    <view v-else-if="practiceMode === 'poem-recite'" class="practice-container">
      <view class="practice-header">
        <view class="back-btn" @click="backToList">←</view>
        <view class="practice-title">古诗背诵</view>
      </view>
      <view class="practice-content poem-content">
        <view v-if="currentPoem" class="poem-display-card">
          <view class="poem-title-large">{{ currentPoem.title }}</view>
          <view class="poem-author-large">
            <text>{{ currentPoem.author }}</text>
            <text class="dot">·</text>
            <text>{{ currentPoem.dynasty }}代</text>
          </view>
          <view class="poem-content-large">
            <text v-for="(line, index) in currentPoem.content" :key="index" class="poem-line-large">{{ line }}</text>
          </view>
          <view class="poem-translation">{{ currentPoem.translation }}</view>
        </view>
        <view class="complete-btn" @click="completePoemRecite">
          <text class="btn-icon">✅</text>
          <text class="btn-text">我已经会背了</text>
        </view>
      </view>
    </view>

    <view v-else-if="practiceMode === 'poem-write'" class="practice-container">
      <view class="practice-header">
        <view class="back-btn" @click="backToList">←</view>
        <view class="practice-title">古诗默写</view>
      </view>
      <view class="practice-content poem-content">
        <view v-if="currentPoem" class="poem-write-card">
          <view class="poem-title-large">{{ currentPoem.title }}</view>
          <view class="poem-author-large">
            <text>{{ currentPoem.author }}</text>
            <text class="dot">·</text>
            <text>{{ currentPoem.dynasty }}代</text>
          </view>
          <view class="poem-write-hint">请在纸上默写这首诗，完成后点击下方按钮</view>
          <view class="poem-content-mini">
            <text v-for="(line, index) in currentPoem.content" :key="index" class="poem-line-mini">{{ line }}</text>
          </view>
        </view>
        <view class="complete-btn" @click="chineseStore.completePoem(100); showResult = true">
          <text class="btn-icon">✅</text>
          <text class="btn-text">默写完成</text>
        </view>
      </view>
    </view>

    <view v-else-if="practiceMode === 'reading'" class="practice-container">
      <view class="practice-header">
        <view class="back-btn" @click="backToList">←</view>
        <view class="practice-title">课外阅读</view>
      </view>
      <view class="practice-content reading-content">
        <PracticeProgress
          ref="progressRef"
          title="阅读练习"
          :total="currentArticle?.questions.length || 0"
        />
        <view v-if="currentArticle && chineseStore.currentReading" class="reading-card">
          <view class="article-title">{{ currentArticle.title }}</view>
          <view class="article-content">{{ currentArticle.content }}</view>
          <view class="question-card">
            <view class="question-text">{{ currentArticle.questions[chineseStore.currentReading.currentQuestionIndex].question }}</view>
            <view class="options-list">
              <view
                v-for="(option, index) in currentArticle.questions[chineseStore.currentReading.currentQuestionIndex].options"
                :key="index"
                class="option-item"
                :class="{ selected: selectedOption === index }"
                @click="selectOption(index)"
              >
                <text class="option-letter">{{ String.fromCharCode(65 + index) }}.</text>
                <text class="option-text">{{ option }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="nav-buttons">
          <view
            class="nav-btn prev"
            :class="{ disabled: chineseStore.currentReading?.currentQuestionIndex === 0 }"
            @click="prevReading"
          >
            上一题
          </view>
          <view class="nav-btn next" :class="{ disabled: selectedOption === -1 }" @click="nextReading">
            {{ chineseStore.currentReading?.currentQuestionIndex === (currentArticle?.questions.length || 0) - 1 ? '提交' : '下一题' }}
          </view>
        </view>
      </view>
    </view>

    <view v-else-if="practiceMode === 'commonsense'" class="practice-container">
      <view class="practice-header">
        <view class="back-btn" @click="backToList">←</view>
        <view class="practice-title">语文常识</view>
      </view>
      <view class="practice-content">
        <PracticeProgress
          ref="progressRef"
          title="常识练习"
          :total="chineseStore.currentCommonSense?.questions.length || 0"
        />
        <view v-if="chineseStore.currentCommonSense" class="commonsense-card">
          <view class="question-text">{{ chineseStore.currentCommonSense.questions[chineseStore.currentCommonSense.currentIndex].question }}</view>
          <view class="options-list">
            <view
              v-for="(option, index) in chineseStore.currentCommonSense.questions[chineseStore.currentCommonSense.currentIndex].options"
              :key="index"
              class="option-item"
              :class="{ selected: selectedOption === index }"
              @click="selectOption(index)"
            >
              <text class="option-letter">{{ String.fromCharCode(65 + index) }}.</text>
              <text class="option-text">{{ option }}</text>
            </view>
          </view>
        </view>
        <view class="nav-buttons">
          <view
            class="nav-btn prev"
            :class="{ disabled: chineseStore.currentCommonSense?.currentIndex === 0 }"
            @click="prevCommonSense"
          >
            上一题
          </view>
          <view class="nav-btn next" :class="{ disabled: selectedOption === -1 }" @click="nextCommonSense">
            {{ chineseStore.currentCommonSense?.currentIndex === (chineseStore.currentCommonSense?.questions.length || 0) - 1 ? '提交' : '下一题' }}
          </view>
        </view>
      </view>
    </view>

    <view v-if="showResult" class="result-overlay">
      <view class="result-card">
        <view class="result-emoji">{{ resultEmoji }}</view>
        <view class="result-score">{{ resultScore }}分</view>
        <view class="result-message">{{ resultMessage }}</view>
        <view class="result-buttons">
          <view class="result-btn" @click="backToList">返回列表</view>
        </view>
      </view>
    </view>
  </view>
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

.practice-container {
  min-height: 100vh;
  background: var(--bg-primary);
}

.practice-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  padding-top: calc(var(--spacing-md) + var(--status-bar-height, 44rpx));
  background: linear-gradient(135deg, var(--secondary-color), var(--success-color));
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: var(--text-white);
  font-weight: 700;
  margin-right: var(--spacing-md);
}

.practice-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-white);
}

.practice-content {
  padding: var(--spacing-md);
}

.dictation-card,
.pinyin-card,
.wordsentence-card,
.commonsense-card {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-md);
  box-shadow: var(--shadow-md);
}

.character-info {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.pinyin {
  font-size: var(--font-size-xxl);
  font-weight: 700;
  color: var(--secondary-color);
  margin-bottom: var(--spacing-sm);
}

.meaning {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.example {
  font-size: var(--font-size-md);
  color: var(--text-light);
  font-style: italic;
}

.character-display,
.word-display {
  font-size: 120rpx;
  font-weight: 700;
  color: var(--secondary-color);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.word-meaning {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.hint {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.input-container {
  margin-top: var(--spacing-md);
}

.dictation-input,
.pinyin-input {
  width: 100%;
  height: 100rpx;
  background: #f5fffd;
  border: 3rpx solid var(--secondary-color);
  border-radius: var(--border-radius-md);
  text-align: center;
  font-size: var(--font-size-xxl);
  font-weight: 700;
  color: var(--text-primary);
}

.wordsentence-input {
  width: 100%;
  min-height: 150rpx;
  background: #f5fffd;
  border: 3rpx solid var(--secondary-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm);
  font-size: var(--font-size-md);
  color: var(--text-primary);
  line-height: 1.6;
}

.nav-buttons {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.nav-btn {
  flex: 1;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: 700;
  text-align: center;
  transition: all var(--transition-fast);
}

.nav-btn.prev {
  background: #e8f5f2;
  color: var(--secondary-color);
}

.nav-btn.next {
  background: linear-gradient(135deg, var(--secondary-color), var(--success-color));
  color: var(--text-white);
}

.nav-btn.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.poem-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 150rpx);
}

.poem-display-card,
.poem-write-card {
  flex: 1;
  background: linear-gradient(135deg, #fffaf0, #fff5e6);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-md);
  box-shadow: var(--shadow-md);
  border: 3rpx solid #ffe4b5;
}

.poem-title-large {
  font-size: var(--font-size-xxl);
  font-weight: 700;
  color: #8b4513;
  text-align: center;
  margin-bottom: var(--spacing-sm);
}

.poem-author-large {
  font-size: var(--font-size-md);
  color: #a0522d;
  text-align: center;
  margin-bottom: var(--spacing-lg);

  .dot {
    margin: 0 8rpx;
  }
}

.poem-content-large {
  margin-bottom: var(--spacing-lg);
}

.poem-line-large {
  display: block;
  font-size: var(--font-size-xl);
  color: #5c4033;
  line-height: 2;
  text-align: center;
}

.poem-translation {
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  font-size: var(--font-size-md);
  color: #8b4513;
  line-height: 1.6;
}

.poem-write-hint {
  font-size: var(--font-size-md);
  color: #8b4513;
  text-align: center;
  margin-bottom: var(--spacing-lg);
  font-weight: 600;
}

.poem-content-mini {
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}

.poem-line-mini {
  display: block;
  font-size: var(--font-size-md);
  color: #a0522d;
  line-height: 1.8;
  text-align: center;
  opacity: 0.6;
}

.complete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-fast);

  &:active {
    transform: scale(0.98);
  }
}

.btn-icon {
  font-size: 40rpx;
}

.btn-text {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-white);
}

.reading-content {
  height: calc(100vh - 150rpx);
  overflow-y: auto;
}

.reading-card {
  background: var(--bg-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-md);
  box-shadow: var(--shadow-md);
}

.article-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.article-content {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  line-height: 1.8;
  padding: var(--spacing-md);
  background: #f5fffd;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
}

.question-card {
  background: #e8f5f2;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}

.question-text {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--bg-white);
  border-radius: var(--border-radius-md);
  border: 3rpx solid transparent;
  transition: all var(--transition-fast);
}

.option-item.selected {
  border-color: var(--secondary-color);
  background: #f5fffd;
}

.option-letter {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--secondary-color);
  min-width: 32rpx;
}

.option-text {
  font-size: var(--font-size-md);
  color: var(--text-primary);
  flex: 1;
}

.result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.result-card {
  background: var(--bg-white);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  margin: var(--spacing-lg);
  text-align: center;
  box-shadow: var(--shadow-lg);
  width: 80%;
  max-width: 600rpx;
}

.result-emoji {
  font-size: 100rpx;
  margin-bottom: var(--spacing-sm);
}

.result-score {
  font-size: 80rpx;
  font-weight: 700;
  color: var(--secondary-color);
  margin-bottom: var(--spacing-sm);
}

.result-message {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.result-buttons {
  display: flex;
  gap: var(--spacing-md);
}

.result-btn {
  flex: 1;
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--secondary-color), var(--success-color));
  color: var(--text-white);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: 700;
}
</style>
