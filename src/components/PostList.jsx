import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // [추가] 페이지 이동 훅

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
  cursor: pointer; /* 클릭 가능한 손가락 커서 */

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

  // [추가] 페이지 이동을 위한 훅 생성
  const navigate = useNavigate();

  const fetchPosts = async (page = 0) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');
    
    try {
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }
      
      const params = new URLSearchParams({
        page: page.toString(),
        size: '10',
        sort: 'regTime,desc'
      });
      
      const response = await fetch(
        `http://127.0.0.1:8080/api/mima.wiki/article?${params.toString()}`,
        {
          headers: {
            // [수정] Content-Type 추가 및 토큰 설정 방식 보강
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 403) {
        // 403 에러 발생 시 토큰 삭제 후 에러 메시지 처리
        localStorage.removeItem('authToken');
        setError('로그인이 만료되었습니다. 다시 로그인해주세요.');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }
      
      const responseData = await response.json();
      // console.log('API 응답:', responseData);

      setPosts(responseData.content || []);
      setTotalPages(responseData.totalPages || 0);
      setCurrentPage(responseData.number || 0);
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

  // [추가] 리스트 아이템 클릭 시 상세 페이지로 이동하는 함수
  const handleItemClick = (keyword) => {
    navigate(`/post/${keyword}`);
  };

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
        <ErrorMessage>
          {error} <br/><br/>
          {/* 에러 발생 시 다시 로그인하도록 안내 버튼 추가 */}
          <button onClick={() => navigate('/')} style={{padding:'5px 10px', cursor:'pointer'}}>
            로그인 페이지로 이동
          </button>
        </ErrorMessage>
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
        <PostItem 
          key={post.id}
          // [추가] 클릭 이벤트 연결
          onClick={() => handleItemClick(post.keyword)}
        >
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