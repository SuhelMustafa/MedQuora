import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../context/appContext";
import { apiRequest } from "../context/api";
import { specialityData } from "../assets/assets_frontend/assets";

const empty = {
  name: "",
  email: "",
  password: "",
  speciality: specialityData[0].speciality,
  degree: "MBBS",
  experience: "",
  about: "",
  fees: "",
  image: "",
  phone: "",
  address: { line1: "", line2: "" },
};
const field =
  "w-full mt-1.5 border border-gray-300 rounded-lg px-3.5 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-indigo-100";

export default function AdminAddDoctor() {
  const { token, refreshDoctors } = useContext(AppContext);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const set = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await apiRequest("/admin/doctors", {
        token,
        method: "POST",
        body: JSON.stringify({ ...form, fees: Number(form.fees) }),
      });
      await refreshDoctors();
      navigate("/admin/doctors", {
        state: { notice: "Doctor account created successfully." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto">
      <Link
        to="/admin/doctors"
        className="text-sm text-gray-500 hover:text-primary"
      >
        ← Back to doctor list
      </Link>
      <div className="mt-4 mb-7">
        <p className="text-sm font-medium text-primary">DOCTOR MANAGEMENT</p>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mt-1">
          Add a doctor
        </h1>
        <p className="text-gray-500 mt-2">
          Create a profile in the directory and give the doctor access to their
          portal.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Account access</h2>
            <p className="text-sm text-gray-500 mt-1">
              The doctor will use these credentials to sign in.
            </p>
          </div>
          <div className="p-5 sm:p-7 grid sm:grid-cols-2 gap-x-5 gap-y-4">
            <label className="text-sm font-medium text-gray-700">
              Doctor’s full name
              <input
                className={field}
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Dr. Amina Rahman"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Login email
              <input
                className={field}
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="doctor@clinic.com"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">
              Temporary password
              <input
                className={field}
                type="password"
                autoComplete="new-password"
                minLength="8"
                required
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="At least 8 characters"
              />
              <span className="text-xs font-normal text-gray-500 mt-1.5 block">
                Give this password to the doctor privately.
              </span>
            </label>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              Professional profile
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              This information is shown to patients when they browse doctors.
            </p>
          </div>
          <div className="p-5 sm:p-7 grid sm:grid-cols-2 gap-x-5 gap-y-4">
            <label className="text-sm font-medium text-gray-700">
              Specialty
              <select
                className={field}
                value={form.speciality}
                onChange={(e) => set("speciality", e.target.value)}
              >
                {specialityData.map((item) => (
                  <option key={item.speciality}>{item.speciality}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              Degree
              <input
                className={field}
                value={form.degree}
                onChange={(e) => set("degree", e.target.value)}
                placeholder="MBBS"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Experience
              <input
                className={field}
                value={form.experience}
                onChange={(e) => set("experience", e.target.value)}
                placeholder="e.g. 5 years"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Consultation fee
              <input
                className={field}
                type="number"
                min="0"
                step="0.01"
                required
                value={form.fees}
                onChange={(e) => set("fees", e.target.value)}
                placeholder="0.00"
              />
            </label>
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">
              Profile image URL{" "}
              <span className="font-normal text-gray-400">(optional)</span>
              <input
                className={field}
                type="url"
                placeholder="https://…"
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
              />
            </label>
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">
              About the doctor
              <textarea
                className={field}
                rows="4"
                value={form.about}
                onChange={(e) => set("about", e.target.value)}
                placeholder="Add a short introduction, experience, and areas of focus."
              />
            </label>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Contact details</h2>
            <p className="text-sm text-gray-500 mt-1">
              Optional details for the doctor profile.
            </p>
          </div>
          <div className="p-5 sm:p-7 grid sm:grid-cols-2 gap-x-5 gap-y-4">
            <label className="text-sm font-medium text-gray-700">
              Phone number
              <input
                className={field}
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+880…"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
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
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">
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
          </div>
        </section>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3"
          >
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-3 justify-end pb-5">
          <Link
            to="/admin/doctors"
            className="rounded-xl border border-gray-300 px-5 py-3 text-sm text-gray-700 hover:bg-white"
          >
            Cancel
          </Link>
          <button
            disabled={busy}
            className="rounded-xl bg-primary text-white px-6 py-3 text-sm font-semibold shadow-sm hover:brightness-95 disabled:opacity-60"
          >
            {busy ? "Creating account…" : "Create doctor account"}
          </button>
        </div>
      </form>
    </section>
  );
}
