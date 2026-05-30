import React from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Simulated API call
const fetchUsers = async () => {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

const UserList = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    refetchInterval: 60000,
  });

  if (isLoading) return <p>Loading users…</p>;
  if (error) return <p>Error loading users.</p>;

  return (
    <ul>
      {data.map((user: any) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default function AdminDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <main style={{ padding: "1rem" }}>
        <h1>Admin Dashboard</h1>
        <section>
          <h2>Users</h2>
          <UserList />
        </section>
      </main>
    </QueryClientProvider>
  );
}
