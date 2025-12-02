import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import React from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (auth?.loading) {
    return <div>Loading...</div>;
  }

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
