import React, { useState } from 'react';
import styled from 'styled-components';

// --- Styled Components for Modal ---

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ModalHeader = styled.h3`
    margin: 0;
    font-size: 1.5em;
    color: #386a4e;
    border-bottom: 2px solid #386a4e;
    padding-bottom: 10px;
`;

const Input = styled.input`
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
    width: 100%;
    box-sizing: border-box;

    &:focus {
        border-color: #4a7d60;
        outline: none;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

const PrimaryButton = styled.button`
    background-color: #4a7d60;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.2s;

    &:hover {
        background-color: #386a4e;
    }
`;

const SecondaryButton = styled.button`
    background-color: #e0e0e0;
    color: #333;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.2s;

    &:hover {
        background-color: #ccc;
    }
`;

// --- NicknameModal Component ---

const NicknameModal = ({ currentName, isVisible, onClose, onSave }) => {
    const [name, setName] = useState(currentName);

    // Enter 키로 저장 기능 활성화
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSave(name);
        }
    };

    if (!isVisible) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>닉네임 변경</ModalHeader>
                <p>새로운 닉네임을 입력해주세요.</p>
                <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="새 닉네임"
                    maxLength={20} // 최대 길이 제한
                    autoFocus
                />
                <ButtonGroup>
                    <SecondaryButton onClick={onClose}>취소</SecondaryButton>
                    <PrimaryButton onClick={() => onSave(name)}>저장</PrimaryButton>
                </ButtonGroup>
            </ModalContent>
        </ModalOverlay>
    );
};

export default NicknameModal;