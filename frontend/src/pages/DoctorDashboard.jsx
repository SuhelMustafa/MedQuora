import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../context/appContext";
import { apiRequest } from "../context/api";

const cards = [
  ["earnings", "Earnings (completed visits)", true],
  ["upcoming", "Booked appointments"],
  ["patients", "Patients"],
  ["appointments", "Total appointments"],
];
export default function DoctorDashboard() {
  const { token } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiRequest("/doctor/dashboard", { token })
      .then(setData)
      .catch((err) => setError(err.message));
  }, [token]);
  return (
    <section>
      <h1 className="text-2xl font-semibold">Doctor dashboard</h1>
      <p className="text-gray-500 mt-1">
        Your appointments, patients, and earnings at a glance.
      </p>
      {error && (
        <p role="alert" className="text-red-600 mt-4">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-7">
        {cards.map(([key, label, money]) => (
          <article
            key={key}
            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5"
          >
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl sm:text-3xl font-semibold mt-2">
              {data ? `${money ? "$" : ""}${data.stats[key]}` : "—"}
            </p>
          </article>
        ))}
      </div>
      <div className="flex flex-wrap justify-between items-center gap-2 mt-8 sm:mt-9 mb-3">
        <h2 className="font-semibold text-lg">Recent appointments</h2>
        <Link to="/doctor/appointments" className="text-primary text-sm">
          Manage appointments
        </Link>
      </div>
      <div className="sm:hidden space-y-3">
        {data?.appointments?.map((item) => (
          <article
            key={item._id}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <p className="font-medium">{item.patient?.name || "Patient"}</p>
            <p className="text-xs text-gray-500 break-all">
              {item.patient?.phone || item.patient?.email}
            </p>
            <div className="flex justify-between gap-3 border-t border-gray-100 mt-3 pt-3 text-sm">
              <span>
                {item.date}
                <span className="block text-gray-500">{item.time}</span>
              </span>
              <span className="text-right">
                ${item.fees}
                <span className="block text-gray-500">{item.status}</span>
              </span>
            </div>
          </article>
        ))}
        {data && !data.appointments.length && (
          <p className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
            No appointments yet.
          </p>
        )}
      </div>
      <div className="hidden sm:block overflow-x-auto bg-white border border-gray-200 rounded-xl">
        <table className="w-full min-w-[600px] text-sm text-left">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-4">Patient</th>
              <th className="p-4">Date & time</th>
              <th className="p-4">Fee</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.appointments?.map((item) => (
              <tr key={item._id} className="border-t border-gray-100">
                <td className="p-4">
                  {item.patient?.name}
                  <span className="block text-xs text-gray-500 break-all">
                    {item.patient?.phone || item.patient?.email}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  {item.date} · {item.time}
                </td>
                <td className="p-4">${item.fees}</td>
                <td className="p-4">{item.status}</td>
              </tr>
            ))}
            {data && !data.appointments.length && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No appointments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
