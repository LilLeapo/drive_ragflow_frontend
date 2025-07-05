import React, { useState, useCallback } from 'react';
import { Input, Button, Dropdown, Menu } from 'antd';
import { StopCircle, SendHorizontal, History } from 'lucide-react';
import './SearchInput.css';

const { Search } = Input;

interface Props {
  onSearch: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  onStop?: () => void;
  placeholder?: string;
  size?: 'large' | 'middle' | 'small';
  className?: string;
  searchHistory?: string[];
}

const SearchInput: React.FC<Props> = ({
  onSearch,
  loading = false,
  disabled = false,
  onStop,
  placeholder = '请输入您的问题...',
  size = 'large',
  className,
  searchHistory = [],
}) => {
  const [value, setValue] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    if (value.trim()) {
      onSearch(value.trim());
    }
  }, [value, onSearch]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  const handleHistorySelect = useCallback((question: string) => {
    setValue(question);
    onSearch(question);
  }, [onSearch]);

  const renderAddon = () => {
    if (loading && onStop) {
      return (
        <Button 
          onClick={onStop}
          icon={<StopCircle size={16} />}
          type="text"
          title="停止生成"
        />
      );
    }
    
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {searchHistory.length > 0 && (
          <Dropdown
            overlay={
              <Menu>
                {searchHistory.map((question, index) => (
                  <Menu.Item key={index} onClick={() => handleHistorySelect(question)}>
                    {question.length > 50 ? `${question.substring(0, 50)}...` : question}
                  </Menu.Item>
                ))}
              </Menu>
            }
            trigger={['click']}
          >
            <Button 
              icon={<History size={16} />}
              type="text"
              title="搜索历史"
            />
          </Dropdown>
        )}
        <Button 
          onClick={handleSearch}
          icon={<SendHorizontal size={16} />}
          type="text"
          disabled={disabled || !value.trim()}
          title="发送"
          style={{ color: value.trim() ? '#1890ff' : undefined }}
        />
      </div>
    );
  };

  return (
    <Search
      value={value}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      placeholder={placeholder}
      allowClear
      size={size}
      disabled={disabled}
      loading={loading}
      className={className}
      addonAfter={renderAddon()}
      onSearch={handleSearch}
    />
  );
};

export default SearchInput; 