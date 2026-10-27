import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/appContext";
import DoctorCard from "./DoctorCard";

function TopDoctors() {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        To browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 pt-5 gap-y-5 sm:gap-y-6 px-1 sm:px-0">
        {doctors.slice(0, 10).map((item) => (
          <DoctorCard doctor={item} key={item._id} />
        ))}
      </div>
      <button
        onClick={() => {
          navigate(`/doctors`);
          scrollTo(0, 0);
        }}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        more
      </button>
    </div>
  );
}

export default TopDoctors;
