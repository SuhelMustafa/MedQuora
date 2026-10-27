import { useCallback, useEffect, useState } from "react";
import { doctors as sampleDoctors } from "../assets/assets_frontend/assets";
import AppContext from "./appContext";
import { apiRequest } from "./api";

const AppContextProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("medquora-token") || "",
  );
  const [user, setUser] = useState(null);
  const [doctorList, setDoctorList] = useState(sampleDoctors);
  const [authLoading, setAuthLoading] = useState(() =>
    Boolean(localStorage.getItem("medquora-token")),
  );

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    apiRequest("/auth/me", { token })
      .then(({ user: currentUser }) => {
        if (!cancelled) setUser(currentUser);
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem("medquora-token");
          setToken("");
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const mergeDoctors = useCallback((managedDoctors) => {
    const sampleIds = new Set(sampleDoctors.map((doctor) => doctor._id));
    setDoctorList([
      ...sampleDoctors,
      ...managedDoctors.filter((doctor) => !sampleIds.has(doctor._id)),
    ]);
  }, []);

  const refreshDoctors = useCallback(async () => {
    try {
      const { doctors: managedDoctors } = await apiRequest("/doctors");
      mergeDoctors(managedDoctors);
    } catch {
      setDoctorList(sampleDoctors);
    }
  }, [mergeDoctors]);

  useEffect(() => {
    let cancelled = false;
    apiRequest("/doctors")
      .then(({ doctors: managedDoctors }) => {
        if (!cancelled) mergeDoctors(managedDoctors);
      })
      .catch(() => {
        if (!cancelled) setDoctorList(sampleDoctors);
      });
    return () => {
      cancelled = true;
    };
  }, [mergeDoctors]);

  const authenticate = async (path, credentials) => {
    const result = await apiRequest(path, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    localStorage.setItem("medquora-token", result.token);
    setToken(result.token);
    setUser(result.user);
    setAuthLoading(false);
    return result.user;
  };

  const value = {
    doctors: doctorList,
    refreshDoctors,
    token,
    user,
    authLoading,
    login: (credentials) => authenticate("/auth/login", credentials),
    register: (details) => authenticate("/auth/register", details),
    logout: () => {
      localStorage.removeItem("medquora-token");
      setToken("");
      setUser(null);
    },
    updateUser: setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
