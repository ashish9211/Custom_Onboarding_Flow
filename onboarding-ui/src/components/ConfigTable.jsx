import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ConfigTable = () => {
  const [config, setConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/config`)
      .then((res) => {
        setConfig(res.data.pages || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch config");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500 animate-pulse">Loading config...</p>
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
      <table className="w-full text-left text-gray-700 min-w-[600px]">
        <thead className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <tr>
            <th className="px-6 py-3 text-sm font-semibold">Step Key</th>
            <th className="px-6 py-3 text-sm font-semibold">Title</th>
            <th className="px-6 py-3 text-sm font-semibold">Order</th>
            <th className="px-6 py-3 text-sm font-semibold">Components</th>
          </tr>
        </thead>
        <tbody>
          {config.map((page, idx) => (
            <tr
              key={page.key}
              className={`transition duration-200 hover:bg-green-50 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="px-6 py-3">{page.key}</td>
              <td className="px-6 py-3">{page.title}</td>
              <td className="px-6 py-3">{page.order}</td>
              <td className="px-6 py-3">{page.components.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConfigTable;