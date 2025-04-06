import React, { useState } from 'react';
import styled from 'styled-components';
import PaymentProcessingModal from '../components/PaymentProcessingModal';

const DemoContainer = styled.div`
  padding: 2rem;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
`;

const DemoButton = styled.button`
  background-color: #FF6B2C;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #E85A1F;
  }
`;

const ModalDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DemoContainer>
      <DemoButton onClick={() => setIsModalOpen(true)}>
        Show Payment Processing Modal
      </DemoButton>

      <PaymentProcessingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DemoContainer>
  );
};

export default ModalDemo; 