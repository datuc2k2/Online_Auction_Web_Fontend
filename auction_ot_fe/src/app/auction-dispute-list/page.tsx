import AuctionDisputeList from "@/components/auction-result-list/AuctionDisputeList";
import { CommonLayout } from "@/layout/CommonLayout";
import React from "react";


const AuctionDisputeListWrap = React.memo(() => { 
    return <>
        <AuctionDisputeList />
    </>
})

export default CommonLayout(AuctionDisputeListWrap);