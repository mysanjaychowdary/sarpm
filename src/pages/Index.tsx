"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext"; // Import useSession

const Index = () => {
  const navigate = useNavigate();
  const { session, isLoadingSession } = useSession(); // Get session and loading state

  useEffect(() => {
    if (!isLoadingSession) {
      if (session) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate, session, isLoadingSession]);

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Loading...</h1>
          <p className="text-xl text-gray-600">Checking authentication status.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecting...</h1>
        <p className="text-xl text-gray-600">
          If you are not redirected, please click{" "}
          <a href={session ? "/dashboard" : "/login"} className="text-blue-500 hover:text-blue-700 underline">
            here
          </a>.
        </p>
      </div>
    </div>
  );
};

export default Index;