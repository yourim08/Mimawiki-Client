import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: ${props => props.theme.vw(1060)};
  top: ${props => props.theme.vh(265)};
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
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 18px 15px;
  background-color: #FFFFFF;
  color: black;
  border: 1px solid #e0e0e0;
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

const LoginButton = styled.button`
  width: 100%;
  padding: 18px;
  background-color: #558b5a;
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

const SignUpLink = styled.a`
  color: #558b5a;
  text-decoration: none;
  font-weight: bold;
  margin-left: 8px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://127.0.0.1:8080/api/mima.wiki/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        passwd: password
      }),
    });

    const data = await response.json(); // 항상 JSON 파싱

    if (response.ok) {
      // 로그인 성공 시 token 저장
      const token = data.data?.token; // data 안에 data가 있는 구조
      if (token) {
        localStorage.setItem('authToken', token);
        console.log('토큰 저장 완료:', token);
      }
      else {
        console.log('토큰이 응답에 없습니다.');
      }
      console.log('응답 전체:', data);
      alert('로그인 성공!');
      navigate('/main');
    } else if (response.status === 400) {
      alert(data.message || '로그인 정보가 올바르지 않습니다.');
    } else {
      alert('로그인 중 알 수 없는 오류가 발생했습니다.');
    }
  } catch (err) {
    console.error(err);
    alert('로그인 중 네트워크 오류가 발생했습니다.');
  }
};


  return (
    <FormContainer>
      <FormBox>
        <Form onSubmit={handleSubmit}>
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
          <LoginButton type="submit">
            로그인
          </LoginButton>
        </Form>

        <LinkContainer>
          계정이 없으신가요?
          <SignUpLink href="/signUp">가입하기</SignUpLink>
        </LinkContainer>
      </FormBox>
    </FormContainer>
  );
};

export default LoginForm;

