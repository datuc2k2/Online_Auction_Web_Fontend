import { useRouter } from "next/navigation";
import { UserList as StyledUserGrid } from "./_styles";
import UserCard from "./_UserCard";
const _UserList = ({ users }) => {
  const router = useRouter();
  return (
    <StyledUserGrid>
      {users.map((user) => (
        <UserCard
          key={user.userId}
          user={user}
          onViewProfile={() => router.push(`/user-profile/${user.userId}`)}
        />
      ))}
    </StyledUserGrid>
  );
};
export default _UserList;
