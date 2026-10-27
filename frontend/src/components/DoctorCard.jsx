import { Link } from "react-router-dom";

export default function DoctorCard({ doctor }) {
  return (
    <Link
      to={`/appointment/${doctor._id}`}
      onClick={() => scrollTo(0, 0)}
      className="block border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-blue-50">
        <div
          className="absolute inset-0 grid place-items-center text-5xl font-semibold text-primary/70"
          aria-hidden="true"
        >
          {doctor.name?.trim()?.charAt(0)?.toUpperCase() || "D"}
        </div>
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
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span
            className="w-2 h-2 bg-green-500 rounded-full"
            aria-hidden="true"
          />
          <span>Available</span>
        </div>
        <p className="text-gray-900 text-lg font-medium mt-1">{doctor.name}</p>
        <p className="text-gray-600 text-sm">{doctor.speciality}</p>
      </div>
    </Link>
  );
}
