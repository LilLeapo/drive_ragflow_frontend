# 安装和设置说明

## 系统要求

- Node.js 16.x 或更高版本
- npm 8.x 或更高版本（通常与Node.js一起安装）

## 安装Node.js

### 方法1：使用包管理器（推荐）

#### Ubuntu/Debian:
```bash
# 更新包列表
sudo apt update

# 安装Node.js和npm
sudo apt install nodejs npm

# 验证安装
node --version
npm --version
```

#### CentOS/RHEL/Fedora:
```bash
# 使用dnf (Fedora) 或 yum (CentOS/RHEL)
sudo dnf install nodejs npm
# 或
sudo yum install nodejs npm

# 验证安装
node --version
npm --version
```

### 方法2：使用NodeSource仓库（获取最新版本）

```bash
# 下载并执行NodeSource安装脚本
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# 安装Node.js
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

### 方法3：使用nvm（Node Version Manager）

```bash
# 安装nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载终端配置
source ~/.bashrc

# 安装最新的LTS版本Node.js
nvm install --lts

# 使用安装的版本
nvm use --lts

# 验证安装
node --version
npm --version
```

## 项目安装步骤

1. **进入项目目录**
   ```bash
   cd ragflow-search-standalone
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置API设置**
   
   编辑 `src/services/api.ts` 文件，修改以下配置：
   
   ```typescript
   // 替换为你的RAGFlow API地址
   const API_BASE_URL = 'http://your-ragflow-server:port';
   
   // 替换为你的API密钥
   const API_KEY = 'your-api-key-here';
   ```

4. **启动开发服务器**
   ```bash
   npm start
   ```
   
   应用将在 `http://localhost:3000` 启动。

5. **构建生产版本**
   ```bash
   npm run build
   ```

## 环境变量配置（可选）

创建 `.env` 文件在项目根目录：

```bash
# .env
REACT_APP_API_BASE_URL=http://your-ragflow-server:port
REACT_APP_API_KEY=your-api-key-here
```

然后修改 `src/services/api.ts` 使用环境变量：

```typescript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9380';
const API_KEY = process.env.REACT_APP_API_KEY || 'your-default-api-key';
```

## 常见问题解决

### 1. 权限问题
如果遇到权限错误，可以配置npm使用不同的目录：
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 2. 网络问题
如果npm安装很慢，可以使用淘宝镜像：
```bash
npm config set registry https://registry.npmmirror.com
```

### 3. 清理缓存
如果遇到奇怪的错误，尝试清理npm缓存：
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 项目结构验证

安装完成后，项目结构应该如下：

```
ragflow-search-standalone/
├── node_modules/           # 依赖包（npm install后生成）
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── KnowledgeSelector.tsx
│   │   ├── KnowledgeSelector.css
│   │   ├── SearchInput.tsx
│   │   ├── SearchInput.css
│   │   ├── SearchResults.tsx
│   │   ├── SearchResults.css
│   │   ├── SearchPage.tsx
│   │   └── SearchPage.css
│   ├── hooks/
│   │   └── useSearch.ts
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
├── package-lock.json       # 锁定依赖版本（npm install后生成）
├── README.md
└── SETUP.md
```

## 下一步

1. 确保你的RAGFlow服务器正在运行
2. 配置正确的API地址和密钥
3. 启动应用并测试搜索功能

如果遇到任何问题，请检查浏览器控制台的错误信息，并确保RAGFlow API可以正常访问。 