import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import WikiDescription from '../components/WikiDescription';
import PostList from '../components/PostList';
import UserProfile from '../components/UserProfile';
import TopTenRanking from '../components/TopTenRanking';

// ----------------------
// Global & Header Styles
// ----------------------

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
    background-color: white; /* 이미지 배경 색상과 유사 */
    color: #333;
  }
`;

const Header = styled.header`
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #558B5A; /* 녹색 헤더 배경 */
  color: white;
  padding: 0 20px; /* 오른쪽 패딩을 20px에서 50px로 늘림 */
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100vw;
  height: ${props => props.theme.vh(60)};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 450px;
  background-color: white;
  border-radius: 4px;
  height: 40px;
  margin-left: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  input {
    flex-grow: 1;
    border: none;
    padding: 0 15px;
    font-size: 16px;
    height: 100%;
    border-radius: 4px;
  }

  svg {
    margin: 0 10px;
    color: #a0a0a0;
  }
`;

const HeaderPlaceholder = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  
  /* 마이페이지/알림 종 모양 아이콘 영역 */
  span {
    padding-right: 10px;
    margin-right: 50px;
    cursor: pointer;
    font-size: 18px; /* 아이콘 대신 임시 텍스트 */
  }
`;

// ----------------------
// Main Content Layout
// ----------------------

const MainLayout = styled.main`
  display: flex;
  justify-content: center;
  padding: 20px 30px;
  padding-left: 300px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1500px;
  display: flex;
  gap: 30px;
`;

const LeftColumn = styled.section`
  flex: 3; /* 왼쪽 컬럼이 더 넓게 */
`;

const RightColumn = styled.aside`
  flex: 1; /* 오른쪽 컬럼이 좁게 */
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const MainPage = () => {
  return (
    <>
      <GlobalStyle />
      <Header>
        <SearchBar>
          <input style={{ backgroundColor: 'white', color: 'black' }} type="text" placeholder="# 태그 검색" />
          <span style={{ fontSize: '1.2em' }}>🔍</span> 
          <span style={{ fontSize: '1.2em' }}>✕</span>
        </SearchBar>
        <HeaderPlaceholder>
          <span>마이페이지</span> 
          <span style={{ color: 'white' }}>🔔</span>
        </HeaderPlaceholder>
      </Header>
      
      <MainLayout>
        <ContentWrapper>
          <LeftColumn>
            <WikiDescription />
            <PostList />
          </LeftColumn>
          
          <RightColumn>
            <UserProfile />
            <TopTenRanking />
          </RightColumn>
        </ContentWrapper>
      </MainLayout>
    </>
  );
};

export default MainPage;