import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isAdmin, isAuthenticated, login } from "../auth/auth";

export function AdminRoute({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
    login();
    return <div className="p-6">Redirecting to login...</div>;
  }
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}