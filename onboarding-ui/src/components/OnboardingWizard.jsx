import React, { useState, useEffect } from "react";
import { toast } from "../utils/toast";
import { AboutMe } from "./forms/AboutMe";
import { Address } from "./forms/Address";
import { Birthdate } from "./forms/Birthdate";
import * as userApi from "../api/users";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const componentMap = {
  aboutMe: AboutMe,
  address: Address,
  birthdate: Birthdate,
};


const OnboardingWizard = () => {
  const [pages, setPages] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [mode, setMode] = useState("signup"); // signup / login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null);

  // Form data
  const [aboutMe, setAboutMe] = useState("");
  const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "" });
  const [birthdate, setBirthdate] = useState("");

  // Fetch onboarding config and resume user
  useEffect(() => {
    userApi.getConfig()
      .then((res) => {
        if (res.data.pages) {
          const sorted = [...res.data.pages].sort((a, b) => a.order - b.order);
          setPages(sorted);
        }
      })
      .catch(() => toast.error("Failed to load wizard config"));

    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      setUserId(savedUserId);
      userApi.getUser(savedUserId)
        .then((res) => {
          const currentStep = res.data.currentStep || 0;
          setStepIndex(currentStep);
          if (res.data.aboutMe) setAboutMe(res.data.aboutMe);
          if (res.data.birthdate) setBirthdate(res.data.birthdate);
          if (res.data.address) setAddress(res.data.address);
        })
        .catch(() => localStorage.removeItem("userId"));
    }
  }, []);

  // Signup/Login handler
const handleAuth = async (e) => {
  e.preventDefault();
  if (!email || !password) return toast.error("Email and password required");

  try {
    const res = mode === "signup"
      ? await userApi.signup(email, password)
      : await userApi.login(email, password);

    setUserId(res.data.id);
    localStorage.setItem("userId", res.data.id);
    setStepIndex(0);

    // Dynamic toast message
    toast.success(
      mode === "signup" ? "Signup successful ✅" : "Login successful ✅"
    );
  } catch (err) {
    toast.error(err.response?.data?.error || `${mode === "signup" ? "Signup" : "Login"} failed ❌`);
  }
};

  // Save current step
  const handleStepSubmit = async () => {
    if (!userId) return toast.error("User ID missing");
    const currentPage = pages[stepIndex];
    if (!currentPage?.components?.length) return toast.error("No components defined for this step");

    const updateData = {};
    currentPage.components.forEach((comp) => {
      if (comp === "aboutMe") updateData.aboutMe = aboutMe;
      else if (comp === "address") updateData.address = { ...address };
      else if (comp === "birthdate") updateData.birthdate = birthdate;
    });
    updateData.currentStep = stepIndex + 1;

    try {
      await userApi.updateUser(userId, updateData);
      if (stepIndex + 1 >= pages.length) {
        toast.success("Onboarding Complete! 🎉");
        localStorage.removeItem("userId");
        setStepIndex(0);
        setMode("signup");
        setEmail("");
        setPassword("");
        setUserId(null);
        setAboutMe("");
        setAddress({ street: "", city: "", state: "", zip: "" });
        setBirthdate("");
      } else {
        setStepIndex(stepIndex + 1);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update user data ❌");
    }
  };

  // AUTH STEP
  if (!userId) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
          <div className="bg-blue-600 text-white text-center py-4 rounded-t-2xl font-bold text-xl">
            {mode === "signup" ? "Create Account" : "Log In"}
          </div>
          <div className="p-6">
            <form onSubmit={handleAuth} className="space-y-4">
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
                {mode === "signup" ? "Sign Up" : "Log In"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm">
              {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                className="text-indigo-600 hover:underline"
              >
                {mode === "signup" ? "Log in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ONBOARDING STEP
  const currentPage = pages[stepIndex];
  const valueMap = { aboutMe, address, birthdate };
  const setterMap = { setAboutMe, setAddress, setBirthdate };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
        <div className="bg-blue-600 text-white text-center py-4 rounded-t-2xl font-bold text-xl">
          {currentPage?.title || `Step ${stepIndex + 1}`}
        </div>
        <div className="p-6">
          {currentPage?.components?.map((comp) => {
            const Component = componentMap[comp];
            if (!Component) return null;

            return (
              <Component
                key={comp}
                value={valueMap[comp]}
                onChange={setterMap[`set${comp.charAt(0).toUpperCase() + comp.slice(1)}`]}
              />
            );
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