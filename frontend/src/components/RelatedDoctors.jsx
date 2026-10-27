import { useContext, useMemo } from "react";
import AppContext from "../context/appContext";
import DoctorCard from "./DoctorCard";

function RelatedDoctors({ docId, speciality }) {
  const { doctors } = useContext(AppContext);
  const relDoc = useMemo(
    () =>
      doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId,
      ),
    [doctors, speciality, docId],
  );

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        To browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {relDoc.slice(0, 5).map((item) => (
          <DoctorCard doctor={item} key={item._id} />
        ))}
      </div>
    </div>
  );
}

export default RelatedDoctors;
