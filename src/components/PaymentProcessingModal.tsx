import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 8px;
  
  &:hover {
    color: #666;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  font-size: 28px;
  color: #FF6B2C;
  font-weight: 500;
`;

const InfoIcon = styled.div`
  width: 32px;
  height: 32px;
  border: 2px solid #FF6B2C;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-style: italic;
  font-family: serif;
`;

const Message = styled.div`
  color: #666;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const ContactLink = styled.a`
  color: #FF6B2C;
  text-decoration: underline;
  cursor: pointer;
  
  &:hover {
    color: #E85A1F;
  }
`;

interface PaymentProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentProcessingModal: React.FC<PaymentProcessingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>
          <InfoIcon>i</InfoIcon>
          Payment Processing
        </Title>
        <Message>Thank you! Your payment is being processed.</Message>
        <Message>Bank transfer or ACH payments may take 1-5 business days to complete.</Message>
        <Message>Your campaign will activate automatically once the payment is confirmed, and you'll receive an email notification.</Message>
        <Message>
          If you have any questions in the meantime, feel free to{' '}
          <ContactLink href="mailto:support@example.com">contact us</ContactLink>.
        </Message>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PaymentProcessingModal; 