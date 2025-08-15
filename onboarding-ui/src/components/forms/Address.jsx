export const Address = ({ value, onChange }) => (
  <div className="mb-6">
    {["street", "city", "state", "zip"].map((field) => (
      <div key={field} className="mb-2">
        <label className="block mb-1 font-semibold text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
        <input
          type="text"
          value={value[field]}
          onChange={(e) => onChange({ ...value, [field]: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          placeholder={field === "zip" ? "Zip Code" : field.charAt(0).toUpperCase() + field.slice(1)}
        />
      </div>
    ))}
  </div>
);