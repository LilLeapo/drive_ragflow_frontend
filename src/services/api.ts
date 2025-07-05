import { IKnowledge, ISearchParams, ISearchResult } from '../types';

// API配置 - 请根据您的RAGFlow服务器地址进行修改
const API_BASE_URL = 'http://localhost:9380';
const API_KEY = 'ragflow-cxYWJkN2M0NTk2ZTExZjA5MGRmMDI0Mm';

// API服务类
class ApiService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.apiKey = API_KEY;
  }

  // 获取知识库列表
  async getKnowledgeList(): Promise<IKnowledge[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/datasets`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`<${response.status}: ${response.statusText}>`);
      }

      const data = await response.json();
      
      if (data.code !== 0) {
        throw new Error(data.message || 'API返回错误');
      }

      // 转换RAGFlow数据格式为应用所需格式
      return data.data.map((dataset: any) => ({
        id: dataset.id,
        name: dataset.name,
        description: dataset.description || '',
        avatar: dataset.avatar || '',
        chunk_count: dataset.chunk_count || 0,
        document_count: dataset.document_count || 0,
        created_by: dataset.created_by,
        permission: dataset.permission,
        status: dataset.status,
        create_time: dataset.create_time,
        update_time: dataset.update_time,
      }));
    } catch (error) {
      console.error('获取知识库列表失败:', error);
      throw error;
    }
  }

  // 搜索知识库 - 使用RAGFlow检索API
  async searchKnowledge(params: ISearchParams): Promise<ISearchResult> {
    try {
      const requestBody = {
        question: params.question,
        dataset_ids: params.dataset_ids || params.knowledgeIds || [],
        document_ids: params.document_ids || params.doc_ids || [],
        page: params.page || 1,
        page_size: params.page_size || params.size || 10,
        similarity_threshold: params.similarity_threshold || 0.2,
        vector_similarity_weight: params.vector_similarity_weight || 0.3,
        top_k: params.top_k || 1024,
        keyword: params.keyword || false,
        highlight: params.highlight || true,
      };

      const response = await fetch(`${this.baseURL}/api/v1/retrieval`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`<${response.status}: ${response.statusText}>`);
      }

      const data = await response.json();
      
      if (data.code !== 0) {
        throw new Error(data.message || 'API返回错误');
      }

      // RAGFlow检索API返回的数据结构
      return {
        answer: '', // 检索API不返回answer，只返回chunks
        chunks: data.data?.chunks || [],
        reference: [], // 检索API不返回reference
        doc_aggs: data.data?.doc_aggs || [],
        total: data.data?.total || 0,
      };
    } catch (error) {
      console.error('搜索失败:', error);
      throw error;
    }
  }
}

// 创建单例实例
const apiService = new ApiService();

// 导出单例实例
export default apiService; 