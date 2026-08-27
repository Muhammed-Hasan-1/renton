import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("rentonToken");
  });

  // Check authentication whenever the route changes
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("rentonToken"));
  }, [location.pathname]);

  const navItems = [
    {
      name: "Equipment",
      path: "/equipment",
    },
    {
      name: "Categories",
      path: "/categories",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
    {
      name: "Feedback",
      path: "/feedback",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/90 shadow-lg shadow-emerald-100/50 backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8 lg:px-12">

        {/* =========================
            LOGO
        ========================= */}
        <Link
          to={isLoggedIn ? "/dashboard" : "/"}
          className="group flex items-center gap-4 transition-all duration-300"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-2xl font-bold text-white shadow-lg shadow-emerald-300 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
            R
          </div>

          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-emerald-700 transition-colors duration-300 group-hover:text-emerald-600">
              Renton
            </h1>

            <p className="text-sm text-slate-500">
              Equipment Rental System
            </p>
          </div>
        </Link>

        {/* =========================
            NAVIGATION
        ========================= */}
        <div className="hidden items-center gap-10 lg:flex">

          {/* Home when logged out */}
          {!isLoggedIn && (
            <Link
              to="/"
              className="group relative text-lg font-semibold text-slate-700 transition-all duration-300 hover:text-emerald-600"
            >
              Home

              <span className="absolute -bottom-2 left-0 h-[3px] w-0 rounded-full bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          )}

          {/* Dashboard when logged in */}
          {isLoggedIn && (
            <Link
              to="/dashboard"
              className="group relative text-lg font-semibold text-slate-700 transition-all duration-300 hover:text-emerald-600"
            >
              Dashboard

              <span className="absolute -bottom-2 left-0 h-[3px] w-0 rounded-full bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          )}

          {/* Common navigation items */}
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="group relative text-lg font-semibold text-slate-700 transition-all duration-300 hover:text-emerald-600"
            >
              {item.name}

              <span className="absolute -bottom-2 left-0 h-[3px] w-0 rounded-full bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* =========================
            RIGHT SIDE BUTTONS
        ========================= */}
        <div className="flex items-center gap-5">

          {/* Logged out */}
          {!isLoggedIn && (
            <>
              <Link
                to="/signin"
                className="rounded-xl border-2 border-emerald-600 px-6 py-3 text-lg font-semibold text-emerald-700 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-50 hover:shadow-lg hover:shadow-emerald-200"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 px-7 py-3 text-lg font-semibold text-white shadow-lg shadow-emerald-300 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-emerald-400"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Logged in */}
          {isLoggedIn && (
            <Link
              to="/profile"
              className="rounded-xl bg-emerald-100 px-6 py-3 text-lg font-semibold text-emerald-700 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-200"
            >
              My Profile
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}