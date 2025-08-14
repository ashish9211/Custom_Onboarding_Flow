import React, { useState, useEffect } from "react";
import axios from "axios";
const BASE_URL = "https://custom-onboarding-flow.onrender.com";
const availableComponents = [
  { key: "aboutMe", label: "About Me" },
  { key: "address", label: "Address" },
  { key: "birthdate", label: "Birthdate" },
];

const AdminConfig = () => {
  const [page2Components, setPage2Components] = useState([]);
  const [page3Components, setPage3Components] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch existing config on mount with defaults
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/config`)
      .then((res) => {
        setPage2Components(res.data.page2Components?.length ? res.data.page2Components : ["aboutMe"]);
        setPage3Components(res.data.page3Components?.length ? res.data.page3Components : ["address"]);
      })
      .catch(() => {
        setPage2Components(["aboutMe"]);
        setPage3Components(["address"]);
        setError("Failed to load config, defaults applied");
      });
  }, []);

  // Toggle component selection for a given page
  const toggleComponent = (page, compKey) => {
    if (page === 2) {
      setPage2Components((prev) =>
        prev.includes(compKey) ? prev.filter((c) => c !== compKey) : [...prev, compKey]
      );
    } else {
      setPage3Components((prev) =>
        prev.includes(compKey) ? prev.filter((c) => c !== compKey) : [...prev, compKey]
      );
    }
  };

  // Submit config update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (page2Components.length === 0 || page3Components.length === 0) {
      setError("Each page must have at least one component selected.");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/config`, {
        page2Components,
        page3Components,
      });
      setMessage("Configuration saved successfully.");
    } catch {
      setError("Failed to save configuration.");
    }
  };

  // Render checkbox list for a page
  const renderCheckboxes = (pageNum, selectedComponents) => (
    <div className="bg-white shadow-md hover:shadow-lg rounded-lg p-6 mb-6 transition">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Page {pageNum} Components</h3>
      <div className="space-y-3">
        {availableComponents.map(({ key, label }) => (
          <label key={key} className="flex items-center space-x-3 cursor-pointer text-gray-700">
            <input
              type="checkbox"
              checked={selectedComponents.includes(key)}
              onChange={() => toggleComponent(pageNum, key)}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-400 focus:ring-2"
            />
            <span className="font-medium">{label}</span>
          </label>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Select which fields appear on this page of the onboarding wizard.
      </p>
    </div>
  );

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🛠 Admin Configuration
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          {renderCheckboxes(2, page2Components)}
          {renderCheckboxes(3, page3Components)}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminConfig;