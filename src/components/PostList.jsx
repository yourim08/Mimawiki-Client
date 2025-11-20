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
    background-color: #f0f0f0;
    color: #558B5A;
    ${({ active }) => active && 'background-color: #45784a;'}
  }
`;

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchPosts = async (page = 0) => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/mima.wiki/article?page=${page}`);
      if (!response.ok) throw new Error('API 호출 실패');
      const data = await response.json();

      setPosts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.number || 0);
    } catch (error) {
      console.error('Post fetch error:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <ListWrapper>
      {posts.map(post => (
        <PostItem key={post.id}>
          <PostTitle>{post.keyword}</PostTitle>
          <PostDate>{new Date(post.regTime).toLocaleDateString()}</PostDate>
        </PostItem>
      ))}

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
    </ListWrapper>
  );
};

export default PostList;
