import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppContext from "../context/appContext";
import { apiRequest } from "../context/api";

function MyAppointments() {
  const { token, user, authLoading } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!authLoading && !user)
      navigate("/login", {
        state: { from: "/my-appointments" },
        replace: true,
      });
    if (token)
      apiRequest("/appointments", { token })
        .then(({ appointments: items }) => setAppointments(items))
        .catch((err) => setError(err.message));
  }, [token, user, authLoading, navigate]);

  const cancel = async (id) => {
    setError("");
    setBusyId(id);
    try {
      const { appointment } = await apiRequest(`/appointments/${id}/cancel`, {
        token,
        method: "PATCH",
      });
      setAppointments((current) =>
        current.map((item) => (item._id === id ? appointment : item)),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };
  const formatDate = (value) =>
    new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  if (authLoading || !user)
    return (
      <p className="py-20 text-center text-gray-500">
        Loading your appointments…
      </p>
    );
  return (
    <main className="my-10 min-h-[45vh]">
      <h1 className="text-2xl font-semibold text-gray-800">My appointments</h1>
      {location.state?.notice && (
        <p className="mt-4 rounded-lg bg-green-50 text-green-800 px-4 py-3">
          {location.state.notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 text-red-600">
          {error}
        </p>
      )}
      {!appointments.length && !error ? (
        <div className="py-16 text-center text-gray-500">
          You don’t have any appointments yet.
          <br />
          <Link
            to="/doctors"
            className="text-primary underline inline-block mt-3"
          >
            Find a doctor
          </Link>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
          {appointments.map((item) => (
            <article
              key={item._id}
              className="py-6 flex flex-col sm:flex-row gap-4 sm:gap-5 sm:items-center"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover bg-blue-50 grid place-items-center text-3xl font-semibold text-primary shrink-0">
                {item.doctorImage ? (
                  <img
                    src={item.doctorImage}
                    alt={item.doctorName}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  item.doctorName?.charAt(0)
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.doctorName}</h2>
                <p className="text-gray-500 text-sm">{item.speciality}</p>
                <p className="mt-3 text-sm">
                  <strong>Date & time</strong>
                  <br />
                  {formatDate(item.date)} ·{" "}
                  {new Date(`2000-01-01T${item.time}`).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm mt-2">Fee: ${item.fees}</p>
                <p
                  className={`text-xs mt-2 font-medium ${item.status === "Booked" ? "text-green-700" : "text-gray-500"}`}
                >
                  {item.status}
                </p>
              </div>
              {item.status === "Booked" && (
                <button
                  disabled={busyId === item._id}
                  onClick={() => cancel(item._id)}
                  className="w-full sm:w-auto border border-gray-300 text-gray-600 rounded-full px-5 py-2 hover:border-red-400 hover:text-red-600 disabled:opacity-50"
                >
                  {busyId === item._id ? "Cancelling…" : "Cancel appointment"}
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyAppointments;
