import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 15px 0;
  color: #333;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #888;
  font-size: 14px;
`;

const AuthorIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #e0e0e0;
`;

const ArticleHeader = ({ title, authorName, regTime }) => {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
      <MetaInfo>
        <AuthorIcon />
        <span>{authorName}</span>
        <span>•</span>
        <span>{new Date(regTime).toLocaleDateString('ko-KR')}</span>
      </MetaInfo>
    </HeaderContainer>
  );
};

export default ArticleHeader;