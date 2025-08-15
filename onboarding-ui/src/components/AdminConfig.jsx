import React, { useEffect, useState } from "react";
import Toast from "../components/Toast";
import * as configApi from "../api/admin";

// Use default components/pages if backend fails
const availableComponents = [
  { key: "aboutMe", label: "About Me" },
  { key: "address", label: "Address" },
  { key: "birthdate", label: "Birthdate" },
];

const defaultPages = [
  { key: "step-1", title: "Step-1", order: 1, components: ["address", "birthdate"] },
  { key: "step-2", title: "Step-2", order: 2, components: ["aboutMe"] },
];

const AdminConfig = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await configApi.getConfig();
        if (res.data?.pages?.length > 0) {
          const normalized = res.data.pages
            .map((p, idx) => ({
              key: p.key || `step-${idx + 1}`,
              title: p.title || `Step-${idx + 1}`,
              order: typeof p.order === "number" ? p.order : idx + 1,
              components: Array.isArray(p.components) ? p.components : [],
            }))
            .sort((a, b) => a.order - b.order);
          setPages(normalized);
        } else {
          setPages(defaultPages);
        }
      } catch (err) {
        console.warn("Failed to load config, applying defaults", err?.message);
        setPages(defaultPages);
        setError("Failed to load config. Defaults applied.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const toggleComponent = (pageKey, compKey) => {
    setPages((prev) =>
      prev.map((p) =>
        p.key === pageKey
          ? {
              ...p,
              components: p.components.includes(compKey)
                ? p.components.filter((c) => c !== compKey)
                : [...p.components, compKey],
            }
          : p
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    for (const p of pages) {
      if (!p.components || p.components.length === 0) {
        setError(`Each page must have at least one component. Check ${p.title}`);
        setToastType("error");
        setToast(`Each page must include at least one component (error on ${p.title})`);
        return;
      }
    }

    try {
      await configApi.saveConfig(pages);
      setToastType("success");
      setToast("Configuration saved successfully ✅");
    } catch (err) {
      // fallback for legacy backend
      if (err?.response?.status === 400 || err?.response?.status === 404) {
        try {
          const page2 = pages[0]?.components || [];
          const page3 = pages[1]?.components || [];
          await configApi.saveConfigLegacy(page2, page3);
          setToastType("success");
          setToast("Configuration saved (legacy fallback) ✅");
          return;
        } catch (err2) {
          console.error("Fallback failed", err2);
        }
      }
      console.error("Save failed", err);
      setError("Failed to save configuration.");
      setToastType("error");
      setToast("Failed to save configuration ❌");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8">
        <div className="text-gray-500 animate-pulse">Loading admin config...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🛠 Admin Configuration</h2>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {pages
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((page) => (
              <div
                key={page.key}
                className="bg-white border border-gray-200 shadow-md rounded-xl p-6 transition hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">{page.title}</h3>
                  <div className="text-sm text-gray-500">Order: {page.order}</div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableComponents.map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center space-x-3 cursor-pointer text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={page.components.includes(key)}
                        onChange={() => toggleComponent(page.key, key)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-400 focus:ring-2"
                      />
                      <div>
                        <div className="font-medium">{label}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <p className="text-sm text-gray-500 mt-3">
                  Select which components appear on this step of the onboarding wizard.
                </p>
              </div>
            ))}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Save Configuration
          </button>
        </form>
      </div>

      {toast && (
        <Toast
          message={toast}
          type={toastType}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default AdminConfig;