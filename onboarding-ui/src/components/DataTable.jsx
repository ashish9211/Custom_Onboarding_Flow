import React, { useEffect, useState } from "react";
import { getUsers } from "../api/data";

const DataTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsers()
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch users");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500 animate-pulse">Loading users...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-gray-700 min-w-[800px]">
        <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
          <tr>
            <th className="px-6 py-3 text-sm font-semibold">Email</th>
            <th className="px-6 py-3 text-sm font-semibold">Birthdate</th>
            <th className="px-6 py-3 text-sm font-semibold">Street</th>
            <th className="px-6 py-3 text-sm font-semibold">City</th>
            <th className="px-6 py-3 text-sm font-semibold">State</th>
            <th className="px-6 py-3 text-sm font-semibold">Zip</th>
            <th className="px-6 py-3 text-sm font-semibold">About Me</th>
            <th className="px-6 py-3 text-sm font-semibold">Created Date</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr
              key={u.id}
              className={`transition duration-200 hover:bg-blue-50 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="px-6 py-3">{u.email}</td>
              <td className="px-6 py-3">{u.birthdate || "-"}</td>
              <td className="px-6 py-3">{u.address?.street || "-"}</td>
              <td className="px-6 py-3">{u.address?.city || "-"}</td>
              <td className="px-6 py-3">{u.address?.state || "-"}</td>
              <td className="px-6 py-3">{u.address?.zip || "-"}</td>
              <td className="px-6 py-3">{u.aboutMe || "-"}</td>
              <td className="px-6 py-3">
                {u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;