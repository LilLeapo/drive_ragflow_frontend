import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api.ts';
import { IKnowledge, ISearchParams, ISearchResult } from '../types';

// 获取知识库列表的钩子
export const useKnowledgeList = () => {
  const [knowledgeList, setKnowledgeList] = useState<IKnowledge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKnowledgeList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await apiService.getKnowledgeList();
      setKnowledgeList(list);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取知识库列表失败';
      setError(errorMessage);
      console.error('获取知识库列表失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKnowledgeList();
  }, [fetchKnowledgeList]);

  return {
    knowledgeList,
    loading,
    error,
    refetch: fetchKnowledgeList,
  };
};

// 搜索钩子
export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<ISearchResult | null>(null);

  const search = useCallback(async (params: ISearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.searchKnowledge(params);
      setSearchResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '搜索失败';
      setError(errorMessage);
      console.error('搜索失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    search,
    loading,
    error,
    searchResult,
    clearResults: () => setSearchResult(null),
  };
}; 