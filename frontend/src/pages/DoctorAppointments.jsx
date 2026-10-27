import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { apiRequest } from "../context/api";

export default function DoctorAppointments() {
  const { token } = useContext(AppContext);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    apiRequest("/doctor/appointments", { token })
      .then(({ appointments }) => setItems(appointments))
      .catch((err) => setError(err.message));
  }, [token]);

  const update = async (item, status) => {
    setError("");
    setBusy(item._id);
    try {
      const { appointment } = await apiRequest(
        `/doctor/appointments/${item._id}/status`,
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
    } finally {
      setBusy("");
    }
  };

  const actions = (item) =>
    item.status === "Booked" ? (
      <div className="flex flex-wrap gap-2">
        <button
          disabled={busy === item._id}
          onClick={() => update(item, "Completed")}
          className="rounded-full bg-green-50 text-green-700 px-4 py-2 disabled:opacity-50"
        >
          Complete
        </button>
        <button
          disabled={busy === item._id}
          onClick={() => update(item, "Cancelled")}
          className="rounded-full bg-red-50 text-red-700 px-4 py-2 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    ) : (
      <span className="text-sm text-gray-400">No action available</span>
    );

  return (
    <section className="min-w-0">
      <h1 className="text-2xl font-semibold">Appointments</h1>
      <p className="text-gray-500 mt-1">
        Review patient details and update appointment status.
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
                <div>
                  <h2 className="font-semibold">
                    {item.patient?.name || "Patient"}
                  </h2>
                  <p className="text-xs text-gray-500 break-all">
                    {item.patient?.email}
                  </p>
                  {item.patient?.phone && (
                    <p className="text-xs text-gray-500">
                      {item.patient.phone}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 border-y border-gray-100 py-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Date and time</p>
                    <p>{item.date}</p>
                    <p>{item.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fee</p>
                    <p>${item.fees}</p>
                    <p className="mt-1">{item.status}</p>
                  </div>
                </div>
                {actions(item)}
              </article>
            ))}
          </div>
          <div className="hidden sm:block overflow-x-auto bg-white border border-gray-200 rounded-xl mt-6">
            <table className="w-full min-w-[850px] text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  {["Patient", "Date & time", "Fee", "Status", "Action"].map(
                    (title) => (
                      <th key={title} className="p-4">
                        {title}
                      </th>
                    ),
                  )}
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
                      <span className="block text-xs text-gray-500">
                        {item.patient?.phone}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {item.date}
                      <span className="block text-gray-500">{item.time}</span>
                    </td>
                    <td className="p-4">${item.fees}</td>
                    <td className="p-4">{item.status}</td>
                    <td className="p-4">{actions(item)}</td>
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
