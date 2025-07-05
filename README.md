# RAGFlow 搜索前端应用

这是一个基于RAGFlow的独立搜索前端应用，提供智能知识库搜索功能。

## 功能特性

- 🔍 **智能搜索**: 基于RAGFlow的语义搜索能力
- 📚 **知识库管理**: 支持多知识库选择和管理
- 💬 **实时问答**: 支持流式响应的问答体验
- 📖 **结果展示**: 丰富的搜索结果展示，包括答案、相关片段和文档聚合
- 🔗 **相关问题**: 自动推荐相关问题
- 📱 **响应式设计**: 适配桌面和移动设备
- 🎨 **现代UI**: 基于Ant Design的现代化界面

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI组件库**: Ant Design
- **图标库**: Lucide React
- **HTTP客户端**: Axios
- **流式处理**: EventSource Parser
- **样式**: CSS + Ant Design主题

## 项目结构

```
ragflow-search-standalone/
├── public/
│   └── index.html              # HTML模板
├── src/
│   ├── components/             # 组件目录
│   │   ├── KnowledgeSelector.tsx    # 知识库选择器
│   │   ├── SearchInput.tsx          # 搜索输入框
│   │   ├── SearchResults.tsx        # 搜索结果展示
│   │   ├── SearchPage.tsx           # 主搜索页面
│   │   └── *.css                    # 组件样式文件
│   ├── hooks/                  # 自定义Hooks
│   │   └── useSearch.ts        # 搜索相关Hooks
│   ├── services/               # API服务
│   │   └── api.ts              # API调用封装
│   ├── types/                  # TypeScript类型定义
│   │   └── index.ts            # 类型定义文件
│   ├── App.tsx                 # 主应用组件
│   ├── App.css                 # 应用样式
│   ├── index.tsx               # 应用入口
│   └── index.css               # 全局样式
├── package.json                # 项目配置
└── README.md                   # 项目说明
```

## 快速开始

### 1. 安装依赖

```bash
cd ragflow-search-standalone
npm install
```

### 2. 配置API

在 `src/services/api.ts` 文件中配置你的RAGFlow API：

```typescript
// 配置你的RAGFlow API地址
const API_BASE_URL = 'http://your-ragflow-api-url';

// 配置你的API密钥
const API_KEY = 'your-api-key-here';
```

### 3. 启动应用

```bash
npm start
```

应用将在 `http://localhost:3000` 启动。

### 4. 构建生产版本

```bash
npm run build
```

构建后的文件将在 `build/` 目录中。

## 使用说明

### 1. 选择知识库

在左侧边栏的"知识库选择"区域，选择你要搜索的知识库。支持多选。

### 2. 输入搜索问题

在搜索框中输入你的问题，点击发送按钮或按Enter键开始搜索。

### 3. 查看搜索结果

搜索结果包括：
- **回答**: AI生成的答案
- **相关片段**: 匹配的知识片段，支持高亮显示
- **相关文档**: 相关文档的聚合信息
- **相关问题**: 系统推荐的相关问题

### 4. 搜索历史

左侧边栏会显示最近的搜索历史，点击可以快速查看之前的搜索结果。

## API配置

### 环境变量

你可以通过环境变量配置API：

```bash
# .env 文件
REACT_APP_API_BASE_URL=http://your-ragflow-api-url
REACT_APP_API_KEY=your-api-key-here
```

### API接口

应用使用以下RAGFlow API接口：

- `GET /v1/datasets` - 获取知识库列表
- `POST /v1/chats/{chat_id}/completions` - 发送问题并获取答案
- `POST /v1/retrieval` - 测试检索功能
- `POST /v1/chats/{chat_id}/related_questions` - 获取相关问题

## 自定义配置

### 主题配置

在 `src/App.tsx` 中可以自定义Ant Design主题：

```typescript
const theme = {
  token: {
    colorPrimary: '#1890ff',    // 主色调
    borderRadius: 8,            // 圆角大小
    fontSize: 14,               // 字体大小
    // ... 更多配置
  },
};
```

### 样式自定义

每个组件都有对应的CSS文件，可以根据需要进行样式调整。

## 开发指南

### 添加新功能

1. 在 `src/components/` 中创建新组件
2. 在 `src/hooks/` 中添加相关的自定义Hook
3. 在 `src/services/api.ts` 中添加API调用
4. 在 `src/types/index.ts` 中添加类型定义

### 调试

使用浏览器开发者工具查看网络请求和控制台日志。API调用失败时会在控制台输出详细错误信息。

## 部署

### 1. 构建应用

```bash
npm run build
```

### 2. 部署到静态服务器

将 `build/` 目录的内容部署到任何静态文件服务器，如Nginx、Apache或CDN。

### 3. 配置反向代理

如果需要解决跨域问题，可以配置反向代理：

```nginx
# Nginx配置示例
location /api/ {
    proxy_pass http://your-ragflow-api-url/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 常见问题

### 1. 跨域问题

如果遇到跨域问题，可以：
- 在RAGFlow服务端配置CORS
- 使用反向代理
- 在开发环境中配置代理

### 2. API密钥安全

生产环境中不应该在前端代码中硬编码API密钥。建议：
- 使用环境变量
- 通过后端代理API调用
- 实现用户认证系统

### 3. 性能优化

- 使用React.memo优化组件渲染
- 实现虚拟滚动处理大量数据
- 使用防抖优化搜索输入

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License 