export const Birthdate = ({ value, onChange }) => (
  <div className="mb-6">
    <label className="block mb-2 font-semibold text-gray-700">Birthdate</label>
    <input
      type="date"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
    />
  </div>
);