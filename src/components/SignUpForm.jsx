import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: ${props => props.theme.vw(700)};
  top: ${props => props.theme.vh(312)};
`;

const FormBox = styled.div`
  width: 520px;
  height: 484px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  padding-top: 20px; 
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 18px 15px; 
  border: 1px solid #e0e0e0;
  background-color: #FFFFFF;
  color: black;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
  
  &::placeholder {
    color: #a0a0a0;
  }
  
  &:focus {
    border-color: #70ad47; 
    outline: none;
  }
`;

const SignUpButton = styled.button`
  width: 100%;
  padding: 18px;
  background-color: #558b5a; /* 녹색 계열 */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 25px; 
  
  &:hover {
    background-color: #45784a;
  }
  
  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const LinkContainer = styled.div`
  margin-top: 40px;
  font-size: 15px;
  color: #606060;
`;

const LoginLink = styled.a`
  color: #558b5a; 
  text-decoration: none;
  font-weight: bold;
  margin-left: 8px; 
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

// ----------------------
// Component
// ----------------------

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8080/api/mima.wiki/members/signup', { // 서버 주소 확인
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          email,
          passwd: password   // 컨트롤러가 요구하는 필드명
        }),
      });

      if (!response.ok) {
        throw new Error('회원가입 실패');
      }

      const data = await response.json();
      console.log('회원가입 성공:', data);

      if (data.data && data.data.success) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        window.location.href = '/'; // 로그인 페이지로 이동
      } else {
        alert('회원가입에 실패했습니다. 이미 존재하는 이메일일 수 있습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <FormContainer>
      <FormBox>
        <Form onSubmit={handleSubmit}>
          <InputField
            type="text"
            placeholder="사용자 이름"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <InputField
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputField
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <SignUpButton type="submit">
            가입하기
          </SignUpButton>
        </Form>

        <LinkContainer>
          이미 계정이 있으신가요?
          <LoginLink href="/">
            로그인
          </LoginLink>
        </LinkContainer>
      </FormBox>
    </FormContainer>
  );
};

export default SignUpForm;