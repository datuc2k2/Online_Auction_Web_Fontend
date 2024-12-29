import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 16px;
`;

export const AuctionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const UserList = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
`;

export const UserCardStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f7f8fa;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AvatarContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Username = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;

  &.primary {
    background: #1877f2;
    color: white;
    &:hover {
      background: #166fe5;
    }
  }

  &.secondary {
    background: #e4e6eb;
    color: #050505;
    &:hover {
      background: #d8dadf;
    }
  }
`;
