import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [ownerStats, setOwnerStats] = useState({
    totalEquipment: 0,
    availableEquipment: 0,
    unavailableEquipment: 0,
    pendingRequests: 0,
    confirmedRentals: 0,
    activeRentals: 0,
    completedRentals: 0,
  });

  const [adminStats, setAdminStats] = useState({
    users: {
      total: 0,
      customers: 0,
      owners: 0,
      admins: 0,
    },
    equipment: {
      total: 0,
      available: 0,
      unavailable: 0,
    },
    rentals: {
      total: 0,
      pending: 0,
      confirmed: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
    },
    feedback: {
      total: 0,
    },
  });

  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");

  // ======================================================
  // LOAD USER
  // ======================================================

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

  // ======================================================
  // ROLE CHECK
  // ======================================================

  const isOwner = user?.role?.toLowerCase() === "owner";

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const isCustomer = user?.role?.toLowerCase() === "customer";

  // ======================================================
  // LOAD OWNER STATISTICS
  // ======================================================

  useEffect(() => {
    if (!user || !isOwner) {
      return;
    }

    const fetchOwnerStats = async () => {
      const token = localStorage.getItem("rentonToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        setStatsLoading(true);
        setStatsError("");

        const [equipmentResponse, rentalsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/equipment/my-equipment", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          axios.get("http://localhost:5000/api/rentals/owner", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const equipments = equipmentResponse.data || [];

        const rentals = rentalsResponse.data || [];

        // Equipment statistics
        const totalEquipment = equipments.length;

        const availableEquipment = equipments.filter(
          (equipment) => equipment.available === true,
        ).length;

        const unavailableEquipment = equipments.filter(
          (equipment) => equipment.available === false,
        ).length;

        // Rental statistics
        const pendingRequests = rentals.filter(
          (rental) => rental.status === "pending",
        ).length;

        const confirmedRentals = rentals.filter(
          (rental) => rental.status === "confirmed",
        ).length;

        const activeRentals = rentals.filter(
          (rental) => rental.status === "active",
        ).length;

        const completedRentals = rentals.filter(
          (rental) => rental.status === "completed",
        ).length;

        setOwnerStats({
          totalEquipment,
          availableEquipment,
          unavailableEquipment,
          pendingRequests,
          confirmedRentals,
          activeRentals,
          completedRentals,
        });
      } catch (error) {
        console.error("Failed to load owner statistics:", error);

        setStatsError(
          error.response?.data?.message || "Unable to load owner statistics.",
        );
      } finally {
        setStatsLoading(false);
      }
    };

    fetchOwnerStats();
  }, [user, isOwner, navigate]);

  // ======================================================
  // LOAD ADMIN STATISTICS
  // ======================================================

  useEffect(() => {
    if (!user || !isAdmin) {
      return;
    }

    const fetchAdminStats = async () => {
      const token = localStorage.getItem("rentonToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        setStatsLoading(true);
        setStatsError("");

        const response = await axios.get(
          "http://localhost:5000/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setAdminStats(
          response.data.stats || {
            users: {
              total: 0,
              customers: 0,
              owners: 0,
              admins: 0,
            },
            equipment: {
              total: 0,
              available: 0,
              unavailable: 0,
            },
            rentals: {
              total: 0,
              pending: 0,
              confirmed: 0,
              active: 0,
              completed: 0,
              cancelled: 0,
            },
            feedback: {
              total: 0,
            },
          },
        );
      } catch (error) {
        console.error("Failed to load admin statistics:", error);

        setStatsError(
          error.response?.data?.message || "Unable to load admin statistics.",
        );
      } finally {
        setStatsLoading(false);
      }
    };

    fetchAdminStats();
  }, [user, isAdmin, navigate]);

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem("rentonToken");
    localStorage.removeItem("rentonUser");

    navigate("/");
  };

  // ======================================================
  // LOADING USER
  // ======================================================

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <h1 className="text-2xl font-bold text-slate-700">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  // ======================================================
  // STAT CARD
  // ======================================================

  const StatCard = ({ icon, label, value, description }) => {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              {label}
            </p>

            <p className="mt-3 text-4xl font-bold text-slate-800">
              {statsLoading ? "..." : value}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
            {icon}
          </div>
        </div>

        {description && (
          <p className="mt-4 text-sm text-slate-500">{description}</p>
        )}
      </div>
    );
  };

  // ======================================================
  // MAIN DASHBOARD
  // ======================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ==================================================
          HEADER
      ================================================== */}

      <section className="bg-gradient-to-r from-emerald-700 to-green-600 px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100">
            {isAdmin
              ? "Administrator"
              : isOwner
                ? "Equipment Owner"
                : "Welcome back"}
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Hello, {user.name || "User"}!
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-emerald-50">
            {isAdmin
              ? "Manage and monitor the Renton platform from your administrator dashboard."
              : isOwner
                ? "Manage your equipment and rental activity from your Renton dashboard."
                : "Manage your rentals, equipment and account from your Renton dashboard."}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* ==================================================
            ACCOUNT INFORMATION
        ================================================== */}

        <section className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                ACCOUNT
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {user.name || "Renton User"}
              </h2>

              <p className="mt-2 text-slate-500">{user.email}</p>

              <p className="mt-4">
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold capitalize text-emerald-700">
                  {isAdmin
                    ? "Administrator"
                    : isOwner
                      ? "Equipment Owner"
                      : "Customer"}
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

        {/* ==================================================
            ADMIN STATISTICS
        ================================================== */}

        {isAdmin && (
          <section className="mb-10">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                ADMIN OVERVIEW
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                Renton Platform Statistics
              </h2>

              <p className="mt-2 text-slate-500">
                Monitor users, equipment, rentals and feedback across the Renton
                system.
              </p>
            </div>

            {statsError && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 font-medium text-red-700">
                {statsError}
              </div>
            )}

            {/* Users */}
            <div className="mb-6">
              <h3 className="mb-4 text-xl font-bold text-slate-800">Users</h3>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  icon="👥"
                  label="Total Users"
                  value={adminStats.users.total}
                  description="All registered users."
                />

                <StatCard
                  icon="🙋"
                  label="Customers"
                  value={adminStats.users.customers}
                  description="Registered customers."
                />

                <StatCard
                  icon="🛠️"
                  label="Owners"
                  value={adminStats.users.owners}
                  description="Registered equipment owners."
                />

                <StatCard
                  icon="👑"
                  label="Admins"
                  value={adminStats.users.admins}
                  description="Administrator accounts."
                />
              </div>
            </div>

            {/* Equipment */}
            <div className="mb-6">
              <h3 className="mb-4 text-xl font-bold text-slate-800">
                Equipment
              </h3>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  icon="🔧"
                  label="Total Equipment"
                  value={adminStats.equipment.total}
                  description="All equipment listed on Renton."
                />

                <StatCard
                  icon="🟢"
                  label="Available"
                  value={adminStats.equipment.available}
                  description="Equipment currently available."
                />

                <StatCard
                  icon="🔴"
                  label="Unavailable"
                  value={adminStats.equipment.unavailable}
                  description="Equipment currently unavailable."
                />
              </div>
            </div>

            {/* Rentals */}
            <div className="mb-6">
              <h3 className="mb-4 text-xl font-bold text-slate-800">Rentals</h3>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  icon="📋"
                  label="Total Rentals"
                  value={adminStats.rentals.total}
                  description="All rental requests and bookings."
                />

                <StatCard
                  icon="📩"
                  label="Pending"
                  value={adminStats.rentals.pending}
                  description="Waiting for owner approval."
                />

                <StatCard
                  icon="✅"
                  label="Confirmed"
                  value={adminStats.rentals.confirmed}
                  description="Approved rentals."
                />

                <StatCard
                  icon="🔄"
                  label="Active"
                  value={adminStats.rentals.active}
                  description="Currently active rentals."
                />

                <StatCard
                  icon="📦"
                  label="Completed"
                  value={adminStats.rentals.completed}
                  description="Successfully returned rentals."
                />

                <StatCard
                  icon="❌"
                  label="Cancelled"
                  value={adminStats.rentals.cancelled}
                  description="Cancelled or rejected rentals."
                />
              </div>
            </div>

            {/* Feedback */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-slate-800">
                Feedback
              </h3>

              <div className="grid gap-6 sm:grid-cols-2">
                <StatCard
                  icon="💬"
                  label="Total Feedback"
                  value={adminStats.feedback.total}
                  description="Feedback submitted by Renton users."
                />
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            OWNER STATISTICS
        ================================================== */}

        {isOwner && (
          <section className="mb-10">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                OWNER OVERVIEW
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                Your Rental Activity
              </h2>

              <p className="mt-2 text-slate-500">
                A quick overview of your equipment and rental activity.
              </p>
            </div>

            {statsError && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 font-medium text-red-700">
                {statsError}
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon="🛠️"
                label="Total Equipment"
                value={ownerStats.totalEquipment}
                description="Equipment currently listed by you."
              />

              <StatCard
                icon="🟢"
                label="Available"
                value={ownerStats.availableEquipment}
                description="Equipment currently available for rent."
              />

              <StatCard
                icon="🔴"
                label="Unavailable"
                value={ownerStats.unavailableEquipment}
                description="Equipment currently unavailable."
              />

              <StatCard
                icon="📩"
                label="Pending Requests"
                value={ownerStats.pendingRequests}
                description="Customer requests waiting for approval."
              />
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                icon="✅"
                label="Confirmed"
                value={ownerStats.confirmedRentals}
                description="Approved rentals waiting to start."
              />

              <StatCard
                icon="🔄"
                label="Active Rentals"
                value={ownerStats.activeRentals}
                description="Equipment currently rented."
              />

              <StatCard
                icon="📦"
                label="Completed"
                value={ownerStats.completedRentals}
                description="Rentals successfully returned."
              />
            </div>
          </section>
        )}

        {/* ==================================================
            QUICK ACCESS
        ================================================== */}

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
              <div className="text-4xl">🔧</div>

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
              <div className="text-4xl">📋</div>

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
              <div className="text-4xl">💬</div>

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

            {/* Admin User Management */}

            {isAdmin && (
              <Link
                to="/admin/users"
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-4xl">👥</div>

                <h3 className="mt-5 text-xl font-bold text-slate-800">
                  User Management
                </h3>

                <p className="mt-2 text-slate-500">
                  View users and manage customer, owner and admin roles.
                </p>

                <div className="mt-5 font-semibold text-emerald-600">
                  Manage Users →
                </div>
              </Link>
            )}

            {/* Admin Feedback Management */}

            {isAdmin && (
              <Link
                to="/admin/feedback"
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-4xl">💬</div>

                <h3 className="mt-5 text-xl font-bold text-slate-800">
                  Feedback Management
                </h3>

                <p className="mt-2 text-slate-500">
                  Review and manage feedback submitted by Renton users.
                </p>

                <div className="mt-5 font-semibold text-emerald-600">
                  Manage Feedback →
                </div>
              </Link>
            )}
            {/* My Equipment */}

            {isOwner && (
              <Link
                to="/my-equipment"
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-4xl">🛠️</div>

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

            {/* Rental Requests */}

            {isOwner && (
              <Link
                to="/rental-requests"
                className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-4xl">📩</div>

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
              <div className="text-4xl">📂</div>

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

            {/* Profile */}

            <Link
              to="/profile"
              className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl">👤</div>

              <h3 className="mt-5 text-xl font-bold text-slate-800">
                My Profile
              </h3>

              <p className="mt-2 text-slate-500">
                View and update your account information.
              </p>

              <div className="mt-5 font-semibold text-emerald-600">
                View Profile →
              </div>
            </Link>
          </div>
        </section>

        {/* ==================================================
            ACCOUNT SUMMARY
        ================================================== */}

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
                <p className="text-sm text-slate-400">Name</p>

                <p className="mt-1 text-lg font-semibold text-slate-800">
                  {user.name || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Email</p>

                <p className="mt-1 text-lg font-semibold text-slate-800">
                  {user.email || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Account Type</p>

                <p className="mt-1 text-lg font-semibold text-emerald-600">
                  {isAdmin
                    ? "Administrator"
                    : isOwner
                      ? "Equipment Owner"
                      : isCustomer
                        ? "Customer"
                        : "User"}
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
