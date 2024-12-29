import React from 'react';

interface StatusBadgeProps {
  status: string;
  bgcolor: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, bgcolor }) => {
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '8px 16px',
        borderRadius: '12px',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: bgcolor,
        whiteSpace: 'nowrap'
      }}
    >
      {status}
    </div>
  );
};

export default StatusBadge;
