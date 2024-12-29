import { Status } from "@/store/constants";
import { AuctionGrid as StyledAuctionGrid } from "./_styles";
import EndAuctionItemCard from "@/components/auction/EndAuctionItemCard";
import LastestAuctionItemCard from "@/components/auction/LastestAuctionItemCard";
import LiveAuctionItemCard from "@/components/auction/LiveAuctionItemCard";

const AuctionGrid = ({ auctions }) => (
  <StyledAuctionGrid>
    {auctions.map((item) => {
      if (item.status === Status.Going) {
        return <LastestAuctionItemCard key={item.$id} props={item} />;
      } else if (item.status === Status.Ended) {
        return <EndAuctionItemCard key={item.$id} props={item} />;
      }
      return <LiveAuctionItemCard key={item.$id} props={item} />;
    })}
  </StyledAuctionGrid>
);
export default AuctionGrid;
