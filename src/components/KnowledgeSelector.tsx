import React, { useMemo, useState, useEffect } from 'react';
import { Tree, Spin, Typography, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { TreeDataNode, TreeProps } from 'antd';
import { useKnowledgeList } from '../hooks/useSearch.ts';
import { IKnowledge } from '../types/index.ts';

const { Text } = Typography;

interface Props {
  selectedKnowledgeIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  className?: string;
}

const KnowledgeSelector: React.FC<Props> = ({
  selectedKnowledgeIds,
  onSelectionChange,
  className,
}) => {
  const { knowledgeList, loading, error } = useKnowledgeList();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  // 添加调试信息
  useEffect(() => {
    console.log('KnowledgeSelector - knowledgeList:', knowledgeList);
    console.log('KnowledgeSelector - loading:', loading);
    console.log('KnowledgeSelector - error:', error);
  }, [knowledgeList, loading, error]);

  // 将知识库列表转换为树形结构
  const treeData = useMemo(() => {
    return knowledgeList.reduce((acc: TreeDataNode[], kb: IKnowledge) => {
      const parentItem = acc.find((x) => x.key === kb.embd_id);
      const childItem: TreeDataNode = {
        title: kb.name,
        key: kb.id,
        isLeaf: true,
      };

      if (parentItem) {
        parentItem.children?.push(childItem);
      } else {
        acc.push({
          title: kb.embd_id,
          key: kb.embd_id,
          isLeaf: false,
          children: [childItem],
        });
      }

      return acc;
    }, []);
  }, [knowledgeList]);

  // 自动展开第一个组并选择其子项
  useEffect(() => {
    if (treeData.length > 0 && selectedKnowledgeIds.length === 0) {
      const firstGroup = treeData[0];
      const firstGroupChildren = firstGroup.children?.map((x) => x.key as string) || [];
      
      if (firstGroupChildren.length > 0) {
        onSelectionChange(firstGroupChildren);
      }
      
      setExpandedKeys(treeData.map((x) => x.key));
    }
  }, [treeData, selectedKnowledgeIds.length, onSelectionChange]);

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue, info) => {
    const currentCheckedKeys = checkedKeysValue as string[];
    let nextSelectedKeys: string[] = [];
    
    const { isLeaf, checked, key, children } = info.node;
    
    if (isLeaf) {
      // 叶子节点（知识库）被选中
      const selectedKb = knowledgeList.find((x) => x.id === key);
      if (!checked) {
        // 检查是否与其他已选知识库的嵌入ID冲突
        const embeddingIds = currentCheckedKeys
          .filter((x) => knowledgeList.some((y) => y.id === x))
          .map((x) => knowledgeList.find((y) => y.id === x)?.embd_id);

        if (embeddingIds.some((x) => x !== selectedKb?.embd_id)) {
          nextSelectedKeys = [key as string];
        } else {
          nextSelectedKeys = currentCheckedKeys;
        }
      } else {
        nextSelectedKeys = currentCheckedKeys;
      }
    } else {
      // 父节点（嵌入ID组）被选中
      if (!checked) {
        nextSelectedKeys = [
          key as string,
          ...(children?.map((x) => x.key as string) ?? []),
        ];
      } else {
        nextSelectedKeys = [];
      }
    }

    onSelectionChange(nextSelectedKeys);
  };

  const renderTitle = (node: TreeDataNode) => {
    const kb = knowledgeList.find((x) => x.id === node.key);
    return (
      <Space>
        {node.isLeaf && (
          <Avatar size={24} icon={<UserOutlined />} src={kb?.avatar} />
        )}
        <Text
          ellipsis={{ tooltip: node.title as string }}
          style={{ 
            fontWeight: node.isLeaf ? 'normal' : 'bold',
            color: node.isLeaf ? '#333' : '#666',
          }}
        >
          {node.title as string}
        </Text>
      </Space>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '10px' }}>加载知识库列表...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Text type="danger">加载知识库失败: {error}</Text>
        <div style={{ marginTop: '10px' }}>
          <Text type="secondary">请检查API配置和网络连接</Text>
        </div>
      </div>
    );
  }

  if (knowledgeList.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Text type="secondary">暂无可用知识库</Text>
        <div style={{ marginTop: '10px' }}>
          <Text type="secondary">请先在RAGFlow中创建知识库</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={selectedKnowledgeIds}
        treeData={treeData}
        titleRender={renderTitle}
        style={{ background: 'transparent' }}
      />
    </div>
  );
};

export default KnowledgeSelector; 