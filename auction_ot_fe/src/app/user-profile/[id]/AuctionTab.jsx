import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import EndAuctionItemCard from "@/components/auction/EndAuctionItemCard";
import LastestAuctionItemCard from "@/components/auction/LastestAuctionItemCard";
import LiveAuctionItemCard from "@/components/auction/LiveAuctionItemCard";
import { Status } from "@/store/constants";
import { Pagination, Select } from "antd";
import styled from "styled-components";

const { Option } = Select;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const AuctionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
`;

const AuctionContainer = styled.div`
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
`;

const AuctionTab = ({ userId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // useSearchParams hook
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecord, setTotalRecord] = useState(0);

  const pageSize = 9;

  // Extract query params
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentStatus = searchParams.get("status") || "all";
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const payload = {
        userId: userId,
        pageIndex: currentPage,
        pageSize: pageSize,
      };

      // Add status to payload if it's not "all"
      if (currentStatus && currentStatus !== "all") {
        payload.status = currentStatus;
      }

      const response = await axios.post(
        "http://localhost:5208/api/ListAuction/GetListAuction",
        payload
      );

      setAuctions(response.data.auctions.$values);
      setTotalRecord(response.data.totalRecords);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      fetchAuctions();
    }
  }, [userId, searchParams]);

  const handlePageChange = (page) => {
    router.push(pathname + "?" + createQueryString("page", page));
  };

  const handleStatusChange = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", value);
    params.set("page", "1");
    router.push(pathname + "?" + params.toString());
  };

  return (
    <AuctionContainer>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <FilterContainer>
            <span>Filter by Status:</span>
            <Select
              style={{ width: 200 }}
              onChange={handleStatusChange}
              value={currentStatus}
              placeholder="Select status"
            >
              <Option value="all">All</Option>
              <Option value={Status.OnGoing.toString()}>On Going</Option>
              <Option value={Status.Going.toString()}>Going</Option>
              <Option value={Status.Ended.toString()}>Ended</Option>
            </Select>
          </FilterContainer>
          <AuctionGrid>
            {auctions.length === 0 ? (
              <div>No auctions found.</div>
            ) : (
              auctions.map((item) => {
                if (item.status === Status.Going) {
                  return <LastestAuctionItemCard key={item.$id} props={item} />;
                } else if (item.status === Status.Ended) {
                  return <EndAuctionItemCard key={item.$id} props={item} />;
                }
                return <LiveAuctionItemCard key={item.$id} props={item} />;
              })
            )}
          </AuctionGrid>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalRecord}
            onChange={handlePageChange}
          />
        </div>
      )}
    </AuctionContainer>
  );
};

export default AuctionTab;
