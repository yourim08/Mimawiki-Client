import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NicknameModal from '../components/NicknameModal';
import { useNavigate } from 'react-router-dom';




const API_URL = 'http://127.0.0.1:8080/api/mima.wiki/profile/me';

// --- Styled Components (생략 가능, 기존 그대로 사용) ---
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh; 
  width: 1920px; 
  background-color: #f7f7f7;
`;
const Header = styled.header`
  background-color: #386a4e; 
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  position: fixed; 
  top: 0;
  left: 0;
  z-index: 1000;
`;
const HeaderTitle = styled.div`
  color: white;
  font-weight: bold;
  font-size: 1.1em;
`;
const NotificationIcon = styled.div`
  color: white;
  font-size: 1.2em;
  cursor: pointer;
`;
const MainContainer = styled.main`
  width: 100%;
  max-width: 1200px; 
  padding: 130px 20px 20px 20px; 
  box-sizing: border-box;
`;
const ProfileSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;
const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
`;
const ProfileAvatar = styled.div`
  font-size: 40px;
  color: #9e9e9e;
  background-color: #e0e0e0;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;
const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;
const UserName = styled.span`
  font-size: 1.2em;
  font-weight: 500;
  color: #333;
`;
const PostCount = styled.span`
  font-size: 0.9em;
  color: #777;
`;
const ActionButtons = styled.div`
  display: flex;
  gap: 10px; 
`;
const LogoutButton = styled.button`
  background-color: #4a7d60; 
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s;
  &:hover { background-color: #386a4e; }
`;
const EditButton = styled.button`
  background: none;
  border: 1px solid #ccc;
  color: #555;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s;
  &:hover { background-color: #e0e0e0; }
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 10px 0 30px 0;
`;
const PostsSection = styled.section`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;
const PostsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  h3 { margin: 0; font-size: 1.2em; color: #333; }
`;

const PostList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const PostItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  &:last-child { border-bottom: none; }
`;


const PostActions = styled.div`
  display: flex;
  gap: 8px;
`;

const EditPostButton = styled.button`
  background: #d99b4fff;
  border: 1px solid #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  cursor: pointer;
  &:hover { background-color: #f67d27ff; }
`;

const DeletePostButton = styled.button`
  background: #d9534f;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  cursor: pointer;
  &:hover { background-color: #c9302c; }
`;


const PostTitle = styled.span` color: #333; `;
const PostDate = styled.span` color: #777; font-size: 0.9em; `;

// --- MyPage Component ---
const MyPage = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [posts, setPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        if (!authToken) return;

        const fetchProfile = async () => {
            try {
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

                const result = await response.json();
                setUserName(result.data.name || '닉네임 입력');
                setPosts(result.data.myArticles || []);
                setPostCount(result.data.totalArticleCount || 0);
            } catch (error) {
                console.error('프로필/글 목록 불러오기 실패:', error);
            }
        };

        fetchProfile();
    }, [authToken]);

    const handleLogout = async () => {
        const token = localStorage.getItem('authToken');
        try {
            // 서버 로그아웃 API 호출 (블랙리스트 등록 등)
            await fetch('http://127.0.0.1:8080/api/mima.wiki/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('로그아웃 요청 중 오류:', error);
        } finally {
            // 성공 여부와 관계없이 클라이언트 측 토큰 삭제 및 이동
            localStorage.removeItem('authToken');
            alert('로그아웃 되었습니다.');
            navigate('/'); // 로그인 페이지(또는 메인)로 이동
        }
    };

    const handleDeletePost = async (keyword) => {
        if (!authToken) return alert('로그인 상태를 확인해주세요.');

        try {
            const response = await fetch(`http://127.0.0.1:8080/api/mima.wiki/w/${keyword}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            const result = await response.json();

            if (result.code === 200) {
                // 화면에서 바로 제거
                setPosts(prev => prev.filter(p => p.keyword !== keyword));
                setPostCount(prev => prev - 1);
            } else {
                alert(`삭제 실패: ${result.message}`);
            }
        } catch (error) {
            console.error('삭제 실패:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    const openEditModal = () => setIsModalOpen(true);

    const handleSaveNickname = async (newName) => {
        setIsModalOpen(false);
        if (!newName || newName.trim() === '' || newName === userName) return;
        if (!authToken) { alert('로그인 상태를 확인해주세요.'); return; }

        try {
            const response = await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ name: newName }),
            });

            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
            const result = await response.json();
            if (result.code === 200) setUserName(newName);
            else alert(`닉네임 변경 실패: ${result.message}`);
        } catch (error) {
            console.error('닉네임 변경 실패:', error);
        }
    };

    return (
        <PageWrapper>
            <Header>
                <HeaderTitle onClick={() => navigate('/main')}>메인피드</HeaderTitle>
                <NotificationIcon>🔔</NotificationIcon>
            </Header>

            <MainContainer>
                <ProfileSection>
                    <ProfileInfo>
                        <ProfileAvatar>👤</ProfileAvatar>
                        <UserDetails>
                            <UserName>{userName} 님</UserName>
                            <PostCount>작성한 글 {postCount}개</PostCount>
                        </UserDetails>
                    </ProfileInfo>

                    <ActionButtons>
                        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
                        <EditButton onClick={openEditModal}>내 정보 수정</EditButton>
                    </ActionButtons>
                </ProfileSection>

                <Divider />

                <PostsSection>
                    <PostsHeader>
                        <h3>작성한 글</h3>
                    </PostsHeader>
                    <PostList>
                        {posts.map(post => (
                            <PostItem key={post.id}>
                                <PostTitle>{post.keyword || post.content.slice(0, 20)}</PostTitle>

                                <PostActions>
                                    <EditPostButton onClick={() => navigate(`/edit/${post.keyword}`)}>
                                        수정
                                    </EditPostButton>
                                    <DeletePostButton onClick={() => handleDeletePost(post.keyword)}>
                                        삭제
                                    </DeletePostButton>
                                </PostActions>
                            </PostItem>
                        ))}
                    </PostList>

                </PostsSection>
            </MainContainer>

            <NicknameModal
                currentName={userName}
                isVisible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveNickname}
            />
        </PageWrapper>
    );
};

export default MyPage;