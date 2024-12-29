"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "../_styles";
import AuctionGrid from "../_AuctionGrid";

const AuctionsSearchPage = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5208/api/Search/auctions?keyword=${keyword}`
        );
        const data = await response.json();
        setAuctions(data.$values);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, [keyword]);

  return (
    <Container>
      {auctions.length === 0 ? (
        <p>No auctions found.</p>
      ) : (
        <AuctionGrid auctions={auctions} />
      )}
    </Container>
  );
};

export default AuctionsSearchPage;
