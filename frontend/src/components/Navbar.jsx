import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../context/appContext";

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem("medquora-theme");
    if (savedTheme) return savedTheme === "dark";
  } catch {
    // Use the system preference when browser storage is unavailable.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches || false;
}

function Navbar() {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(getInitialTheme);
  const profileRef = useRef(null);
  const { user, logout } = useContext(AppContext);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      localStorage.setItem("medquora-theme", darkMode ? "dark" : "light");
    } catch {
      // The selected theme still applies for the current visit.
    }
  }, [darkMode]);

  useEffect(() => {
    if (!showDropdown) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!profileRef.current?.contains(event.target)) setShowDropdown(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [showDropdown]);

  const goTo = (path) => {
    navigate(path); // always use an absolute path (starts with "/")
    setShowDropdown(false);
    setShowMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setShowMenu(false);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between gap-3 text-sm py-3 sm:py-4 mb-4 sm:mb-5 border-b border-b-gray-400 min-w-0">
      <img
        onClick={() => navigate("/")}
        className="brand-logo w-32 sm:w-40 xl:w-60 shrink-0 cursor-pointer"
        src={assets.MainLogo}
        alt=""
      />

      <ul className="hidden lg:flex items-start gap-3 xl:gap-5 font-medium">
        <NavLink to={"/"}>
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/doctors"}>
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/doctor-guide"}>
          <li className="py-1">FIND CARE</li>
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

      <div className="flex items-center gap-2 sm:gap-3 xl:gap-5 shrink-0">
        <button
          type="button"
          onClick={() => setDarkMode((previous) => !previous)}
          aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
          title={`Switch to ${darkMode ? "light" : "dark"} mode`}
          className="border border-gray-300 rounded-full px-3 py-2 text-sm whitespace-nowrap"
        >
          <span aria-hidden="true">{darkMode ? "☀" : "☾"}</span>
          <span className="hidden 2xl:inline ml-2">
            {darkMode ? "Light mode" : "Dark mode"}
          </span>
        </button>
        {user ? (
          <div ref={profileRef} className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setShowDropdown((previous) => !previous)}
              aria-haspopup="menu"
              aria-expanded={showDropdown}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                className="w-8 h-8 rounded-full object-cover shrink-0"
                src={assets.profile_pic}
                alt=""
              />
              <span className="max-w-32 truncate">{user.name}</span>
              <img
                className="dark-invert w-2.5 shrink-0"
                src={assets.dropdown_icon}
                alt=""
              />
            </button>
            {showDropdown && (
              <div
                role="menu"
                className="absolute top-full right-0 pt-3 text-base font-medium text-gray-600 z-20"
              >
                <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg">
                  {user.role === "patient" ? (
                    <>
                      <button
                        role="menuitem"
                        onClick={() => goTo("/my-profile")}
                        className="text-left hover:text-black"
                      >
                        My Profile
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => goTo("/my-appointments")}
                        className="text-left hover:text-black"
                      >
                        My Appointments
                      </button>
                    </>
                  ) : user.role === "doctor" ? (
                    <>
                      <button
                        role="menuitem"
                        onClick={() => goTo("/doctor")}
                        className="text-left hover:text-black"
                      >
                        Doctor dashboard
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => goTo("/doctor/profile")}
                        className="text-left hover:text-black"
                      >
                        My Profile
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        role="menuitem"
                        onClick={() => goTo("/admin")}
                        className="text-left hover:text-black"
                      >
                        Admin dashboard
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => goTo("/admin/doctors/new")}
                        className="text-left hover:text-black"
                      >
                        Add doctor
                      </button>
                    </>
                  )}
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="text-left hover:text-black"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden lg:block cursor-pointer"
          >
            Login
          </button>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className="dark-invert w-6 shrink-0 lg:hidden cursor-pointer"
          src={assets.menu_icon}
          alt=""
        />
      </div>

      {/* mobile menu: always "fixed" so it never takes space in the navbar row */}
      <div
        className={`${
          showMenu ? "w-full" : "w-0"
        } fixed lg:hidden right-0 top-0 bottom-0 z-30 overflow-y-auto overflow-x-hidden bg-white transition-all`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <img
            className="brand-logo w-32 sm:w-36"
            src={assets.MainLogo}
            alt="MedQuora"
          />
          <img
            className="dark-invert w-7 cursor-pointer"
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
          <NavLink onClick={() => setShowMenu(false)} to="/doctor-guide">
            <p className="px-4 py-2 rounded inline-block">FIND CARE</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/about">
            <p className="px-4 py-2 rounded inline-block">ABOUT</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/contact">
            <p className="px-4 py-2 rounded inline-block">CONTACT</p>
          </NavLink>
          {user?.role === "patient" ? (
            <>
              <NavLink onClick={() => setShowMenu(false)} to="/my-profile">
                <p className="px-4 py-2 rounded inline-block">MY PROFILE</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/my-appointments">
                <p className="px-4 py-2 rounded inline-block">
                  MY APPOINTMENTS
                </p>
              </NavLink>
              <button onClick={handleLogout} className="px-4 py-2">
                LOG OUT
              </button>
            </>
          ) : user ? (
            <>
              <button
                onClick={() =>
                  goTo(user.role === "admin" ? "/admin" : "/doctor")
                }
                className="px-4 py-2"
              >
                OPEN {user.role.toUpperCase()} PORTAL
              </button>
              <button onClick={handleLogout} className="px-4 py-2">
                LOG OUT
              </button>
            </>
          ) : (
            <button
              onClick={() => goTo("/login")}
              className="bg-primary text-white rounded-full px-6 py-3 mt-2"
            >
              Login
            </button>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
