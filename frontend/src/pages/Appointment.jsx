import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppContext from "../context/appContext";
import { apiRequest } from "../context/api";

const slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];
const dateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function Appointment() {
  const { docId } = useParams();
  const { doctors, token, user } = useContext(AppContext);
  const doctor = doctors.find((item) => item._id === docId);
  const navigate = useNavigate();
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [availability, setAvailability] = useState(null);
  const dates = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + index + 1);
        return date;
      }),
    [],
  );
  const selectedDate = dateKey(dates[day]);

  useEffect(() => {
    if (!doctor) return undefined;
    let active = true;
    apiRequest(`/doctors/${doctor._id}/availability?date=${selectedDate}`)
      .then(({ bookedTimes }) => {
        if (active)
          setAvailability({ date: selectedDate, bookedTimes, error: "" });
      })
      .catch((err) => {
        if (active)
          setAvailability({
            date: selectedDate,
            bookedTimes: [],
            error: err.message,
          });
      });
    return () => {
      active = false;
    };
  }, [doctor, selectedDate]);
  const currentAvailability =
    availability?.date === selectedDate ? availability : null;

  if (!doctor)
    return (
      <div className="py-20 text-center">
        <p className="text-xl">Doctor not found</p>
        <Link
          to="/doctors"
          className="text-primary underline mt-3 inline-block"
        >
          Browse doctors
        </Link>
      </div>
    );
  const book = async () => {
    if (!token || !user)
      return navigate("/login", { state: { from: `/appointment/${docId}` } });
    if (!time) return setError("Choose an appointment time to continue.");
    setError("");
    setBusy(true);
    try {
      await apiRequest("/appointments", {
        token,
        method: "POST",
        body: JSON.stringify({
          doctorId: doctor._id,
          doctorName: doctor.name,
          doctorImage: doctor.image,
          speciality: doctor.speciality,
          fees: doctor.fees,
          date: dateKey(dates[day]),
          time,
        }),
      });
      navigate("/my-appointments", {
        state: { notice: "Your appointment is booked." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="my-10">
      <section className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        <div className="relative w-full sm:w-52 md:w-64 shrink-0 aspect-[4/3] sm:aspect-auto sm:min-h-64 bg-blue-50 rounded-xl overflow-hidden grid place-items-center">
          <span
            className="text-6xl font-semibold text-primary/70"
            aria-hidden="true"
          >
            {doctor.name?.trim()?.charAt(0)?.toUpperCase() || "D"}
          </span>
          {doctor.image && (
            <img
              className="absolute inset-0 w-full h-full object-cover"
              src={doctor.image}
              alt={doctor.name}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
        <div className="flex-1 min-w-0 border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 break-words">
            {doctor.name}
            <span className="text-sm font-normal text-gray-500 ml-2">✓</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {doctor.degree} · {doctor.speciality} · {doctor.experience}
          </p>
          <h2 className="font-medium mt-6">About</h2>
          <p className="text-sm text-gray-600 mt-2">{doctor.about}</p>
          <p className="text-sm text-gray-600 mt-5">
            Consultation fee:{" "}
            <strong className="text-gray-800">${doctor.fees}</strong>
          </p>
        </div>
      </section>
      <section className="mt-9">
        <h2 className="font-semibold text-lg">Choose a date</h2>
        <div className="flex gap-3 overflow-x-auto py-4">
          {dates.map((date, index) => (
            <button
              key={dateKey(date)}
              onClick={() => {
                setDay(index);
                setTime("");
              }}
              className={`shrink-0 min-w-20 rounded-full border px-4 py-3 text-sm ${day === index ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-700"}`}
            >
              <span className="block">
                {date.toLocaleDateString(undefined, { weekday: "short" })}
              </span>
              <span className="font-semibold">{date.getDate()}</span>
            </button>
          ))}
        </div>
        <h2 className="font-semibold mt-5">Available times</h2>
        {currentAvailability?.error && (
          <p role="alert" className="text-red-600 text-sm mt-3">
            {currentAvailability.error}
          </p>
        )}
        <div className="flex flex-wrap gap-3 mt-4">
          {slots.map((slot) => {
            const booked = currentAvailability?.bookedTimes.includes(slot);
            return (
              <button
                key={slot}
                disabled={
                  !currentAvailability ||
                  Boolean(currentAvailability.error) ||
                  booked
                }
                onClick={() => setTime(slot)}
                className={`rounded-full border px-5 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed ${time === slot ? "bg-primary text-white border-primary" : "border-gray-300 hover:border-primary"}`}
              >
                {new Date(`2000-01-01T${slot}`).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
                {booked ? " · Booked" : ""}
              </button>
            );
          })}
        </div>
        {!currentAvailability && (
          <p className="text-xs text-gray-500 mt-2">Checking availability…</p>
        )}
        {error && (
          <p role="alert" className="text-red-600 text-sm mt-4">
            {error}
          </p>
        )}
        <button
          onClick={book}
          disabled={busy}
          className="w-full sm:w-auto bg-primary text-white rounded-full px-8 sm:px-10 py-3 mt-7 disabled:opacity-60"
        >
          {busy ? "Booking…" : "Book appointment"}
        </button>
        {!user && (
          <p className="text-sm text-gray-500 mt-3">
            You’ll be asked to sign in before confirming.
          </p>
        )}
      </section>
    </main>
  );
}

export default Appointment;
