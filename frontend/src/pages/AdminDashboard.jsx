import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../context/appContext";
import { apiRequest } from "../context/api";

const metrics = [
  {
    key: "doctors",
    label: "Active doctors",
    hint: "Available in the directory",
    icon: "＋",
    color: "text-indigo-700 bg-indigo-50",
  },
  {
    key: "patients",
    label: "Patients",
    hint: "Registered accounts",
    icon: "♡",
    color: "text-sky-700 bg-sky-50",
  },
  {
    key: "activeAppointments",
    label: "Upcoming visits",
    hint: "Currently booked",
    icon: "▦",
    color: "text-amber-700 bg-amber-50",
  },
  {
    key: "completed",
    label: "Completed visits",
    hint: "Marked complete",
    icon: "✓",
    color: "text-emerald-700 bg-emerald-50",
  },
];

function statusClass(status) {
  if (status === "Completed") return "bg-emerald-50 text-emerald-700";
  if (status === "Cancelled") return "bg-gray-100 text-gray-600";
  return "bg-blue-50 text-blue-700";
}

export default function AdminDashboard() {
  const { token, user } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiRequest("/admin/dashboard", { token })
      .then(setData)
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">MEDQUORA · ADMIN</p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mt-1">
            Good to see you, {user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="text-gray-500 mt-2">
            Here’s what’s happening at your clinic.
          </p>
        </div>
        <Link
          to="/admin/doctors/new"
          className="inline-flex items-center justify-center gap-2 bg-primary hover:brightness-95 text-white rounded-xl px-5 py-3 font-medium shadow-sm"
        >
          <span className="text-xl leading-none">＋</span> Add a doctor
        </Link>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3"
        >
          {error}
        </p>
      )}

      {!data?.stats?.doctors && data && (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="font-semibold text-gray-900 text-lg">
              Start building your doctor directory
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Create a doctor profile and login so they can manage visits and
              earnings.
            </p>
          </div>
          <Link
            to="/admin/doctors/new"
            className="shrink-0 bg-white border border-primary text-primary hover:bg-indigo-50 rounded-lg px-5 py-3 text-sm font-semibold"
          >
            Create first doctor →
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((item) => (
          <article
            key={item.key}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{item.label}</span>
              <span
                className={`w-10 h-10 rounded-xl grid place-items-center text-lg font-semibold ${item.color}`}
              >
                {item.icon}
              </span>
            </div>
            <p className="text-3xl font-semibold tracking-tight text-gray-900 mt-4">
              {data?.stats?.[item.key] ?? "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">{item.hint}</p>
          </article>
        ))}
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_280px] gap-5 items-start">
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-gray-900">
                Recent appointments
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Latest booking activity across the clinic
              </p>
            </div>
            <Link
              to="/admin/appointments"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="sm:hidden p-3 space-y-3">
            {data?.appointments?.map((item) => (
              <article
                key={item._id}
                className="rounded-xl border border-gray-100 p-3 text-sm"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <p className="font-medium break-words">
                      {item.patient?.name || "Patient"}
                    </p>
                    <p className="text-xs text-gray-500 break-all">
                      {item.patient?.email}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClass(item.status)}`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-3">
                  {item.doctorName}
                  <span className="block text-xs text-gray-500">
                    {item.speciality}
                  </span>
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  {item.date} · {item.time}
                </p>
              </article>
            ))}
            {data && !data.appointments.length && (
              <p className="py-5 text-center text-sm text-gray-500">
                No appointments yet
              </p>
            )}
            {!data && (
              <p className="py-5 text-center text-sm text-gray-400">
                Loading appointment activity…
              </p>
            )}
          </div>
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="bg-gray-50/80 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Doctor</th>
                  <th className="px-5 py-3">Date & time</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.appointments?.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-gray-100 hover:bg-gray-50/60"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {item.patient?.name || "Patient"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.patient?.email}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-gray-800">{item.doctorName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.speciality}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {item.date}
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {item.time}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {data && !data.appointments.length && (
                  <tr>
                    <td colSpan="4" className="p-10 text-center">
                      <p className="font-medium text-gray-700">
                        No appointments yet
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Bookings will appear here.
                      </p>
                    </td>
                  </tr>
                )}
                {!data && (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-10 text-center text-sm text-gray-400"
                    >
                      Loading appointment activity…
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">Quick actions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your clinic from here.
          </p>
          <div className="flex flex-col gap-2 mt-5">
            <Link
              to="/admin/doctors/new"
              className="flex items-center justify-between rounded-xl bg-primary text-white px-4 py-3 text-sm font-medium hover:brightness-95"
            >
              <span>Add doctor account</span>
              <span>→</span>
            </Link>
            <Link
              to="/admin/doctors"
              className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span>Manage doctor list</span>
              <span>→</span>
            </Link>
            <Link
              to="/admin/appointments"
              className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span>Review appointments</span>
              <span>→</span>
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
