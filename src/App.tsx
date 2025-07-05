import React from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import SearchPage from './components/SearchPage.tsx';
import './App.css';

// 自定义主题配置
const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#1890ff',
      siderBg: '#ffffff',
      bodyBg: '#f0f2f5',
    },
    Card: {
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    },
    Input: {
      borderRadius: 8,
      fontSize: 16,
    },
    Button: {
      borderRadius: 8,
    },
    Tree: {
      borderRadius: 6,
    },
    Tag: {
      borderRadius: 6,
    },
  },
};

const App: React.FC = () => {
  return (
    <ConfigProvider 
      locale={zhCN}
      theme={theme}
    >
      <AntdApp>
        <div className="App">
          <SearchPage />
        </div>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App; 