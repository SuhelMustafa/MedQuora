import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../context/appContext";
import { apiRequest } from "../context/api";

const welcome = {
  role: "assistant",
  content:
    "Tell me what kind of care you’re looking for. I can help you find a doctor by specialty, but I can’t diagnose an illness.",
  specialties: [],
};

function DoctorGuide() {
  const { doctors } = useContext(AppContext);
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);

  const send = async (event) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || busy) return;
    const history = messages
      .filter((item) => item !== welcome)
      .slice(-12)
      .map(({ role, content }) => ({ role, content }));
    setMessages((items) => [...items, { role: "user", content: message }]);
    setInput("");
    setBusy(true);
    setError("");
    try {
      const result = await apiRequest("/doctor-guide/chat", {
        method: "POST",
        body: JSON.stringify({ message, history }),
      });
      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          content: result.reply,
          specialties: result.recommendedSpecialties || [],
        },
      ]);
      requestAnimationFrame(() =>
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="my-8 sm:my-12 max-w-4xl mx-auto">
      <header className="mb-6">
        <p className="text-primary font-medium">DOCTOR FINDER</p>
        <h1 className="text-3xl font-semibold mt-2">Find the right specialist</h1>
        <p className="text-gray-600 mt-2">
          Describe what kind of care you need and get help finding a relevant specialty.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
        <div
          ref={listRef}
          aria-live="polite"
          className="h-[min(55vh,520px)] min-h-72 overflow-y-auto p-4 sm:p-6 space-y-4"
        >
          {messages.map((item, index) => {
            const matches = item.role === "assistant"
              ? doctors.filter((doctor) => item.specialties.includes(doctor.speciality))
              : [];
            return (
              <div key={`${index}-${item.role}`} className={item.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={`max-w-[90%] rounded-2xl px-4 py-3 ${item.role === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-800"}`}>
                  <p className="whitespace-pre-wrap text-sm leading-6">{item.content}</p>
                  {matches.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-semibold">Doctors in the suggested specialty</p>
                      {matches.slice(0, 4).map((doctor) => (
                        <Link
                          key={doctor._id}
                          to={`/appointment/${doctor._id}`}
                          className="flex items-center gap-3 rounded-xl bg-white p-2 text-gray-800 hover:bg-blue-50"
                        >
                          <img src={doctor.image} alt="" className="h-10 w-10 rounded-full object-cover bg-blue-50" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{doctor.name}</span>
                            <span className="block text-xs text-gray-500">{doctor.speciality}</span>
                          </span>
                          <span className="text-xs text-primary">View</span>
                        </Link>
                      ))}
                      <Link to="/doctors" className="inline-block text-xs font-medium text-primary underline">
                        Browse all doctors
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {busy && <p className="text-sm text-gray-500">Finding relevant specialties…</p>}
        </div>
        {error && <p role="alert" className="px-4 text-sm text-red-600">{error}</p>}
        <form onSubmit={send} className="border-t border-gray-200 p-3 sm:p-4 flex gap-2">
          <label className="sr-only" htmlFor="doctor-guide-message">Describe what care you need</label>
          <input
            id="doctor-guide-message"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={1200}
            placeholder="For example: I need help with a skin concern"
            className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button disabled={busy || !input.trim()} className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-white disabled:opacity-50">
            Send
          </button>
        </form>
      </section>

      <aside className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">
        This tool only helps you find doctors by specialty. It does not diagnose conditions or replace medical advice. If you may be having a medical emergency, contact your local emergency service now.
      </aside>
    </main>
  );
}

export default DoctorGuide;
