import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const RankingBox = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  border-bottom: 2px solid #558B5A;
  padding-bottom: 8px;
  margin: 0 0 15px 0;
`;

const RankingList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RankingItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px 0;
  font-size: 15px;
  color: #333;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  span:first-child {
    font-weight: bold;
    color: #558B5A;
    width: 20px;
    text-align: center;
    margin-right: 10px;
  }

  &:hover {
    background-color: #fafafa;
  }
`;

const TopTenRanking = () => {
  const [ranking, setRanking] = useState([]);

useEffect(() => {
  const fetchRanking = async () => {
    try {
      const token = localStorage.getItem('authToken'); // 로그인 후 저장된 토큰
      const response = await fetch('http://127.0.0.1:8080/api/mima.wiki/chart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`);
      
      const data = await response.json();
      const topTen = data.data
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 10)
        .map(item => item.keyword);
      
      setRanking(topTen);
    } catch (error) {
      console.error('Ranking fetch error:', error);
    }
  };

  fetchRanking();
}, []);


  return (
    <RankingBox>
      <Title>실시간 인기 Top 10</Title>
      <RankingList>
        {ranking.map((item, index) => (
          <RankingItem key={index}>
            <span>{index + 1}</span>
            {item}
          </RankingItem>
        ))}
      </RankingList>
    </RankingBox>
  );
};

export default TopTenRanking;
