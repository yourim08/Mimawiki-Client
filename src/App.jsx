import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import './App.css'
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import SignUp from './pages/SignUp';
import MainPage from './pages/MainPage';
import WritePage from './pages/WritePage';
import MyPage from './pages/MyPage';
import EditPage from './pages/EditPage';
import PostDetailPage from './pages/PostDetailPage';

  

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/main" element={<MainPage />} /> 
        <Route path="/post/:keyword" element={<PostDetailPage />} />
        <Route path="/write" element={<WritePage/>}/>
        <Route path="/myPage" element={<MyPage/>}/>
        <Route path="/edit/:keyword" element={<EditPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App
