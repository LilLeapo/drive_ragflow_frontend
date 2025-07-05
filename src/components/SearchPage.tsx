import React, { useState, useEffect } from 'react';
import { Layout, message, Spin, Card, Flex } from 'antd';
import { SearchOutlined, DatabaseOutlined } from '@ant-design/icons';
import SearchInput from './SearchInput.tsx';
import SearchResults from './SearchResults.tsx';
import KnowledgeSelector from './KnowledgeSelector.tsx';
import { useKnowledgeList, useSearch } from '../hooks/useSearch.ts';
import { IChunk, IDocumentAgg } from '../types';
import './SearchPage.css';

const { Content, Sider } = Layout;

const SearchPage: React.FC = () => {
  const [selectedKnowledgeIds, setSelectedKnowledgeIds] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<{
    answer: string;
    chunks: IChunk[];
    documents: IDocumentAgg[];
    total: number;
  }>({
    answer: '',
    chunks: [],
    documents: [],
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isFirstRender, setIsFirstRender] = useState(true);

  const { error: knowledgeError } = useKnowledgeList();
  const { search } = useSearch();

  // 处理知识库选择
  const handleKnowledgeChange = (knowledgeIds: string[]) => {
    setSelectedKnowledgeIds(knowledgeIds);
  };

  // 处理搜索
  const handleSearch = async (question: string) => {
    if (!question.trim()) {
      message.warning('请输入搜索问题');
      return;
    }

    if (selectedKnowledgeIds.length === 0) {
      message.warning('请选择至少一个知识库');
      return;
    }

    setLoading(true);
    setCurrentQuestion(question);
    setCurrentPage(1);
    setIsFirstRender(false);

    try {
      const result = await search({
        question: question.trim(),
        dataset_ids: selectedKnowledgeIds,
        page: 1,
        page_size: pageSize,
        highlight: true,
        similarity_threshold: 0.2,
        vector_similarity_weight: 0.3,
        top_k: 1024,
        keyword: false,
      });

      setSearchResults({
        answer: result.answer || '',
        chunks: result.chunks || [],
        documents: result.doc_aggs || [],
        total: result.total || 0,
      });
    } catch (error) {
      console.error('搜索失败:', error);
      message.error('搜索失败，请重试');
      setSearchResults({
        answer: '',
        chunks: [],
        documents: [],
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理分页
  const handlePageChange = async (page: number) => {
    if (!currentQuestion.trim() || selectedKnowledgeIds.length === 0) return;

    setLoading(true);
    setCurrentPage(page);

    try {
      const result = await search({
        question: currentQuestion,
        dataset_ids: selectedKnowledgeIds,
        page: page,
        page_size: pageSize,
        highlight: true,
        similarity_threshold: 0.2,
        vector_similarity_weight: 0.3,
        top_k: 1024,
        keyword: false,
      });

      setSearchResults({
        answer: result.answer || '',
        chunks: result.chunks || [],
        documents: result.doc_aggs || [],
        total: result.total || 0,
      });
    } catch (error) {
      console.error('分页搜索失败:', error);
      message.error('分页搜索失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理chunk点击
  const handleChunkClick = (chunk: IChunk) => {
    console.log('Chunk clicked:', chunk);
    // 这里可以添加chunk点击的处理逻辑，比如高亮显示、复制内容等
    message.info(`点击了来自 "${chunk.docnm_kwd}" 的内容片段`);
  };

  // 处理文档点击
  const handleDocumentClick = (document: IDocumentAgg) => {
    console.log('Document clicked:', document);
    // 这里可以添加文档点击的处理逻辑，比如跳转到文档详情页
    message.info(`点击了文档 "${document.doc_name}"，包含 ${document.count} 个相关片段`);
  };

  // 处理相关问题点击
  const handleRelatedQuestionClick = (question: string) => {
    console.log('Related question clicked:', question);
    // 重新搜索相关问题
    handleSearch(question);
  };

  // 显示知识库加载错误
  useEffect(() => {
    if (knowledgeError) {
      message.error('加载知识库失败，请检查网络连接和API配置');
    }
  }, [knowledgeError]);

  // 搜索输入组件
  const SearchInputComponent = (
    <div className="search-input-wrapper">
      <SearchInput 
        onSearch={handleSearch} 
        placeholder="请输入您的问题..."
        size="large"
        loading={loading}
      />
    </div>
  );

  return (
    <Layout className="search-page">
      {/* 侧边栏 */}
      <Sider 
        width={300} 
        className={`search-sider ${isFirstRender ? 'transparent-sider' : ''}`}
        theme="light"
      >
        <div className="sider-content">
          <Card 
            title={
              <Flex align="center" gap={8}>
                <DatabaseOutlined />
                <span>知识库选择</span>
              </Flex>
            }
            className="knowledge-selector-card"
            size="small"
          >
            <KnowledgeSelector
              selectedKnowledgeIds={selectedKnowledgeIds}
              onSelectionChange={handleKnowledgeChange}
            />
          </Card>
        </div>
      </Sider>

      {/* 主内容区 */}
      <Layout className={isFirstRender ? 'main-layout-centered' : 'main-layout'}>
        <Content>
          {isFirstRender ? (
            // 首次渲染 - 居中显示搜索框
            <Flex justify="center" className="first-render-content">
              <Flex vertical align="center" gap="large">
                <div className="app-logo">
                  <div className="app-icon">
                    <SearchOutlined style={{ fontSize: '60px', color: '#1890ff' }} />
                  </div>
                  <h1 className="app-name">RAGFlow 搜索</h1>
                </div>
                {SearchInputComponent}
              </Flex>
            </Flex>
          ) : (
            // 搜索后 - 正常布局
            <Flex className="content-wrapper">
              <div className="main-content">
                {/* 顶部搜索框 */}
                <div className="sticky-search">
                  {SearchInputComponent}
                </div>

                {/* 加载状态 */}
                {loading && (
                  <div className="loading-wrapper">
                    <Spin size="large" />
                    <div className="loading-text">正在搜索中...</div>
                  </div>
                )}

                {/* 搜索结果 */}
                <div className="results-wrapper">
                  <SearchResults
                    answer={searchResults.answer}
                    chunks={searchResults.chunks}
                    documents={searchResults.documents}
                    total={searchResults.total}
                    page={currentPage}
                    pageSize={pageSize}
                    onChunkClick={handleChunkClick}
                    onDocumentClick={handleDocumentClick}
                    onRelatedQuestionClick={handleRelatedQuestionClick}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </Flex>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SearchPage; 