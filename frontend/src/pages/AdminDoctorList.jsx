import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AppContext from "../context/appContext";
import { apiRequest } from "../context/api";

export default function AdminDoctorList() {
  const { token, refreshDoctors } = useContext(AppContext);
  const [doctors, setDoctors] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const location = useLocation();
  useEffect(() => {
    apiRequest("/admin/doctors", { token })
      .then(({ doctors: rows }) => setDoctors(rows))
      .catch((err) => setError(err.message));
  }, [token]);
  const save = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const { doctor } = await apiRequest(`/admin/doctors/${editing._id}`, {
        token,
        method: "PUT",
        body: JSON.stringify({ ...editing, fees: Number(editing.fees) }),
      });
      setDoctors((list) =>
        list.map((item) => (item._id === doctor._id ? doctor : item)),
      );
      setEditing(null);
      await refreshDoctors();
    } catch (err) {
      setError(err.message);
    }
  };
  const activate = async (doctor) => {
    setError("");
    try {
      const { doctor: updated } = await apiRequest(
        `/admin/doctors/${doctor._id}`,
        {
          token,
          method: "PUT",
          body: JSON.stringify({ active: !doctor.active }),
        },
      );
      setDoctors((list) =>
        list.map((item) => (item._id === updated._id ? updated : item)),
      );
      await refreshDoctors();
    } catch (err) {
      setError(err.message);
    }
  };
  const field = "w-full border border-gray-300 rounded-lg px-3 py-2";
  return (
    <section>
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Doctor list</h1>
          <p className="text-gray-500 mt-1">
            Manage doctor profiles and account access.
          </p>
        </div>
        <Link
          to="/admin/doctors/new"
          className="bg-primary text-white rounded-full px-5 py-3 text-sm"
        >
          Add doctor
        </Link>
      </div>
      {location.state?.notice && (
        <p role="status" className="mt-4 text-green-700">
          {location.state.notice}
        </p>
      )}
      {error && (
        <p role="alert" className="text-red-600 mt-4">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 mt-6">
        {doctors.map((doctor) => (
          <article
            key={doctor._id}
            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5"
          >
            <div className="flex gap-3 sm:gap-4 items-center">
              {doctor.image ? (
                <img
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover bg-gray-100 shrink-0"
                  src={doctor.image}
                  alt=""
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-blue-50 grid place-items-center text-primary text-xl font-semibold shrink-0">
                  {doctor.name[0]}
                </div>
              )}
              <div className="min-w-0">
                <h2 className="font-semibold truncate">{doctor.name}</h2>
                <p className="text-sm text-gray-500 truncate">
                  {doctor.speciality}
                </p>
                <p
                  className={`text-xs mt-1 ${doctor.active ? "text-green-700" : "text-gray-500"}`}
                >
                  {doctor.active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 truncate">
              {doctor.email}
            </p>
            <p className="text-sm mt-1">Fee: ${doctor.fees}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setEditing({ ...doctor })}
                className="border border-gray-300 rounded-full px-3 sm:px-4 py-2 text-sm"
              >
                Edit profile
              </button>
              <button
                onClick={() => activate(doctor)}
                className="text-sm text-red-600 px-2"
              >
                {doctor.active ? "Deactivate" : "Reactivate"}
              </button>
            </div>
          </article>
        ))}
        {!doctors.length && !error && (
          <p className="text-gray-500">
            No doctor profiles yet. Add the first doctor to get started.
          </p>
        )}
      </div>
      {editing && (
        <div className="fixed inset-0 z-40 bg-black/40 grid place-items-center p-4">
          <form
            onSubmit={save}
            className="bg-white rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Edit doctor profile</h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              {[
                ["name", "Name"],
                ["speciality", "Specialty"],
                ["degree", "Degree"],
                ["experience", "Experience"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["fees", "Fee"],
                ["image", "Image URL"],
              ].map(([key, label]) => (
                <label key={key} className="text-sm">
                  {label}
                  <input
                    className={`${field} mt-1`}
                    type={key === "fees" ? "number" : "text"}
                    min={key === "fees" ? "0" : undefined}
                    value={editing[key] ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, [key]: e.target.value })
                    }
                  />
                </label>
              ))}
              <label className="sm:col-span-2 text-sm">
                About
                <textarea
                  rows="3"
                  className={`${field} mt-1`}
                  value={editing.about || ""}
                  onChange={(e) =>
                    setEditing({ ...editing, about: e.target.value })
                  }
                />
              </label>
            </div>
            {error && <p className="text-red-600 mt-3">{error}</p>}
            <div className="flex gap-3 mt-5">
              <button className="bg-primary text-white rounded-full px-6 py-2">
                Save profile
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="border rounded-full px-6 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
