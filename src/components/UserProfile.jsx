import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 

const ProfileBox = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
`;

const ProfileName = styled.span`
  font-size: 17px;
  font-weight: bold;
`;

const ProfileImage = styled.div`
  width: 40px;
  height: 40px;
  background-color: #f0f0f0;
  border-radius: 50%;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid #ccc;
  color: #606060;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const WriteButton = styled.button`
  width: 100%;
  padding: 10px 0;
  background-color: #558B5A;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: #45784a;
  }
`;

const UserProfile = () => {
  const navigate = useNavigate(); 
  const [userName, setUserName] = useState(''); // 사용자 이름 상태 관리

  // 1. 컴포넌트 마운트 시 내 정보 가져오기
  useEffect(() => {
    const fetchMyProfile = async () => {
      const token = localStorage.getItem('authToken'); // 로그인 시 저장한 토큰 가져오기

      // 토큰이 없으면 로그인 페이지로 보내거나 처리 (선택 사항)
      if (!token) {
        console.log('로그인이 필요합니다.');
        // navigate('/'); // 필요 시 주석 해제
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8080/api/mima.wiki/profile/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // [중요] 헤더에 토큰 추가
          }
        });

        if (response.ok) {
          const json = await response.json();
          // API 명세: DataResponseProfileRes -> data -> ProfileRes -> name
          if (json.data && json.data.name) {
            setUserName(json.data.name);
          }
        } else {
          console.error('프로필 조회 실패');
          // 토큰 만료 등의 이유로 실패 시 로그아웃 처리 등을 할 수 있음
        }
      } catch (error) {
        console.error('프로필 fetch 오류:', error);
      }
    };

    fetchMyProfile();
  }, [navigate]);

  const handleWrite = () => {
    navigate('/write'); 
  };

  // 2. 로그아웃 핸들러
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

  return (
    <ProfileBox>
      <UserInfo>
        <UserDetails>
          <ProfileImage />
          {/* 3. 상태에 저장된 이름 표시 (없으면 기본값) */}
          <ProfileName>
            {userName ? `${userName} 님` : '게스트 님'}
          </ProfileName>
        </UserDetails>
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </UserInfo>
      <WriteButton onClick={handleWrite}>
        글쓰기
      </WriteButton>
    </ProfileBox>
  );
};

export default UserProfile;