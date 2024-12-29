import CreatedAuctionList from "@/components/auction-result-list/CreatedAuctionList";
import WinnerList from "@/components/auction-result-list/WinnerList";
import { CommonLayout } from "@/layout/CommonLayout";
import React from "react";


const AuctionResultList = React.memo(() => { 
    return <>
        <WinnerList />
        <CreatedAuctionList />
    </>
})

export default CommonLayout(AuctionResultList);