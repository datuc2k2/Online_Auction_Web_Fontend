import React, { useState, useEffect, useRef, useCallback } from "react";

import { useRouter } from "next/navigation";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGavel,
  faUser,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 6px 16px;
  padding-left: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 24px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #f8f9fa;
  color: #495057;

  &:focus {
    outline: none;
    border-color: #489077;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    background: #ffffff;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #adb5bd;
  display: flex;
  align-items: center;
`;

const ResultsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  max-height: 400px;
  width: calc(100% + 50px);
  overflow-y: auto;
  border: 1px solid #eaeaea;
`;

const ResultItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }

  .result-icon {
    font-size: 18px;
  }

  .result-content {
    flex: 1;

    .result-title {
      font-weight: 500;
      color: #2c3e50;
      margin-bottom: 4px;
    }

    .result-description {
      font-size: 12px;
      color: #6c757d;
    }
  }
`;

const SearchComponent = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef(null);
  const debounceTimeout = useRef(null);
  const debounce = (func, delay) => {
    return (...args) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSearchResults = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5208/api/Search?keyword=${searchTerm}`
      );
      const data = await response.json();
      setResults(data.$values || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Search error:", error);
    }
  };
  const debouncedSearch = useCallback(
    debounce((searchTerm) => fetchSearchResults(searchTerm), 500),
    []
  );
  const handleInputChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };
  const handleResultClick = (result) => {
    router.push(result.url);
    setShowDropdown(false);
    setKeyword("");
  };

  const getIcon = (type) => {
    switch (type) {
      case "Auction":
        return <FontAwesomeIcon icon={faGavel} className="result-icon" />;
      case "User":
        return <FontAwesomeIcon icon={faUser} className="result-icon" />;
      default:
        return <FontAwesomeIcon icon={faFileLines} className="result-icon" />;
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && keyword.trim()) {
      router.push(`/search/top?keyword=${keyword}`);
    }
  };
  return (
    <SearchContainer ref={wrapperRef}>
      <SearchIcon>
        <i className="fas fa-search"></i>
      </SearchIcon>
      <SearchInput
        type="text"
        placeholder="Tìm kiếm..."
        value={keyword}
        onChange={handleInputChange}
        onClick={() => keyword.trim() && setShowDropdown(true)}
        onKeyDown={handleKeyDown}
      />

      {showDropdown && results.length > 0 && (
        <ResultsDropdown>
          {results.map((result) => (
            <ResultItem
              key={result.id}
              onClick={() => handleResultClick(result)}
            >
              <span className="result-icon">{getIcon(result.type)}</span>
              <div className="result-content">
                <div className="result-title">{result.name}</div>
                {result.description && (
                  <div className="result-description">{result.description}</div>
                )}
              </div>
            </ResultItem>
          ))}
        </ResultsDropdown>
      )}
    </SearchContainer>
  );
};

export default SearchComponent;
