import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { apiRequest } from "../context/api";

export default function AdminAppointments() {
  const { token } = useContext(AppContext);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/admin/appointments", { token })
      .then(({ appointments }) => setItems(appointments))
      .catch((err) => setError(err.message));
  }, [token]);

  const update = async (item, status) => {
    setError("");
    try {
      const { appointment } = await apiRequest(
        `/admin/appointments/${item._id}/status`,
        {
          token,
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );
      setItems((current) =>
        current.map((row) => (row._id === item._id ? appointment : row)),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const statusControl = (item) => (
    <select
      aria-label={`Status for ${item.patient?.name || "appointment"}`}
      value={item.status}
      onChange={(event) => update(item, event.target.value)}
      className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2"
    >
      <option>Booked</option>
      <option>Completed</option>
      <option>Cancelled</option>
    </select>
  );

  return (
    <section className="min-w-0">
      <h1 className="text-2xl font-semibold">Appointments</h1>
      <p className="text-gray-500 mt-1">
        Review bookings and update their status.
      </p>
      {error && (
        <p role="alert" className="text-red-600 mt-4 break-words">
          {error}
        </p>
      )}

      {!items.length ? (
        <div className="bg-white border border-gray-200 rounded-xl mt-6 p-8 text-center text-gray-500">
          No appointments found.
        </div>
      ) : (
        <>
          <div className="sm:hidden mt-6 space-y-3">
            {items.map((item) => (
              <article
                key={item._id}
                className="bg-white border border-gray-200 rounded-xl p-4 space-y-3"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold break-words">
                      {item.patient?.name || "Patient"}
                    </h2>
                    <p className="text-xs text-gray-500 break-all">
                      {item.patient?.email}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">
                    ${item.fees}
                  </span>
                </div>
                <div className="text-sm border-t border-gray-100 pt-3">
                  <p className="font-medium">{item.doctorName}</p>
                  <p className="text-gray-500">{item.speciality}</p>
                  <p className="mt-2">
                    {item.date} · {item.time}
                  </p>
                </div>
                {statusControl(item)}
              </article>
            ))}
          </div>
          <div className="hidden sm:block overflow-x-auto bg-white border border-gray-200 rounded-xl mt-6">
            <table className="w-full min-w-[760px] text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  {[
                    "Patient",
                    "Doctor",
                    "Specialty",
                    "Date & time",
                    "Fee",
                    "Status",
                  ].map((title) => (
                    <th key={title} className="p-4">
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-t border-gray-100">
                    <td className="p-4">
                      {item.patient?.name || "Patient"}
                      <span className="block text-xs text-gray-500 break-all">
                        {item.patient?.email}
                      </span>
                    </td>
                    <td className="p-4">{item.doctorName}</td>
                    <td className="p-4">{item.speciality}</td>
                    <td className="p-4 whitespace-nowrap">
                      {item.date}
                      <span className="block text-gray-500">{item.time}</span>
                    </td>
                    <td className="p-4">${item.fees}</td>
                    <td className="p-4">{statusControl(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
