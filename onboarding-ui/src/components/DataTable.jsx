import React, { useEffect, useState } from "react";
import axios from "axios";

const DataTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
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
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          👥 User Data
        </h2>

        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold">ID</th>
                <th className="px-6 py-3 text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-sm font-semibold">Birthdate</th>
                <th className="px-6 py-3 text-sm font-semibold">Street</th>
                <th className="px-6 py-3 text-sm font-semibold">City</th>
                <th className="px-6 py-3 text-sm font-semibold">State</th>
                <th className="px-6 py-3 text-sm font-semibold">Zip</th>
                <th className="px-6 py-3 text-sm font-semibold">About Me</th>
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
                  <td className="px-6 py-3">{u.id}</td>
                  <td className="px-6 py-3">{u.email}</td>
                  <td className="px-6 py-3">{u.birthdate || "-"}</td>
                  <td className="px-6 py-3">{u.address_street || "-"}</td>
                  <td className="px-6 py-3">{u.address_city || "-"}</td>
                  <td className="px-6 py-3">{u.address_state || "-"}</td>
                  <td className="px-6 py-3">{u.address_zip || "-"}</td>
                  <td className="px-6 py-3">{u.about_me || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  );
};

export default DataTable;