import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// --- 스타일 정의 ---
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh; 
  width: 1920px; 
  background-color: #f7f7f7;
`;

const TopHeader = styled.div`
  width: 100%;
  height: 64px;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #e0e0e0;
  gap: 15px;
`;

const BackArrow = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover { color: #009688; }
`;

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 40px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SuggestionItem = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  border-left: 5px solid ${props => props.read ? '#ddd' : '#009688'}; /* 읽음 여부에 따라 색상 변경 */
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;
  color: #888;
`;

const ArticleTitleLink = styled.span`
  font-weight: 600;
  color: #009688;
`;

const SuggestionContent = styled.div`
  font-size: 15px;
  color: #333;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  margin-top: 100px;
  font-size: 16px;
`;

const SuggestionPage = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/');
      return;
    }

    try {
      // 받은 제안 목록 조회 API
      const response = await fetch(`http://127.0.0.1:8080/api/mima.wiki/suggestions/received`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const json = await response.json();
        // API 응답 구조(PageSuggestionRes)에 따라 content 배열 추출
        setSuggestions(json.data.content || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 제안 클릭 시 읽음 처리
  const handleRead = async (suggestionId, isRead, articleKeyword) => {
    if (!isRead) {
      try {
        const token = localStorage.getItem('authToken');
        await fetch(`http://127.0.0.1:8080/api/mima.wiki/suggestions/${suggestionId}/read`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error(error);
      }
    }
    // 해당 글 보러 가기 (선택 사항)
    navigate(`/post/${articleKeyword}`);
  };

  if (loading) return <PageContainer><div>로딩 중...</div></PageContainer>;

  return (
    <PageContainer>
      <TopHeader>
        <BackArrow onClick={() => navigate(-1)}>←</BackArrow>
        <PageTitle>받은 조언함</PageTitle>
      </TopHeader>

      <ContentWrapper>
        {suggestions.length === 0 ? (
          <EmptyMessage>아직 받은 조언이 없습니다.</EmptyMessage>
        ) : (
          suggestions.map((item) => (
            <SuggestionItem 
              key={item.id} 
              read={item.isRead}
              onClick={() => handleRead(item.id, item.isRead, item.articleKeyword)}
            >
              <ItemHeader>
                <span>
                  <ArticleTitleLink>{item.articleKeyword}</ArticleTitleLink> 글에 대한 조언
                </span>
                <span>{new Date(item.regTime).toLocaleDateString()}</span>
              </ItemHeader>
              <SuggestionContent>
                {item.content}
              </SuggestionContent>
              <div style={{marginTop:'10px', fontSize:'12px', color:'#999', textAlign:'right'}}>
                From. {item.suggesterName || '익명'}
              </div>
            </SuggestionItem>
          ))
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default SuggestionPage;