import React, { useState, useEffect } from 'react';
import { Layout, message, Spin } from 'antd';
import SearchInput from './SearchInput.tsx';
import SearchResults from './SearchResults.tsx';
import KnowledgeSelector from './KnowledgeSelector.tsx';
import { useKnowledgeList, useSearch } from '../hooks/useSearch.ts';
import { IChunk, IDocumentAgg } from '../types';
import './SearchPage.css';

const { Header, Content, Sider } = Layout;

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

  const { knowledgeList, loading: knowledgeLoading, error: knowledgeError } = useKnowledgeList();
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

  return (
    <Layout className="search-page">
      <Header className="search-header">
        <div className="header-content">
          <h1>RAGFlow 搜索</h1>
          <div className="search-input-container">
            <SearchInput onSearch={handleSearch} />
          </div>
        </div>
      </Header>

      <Layout>
        <Sider width={300} className="search-sider">
          <div className="sider-content">
            <KnowledgeSelector
              selectedKnowledgeIds={selectedKnowledgeIds}
              onSelectionChange={handleKnowledgeChange}
            />
          </div>
        </Sider>

        <Content className="search-content">
          <div className="content-wrapper">
            {loading && (
              <div className="loading-overlay">
                <Spin size="large" />
                <div className="loading-text">正在搜索...</div>
              </div>
            )}

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
        </Content>
      </Layout>
    </Layout>
  );
};

export default SearchPage; 