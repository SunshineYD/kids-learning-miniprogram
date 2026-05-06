# 📚 语文练习页面优化计划

## 📋 总体目标
在保证原有功能的前提下，提高代码的可维护性、复用性和用户体验，让6-10岁孩子更喜欢语文学习。

---

## 📁 优化文档索引
- [原需求文档](6-10岁少儿课后学习小程序%20开发需求文档（Word精简版）%20(4).md)
- [重构计划](chinese-practice-refactor-plan.md)
- [改进步骤](语文练习模块改进步骤.md)
- [当前优化计划](chinese-practice-optimization-plan.md)

---

## 🔴 高优先级优化（优先处理）

### 1. 类型系统优化
**文件**：`src/types/chinese.ts`

**目标**：抽取重复的类型定义，让类型更加清晰和可复用

**需要创建的类型**：
```typescript
export type PracticeMode = 
  | 'list'
  | 'dictation'
  | 'pinyin'
  | 'wordsentence'
  | 'poem-recite'
  | 'poem-write'
  | 'reading'
  | 'commonsense'

export type TabType = 'textbook' | 'poem' | 'daily'

export interface Tab {
  id: TabType
  name: string
  icon: string
}

export interface Semester {
  id: 1 | 2
  name: string
}
```

---

### 2. 常量定义优化
**文件**：`src/constants/chinese.ts`

**目标**：将tabs和semesters等常量抽取到单独的文件中

**需要定义的常量**：
```typescript
import type { Tab, Semester } from '@/types/chinese'

export const TABS: Tab[] = [
  { id: 'textbook', name: '课本同步', icon: '📚' },
  { id: 'poem', name: '古诗词', icon: '🏮' },
  { id: 'daily', name: '每日一练', icon: '☀️' },
] as const

export const SEMESTERS: Semester[] = [
  { id: 1, name: '上学期' },
  { id: 2, name: '下学期' },
] as const
```

---

### 3. 组件拆分 - 标签页组件
**目标**：将列表视图的三个标签页拆分为独立组件

#### 3.1 TextbookTab 组件
**文件**：`src/components/chinese/tabs/TextbookTab.vue`

**功能**：
- 显示学期选择器
- 显示课程列表
- 触发课程练习事件

**Props**：
```typescript
interface Props {
  semesters: Semester[]
  currentSemester: 1 | 2
  lessons: ChineseLesson[]
  isLessonCompleted: (lesson: ChineseLesson) => boolean
}
```

**Emits**：
```typescript
interface Emits {
  switchSemester: [semester: 1 | 2]
  startDictation: [lesson: ChineseLesson]
  startPinyin: [lesson: ChineseLesson]
  startWordSentence: [lesson: ChineseLesson]
}
```

---

#### 3.2 PoemTab 组件
**文件**：`src/components/chinese/tabs/PoemTab.vue`

**功能**：
- 显示学期选择器
- 显示古诗列表
- 触发古诗练习事件

**Props**：
```typescript
interface Props {
  semesters: Semester[]
  currentSemester: 1 | 2
  poems: AncientPoem[]
  isPoemCompleted: (poem: AncientPoem) => boolean
}
```

**Emits**：
```typescript
interface Emits {
  switchSemester: [semester: 1 | 2]
  startPoemRecite: [poem: AncientPoem]
  startPoemWrite: [poem: AncientPoem]
}
```

---

#### 3.3 DailyTab 组件
**文件**：`src/components/chinese/tabs/DailyTab.vue`

**功能**：
- 显示每日任务完成状态
- 显示课外阅读和语文常识任务卡片
- 触发每日练习事件

**Props**：
```typescript
interface Props {
  dailyPracticeCompleted: boolean
  todayReading: ReadingArticle | null
}
```

**Emits**：
```typescript
interface Emits {
  startReading: [article: ReadingArticle]
  startCommonSense: []
}
```

---

### 4. 组件拆分 - DailyTaskCard 组件
**文件**：`src/components/chinese/DailyTaskCard.vue`

**目标**：封装每日任务卡片，提高复用性

**Props**：
```typescript
interface Props {
  icon: string
  title: string
  desc: string
  gradient: string
}
```

**Emits**：
```typescript
interface Emits {
  click: []
}
```

---

### 5. 主页面重构
**文件**：`src/pages/chinese-practice/chinese-practice.vue`

**目标**：使用抽取的组件重构主页面，让代码更简洁

**重构后结构**：
```vue
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useChineseStore } from '@/store/chinese'
import { useAppStore } from '@/store/app'
import ResultDisplay from '@/components/chinese/layout/ResultDisplay.vue'
import DictationPractice from '@/components/chinese/practice/DictationPractice.vue'
import PinyinPractice from '@/components/chinese/practice/PinyinPractice.vue'
import WordSentencePractice from '@/components/chinese/practice/WordSentencePractice.vue'
import PoemRecitePractice from '@/components/chinese/practice/PoemRecitePractice.vue'
import PoemWritePractice from '@/components/chinese/practice/PoemWritePractice.vue'
import OptionPractice from '@/components/chinese/practice/OptionPractice.vue'
import TextbookTab from '@/components/chinese/tabs/TextbookTab.vue'
import PoemTab from '@/components/chinese/tabs/PoemTab.vue'
import DailyTab from '@/components/chinese/tabs/DailyTab.vue'
import PageHeader from '@/components/chinese/PageHeader.vue'
import TabsContainer from '@/components/chinese/TabsContainer.vue'
import type { PracticeMode, TabType, ChineseLesson, AncientPoem, ReadingArticle } from '@/types'
import { TABS, SEMESTERS } from '@/constants/chinese'
import { getReadingByGrade } from '@/data/chinese-content'
</script>
```

---

## 🟡 中优先级优化

### 6. 错误处理优化
**目标**：添加更完善的错误处理，特别是对 `chineseStore.progress` 为 `null` 的情况

**优化位置**：
- `todayReading` computed 属性
- `dailyPracticeCompleted` computed 属性
- `isLessonCompleted` 函数
- `isPoemCompleted` 函数

---

### 7. 练习模式路由组件
**文件**：`src/components/chinese/PracticeModeRouter.vue`

**目标**：统一管理练习模式的切换，简化主页面模板

**Props**：
```typescript
interface Props {
  mode: PracticeMode
  currentLesson: ChineseLesson | null
  currentPoem: AncientPoem | null
  currentArticle: ReadingArticle | null
}
```

**Emits**：
```typescript
interface Emits {
  back: []
  complete: [score: number]
}
```

---

### 8. PageHeader 组件
**文件**：`src/components/chinese/PageHeader.vue`

**目标**：抽取页面头部为独立组件

---

### 9. TabsContainer 组件
**文件**：`src/components/chinese/TabsContainer.vue`

**目标**：抽取标签页容器为独立组件

---

## 🟢 低优先级优化

### 10. 通用练习布局组件
**文件**：`src/components/chinese/layout/PracticePageLayout.vue`

**目标**：为所有练习组件提供统一的布局结构

---

### 11. 年级选择入口
**目标**：在页面头部添加快速切换年级的按钮

---

### 12. 练习说明和帮助
**目标**：为每个练习模式添加简短的使用说明

---

### 13. 加载状态优化
**目标**：在练习启动时添加加载动画

---

## 📝 实施顺序

**第一步**：高优先级1-5（类型+常量+标签页组件+主页面重构）
**第二步**：中优先级6-9（错误处理+练习路由+其他组件）
**第三步**：低优先级10-13（布局+年级选择+说明+加载）

---

## ✅ 检查清单

- [ ] 创建 `src/types/chinese.ts` 类型定义文件
- [ ] 创建 `src/constants/chinese.ts` 常量文件
- [ ] 创建 `TextbookTab.vue` 组件
- [ ] 创建 `PoemTab.vue` 组件
- [ ] 创建 `DailyTab.vue` 组件
- [ ] 创建 `DailyTaskCard.vue` 组件
- [ ] 重构 `chinese-practice.vue` 主页面
- [ ] 添加完善的错误处理
- [ ] 测试所有功能是否正常
- [ ] 更新文档记录优化过程

---

## 🎯 预期效果

- 代码更清晰：主页面从580+行减少到更易维护的规模
- 组件更复用：标签页、任务卡片等组件可以在其他地方复用
- 类型更安全：使用TypeScript提供更好的类型提示
- 维护更容易：代码结构清晰，修改某个功能只需要修改对应的组件
