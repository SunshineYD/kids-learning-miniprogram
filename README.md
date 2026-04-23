
# 6-10岁少儿课后学习微信小程序

## 项目简介

专为 6-10岁（1-4年级）小学生设计的课后学习微信小程序，包含口算练习、单词背诵、语文巩固、每日打卡等功能。

## 技术栈

- uni-app + Vue 3 + TypeScript
- Pinia 状态管理

## 项目结构

```
miniProgram/
├── src/                    # 源代码
│   ├── pages/             # 页面
│   │   ├── index/        # 首页
│   │   ├── login/        # 登录
│   │   ├── math-practice/ # 数学口算练习
│   │   ├── english/      # 英语单词背诵
│   │   ├── chinese-practice/ # 语文课后巩固
│   │   ├── course/       # 课程中心
│   │   ├── task/         # 每日任务
│   │   ├── mine/         # 我的
│   │   ├── settings/     # 设置
│   │   ├── check-in/     # 每日打卡
│   │   ├── wrong-questions/ # 错题本
│   │   ├── study-report/ # 学习报告
│   │   ├── parent-center/ # 家长中心
│   │   ├── membership/   # 会员中心
│   │   ├── feedback/     # 意见反馈
│   │   └── about/        # 关于我们
│   ├── components/        # 组件
│   │   ├── CheckInCard/
│   │   ├── CourseCard/
│   │   ├── DailyTask/
│   │   ├── GradeSelector/
│   │   ├── KidButton/
│   │   ├── QuickNav/
│   │   ├── ThemeToggle/
│   │   ├── chinese/
│   │   ├── english/
│   │   └── math/
│   ├── store/            # Pinia 状态管理
│   ├── data/             # 题库数据
│   ├── utils/            # 工具函数
│   ├── styles/           # 样式文件
│   ├── types/            # TypeScript 类型定义
│   ├── App.vue           # 应用入口
│   ├── main.ts           # 主入口文件
│   ├── pages.json        # 页面配置
│   ├── manifest.json     # 应用配置
│   └── uni.scss          # uni-app 全局样式
├── static/               # 静态资源
├── docs/                 # 需求文档
├── package.json          # 依赖配置
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
└── project.config.json   # 微信开发者工具配置
```

## 功能模块

### 已完成功能

- ✅ 微信一键登录
- ✅ 手机/平板双端适配
- ✅ 护眼模式/深色模式
- ✅ 答题音效开关
- ✅ 年级选择（1-4年级）
- ✅ 数学口算练习（分级题库、自动批改、错题管理）
- ✅ 英语单词背诵（跟读、听写、艾宾浩斯复习）
- ✅ 语文课后巩固（生字听写、古诗词背诵）
- ✅ 每日打卡体系
- ✅ 错题本
- ✅ 学习报告
- ✅ 家长中心
- ✅ 会员功能
- ✅ 意见反馈
- ✅ 关于我们

## 快速开始

### 方式一：使用 Trae/Vite 开发（推荐）

#### 1. 安装依赖

```bash
npm install
```

#### 2. 配置 AppID

在 `manifest.json` 中配置您的微信小程序 AppID：

```json
"mp-weixin": {
  "appid": "您的AppID",
  ...
}
```

#### 3. 启动开发模式

```bash
npm run dev:mp-weixin
```

#### 4. 在微信开发者工具中预览

启动成功后，编译产物会生成在 `dist/dev/mp-weixin` 目录。打开**微信开发者工具**，选择「导入项目」，选择该目录即可预览和调试。

---

### 方式二：配合 HBuilderX 使用

#### 工作流程：Trae 开发 + HBuilderX 预览

1. **在 Trae IDE 中进行开发**（修改代码、添加功能）
2. **在 Trae 中运行构建**：
   ```bash
   npm run dev:mp-weixin
   ```
3. **在 HBuilderX 或微信开发者工具**中打开 `dist/dev/mp-weixin` 目录预览

#### 文件同步说明

- 所有代码修改在 `src/` 目录下进行
- Vite 会自动监听文件变化并重新编译
- 编译产物会自动更新到 `dist/dev/mp-weixin`
- 微信开发者工具会自动热刷新显示最新内容

---

### 构建生产版本

```bash
npm run build:mp-weixin
```

### 类型检查

```bash
npm run type-check
```

## 开发说明

### 配置 AppID

在 `manifest.json` 中配置您的微信小程序 AppID。

### TabBar 图标

需要在 `static/tabbar/` 目录下添加图标文件。

### 后端 API

当前 API 是模拟的，需要替换为真实接口。

## 注意事项

1. 本项目使用 uni-app 框架开发，可编译到微信小程序平台
2. 所有页面已在 `pages.json` 中配置
3. 样式统一使用 SCSS 变量定义在 `src/styles/variables.scss`
4. 状态管理使用 Pinia，位于 `src/store/` 目录

## 需求文档

详细需求请查看：[docs/6-10岁少儿课后学习小程序 开发需求文档（Word精简版） (4).md](./docs/6-10岁少儿课后学习小程序%20开发需求文档（Word精简版）%20(4).md)

