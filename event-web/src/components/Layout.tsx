import { Link, NavLink, useLocation } from "react-router-dom";
import { getRealmRoles, getUsername, logout, login, isAuthenticated, isAdmin } from "../auth/auth";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-md text-sm transition",
          isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const user = getUsername();
  const roles = getRealmRoles();
  const loc = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">E</div>
              <div className="leading-tight">
                <div className="font-semibold">Event Management</div>
                <div className="text-xs text-slate-500">Keycloak • Role-based</div>
              </div>
            </Link>

            <nav className="ml-6 hidden md:flex items-center gap-2">
              <NavItem to="/" label="Events" />
              {isAdmin() && <NavItem to="/admin" label="Admin" />}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated() ? (
              <>
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-slate-800">{user}</div>
                  <div className="text-xs text-slate-500 truncate max-w-[260px]">
                    {roles.length ? roles.join(", ") : "no roles"}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={login}
                className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* mobile nav */}
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-2 flex gap-2">
            <NavItem to="/" label="Events" />
            {isAdmin() && <NavItem to="/admin" label="Admin" />}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* breadcrumb-ish */}
        <div className="mb-4 text-xs text-slate-500">
          {loc.pathname === "/" ? "Home / Events" : `Home ${loc.pathname.replaceAll("/", " / ")}`}
        </div>

        {children}
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500">
          © {new Date().getFullYear()} Event Management System
        </div>
      </footer>
    </div>
  );
}