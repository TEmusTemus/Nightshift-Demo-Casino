"use client";
import { useEffect, useState } from "react";
type User = { id: number; username: string; balance: number; role: string; created_at: string };
export default function AdminPage() { const [users, setUsers] = useState<User[]>([]); useEffect(() => { void fetch("/api/admin/users").then((r) => r.json()).then((data) => setUsers(data.users ?? [])); }, []); return <section className="app-panel"><h1>Demo admin</h1><p>Local development view of registered demo accounts.</p><ul className="history">{users.map((user) => <li key={user.id}>{user.username} · {user.balance} chips · {user.role}</li>) || <li>No demo accounts yet.</li>}</ul></section>; }
