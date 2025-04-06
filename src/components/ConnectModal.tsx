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
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  text-align: center;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 1rem 0;
`;

const Text = styled.p`
  margin: 0.5rem 0;
  line-height: 1.5;
  color: #333;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  margin: 1rem 0;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const EmailLink = styled.a`
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

interface ConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <Title>Let's Connect</Title>
                <Divider />
                <Text>
                    Interested in a dedicated Slack channel for your company?
                </Text>
                <Text>
                    Please sign up or sign in, and we will create a private
                    Slack channel exclusively for your team to connect with us.
                </Text>
                <Button onClick={() => window.location.href = '/signup'}>
                    Sign Up to Get Your Channel →
                </Button>
                <Text>
                    For any immediate inquiries, feel free to contact us at{' '}
                    <EmailLink href="mailto:ceo@nex.ad">ceo@nex.ad</EmailLink>
                </Text>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ConnectModal; 