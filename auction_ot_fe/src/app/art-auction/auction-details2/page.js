import ArtAuctionDetails2 from "@/components/auction-details/ArtAuctionDetails2";
import Breadcrumb4 from "@/components/common/Breadcrumb4";
import Footer4 from "@/components/footer/Footer4";
import Header4 from "@/components/header/Header4";

export const metadata = {
  icons: {
    icon: "/assets/img/fav-icon.svg",
    title:"Probid- Multi Vendor Auction and Bidding Next js Template."
  },
};
const AuctionDetails2Page = () => {
  
  return (
    <>
      <Header4 />
      <Breadcrumb4 pagetitle="Auction Details" currentPage="Auction Details" />
      <ArtAuctionDetails2/>
      <Footer4 />
    </>
  );
};

export default AuctionDetails2Page;