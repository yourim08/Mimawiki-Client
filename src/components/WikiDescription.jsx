import React from 'react';
import styled from 'styled-components';

const DescriptionBox = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const Title = styled.p`
  font-size: 16px;
  line-height: 1.6;
  font-weight: 500;
  margin: 0 0 15px 0;
`;

const RulesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #606060;
`;

const RuleItem = styled.li`
  margin-bottom: 5px;
  line-height: 1.5;
`;

const CallToAction = styled.p`
  font-size: 15px;
  font-weight: bold;
  margin: 0;
  color: #558B5A; /* 강조 색상 */
`;

const WikiDescription = () => {
  return (
    <DescriptionBox>
      <Title>
        이곳은 학생들이 자유롭게 학교의 이야기를 기록하고 공유하는 아카이브 공간입니다. 
        누구나 참여할 수 있지만, 모두가 즐겁게 이용하기 위해 다음 규칙을 꼭 지켜주세요.
      </Title>
      <RulesList>
        <RuleItem>1. 특정 종교를 비방하거나 오해하는 글은 작성할 수 없습니다.</RuleItem>
        <RuleItem>2. 불법적인 내용(도박, 폭력 등)이 포함된 글은 작성하거나 공유할 수 없습니다.</RuleItem>
        <RuleItem>3. 타인에게 모욕감을 유발할 수 있는 글은 작성할 수 없습니다.</RuleItem>
        <RuleItem>4. 학생 교사 등 타인의 개인정보(실명, 연락처, 계정 정보 등)는 동의 없이 공개할 수 없습니다.</RuleItem>
        <RuleItem>5. 특정인을 비방하거나 욕설하는 행위는 금지합니다.</RuleItem>
        <RuleItem>6. 같은 내용을 반복적으로 작성하거나 문서를 훼손하는 행위는 금지합니다.</RuleItem>
      </RulesList>
      <CallToAction>
        ** 미마위키는 모두가 함께 만들어가는 공간입니다. 기본적인 에티켓을 준수해 주세요. **
      </CallToAction>
    </DescriptionBox>
  );
};

export default WikiDescription;