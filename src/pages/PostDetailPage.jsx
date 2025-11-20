import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

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
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackArrow = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  color: #555;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #009688;
    background-color: #f5f5f5;
    border-radius: 50%;
  }
`;

const LogoText = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #009688;
  margin: 0;
  cursor: pointer;
`;

const SearchBarWrapper = styled.div`
  width: 300px;
  height: 36px;
  background-color: #f0f2f5;
  border-radius: 18px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 14px;
  margin-left: 8px;
`;

const GreenNavBar = styled.div`
  width: 100%;
  height: 48px;
  background-color: #009688;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  box-sizing: border-box;
  gap: 20px;
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

// [NEW] 종 아이콘 래퍼 (클릭 가능)
const BellWrapper = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

// [NEW] 알림 숫자 배지
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

const ContentWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  box-sizing: border-box;
`;

const ArticleCard = styled.div`
  width: 100%;
  max-width: 850px;
  background-color: white;
  border-radius: 16px;
  padding: 60px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  min-height: 600px;

  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
`;

const TitleSection = styled.div`
  flex: 1;
`;

const ArticleTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #222;
  margin: 0 0 15px 0;
  line-height: 1.3;
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
  background-color: #ccc;
`;

const EditButton = styled.button`
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  margin-left: 20px;

  &:hover {
    background-color: #eee;
    color: #333;
  }
`;

const ArticleContent = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-top: 20px;
  margin-bottom: 60px;
  min-height: 200px;

  h1, h2, h3 { margin-top: 30px; margin-bottom: 15px; color: #111; }
  p { margin-bottom: 16px; word-break: keep-all; }
  ul, ol { padding-left: 24px; margin-bottom: 16px; }
  li { margin-bottom: 6px; }
  blockquote { 
    border-left: 4px solid #009688; 
    padding-left: 16px; 
    margin: 20px 0; 
    color: #555; 
    background-color: #f9f9f9;
    padding: 10px 16px;
  }
  img { max-width: 100%; border-radius: 8px; margin: 10px 0; }
  strong { font-weight: 700; color: #000; }
`;

const ArticleFooter = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  border-top: 1px solid #f0f0f0;
  margin-bottom: 40px; /* 제안하기 박스와의 간격 */
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TagItem = styled.span`
  color: #009688;
  background-color: #E0F2F1;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #999;
  font-size: 14px;
`;

const LikeButton = styled.button`
  background: none;
  border: 1px solid ${props => props.active ? '#FF5252' : '#ddd'};
  background-color: ${props => props.active ? '#FFF0F0' : 'white'};
  color: ${props => props.active ? '#FF5252' : '#888'};
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    border-color: #FF5252;
    color: #FF5252;
  }
`;

// [NEW] 제안하기(조언) 영역 스타일
const SuggestionBox = styled.div`
  background-color: #F9F9F9;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 24px;
  margin-top: 20px;
`;

const SuggestionHeader = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SuggestionInput = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
  box-sizing: border-box;
  margin-bottom: 12px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #009688;
  }
`;

const SubmitButton = styled.button`
  background-color: #009688;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  float: right; /* 오른쪽 정렬 */

  &:hover {
    background-color: #00796B;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const PostDetailPage = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // [NEW] 제안 내용 상태
  const [suggestionContent, setSuggestionContent] = useState('');
  // [NEW] 안 읽은 알림 개수 상태
  const [unreadCount, setUnreadCount] = useState(0);
  
  const fetchLock = useRef(false);

  useEffect(() => {
    if (fetchLock.current) return;
    fetchLock.current = true;
    
    // [수정] 알림 개수 조회(fetchUnreadCount) 추가
    Promise.all([fetchArticle(), fetchCurrentUser(), fetchUnreadCount()]);
  }, [keyword]);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch('http://127.0.0.1:8080/api/mima.wiki/profile/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const json = await response.json();
        setCurrentUser(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch user info", error);
    }
  };

  // [NEW] 안 읽은 알림 개수 조회 API
  const fetchUnreadCount = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch('http://127.0.0.1:8080/api/mima.wiki/suggestions/unread-count', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const json = await response.json();
        setUnreadCount(json.data); // API가 숫자를 반환
      }
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  };

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(
        `http://127.0.0.1:8080/api/mima.wiki/w/${encodeURIComponent(keyword)}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        }
      );

      if (response.status === 500) {
        alert('서버 에러: 다시 로그인 해주세요.');
        localStorage.removeItem('authToken');
        navigate('/');
        return;
      }
      
      if (response.status === 403) {
        localStorage.removeItem('authToken');
        navigate('/');
        return;
      }

      if (!response.ok) throw new Error('Failed');
      
      const json = await response.json();
      setArticle(json.data);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8080/api/mima.wiki/w/${encodeURIComponent(keyword)}/like`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const json = await response.json();
        const newLikeState = json.data;
        setIsLiked(newLikeState);

        setArticle(prev => ({
          ...prev,
          likeCount: newLikeState ? prev.likeCount + 1 : prev.likeCount - 1
        }));
      }
    } catch (error) {
      console.error('Like Error:', error);
    }
  };

  // [NEW] 제안하기 제출 핸들러
  const handleSuggestionSubmit = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    if (!suggestionContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8080/api/mima.wiki/w/${encodeURIComponent(keyword)}/suggestions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ content: suggestionContent })
        }
      );

      if (response.ok) {
        alert('작성자에게 수정 제안(조언)을 보냈습니다.');
        setSuggestionContent(''); // 입력창 초기화
      } else {
        alert('제안 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Suggestion Error:', error);
      alert('오류가 발생했습니다.');
    }
  };

  if (loading) return (
    <PageContainer style={{ justifyContent: 'center' }}>
      <div style={{color: '#888'}}>문서 불러오는 중...</div>
    </PageContainer>
  );

  if (!article) return (
    <PageContainer style={{ justifyContent: 'center' }}>
      <div style={{color: '#888'}}>문서를 찾을 수 없습니다.</div>
      <button onClick={() => navigate('/main')} style={{marginTop: '10px'}}>메인으로</button>
    </PageContainer>
  );

  return (
    <PageContainer>
      <TopHeader>
        <HeaderLeft>
          <BackArrow onClick={() => navigate(-1)}>←</BackArrow>
          <LogoText onClick={() => navigate('/main')}>미림마이스터고등학교</LogoText>
        </HeaderLeft>
        
        <SearchBarWrapper>
          <span style={{color:'#aaa'}}>🔍</span>
          <SearchInput placeholder="검색" />
        </SearchBarWrapper>
      </TopHeader>

      <GreenNavBar>
        <span onClick={() => navigate('/main')} style={{cursor:'pointer'}}>메인피드</span>
        
        {/* [수정] 종 아이콘 + 알림 배지 */}
        <BellWrapper onClick={() => navigate('/suggestions')}>
          <span>🔔</span>
          {unreadCount > 0 && (
            <NotificationBadge>{unreadCount > 99 ? '99+' : unreadCount}</NotificationBadge>
          )}
        </BellWrapper>
      </GreenNavBar>

      <ContentWrapper>
        <ArticleCard>
          <CardHeader>
            <TitleSection>
              <ArticleTitle>{article.keyword}</ArticleTitle>
              <MetaInfo>
                <AuthorIcon />
                <span style={{fontWeight:'600', color:'#333'}}>{article.authorName || '익명'}</span>
                <span>·</span>
                <span>
                  {article.regTime 
                    ? new Date(article.regTime).toLocaleDateString() 
                    : ''}
                </span>
              </MetaInfo>
            </TitleSection>

            {/* 작성자 본인일 때만 '수정' 버튼 표시 */}
            {currentUser && article.authorName === currentUser.name && (
              <EditButton onClick={() => navigate(`/edit/${keyword}`)}>
                ✎ 수정
              </EditButton>
            )}
          </CardHeader>

          <ArticleContent 
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />

          <ArticleFooter>
            <TagList>
              {article.tags && article.tags.map((tag, i) => (
                <TagItem key={i}># {tag}</TagItem>
              ))}
            </TagList>

            <ActionGroup>
              <StatItem>
                👁️ {article.viewCount || 0}
              </StatItem>

              <LikeButton onClick={handleLikeToggle} active={isLiked}>
                {isLiked ? '❤️' : '🤍'} {article.likeCount || 0}
              </LikeButton>
            </ActionGroup>
          </ArticleFooter>

          {/* [NEW] 작성자가 아닐 때 '수정 제안(조언)' 박스 표시 */}
          {currentUser && article.authorName !== currentUser.name && (
            <SuggestionBox>
              <SuggestionHeader>💡 수정 제안 / 조언하기</SuggestionHeader>
              <SuggestionInput 
                placeholder="이 문서에 대해 수정할 점이나 조언을 남겨주세요. 작성자에게 전달됩니다."
                value={suggestionContent}
                onChange={(e) => setSuggestionContent(e.target.value)}
              />
              <div style={{ overflow: 'hidden' }}>
                <SubmitButton onClick={handleSuggestionSubmit}>
                  보내기
                </SubmitButton>
              </div>
            </SuggestionBox>
          )}

        </ArticleCard>
      </ContentWrapper>
    </PageContainer>
  );
};

export default PostDetailPage;