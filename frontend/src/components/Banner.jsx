import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

function Banner() {
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col md:flex-row items-center overflow-hidden bg-primary rounded-lg px-5 sm:px-8 md:px-10 lg:px-12 my-12 sm:my-16 md:my-20 md:mx-4 lg:mx-10">
      {/* Left side */}
      <div className="flex-1 py-8 sm:py-12 lg:py-20 lg:pl-5">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white">
          <p>Book Appointment</p>
          <p className="mt-4">With 100+ Trusted Doctors</p>
        </div>
        <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className="bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all"
        >
          Login
        </button>
      </div>

      {/* Right side */}
      <div className="hidden md:block w-2/5 self-stretch relative">
        <img
          className="w-full h-full object-contain object-bottom max-w-md ml-auto"
          src={assets.appointment_img}
          alt=""
        />
      </div>
    </div>
  );
}

export default Banner;
