import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500"
  };

  return (
    <div
      className={`fixed top-[100px] right-5 px-4 py-3 rounded-lg shadow-lg text-white z-50 
        transform transition-all duration-300 ${typeColors[type]}`}
    >
      <div className="flex items-center">
        <span className="mr-2">
          {type === "success" && "✅"}
          {type === "error" && "❌"}
          {type === "warning" && "⚠️"}
          {type === "info" && "ℹ️"}
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;