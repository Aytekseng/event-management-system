import type { ReactNode } from "react";
import { isAuthenticated, login } from "../auth/auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
    login();
    return <div className="p-6">Redirecting to login...</div>;
  }
  return <>{children}</>;
}