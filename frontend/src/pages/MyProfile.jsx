import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/appContext";
import { apiRequest } from "../context/api";
import { assets } from "../assets/assets_frontend/assets";

function MyProfile() {
  const { token, user, updateUser, authLoading } = useContext(AppContext);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const profile =
    form ||
    (user
      ? {
          ...user,
          address: {
            line1: user.address?.line1 || "",
            line2: user.address?.line2 || "",
          },
        }
      : null);
  useEffect(() => {
    if (!authLoading && !user)
      navigate("/login", { state: { from: "/my-profile" }, replace: true });
  }, [authLoading, user, navigate]);

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const { user: updated } = await apiRequest("/users/me", {
        token,
        method: "PUT",
        body: JSON.stringify(profile),
      });
      updateUser(updated);
      setForm(updated);
      setEditing(false);
      setMessage("Your profile has been updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  if (authLoading || !user || !profile)
    return (
      <p className="py-20 text-center text-gray-500">Loading your profile…</p>
    );
  const field =
    "bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full max-w-full sm:max-w-sm";
  const valueOrField = (key, label, type = "text") =>
    editing ? (
      <input
        className={field}
        aria-label={label}
        type={type}
        value={profile[key] || ""}
        onChange={(e) => setForm({ ...profile, [key]: e.target.value })}
      />
    ) : (
      <span className="text-gray-600">{profile[key] || "Not provided"}</span>
    );
  return (
    <main className="w-full max-w-2xl my-8 sm:my-10">
      <img
        className="w-32 h-32 rounded-xl object-cover"
        src={assets.profile_pic}
        alt="Profile"
      />
      {editing ? (
        <input
          className="w-full max-w-full sm:max-w-md text-2xl sm:text-3xl font-medium mt-5 mb-4 border-b border-gray-300 outline-none"
          aria-label="Full name"
          value={profile.name}
          onChange={(e) => setForm({ ...profile, name: e.target.value })}
          required
        />
      ) : (
        <h1 className="text-2xl sm:text-3xl font-medium text-gray-800 mt-5 mb-4 break-words">
          {profile.name}
        </h1>
      )}
      <hr className="border-gray-300" />
      <h2 className="text-sm uppercase text-gray-500 mt-6 mb-4">
        Contact information
      </h2>
      <dl className="grid grid-cols-[minmax(4.5rem,7.5rem)_minmax(0,1fr)] gap-x-3 sm:gap-x-5 gap-y-4 text-sm">
        <dt className="font-medium">Email</dt>
        <dd className="min-w-0 text-blue-600 break-all">{profile.email}</dd>
        <dt className="font-medium">Phone</dt>
        <dd className="min-w-0">
          {valueOrField("phone", "Phone number", "tel")}
        </dd>
        <dt className="font-medium">Address</dt>
        <dd className="min-w-0 flex flex-col gap-2">
          {editing ? (
            <>
              <input
                className={field}
                aria-label="Address line 1"
                value={profile.address.line1}
                onChange={(e) =>
                  setForm({
                    ...profile,
                    address: { ...profile.address, line1: e.target.value },
                  })
                }
              />
              <input
                className={field}
                aria-label="Address line 2"
                value={profile.address.line2}
                onChange={(e) =>
                  setForm({
                    ...profile,
                    address: { ...profile.address, line2: e.target.value },
                  })
                }
              />
            </>
          ) : (
            <span className="text-gray-600">
              {profile.address.line1 || "Not provided"}
              <br />
              {profile.address.line2}
            </span>
          )}
        </dd>
      </dl>
      <h2 className="text-sm uppercase text-gray-500 mt-7 mb-4">
        Basic information
      </h2>
      <dl className="grid grid-cols-[minmax(4.5rem,7.5rem)_minmax(0,1fr)] gap-x-3 sm:gap-x-5 gap-y-4 text-sm">
        <dt className="font-medium">Gender</dt>
        <dd className="min-w-0">
          {editing ? (
            <select
              className={field}
              value={profile.gender || ""}
              onChange={(e) => setForm({ ...profile, gender: e.target.value })}
            >
              <option value="">Prefer not to say</option>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          ) : (
            <span className="text-gray-600">
              {profile.gender || "Not provided"}
            </span>
          )}
        </dd>
        <dt className="font-medium">Birthday</dt>
        <dd className="min-w-0">{valueOrField("dob", "Birthday", "date")}</dd>
      </dl>
      {message && (
        <p className="text-green-700 mt-5" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="text-red-600 mt-5" role="alert">
          {error}
        </p>
      )}
      <div className="mt-8 flex gap-3">
        {editing ? (
          <>
            <button
              onClick={save}
              disabled={busy}
              className="bg-primary text-white rounded-full px-7 py-2 disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save changes"}
            </button>
            <button
              onClick={() => {
                setForm(null);
                setEditing(false);
                setError("");
              }}
              className="border border-gray-300 rounded-full px-7 py-2"
            >
              Discard
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setForm({
                ...user,
                address: {
                  line1: user.address?.line1 || "",
                  line2: user.address?.line2 || "",
                },
              });
              setEditing(true);
              setMessage("");
            }}
            className="border border-primary text-primary rounded-full px-7 py-2"
          >
            Edit profile
          </button>
        )}
      </div>
    </main>
  );
}

export default MyProfile;
