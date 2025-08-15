export const AboutMe = ({ value, onChange }) => (
  <div className="mb-6">
    <label className="block mb-2 font-semibold text-gray-700">About Me</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={8}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
      placeholder="Tell us about yourself..."
    />
  </div>
);