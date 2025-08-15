import React, { useEffect, useState } from "react";
import { getUsers } from "../api/data";
import Pagination from "./Pagination";

const DataTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

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

  // Get current users for the table
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
    
      <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200 bg-white mt-8">
      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-gray-700 min-w-fit">
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
            {currentUsers.map((u, idx) => (
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
                <td className="px-6 py-3 whitespace-normal">{u.aboutMe || "-"}</td>
                <td className="px-6 py-3">
                  {u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet View */}
      <div className="lg:hidden">
        {currentUsers.map((u, idx) => (
          <div
            key={u.id}
            className={`border rounded-lg p-4 mb-4 shadow-sm ${
              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <div className="flex flex-col space-y-2 text-sm text-gray-700">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Email:</span>
                <span>{u.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Birthdate:</span>
                <span>{u.birthdate || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Street:</span>
                <span>{u.address?.street || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">City:</span>
                <span>{u.address?.city || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">State:</span>
                <span>{u.address?.state || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Zip:</span>
                <span>{u.address?.zip || "-"}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 mb-1">About Me:</span>
                <span className="text-gray-600">{u.aboutMe || "-"}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="font-semibold">Created:</span>
                <span>{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={users.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default DataTable;

