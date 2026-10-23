import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const samplePayments = [null, "pending", "paid"];

function MyAppointments() {
  const { doctors } = useContext(AppContext);
  const [cancelledIds, setCancelledIds] = useState([]);

  const appointments = (doctors || [])
    .slice(0, 3)
    .map((doc, index) => ({
      id: doc._id,
      doctor: doc,
      slotDate: "25, July, 2024",
      slotTime: "8:30 PM",
      payment: samplePayments[index],
    }))
    .filter((appt) => !cancelledIds.includes(appt.id));

  const cancelAppointment = (id) => {
    // TODO: call your backend to cancel the appointment
    setCancelledIds((prev) => [...prev, id]);
  };

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">
        My Appointments
      </p>

      <div>
        {appointments.length === 0 && (
          <p className="py-6 text-sm text-gray-500">
            You have no upcoming appointments.
          </p>
        )}

        {appointments.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={item.doctor.image}
                alt={item.doctor.name}
              />
            </div>

            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.doctor.name}
              </p>
              <p>{item.doctor.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.doctor.address?.line1}</p>
              <p className="text-xs">{item.doctor.address?.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date &amp; Time:
                </span>{" "}
                {item.slotDate} | {item.slotTime}
              </p>
            </div>

            <div className="hidden sm:block sm:flex-1" />

            <div className="flex flex-col gap-2 justify-end">
              {item.payment === "pending" && (
                <button className="text-sm text-white text-center sm:min-w-48 py-2 border border-primary bg-primary rounded hover:opacity-90 transition-all">
                  Pay here
                </button>
              )}
              {item.payment === "paid" && (
                <button
                  disabled
                  className="text-sm text-white text-center sm:min-w-48 py-2 border border-primary bg-primary rounded"
                >
                  Paid
                </button>
              )}
              <button
                onClick={() => cancelAppointment(item.id)}
                className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all"
              >
                Cancel appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointments;