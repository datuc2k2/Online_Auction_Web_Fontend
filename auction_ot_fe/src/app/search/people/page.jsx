"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "../_styles";
import UserList from "../_UserList";

const PeopleSearchPage = () => {
  const [users, setUsers] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchUsers = async (searchKeyword) => {
    try {
      const response = await fetch(
        `http://localhost:5208/api/Search/users?keyword=${searchKeyword}`
      );
      const data = await response.json();
      setUsers(data.$values);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (searchParams.get("keyword")) {
      searchUsers(searchParams.get("keyword"));
    }
  }, [searchParams]);

  return (
    <Container>
      {users.length === 0 ? <p>No users found.</p> : <UserList users={users} />}
    </Container>
  );
};

export default PeopleSearchPage;
