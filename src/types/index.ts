// 知识库相关类型
export interface IKnowledge {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  chunk_count: number;
  document_count: number;
  created_by: string;
  permission: string;
  status: string;
  create_time: number;
  update_time: number;
  embd_id?: string;
  chunk_num?: number;
}

// 搜索结果块类型 - 根据RAGFlow检索API返回格式
export interface IChunk {
  id: string;
  content: string;
  content_ltks?: string;
  content_with_weight?: string;
  highlight: string;
  document_id: string;
  document_keyword?: string;
  docnm_kwd: string;
  img_id?: string;
  image_id?: string;
  important_keywords?: string[];
  kb_id?: string;
  positions?: string[];
  similarity?: number;
  term_similarity?: number;
  vector_similarity?: number;
  available?: boolean;
}

// 搜索答案类型
export interface IAnswer {
  answer: string;
  reference?: IReference;
  id?: string;
}

// 引用类型
export interface IReference {
  chunks?: IReferenceChunk[];
  doc_aggs?: IDocumentAgg[];
}

export interface IReferenceChunk {
  id: string;
  content_with_weight: string;
  doc_id: string;
  docnm_kwd: string;
  highlight: string;
  img_id?: string;
}

export interface IDocumentAgg {
  doc_id: string;
  doc_name: string;
  count: number;
}

// 测试结果类型
export interface ITestingResult {
  chunks: IChunk[];
  documents: IDocumentAgg[];
  total: number;
}

// API响应类型
export interface IApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 搜索请求参数类型 - 根据RAGFlow检索API参数
export interface ISearchParams {
  question: string;
  dataset_ids?: string[];
  document_ids?: string[];
  page?: number;
  page_size?: number;
  similarity_threshold?: number;
  vector_similarity_weight?: number;
  top_k?: number;
  rerank_id?: string;
  keyword?: boolean;
  highlight?: boolean;
  // 兼容旧版本参数
  kb_ids?: string[];
  knowledgeIds?: string[];
  size?: number;
  doc_ids?: string[];
  datasets?: string[];
}

// 搜索结果类型
export interface ISearchResult {
  answer: string;
  chunks: IChunk[];
  reference: IReference[];
  doc_aggs: IDocumentAgg[];
  total: number;
} 