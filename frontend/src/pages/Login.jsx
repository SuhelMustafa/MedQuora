import { useContext, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AppContext from "../context/appContext";

function Login() {
  const { login, register } = useContext(AppContext);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const role = ["patient", "doctor", "admin"].includes(searchParams.get("role"))
    ? searchParams.get("role")
    : "patient";
  const redirectTo = location.state?.from || "/my-profile";

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const account = isRegister
        ? await register(form)
        : await login({ email: form.email, password: form.password, role });
      navigate(
        account.role === "admin"
          ? "/admin"
          : account.role === "doctor"
            ? "/doctor"
            : redirectTo,
        { replace: true },
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary";
  return (
    <main className="max-w-md mx-auto my-12 p-7 sm:p-9 border border-gray-200 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-800">
        {isRegister ? "Create your account" : "Welcome back"}
      </h1>
      <p className="text-sm text-gray-500 mt-2">
        {isRegister
          ? "Create an account to book and manage appointments."
          : `Sign in to your ${role} account.`}
      </p>
      {!isRegister && (
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl mt-6">
          {["patient", "doctor", "admin"].map((accountType) => (
            <button
              type="button"
              key={accountType}
              onClick={() => setSearchParams({ role: accountType })}
              className={`capitalize rounded-lg py-2 text-sm ${role === accountType ? "bg-white shadow-sm text-primary font-medium" : "text-gray-600"}`}
            >
              {accountType}
            </button>
          ))}
        </div>
      )}
      <form className="mt-7 flex flex-col gap-4" onSubmit={submit}>
        {isRegister && (
          <label className="text-sm text-gray-700">
            Full name
            <input
              className={`${field} mt-1`}
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
        )}
        <label className="text-sm text-gray-700">
          Email address
          <input
            className={`${field} mt-1`}
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label className="text-sm text-gray-700">
          Password
          <input
            className={`${field} mt-1`}
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={isRegister ? 8 : undefined}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="bg-primary text-white rounded-full py-3 mt-1 disabled:opacity-60"
        >
          {busy ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
        </button>
      </form>
      {role === "patient" && (
        <p className="text-sm text-gray-600 mt-5">
          {isRegister ? "Already have an account?" : "New to MedQuora?"}{" "}
          <button
            type="button"
            className="text-primary underline"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Sign in" : "Create an account"}
          </button>
        </p>
      )}
      <p className="text-xs text-gray-500 mt-6">
        By continuing, you agree to use MedQuora to manage your appointment
        requests.
      </p>
    </main>
  );
}

export default Login;
