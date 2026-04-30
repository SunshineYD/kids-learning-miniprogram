# 语文练习页面重构计划

## 现有问题分析

### 1. 文件过大
- 单个文件 1433 行，维护困难
- 所有功能耦合在一个组件

### 2. 代码重复
- 所有练习模式都有类似的导航和进度条逻辑
- 反馈组件逻辑重复
- 页面头部代码重复

### 3. 缺少导入
- 发现 bug：使用了 `audio.playCorrect` 但没有导入 `audio` 工具

### 4. 状态管理混乱
- 16 个 state 变量在 setup 中
- 30+ 个函数混在一起

## 重构方案

### 第一阶段：基础设施（高优先级）
1. ✅ 修复 audio 工具导入
2. 创建通用布局组件
3. 创建练习状态 composable

### 第二阶段：拆分组件（高优先级）
4. 生字听写组件（带即时反馈）
5. 拼音认读组件
6. 组词造句组件

### 第三阶段：完成拆分（中优先级）
7. 古诗相关组件
8. 阅读/常识练习组件
9. 结果展示组件

### 第四阶段：重构主页（高优先级）
10. 整合所有组件，简化主页面

## 目录结构

```
src/components/chinese/
├── layout/
│   ├── PracticePageLayout.vue
│   ├── PracticeHeader.vue
│   └── ResultDisplay.vue
├── practice/
│   ├── DictationPractice.vue
│   ├── PinyinPractice.vue
│   ├── WordSentencePractice.vue
│   ├── PoemRecitePractice.vue
│   ├── PoemWritePractice.vue
│   ├── ReadingPractice.vue
│   └── CommonSensePractice.vue
└── shared/
    ├── FeedbackDisplay.vue
    └── NavigationButtons.vue

src/composables/
└── usePracticeState.ts
```
