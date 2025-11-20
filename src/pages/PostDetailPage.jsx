import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

// --- 스타일 정의 ---

// 1. 전체 배경 (회색)
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh; 
  width: 1920px; 
  background-color: #f7f7f7;
`;

// 2. 상단 헤더 (흰색, 가로 100%)
const TopHeader = styled.div`
  width: 100%;
  height: 64px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px; /* 좌우 여백 */
  box-sizing: border-box;
  border-bottom: 1px solid #e0e0e0;
  position: sticky; /* 스크롤 시 상단 고정 (선택사항) */
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
    display: none; /* 모바일에서는 검색창 숨김 (공간 부족 시) */
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

// 3. 초록색 메뉴바 (가로 100%)
const GreenNavBar = styled.div`
  width: 100%;
  height: 48px;
  background-color: #009688;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 우측 정렬 */
  padding: 0 20px;
  box-sizing: border-box;
  gap: 20px;
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

// 4. 본문 래퍼 (가운데 정렬 핵심)
const ContentWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  padding: 40px 20px;      /* 상하 40px, 좌우 20px 여백 */
  box-sizing: border-box;
`;

// 5. 흰색 카드 (문서 모양)
const ArticleCard = styled.div`
  width: 100%;
  max-width: 850px; /* [핵심] 너비를 850px로 제한하여 문서 느낌 냄 */
  background-color: white;
  border-radius: 16px; /* 둥근 모서리 */
  padding: 60px;       /* 내부 여백 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* 부드러운 그림자 */
  display: flex;
  flex-direction: column;
  min-height: 600px;

  @media (max-width: 768px) {
    padding: 30px; /* 모바일에서는 내부 여백 줄임 */
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

// 본문 내용 (HTML 태그 적용)
const ArticleContent = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-top: 20px;
  margin-bottom: 60px;
  min-height: 200px;

  /* 마크다운/HTML 태그 스타일 */
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

// 하단 영역 (태그 + 버튼)
const ArticleFooter = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  border-top: 1px solid #f0f0f0;
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

const PostDetailPage = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  
  // API 중복 호출 방지
  const fetchLock = useRef(false);

  useEffect(() => {
    if (fetchLock.current) return;
    fetchLock.current = true;
    fetchArticle();
  }, [keyword]);

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
      {/* 1. 상단 헤더 */}
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

      {/* 2. 메뉴바 */}
      <GreenNavBar>
        <span onClick={() => navigate('/main')} style={{cursor:'pointer'}}>메인피드</span>
        <span>🔔 알림</span>
      </GreenNavBar>

      {/* 3. 본문 영역 (중앙 정렬) */}
      <ContentWrapper>
        <ArticleCard>
          {/* 카드 헤더 */}
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

            <EditButton onClick={() => navigate(`/edit/${keyword}`)}>
              ✎ 수정
            </EditButton>
          </CardHeader>

          {/* 본문 내용 (HTML 태그 해석) */}
          <ArticleContent 
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />

          {/* 카드 푸터 */}
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

        </ArticleCard>
      </ContentWrapper>
    </PageContainer>
  );
};

export default PostDetailPage;