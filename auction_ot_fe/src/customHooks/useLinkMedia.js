import { useEffect } from "react";
import { useState } from "react";

export function useLinkMedia (link){
    const mediaLink =link ?link+process.env.NEXT_PUBLIC_IMAGE_POSTFIX: "assets/img/home1/auction-img7.jpg";
    const [media, setMedia] = useState({
      mediaLink: mediaLink,
      mediaType: "image",
      mediaElement: (
        <div style={{ width: "100%", height: "180px" }}>
          <img src={mediaLink} alt="" />
        </div>
      ),
    });
    useEffect(()=>{
        if(!link) return
        const splitLink = link.split(".");
        if(splitLink[splitLink.length-1] == "mp4"){
            setMedia({...media, mediaType: "video", mediaElement: <div style={{width: "100%", height: "180px"}}><video src={media.mediaLink} style={{width: "100%", height: "100%"}}/></div>})
        }
    }, [])
    return media
  }