import AvatarImage from "./_AvatarImage";
import {
  UserInfo,
  UserCardStyled,
  ActionButtons,
  AvatarContainer,
  UserDetails,
  Username,
  Button,
} from "./_styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faComment, faUsers } from "@fortawesome/free-solid-svg-icons";

const UserCard = ({ user, avatar, onViewProfile }) => (
  <UserCardStyled key={user.userId} onClick={onViewProfile}>
    <UserInfo>
      <AvatarContainer onClick={onViewProfile}>
        <AvatarImage avatar={user?.avatar} />
      </AvatarContainer>
      <UserDetails>
        <Username>{user.username}</Username>
        <div>
          <FontAwesomeIcon icon={faStar} style={{ color: "#FFD700" }} />
          {user?.averageRating?.toFixed(2) || 0}/5
        </div>
        <div>
          <FontAwesomeIcon icon={faUsers} /> {user.reviewCount || 0} đánh giá
        </div>
      </UserDetails>
    </UserInfo>
    <ActionButtons>
      <Button className="primary" onClick={onViewProfile}>
        Trang cá nhân
      </Button>
      <Button className="secondary">Nhắn tin</Button>
    </ActionButtons>
  </UserCardStyled>
);

export default UserCard;
