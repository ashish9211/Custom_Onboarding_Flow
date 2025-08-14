import React, { useState, useEffect } from "react";
import axios from "axios";

const componentMap = {
  aboutMe: ({ value, onChange }) => (
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
  ),
  address: ({ value, onChange }) => (
    <div className="mb-6">
      <label className="block mb-2 font-semibold text-gray-700">Street</label>
      <input
        type="text"
        value={value.street}
        onChange={(e) => onChange({ ...value, street: e.target.value })}
        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        placeholder="123 Main St"
      />
      <label className="block mb-2 font-semibold text-gray-700">City</label>
      <input
        type="text"
        value={value.city}
        onChange={(e) => onChange({ ...value, city: e.target.value })}
        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        placeholder="City"
      />
      <label className="block mb-2 font-semibold text-gray-700">State</label>
      <input
        type="text"
        value={value.state}
        onChange={(e) => onChange({ ...value, state: e.target.value })}
        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        placeholder="State"
      />
      <label className="block mb-2 font-semibold text-gray-700">Zip</label>
      <input
        type="text"
        value={value.zip}
        onChange={(e) => onChange({ ...value, zip: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        placeholder="Zip Code"
      />
    </div>
  ),
  birthdate: ({ value, onChange }) => (
    <div className="mb-6">
      <label className="block mb-2 font-semibold text-gray-700">Birthdate</label>
      <input
        type="date"
        value={value || ""} // Keep as string YYYY-MM-DD
        onChange={(e) => onChange(e.target.value)} // Store string
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
      />
    </div>
  ),
};

const OnboardingWizard = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState({ page2Components: [], page3Components: [] });

  // Form data
  const [aboutMe, setAboutMe] = useState("");
  const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "" });
  const [birthdate, setBirthdate] = useState(""); // string YYYY-MM-DD
  const BASE_URL = "https://custom-onboarding-flow.onrender.com";
  // Fetch config & check localStorage on mount
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/config`)
      .then((res) => setConfig(res.data))
      .catch((err) => console.error("Failed to fetch config", err));

    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      setUserId(savedUserId);
      setStep(2); // Resume at Step 2
    }
  }, []);

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL}/api/users`, { email, password });
      setUserId(res.data.id);
      localStorage.setItem("userId", res.data.id);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user");
    }
  };

  const handleStepSubmit = async () => {
    if (!userId) return setError("User ID missing");

    let updateData = {};
    const componentsOnStep = step === 2 ? config.page2Components : config.page3Components;

    componentsOnStep.forEach((comp) => {
      if (comp === "aboutMe") updateData.about_me = aboutMe;
      else if (comp === "address") {
        updateData.address_street = address.street;
        updateData.address_city = address.city;
        updateData.address_state = address.state;
        updateData.address_zip = address.zip;
      } else if (comp === "birthdate") updateData.birthdate = birthdate; // string
    });

    try {
      await axios.patch(`${BASE_URL}/api/users/${userId}`, updateData);
      if (step === 3) {
        alert("Onboarding Complete! Thank you.");
        localStorage.removeItem("userId");
        setStep(1);
        setEmail("");
        setPassword("");
        setUserId(null);
        setAboutMe("");
        setAddress({ street: "", city: "", state: "", zip: "" });
        setBirthdate("");
      } else setStep(step + 1);
    } catch {
      setError("Failed to update user data");
    }
  };

  if (step === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
          <div className="bg-blue-600 text-white text-center py-4 rounded-t-2xl font-bold text-xl">
            Create Account
          </div>
          <div className="p-6">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                Next
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const componentsOnStep = step === 2 ? config.page2Components : config.page3Components;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
        <div className="bg-blue-600 text-white text-center py-4 rounded-t-2xl font-bold text-xl">
          Step {step}
        </div>
        <div className="p-6">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {componentsOnStep.map((comp) => {
            if (comp === "aboutMe") return componentMap.aboutMe({ value: aboutMe, onChange: setAboutMe });
            else if (comp === "address") return componentMap.address({ value: address, onChange: setAddress });
            else if (comp === "birthdate") return componentMap.birthdate({ value: birthdate, onChange: setBirthdate });
            return null;
          })}
          <button
            onClick={handleStepSubmit}
            className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;