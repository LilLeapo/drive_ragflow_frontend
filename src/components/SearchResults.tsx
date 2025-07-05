import React from 'react';
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
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);

  // 渲染分页
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: React.ReactElement[] = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 上一页
    if (page > 1) {
      pages.push(
        <button
          key="prev"
          className="pagination-button"
          onClick={() => onPageChange?.(page - 1)}
        >
          上一页
        </button>
      );
    }

    // 页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${i === page ? 'active' : ''}`}
          onClick={() => onPageChange?.(i)}
        >
          {i}
        </button>
      );
    }

    // 下一页
    if (page < totalPages) {
      pages.push(
        <button
          key="next"
          className="pagination-button"
          onClick={() => onPageChange?.(page + 1)}
        >
          下一页
        </button>
      );
    }

    return (
      <div className="pagination">
        {pages}
        <span className="pagination-info">
          共 {total} 条结果，第 {page} 页 / 共 {totalPages} 页
        </span>
      </div>
    );
  };

  return (
    <div className="search-results">
      {/* 答案部分 */}
      {answer && (
        <div className="answer-section">
          <h3>答案</h3>
          <div className="answer-content">
            <div dangerouslySetInnerHTML={{ __html: answer }} />
          </div>
        </div>
      )}

      {/* 文档统计 */}
      {documents && documents.length > 0 && (
        <div className="documents-section">
          <h3>相关文档 ({documents.length})</h3>
          <div className="documents-grid">
            {documents.map((doc) => (
              <div
                key={doc.doc_id}
                className="document-card"
                onClick={() => onDocumentClick?.(doc)}
              >
                <div className="document-name">{doc.doc_name}</div>
                <div className="document-count">{doc.count} 个相关片段</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 内容片段 */}
      {chunks && chunks.length > 0 && (
        <div className="chunks-section">
          <h3>内容片段 ({total})</h3>
          <div className="chunks-list">
            {chunks.map((chunk) => (
              <div
                key={chunk.id}
                className="chunk-card"
                onClick={() => onChunkClick?.(chunk)}
              >
                <div className="chunk-content">
                  <div 
                    className="chunk-text"
                    dangerouslySetInnerHTML={{ 
                      __html: chunk.highlight || chunk.content || chunk.content_with_weight || ''
                    }}
                  />
                  {chunk.important_keywords && chunk.important_keywords.length > 0 && (
                    <div className="chunk-keywords">
                      <span className="keywords-label">关键词：</span>
                      {chunk.important_keywords.map((keyword, index) => (
                        <span key={index} className="keyword-tag">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="chunk-meta">
                  <span className="chunk-source">
                    来源：{chunk.docnm_kwd || chunk.document_keyword || '未知文档'}
                  </span>
                  {chunk.similarity && (
                    <span className="chunk-similarity">
                      相似度：{(chunk.similarity * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 分页 */}
      {renderPagination()}

      {/* 无结果提示 */}
      {(!chunks || chunks.length === 0) && (!answer || answer.trim() === '') && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <div className="no-results-text">未找到相关内容</div>
          <div className="no-results-suggestion">
            请尝试使用不同的关键词或检查知识库是否包含相关内容
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults; 