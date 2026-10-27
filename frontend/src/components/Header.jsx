import { assets } from "../assets/assets_frontend/assets";

function Header() {
  return (
    <div className="flex flex-col md:flex-row bg-primary rounded-lg px-5 sm:px-7 md:px-8 lg:px-12 overflow-hidden">
      {/* Left Side */}
      <div className="w-full md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 sm:py-12 md:py-12 lg:py-16">
        <p className="text-3xl sm:text-4xl lg:text-5xl text-white font-semibold leading-tight">
          Book Appointment <br /> With Trusted Doctors
        </p>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-white text-sm font-light">
          <img className="w-28" src={assets.group_profiles} alt="" />
          <p>
            Simply browse through our extensive list of trusted doctors,{" "}
            <br className="hidden sm:block" /> schedule your appointment
            hassle-free.
          </p>
        </div>
        <a
          href="#speciality"
          className="flex items-center gap-2 bg-white px-6 sm:px-8 py-3 rounded-full text-gray-600 text-sm hover:scale-105 transition-all duration-300"
        >
          Book Appointment{" "}
          <img className="w-3" src={assets.arrow_icon} alt="" />
        </a>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 relative">
        <img
          className="w-full md:absolute bottom-0 h-auto rounded-lg"
          src={assets.header_img}
          alt=""
        />
      </div>
    </div>
  );
}

export default Header;
