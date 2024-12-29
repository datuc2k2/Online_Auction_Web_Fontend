import { useLinkMedia } from "@/customHooks/useLinkMedia";

const AvatarImage = ({ avatar }) => {
  const { mediaElement } = useLinkMedia(avatar);
  return mediaElement;
};

export default AvatarImage;
