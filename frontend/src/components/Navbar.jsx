import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [token, setToken] = useState(true);

  const goTo = (path) => {
    navigate(path); // always use an absolute path (starts with "/")
    setShowDropdown(false);
    setShowMenu(false);
  };

  const logout = () => {
    setToken(false);
    setShowDropdown(false);
    setShowMenu(false);
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-40 sm:w-60 cursor-pointer"
        src={assets.MainLogo}
        alt=""
      />

      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to={"/"}>
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/doctors"}>
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/about"}>
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/contact"}>
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-5">
        {token ? (
          <div
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer group relative"
          >
            <img
              className="w-8 h-8 rounded-full object-cover shrink-0"
              src={assets.profile_pic}
              alt=""
            />
            <img
              className="w-2.5 shrink-0"
              src={assets.dropdown_icon}
              alt=""
            />

            {/* dropdown: opens on click (mobile) and on hover (desktop) */}
            <div
              className={`absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 ${
                showDropdown ? "block" : "hidden md:group-hover:block"
              }`}
            >
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => goTo("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => goTo("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer"
          >
            Create Account
          </button>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className="w-6 shrink-0 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt=""
        />
      </div>

      {/* mobile menu: always "fixed" so it never takes space in the navbar row */}
      <div
        className={`${
          showMenu ? "w-full" : "w-0"
        } fixed md:hidden right-0 top-0 bottom-0 z-30 overflow-hidden bg-white transition-all`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <img className="w-36" src={assets.logo} alt="" />
          <img
            className="w-7 cursor-pointer"
            onClick={() => setShowMenu(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
          <NavLink onClick={() => setShowMenu(false)} to="/">
            <p className="px-4 py-2 rounded inline-block">HOME</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/doctors">
            <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/about">
            <p className="px-4 py-2 rounded inline-block">ABOUT</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/contact">
            <p className="px-4 py-2 rounded inline-block">CONTACT</p>
          </NavLink>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;