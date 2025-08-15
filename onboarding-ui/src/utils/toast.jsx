import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

let addToast;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  addToast = (toast) => {
    const id = Date.now() + Math.random(); // unique id
    setToasts((prev) => [...prev, { ...toast, id, visible: true }]);

    // Hide toast after duration (fade out)
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
      );
    }, toast.duration || 3000);

    // Remove toast from array after fade-out transition (extra 500ms)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, (toast.duration || 3000) + 500);
  };

  return (
    <>
      {children}
      {ReactDOM.createPortal(
        <div className="fixed top-20 right-5 z-50 space-y-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`px-4 py-3 rounded-lg text-white shadow-lg transform transition-all duration-500 ${
                t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              } ${
                t.type === "success"
                  ? "bg-green-500"
                  : t.type === "error"
                  ? "bg-red-500"
                  : "bg-blue-500"
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

export const toast = {
  success: (message, duration) => addToast({ type: "success", message, duration }),
  error: (message, duration) => addToast({ type: "error", message, duration }),
};