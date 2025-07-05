import React from 'react';
import { Card, List, Pagination, Space, Tag, Divider, Empty, Avatar, Popover } from 'antd';
import { FileTextOutlined, HighlightOutlined, BookOutlined } from '@ant-design/icons';
import { IChunk, IDocumentAgg } from '../types';
import './SearchResults.css';

interface SearchResultsProps {
  answer: string;
  chunks: IChunk[];
  documents: IDocumentAgg[];
  total: number;
  page: number;
  pageSize: number;
  onChunkClick?: (chunk: IChunk) => void;
  onDocumentClick?: (document: IDocumentAgg) => void;
  onRelatedQuestionClick?: (question: string) => void;
  onPageChange?: (page: number) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  answer,
  chunks,
  documents,
  total,
  page,
  pageSize,
  onChunkClick,
  onDocumentClick,
  onRelatedQuestionClick,
  onPageChange,
}) => {
  // 渲染文档图标
  const renderDocumentIcon = (docName: string) => {
    const extension = docName.split('.').pop()?.toLowerCase();
    const iconStyle = { fontSize: '16px', marginRight: '8px' };
    
    switch (extension) {
      case 'pdf':
        return <FileTextOutlined style={{ ...iconStyle, color: '#ff4d4f' }} />;
      case 'doc':
      case 'docx':
        return <FileTextOutlined style={{ ...iconStyle, color: '#1890ff' }} />;
      case 'txt':
        return <FileTextOutlined style={{ ...iconStyle, color: '#52c41a' }} />;
      default:
        return <FileTextOutlined style={{ ...iconStyle, color: '#8c8c8c' }} />;
    }
  };

  // 渲染高亮内容的弹出框
  const renderHighlightPopover = (chunk: IChunk) => {
    const content = chunk.content_with_weight || chunk.content || '';
    return (
      <div className="highlight-popover">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  };

  return (
    <div className="search-results">
      {/* 答案部分 */}
      {answer && (
        <Card
          className="answer-card"
          title={
            <Space>
              <Avatar src="/logo.svg" size={20} />
              <span>RAGFlow 答案</span>
            </Space>
          }
        >
          <div className="answer-content">
            <div dangerouslySetInnerHTML={{ __html: answer }} />
          </div>
        </Card>
      )}

      {/* 相关文档部分 */}
      {documents && documents.length > 0 && (
        <>
          <Divider />
          <Card
            className="documents-card"
            title={
              <Space>
                <BookOutlined />
                <span>相关文档 ({documents.length})</span>
              </Space>
            }
          >
            <div className="documents-grid">
              {documents.map((doc) => (
                <Card
                  key={doc.doc_id}
                  className="document-item"
                  hoverable
                  onClick={() => onDocumentClick?.(doc)}
                  size="small"
                >
                  <Space>
                    {renderDocumentIcon(doc.doc_name)}
                    <div className="document-info">
                      <div className="document-name">{doc.doc_name}</div>
                      <div className="document-count">{doc.count} 个片段</div>
                    </div>
                  </Space>
                </Card>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* 内容片段部分 */}
      {chunks && chunks.length > 0 && (
        <>
          <Divider />
          <div className="chunks-section">
            <div className="chunks-header">
              <Space>
                <HighlightOutlined />
                <span className="chunks-title">内容片段 ({total})</span>
              </Space>
            </div>
            <List
              className="chunks-list"
              dataSource={chunks}
              renderItem={(chunk) => (
                <List.Item>
                  <Card className="chunk-card" hoverable>
                    <Space align="start" className="chunk-content-wrapper">
                      {/* 文档图标 */}
                      <div className="chunk-icon">
                        {renderDocumentIcon(chunk.docnm_kwd || '')}
                      </div>
                      
                      {/* 内容区域 */}
                      <div className="chunk-content-area">
                        {/* 高亮内容 */}
                        <Popover
                          content={renderHighlightPopover(chunk)}
                          title="完整内容"
                          trigger="hover"
                          placement="right"
                          overlayClassName="chunk-popover"
                        >
                          <div
                            className="chunk-highlight"
                            dangerouslySetInnerHTML={{
                              __html: chunk.highlight || chunk.content || chunk.content_with_weight || ''
                            }}
                          />
                        </Popover>

                        {/* 关键词标签 */}
                        {chunk.important_keywords && chunk.important_keywords.length > 0 && (
                          <div className="chunk-keywords">
                            {chunk.important_keywords.map((keyword, index) => (
                              <Tag key={index} color="blue" className="keyword-tag">
                                {keyword}
                              </Tag>
                            ))}
                          </div>
                        )}

                        {/* 文档信息 */}
                        <div className="chunk-meta">
                          <Space 
                            className="document-reference"
                            onClick={() => onChunkClick?.(chunk)}
                          >
                            {renderDocumentIcon(chunk.docnm_kwd || '')}
                            <span className="document-name">
                              {chunk.docnm_kwd || chunk.document_keyword || '未知文档'}
                            </span>
                          </Space>
                          
                          {chunk.similarity && (
                            <span className="similarity-score">
                              相似度: {(chunk.similarity * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </>
      )}

      {/* 分页 */}
      {total > pageSize && (
        <>
          <Divider />
          <div className="pagination-wrapper">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={onPageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条结果`
              }
            />
          </div>
        </>
      )}

      {/* 无结果状态 */}
      {(!chunks || chunks.length === 0) && (!answer || answer.trim() === '') && (
        <div className="empty-state">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <div className="empty-title">未找到相关内容</div>
                <div className="empty-subtitle">
                  请尝试使用不同的关键词或检查知识库是否包含相关内容
                </div>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default SearchResults; 