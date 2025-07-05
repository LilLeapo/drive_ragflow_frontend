# RAGFlow 搜索独立应用 - 项目概览

## 🚀 项目简介

RAGFlow 搜索独立应用是一个基于 React 的前端应用，旨在提供智能搜索功能。该应用集成了 RAGFlow 后端服务，支持知识库搜索、文档检索和智能问答等功能。

## 📋 核心功能

- **智能搜索**: 支持自然语言查询，提供准确的搜索结果
- **知识库管理**: 可选择特定知识库进行搜索
- **文档检索**: 展示相关文档片段和来源
- **智能问答**: 基于检索结果生成智能答案
- **相关问题推荐**: 自动推荐相关问题
- **实时搜索**: 支持流式搜索响应

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **UI 组件库**: Ant Design
- **图标库**: Lucide React
- **构建工具**: Create React App
- **包管理器**: pnpm
- **样式**: CSS + Ant Design 主题

## 📁 项目结构

```
ragflow-search-standalone/
├── public/                 # 静态资源
├── src/
│   ├── components/        # React 组件
│   │   ├── App.tsx       # 主应用组件
│   │   ├── SearchPage.tsx # 搜索页面
│   │   ├── SearchInput.tsx # 搜索输入框
│   │   ├── SearchResults.tsx # 搜索结果展示
│   │   └── KnowledgeSelector.tsx # 知识库选择器
│   ├── hooks/            # 自定义 Hooks
│   │   └── useSearch.ts  # 搜索相关逻辑
│   ├── services/         # API 服务
│   │   └── api.ts        # API 调用封装
│   ├── types/            # TypeScript 类型定义
│   │   └── index.ts      # 类型声明
│   └── styles/           # 样式文件
├── package.json          # 项目配置
├── README.md            # 详细说明文档
├── SETUP.md             # 安装配置指南
└── PROJECT_OVERVIEW.md  # 项目概览（本文件）
```

## 🔧 核心组件说明

### SearchPage
- 主搜索页面，整合所有功能模块
- 管理搜索状态和结果展示
- 支持知识库选择和搜索历史

### SearchInput
- 搜索输入组件
- 支持回车搜索和按钮触发
- 提供搜索状态反馈

### SearchResults
- 搜索结果展示组件
- 支持多种结果格式（答案、文档片段、相关问题）
- 提供结果交互功能

### KnowledgeSelector
- 知识库选择组件
- 支持多选知识库
- 提供知识库状态管理

## 🎯 主要特性

1. **响应式设计**: 适配不同屏幕尺寸
2. **类型安全**: 完整的 TypeScript 类型定义
3. **组件化架构**: 高度模块化的组件设计
4. **错误处理**: 完善的错误提示和处理机制
5. **性能优化**: 合理的状态管理和渲染优化

## 🔗 API 集成

应用通过 `ApiService` 类与 RAGFlow 后端服务进行通信：

- **搜索接口**: `/api/v1/retrieval`
- **知识库接口**: `/api/v1/dataset`
- **流式搜索**: 支持 SSE (Server-Sent Events)

## 📊 构建信息

- **构建状态**: ✅ 成功
- **构建大小**: 
  - JS: ~250.86 kB (gzipped)
  - CSS: ~2 kB (gzipped)
- **兼容性**: 现代浏览器 (ES6+)

## 🚀 快速开始

1. 确保已安装 Node.js (16.x+) 和 pnpm
2. 参考 `SETUP.md` 进行环境配置
3. 运行 `pnpm install` 安装依赖
4. 运行 `pnpm start` 启动开发服务器
5. 访问 `http://localhost:3000` 查看应用

## 📝 开发状态

- ✅ 基础框架搭建完成
- ✅ 核心组件开发完成
- ✅ API 集成完成
- ✅ 类型定义完成
- ✅ 构建配置完成
- ✅ 文档编写完成

## 🤝 贡献指南

详细的贡献指南请参考 `README.md` 文件。

---

*最后更新: 2024年* 