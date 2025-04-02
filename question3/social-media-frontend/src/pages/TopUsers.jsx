import { useEffect, useState } from "react";
import { fetchTopUsers } from "../api/apiService";
import UserCard from "../components/UserCard";

const TopUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchTopUsers().then(setUsers);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Top Users</h1>
      <div className="grid grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default TopUsers;
