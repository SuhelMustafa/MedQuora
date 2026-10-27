import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { apiRequest } from "../context/api";
import { specialityData } from "../assets/assets_frontend/assets";

export default function DoctorProfile() {
  const { token, updateUser, refreshDoctors } = useContext(AppContext);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    apiRequest("/doctor/dashboard", { token })
      .then(({ doctor }) =>
        setForm({
          ...doctor,
          address: {
            line1: doctor.address?.line1 || "",
            line2: doctor.address?.line2 || "",
          },
        }),
      )
      .catch((err) => setError(err.message));
  }, [token]);
  const save = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const { doctor, user } = await apiRequest("/doctor/profile", {
        token,
        method: "PUT",
        body: JSON.stringify({ ...form, fees: Number(form.fees) }),
      });
      setForm({
        ...doctor,
        address: {
          line1: doctor.address?.line1 || "",
          line2: doctor.address?.line2 || "",
        },
      });
      updateUser(user);
      await refreshDoctors();
      setMessage("Your profile has been updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  const field = "w-full mt-1 border border-gray-300 rounded-lg px-3 py-2.5";
  if (!form) return <p className="text-gray-500">Loading profile…</p>;
  return (
    <section className="max-w-3xl">
      <h1 className="text-2xl font-semibold">My doctor profile</h1>
      <p className="text-gray-500 mt-1">
        Update the profile patients see when they book.
      </p>
      <form
        onSubmit={save}
        className="bg-white border border-gray-200 rounded-xl p-5 sm:p-7 mt-6 grid sm:grid-cols-2 gap-4"
      >
        <label className="text-sm">
          Name
          <input
            className={field}
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Email
          <input
            className={`${field} bg-gray-50`}
            readOnly
            value={form.email}
          />
        </label>
        <label className="text-sm">
          Specialty
          <select
            className={field}
            value={form.speciality}
            onChange={(e) => setForm({ ...form, speciality: e.target.value })}
          >
            {specialityData.map((item) => (
              <option key={item.speciality}>{item.speciality}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Degree
          <input
            className={field}
            value={form.degree || ""}
            onChange={(e) => setForm({ ...form, degree: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Experience
          <input
            className={field}
            value={form.experience || ""}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Consultation fee
          <input
            className={field}
            type="number"
            min="0"
            step="0.01"
            value={form.fees}
            onChange={(e) => setForm({ ...form, fees: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Phone
          <input
            className={field}
            value={form.phone || ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Profile image URL
          <input
            className={field}
            type="url"
            value={form.image || ""}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
        </label>
        <label className="text-sm sm:col-span-2">
          About
          <textarea
            className={field}
            rows="4"
            value={form.about || ""}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
          />
        </label>
        <label className="text-sm">
          Address line 1
          <input
            className={field}
            value={form.address.line1}
            onChange={(e) =>
              setForm({
                ...form,
                address: { ...form.address, line1: e.target.value },
              })
            }
          />
        </label>
        <label className="text-sm">
          Address line 2
          <input
            className={field}
            value={form.address.line2}
            onChange={(e) =>
              setForm({
                ...form,
                address: { ...form.address, line2: e.target.value },
              })
            }
          />
        </label>
        {message && (
          <p role="status" className="text-green-700 sm:col-span-2">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="text-red-600 sm:col-span-2">
            {error}
          </p>
        )}
        <div className="sm:col-span-2">
          <button
            disabled={busy}
            className="bg-primary text-white rounded-full px-7 py-3 disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save profile"}
          </button>
        </div>
      </form>
    </section>
  );
}
