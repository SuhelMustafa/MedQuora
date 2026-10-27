import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../context/appContext";

const navigation = {
  admin: [
    ["/admin", "Dashboard"],
    ["/admin/appointments", "Appointments"],
    ["/admin/doctors/new", "Add doctor"],
    ["/admin/doctors", "Doctor list"],
  ],
  doctor: [
    ["/doctor", "Dashboard"],
    ["/doctor/appointments", "Appointments"],
    ["/doctor/profile", "Profile"],
  ],
};

export function RoleGuard({ role }) {
  const { user, authLoading } = useContext(AppContext);
  if (authLoading)
    return (
      <p className="p-12 text-center text-gray-500">Loading your portal…</p>
    );
  if (!user) return <Navigate to={`/login?role=${role}`} replace />;
  if (user.role !== role)
    return (
      <Navigate
        to={
          user.role === "admin"
            ? "/admin"
            : user.role === "doctor"
              ? "/doctor"
              : "/"
        }
        replace
      />
    );
  return <Outlet />;
}

export default function PortalLayout({ role }) {
  const { user, logout } = useContext(AppContext);
  return (
    <div className="min-h-screen w-full min-w-0 bg-gray-50 overflow-x-hidden">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-3 items-center justify-between">
        <div>
          <p className="font-semibold text-xl text-gray-900">
            {role === "admin" ? "Administration" : "Doctor workspace"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Signed in as {user?.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {role === "admin" && (
            <Link
              to="/admin/doctors/new"
              className="bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm hover:brightness-95"
            >
              ＋ Add doctor
            </Link>
          )}
          <button
            onClick={logout}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm hover:border-primary"
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="flex flex-col lg:flex-row min-h-[75vh]">
        <nav
          aria-label={`${role} navigation`}
          className="lg:w-56 xl:w-60 shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 p-3 sm:p-4 flex lg:flex-col gap-2 overflow-x-auto"
        >
          <p className="hidden lg:block px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>
          {navigation[role].map(([path, title], index) => (
            <NavLink
              end={index === 0}
              key={path}
              to={path}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2.5 text-sm transition-colors ${isActive ? "bg-indigo-50 text-primary font-semibold" : "text-gray-600 hover:bg-gray-50"}`
              }
            >
              {title}
            </NavLink>
          ))}
        </nav>
        <main className="p-4 sm:p-5 lg:p-6 flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
