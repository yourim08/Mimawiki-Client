import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import PostList from '../components/PostList';
import UserProfile from '../components/UserProfile';
import TopTenRanking from '../components/TopTenRanking';
import { useNavigate, useSearchParams } from 'react-router-dom';

// --- 스타일 정의 (MainPage와 동일) ---
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
    background-color: white;
    color: #333;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #558B5A;
  color: white;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  box-sizing: border-box;
  height: 60px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 20px;
  padding: 5px 15px;
  width: 300px;

  input {
    border: none;
    outline: none;
    flex: 1;
    margin-left: 10px;
    font-size: 14px;
  }

  span {
    cursor: pointer;
    color: #555;
    margin-left: 5px;
  }
`;

const HeaderPlaceholder = styled.div`
  font-weight: bold;
  display: flex;
  gap: 20px;
  align-items: center;
`;

const BellWrapper = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -8px;
  background-color: #FF5252;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 12px;
  text-align: center;
  border: 1px solid white;
`;

const MainLayout = styled.main`
  display: flex;
  justify-content: center;
  padding: 30px 20px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  gap: 30px;
`;

const LeftColumn = styled.section`
  flex: 3;
`;

const RightColumn = styled.aside`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // URL에서 keyword 가져오기 (?keyword=검색어)
  const keyword = searchParams.get('keyword') || ''; 

  const [inputValue, setInputValue] = useState(keyword);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    setInputValue(keyword); // 검색어가 바뀌면 인풋창도 업데이트
  }, [keyword]);

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const response = await fetch('http://127.0.0.1:8080/api/mima.wiki/suggestions/unread-count', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const json = await response.json();
        setUnreadCount(json.data);
      }
    } catch (error) { console.error(error); }
  };

  // 검색 실행 (다시 현재 페이지로 navigate)
  const handleSearch = () => {
    navigate(`/search?keyword=${encodeURIComponent(inputValue)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <GlobalStyle />
      <Header>
        <SearchBar>
          <span style={{ fontSize: '1.2em' }} onClick={handleSearch}>🔍</span>
          <input 
            style={{ backgroundColor: 'white', color: 'black' }} 
            type="text" 
            placeholder="검색어를 입력하세요" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </SearchBar>
        
        <HeaderPlaceholder>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/myPage')}>
            마이페이지
          </span>

          <BellWrapper onClick={() => navigate('/suggestions')}>
            <span style={{ fontSize: '1.2em' }}>🔔</span>
            {unreadCount > 0 && (
              <NotificationBadge>{unreadCount > 99 ? '99+' : unreadCount}</NotificationBadge>
            )}
          </BellWrapper>

          <span 
            style={{ cursor: 'pointer', fontSize: '0.9em', opacity: 0.8 }}
            onClick={() => {
              localStorage.removeItem('authToken');
              navigate('/');
            }}
          >
            로그아웃
          </span>
        </HeaderPlaceholder>
      </Header>

      <MainLayout>
        <ContentWrapper>
          <LeftColumn>
            {/* WikiDescription(설명) 컴포넌트 제거됨 */}
            
            {/* PostList에 검색어를 전달 */}
            <div style={{marginBottom: '20px', fontSize: '18px', fontWeight: 'bold'}}>
               "{keyword}" 검색 결과
            </div>
            <PostList searchKeyword={keyword} />
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

export default SearchPage;