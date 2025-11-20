import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ListWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  min-height: 400px;
`;

const PostItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #fbfbfb;
  }
`;

const PostTitle = styled.span`
  color: #333;
`;

const PostDate = styled.span`
  color: #a0a0a0;
  font-size: 14px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const PageNumber = styled.span`
  padding: 8px 15px;
  margin: 0 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  background-color: ${({ active }) => (active ? '#558B5A' : 'white')};
  color: ${({ active }) => (active ? 'white' : '#558B5A')};
  border-color: ${({ active }) => (active ? '#558B5A' : '#ddd')};

  &:hover {
    background-color: ${({ active }) => (active ? '#45784a' : '#f0f0f0')};
    color: ${({ active }) => (active ? 'white' : '#558B5A')};
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #a0a0a0;
  font-size: 14px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #558B5A;
  font-size: 14px;
`;

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async (page = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      // Swagger에 따르면 pageable 파라미터가 필수입니다
      const params = new URLSearchParams({
        page: page.toString(),
        size: '10', // 한 페이지당 표시할 항목 수
        sort: 'id,desc' // 최신순 정렬
      });

      const response = await fetch(
        `http://127.0.0.1:8080/api/mima.wiki/article?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('API 응답:', responseData);

      // Swagger 명세에 따르면 PageArticleRes를 직접 반환
      // 하지만 실제로는 DataResponse 안에 data로 감싸져 있을 수 있음
      const pageData = responseData.data || responseData;

      setPosts(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
      setCurrentPage(pageData.number || 0);
    } catch (error) {
      console.error('Post fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <ListWrapper>
        <LoadingMessage>게시글을 불러오는 중...</LoadingMessage>
      </ListWrapper>
    );
  }

  if (error) {
    return (
      <ListWrapper>
        <ErrorMessage>게시글을 불러오는데 실패했습니다: {error}</ErrorMessage>
      </ListWrapper>
    );
  }

  if (posts.length === 0) {
    return (
      <ListWrapper>
        <ErrorMessage>등록된 게시글이 없습니다.</ErrorMessage>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      {posts.map(post => (
        <PostItem key={post.id}>
          <PostTitle>{post.keyword}</PostTitle>
          <PostDate>{new Date(post.regTime).toLocaleDateString('ko-KR')}</PostDate>
        </PostItem>
      ))}

      {totalPages > 1 && (
        <Pagination>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageNumber
              key={i}
              active={i === currentPage}
              onClick={() => fetchPosts(i)}
            >
              {i + 1}
            </PageNumber>
          ))}
        </Pagination>
      )}
    </ListWrapper>
  );
};

export default PostList;