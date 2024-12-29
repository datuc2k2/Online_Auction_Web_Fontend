import React from 'react';

interface PaginationProps {
  total: number;
  pageSize: number;
  current: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ total, pageSize, current, onChange }) => {
  const totalPages = Math.ceil(total / pageSize);

  const handleFirst = () => onChange(1);
  const handleLast = () => onChange(totalPages);
  const handlePrevious = () => onChange(Math.max(1, current - 1));
  const handleNext = () => onChange(Math.min(totalPages, current + 1));

  const getPageNumbers = () => {
    if (totalPages <= 2) {
      // Show only the available pages if there are 1 or 2 pages in total
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    
    const pageNumbers: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (current > totalPages - 4) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="pagination-container">
      <button onClick={handleFirst} disabled={current === 1}>&laquo;&laquo;</button>
      <button onClick={handlePrevious} disabled={current === 1}>&laquo;</button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onChange(page)}
          disabled={page === '...'}
          className={page === current ? 'active' : ''}
        >
          {page}
        </button>
      ))}

      <button onClick={handleNext} disabled={current === totalPages}>&raquo;</button>
      <button onClick={handleLast} disabled={current === totalPages}>&raquo;&raquo;</button>

      <style jsx>{`
        .pagination-container {
          display: flex;
          gap: 4px;
          justify-content: right;
          align-items: center;
          margin-top: 12px;
        }
        button {
          padding: 6px 12px;
          border: none;
          background-color: #f0f0f0;
          cursor: pointer;
          color: #333;
          border-radius: 4px;
        }
        button.active {
          background-color: #3DAA84;
          color: white;
        }
        button[disabled] {
          cursor: not-allowed;
          color: #ccc;
        }
        button:not(.active):hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default Pagination;
