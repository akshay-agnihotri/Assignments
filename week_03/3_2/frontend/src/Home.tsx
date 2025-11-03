import { useEffect, useState } from "react";

type usersT = {
  username: string;
  address: string;
  occupation: string;
};

export default function Home() {
  const [users, setUsers] = useState<usersT[]>([]);
  // check if token is present in local storage (to check sigined in user)
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("Authorization");
      console.log("token ", token);

      if (token) {
        // Fetch user data from the backend
        const response = await fetch("http://localhost:8000/", {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setUsers(data.users);
        }
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
      <h2>Users List</h2>
      <ul>
        {users.map((user, id) => (
          <li key={id}>
            {user.username} <span>{user.occupation}</span>{" "}
            <span>{user.address}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
