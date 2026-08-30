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
        localStorage.removeItem("rentonToken");

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

      {/* =========================
          HEADER
      ========================= */}

      <section className="bg-gradient-to-r from-emerald-700 to-green-600 px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100">
            Welcome back
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Hello, {user.name || "User"}!
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-emerald-50">
            Manage your rentals, equipment and account from your Renton dashboard.
          </p>

        </div>
      </section>


      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* =========================
            ACCOUNT INFORMATION
        ========================= */}

        <section className="mb-10 rounded-3xl bg-white p-8 shadow-sm">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                ACCOUNT
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {user.name || "Renton User"}
              </h2>

              <p className="mt-2 text-slate-500">
                {user.email}
              </p>

              <p className="mt-4">
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


        {/* =========================
            MAIN ACTIONS
        ========================= */}

        <section className="mb-10">

          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              DASHBOARD
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              Quick Access
            </h2>

            <p className="mt-2 text-slate-500">
              Access the features available to your account.
            </p>
          </div>


          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* Browse Equipment */}

            <Link
              to="/equipment"
              className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="text-4xl">
                🔧
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-800">
                Browse Equipment
              </h3>

              <p className="mt-2 text-slate-500">
                Find tools and equipment available for rent.
              </p>

              <div className="mt-5 font-semibold text-emerald-600">
                Browse Equipment →
              </div>

            </Link>


            {/* Rental History */}

            <Link
              to="/rental-history"
              className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="text-4xl">
                📋
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-800">
                Rental History
              </h3>

              <p className="mt-2 text-slate-500">
                View your previous and current rentals.
              </p>

              <div className="mt-5 font-semibold text-emerald-600">
                View Rental History →
              </div>

            </Link>


            {/* Feedback */}

            <Link
              to="/feedback"
              className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="text-4xl">
                💬
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-800">
                Feedback
              </h3>

              <p className="mt-2 text-slate-500">
                Share your experience and suggestions.
              </p>

              <div className="mt-5 font-semibold text-emerald-600">
                Give Feedback →
              </div>

            </Link>


            {/* My Equipment - Owner only */}

            {isOwner && (
              <Link
                to="/my-equipment"
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="text-4xl">
                  🛠️
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-800">
                  My Equipment
                </h3>

                <p className="mt-2 text-slate-500">
                  Add, edit, delete and manage your equipment listings.
                </p>

                <div className="mt-5 font-semibold text-emerald-600">
                  Manage Equipment →
                </div>

              </Link>
            )}


            {/* Rental Requests - Owner only */}

            {isOwner && (
              <Link
                to="/rental-requests"
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="text-4xl">
                  📩
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-800">
                  Rental Requests
                </h3>

                <p className="mt-2 text-slate-500">
                  Review customer requests and approve or reject rentals.
                </p>

                <div className="mt-5 font-semibold text-emerald-600">
                  View Requests →
                </div>

              </Link>
            )}


            {/* Categories */}

            <Link
              to="/categories"
              className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="text-4xl">
                📂
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-800">
                Categories
              </h3>

              <p className="mt-2 text-slate-500">
                Explore equipment by category.
              </p>

              <div className="mt-5 font-semibold text-emerald-600">
                View Categories →
              </div>

            </Link>

          </div>

        </section>


        {/* =========================
            ACCOUNT SUMMARY
        ========================= */}

        <section>

          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              ACCOUNT
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              Account Information
            </h2>
          </div>


          <div className="rounded-3xl bg-white p-8 shadow-sm">

            <div className="grid gap-6 md:grid-cols-3">

              <div>
                <p className="text-sm text-slate-400">
                  Name
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-800">
                  {user.name || "Not available"}
                </p>
              </div>


              <div>
                <p className="text-sm text-slate-400">
                  Email
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-800">
                  {user.email || "Not available"}
                </p>
              </div>


              <div>
                <p className="text-sm text-slate-400">
                  Account Type
                </p>

                <p className="mt-1 text-lg font-semibold text-emerald-600">
                  {isOwner ? "Equipment Owner" : "Customer"}
                </p>
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;