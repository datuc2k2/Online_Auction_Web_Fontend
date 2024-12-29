import MultiparposeAuctionGrid from "@/components/auction-grid/MultiparposeAuctionGrid";
import Breadcrumb1 from "@/components/common/Breadcrumb1";
import Footer from "@/components/footer/Footer";
// import InnerPageHeader1 from "@/components/header/InnerPageHeader1";

export const metadata = {
  title: "Probid- Multi Vendor Auction and Bidding Next js Template.",
  icons: {
    icon: "/assets/img/fav-icon.svg",
  },
};
const AuctionGridPage = () => {
  return (
    <>
      <MultiparposeAuctionGrid />
    </>
  );
};

export default AuctionGridPage;
