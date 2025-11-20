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
  background-color: #f0f0f0; /* 프로필 이미지 임시 배경 */
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
  background-color: #558B5A; /* 녹색 버튼 */
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

  const handleWrite = () => {
    navigate('/write'); 
  };

  return (
    <ProfileBox>
      <UserInfo>
        <UserDetails>
          <ProfileImage />
          <ProfileName>김현수 님</ProfileName>
        </UserDetails>
        <LogoutButton>로그아웃</LogoutButton>
      </UserInfo>
      <WriteButton onClick={handleWrite}>
        글쓰기
      </WriteButton>
    </ProfileBox>
  );
};

export default UserProfile;
