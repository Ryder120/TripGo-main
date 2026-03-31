import React, { useState } from "react";

const sampleUsers = [
    { id: "u1", name: "Alice", email: "alice@example.com", status: "active", role: "user" },
    { id: "u2", name: "Bob", email: "bob@example.com", status: "pending", role: "admin" },
    { id: "u3", name: "Claire", email: "claire@example.com", status: "active", role: "user" },
];

const ManageUsers = () => {
    const [search, setSearch] = useState("");

    const filteredUsers = sampleUsers.filter((user) =>
        [user.name, user.email, user.role]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen py-8 px-4 sm:px-8 lg:px-14 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-slate-900 dark:text-white">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Manage Users</h1>

                <div className="mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name email or role"
                        className="w-full sm:w-1/2 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 dark:bg-slate-800 dark:border-slate-600"
                    />
                </div>

                <div className="overflow-x-auto rounded-xl shadow-soft border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800">
                    <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead className="bg-blue-100 dark:bg-slate-700 text-gray-700 dark:text-gray-100">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="border-t border-gray-200 dark:border-slate-700 hover:bg-blue-50/40 dark:hover:bg-slate-700">
                                    <td className="px-4 py-3">{u.id}</td>
                                    <td className="px-4 py-3">{u.name}</td>
                                    <td className="px-4 py-3">{u.email}</td>
                                    <td className="px-4 py-3 capitalize">{u.role}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
