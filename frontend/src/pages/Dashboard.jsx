import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("rentonUser");
    const token = localStorage.getItem("rentonToken");

    if (!token) {
      navigate("/signin");
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to read logged-in user:", error);
        localStorage.removeItem("rentonUser");
        navigate("/signin");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("rentonToken");
    localStorage.removeItem("rentonUser");

    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-700">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  const isOwner = user.role?.toLowerCase() === "owner";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-700 to-green-600 px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100">
            Welcome back
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Hello, {user.name || "User"}!
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-emerald-50">
            Manage your rentals and explore equipment from your Renton dashboard.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Account Information */}
        <section className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Account
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {user.name || "Renton User"}
              </h2>

              <p className="mt-2 text-slate-500">
                {user.email}
              </p>

              <p className="mt-3">
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                  {isOwner ? "Equipment Owner" : "Customer"}
                </span>
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border-2 border-red-500 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </section>

        {/* Dashboard Cards */}
        <section className="mb-10 grid gap-6 md:grid-cols-3">
          <Link
            to="/equipment"
            className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-4xl">🔧</div>

            <h2 className="mt-5 text-xl font-bold text-slate-800">
              Browse Equipment
            </h2>

            <p className="mt-2 text-slate-500">
              Find tools and equipment available for rent.
            </p>
          </Link>

          <Link
            to="/rental-history"
            className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-4xl">📋</div>

            <h2 className="mt-5 text-xl font-bold text-slate-800">
              Rental History
            </h2>

            <p className="mt-2 text-slate-500">
              View your previous and current rentals.
            </p>
          </Link>

          <Link
            to="/feedback"
            className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-4xl">💬</div>

            <h2 className="mt-5 text-xl font-bold text-slate-800">
              Feedback
            </h2>

            <p className="mt-2 text-slate-500">
              Share your experience and suggestions.
            </p>
          </Link>
        </section>

        {/* Owner Management */}
        {isOwner && (
          <section className="mb-10 rounded-3xl border border-emerald-100 bg-emerald-50 p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="font-semibold text-emerald-600">
                  OWNER PANEL
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  Manage Your Equipment
                </h2>

                <p className="mt-3 text-slate-600">
                  Add new equipment and manage the equipment you have listed
                  for rent.
                </p>
              </div>

              <Link
                to="/my-equipment"
                className="rounded-xl bg-emerald-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
              >
                Manage My Equipment
              </Link>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              QUICK ACTIONS
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              What would you like to do?
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/equipment"
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-3xl">🔎</span>

              <h3 className="mt-4 text-xl font-bold text-slate-800">
                Find Equipment
              </h3>

              <p className="mt-2 text-slate-500">
                Browse available tools and equipment.
              </p>
            </Link>

            {isOwner && (
              <Link
                to="/my-equipment"
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-3xl">🛠️</span>

                <h3 className="mt-4 text-xl font-bold text-slate-800">
                  Manage My Equipment
                </h3>

                <p className="mt-2 text-slate-500">
                  Add, edit and manage your equipment listings.
                </p>
              </Link>
            )}

            <Link
              to="/categories"
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-3xl">📂</span>

              <h3 className="mt-4 text-xl font-bold text-slate-800">
                Browse Categories
              </h3>

              <p className="mt-2 text-slate-500">
                Explore equipment by category.
              </p>
            </Link>

            <Link
              to="/feedback"
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-3xl">💬</span>

              <h3 className="mt-4 text-xl font-bold text-slate-800">
                Give Feedback
              </h3>

              <p className="mt-2 text-slate-500">
                Tell us about your experience.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;