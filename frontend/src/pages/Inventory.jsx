import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Inventory() {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    available: 0,
    reserved: 0,
    currentlyRented: 0,
    unavailable: 0,
  });

  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("rentonToken");
      const storedUser = localStorage.getItem("rentonUser");

      if (!token) {
        navigate("/signin");
        return;
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("rentonUser");
        }
      }

      const response = await axios.get(
        "http://localhost:5000/api/inventory",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInventory(response.data.inventory || []);
      setSummary(
        response.data.summary || {
          total: 0,
          available: 0,
          reserved: 0,
          currentlyRented: 0,
          unavailable: 0,
        }
      );
    } catch (error) {
      console.error("Inventory loading error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("rentonToken");
        localStorage.removeItem("rentonUser");
        navigate("/signin");
        return;
      }

      if (error.response?.status === 403) {
        setError(
          "Only equipment owners and administrators can access inventory management."
        );
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load inventory"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Available":
        return "bg-emerald-100 text-emerald-700";

      case "Reserved":
        return "bg-blue-100 text-blue-700";

      case "Currently Rented":
        return "bg-yellow-100 text-yellow-700";

      case "Unavailable":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filteredInventory =
    filter === "all"
      ? inventory
      : inventory.filter(
          (item) => item.status === filter
        );

  const isAdmin =
    user?.role?.toLowerCase() === "admin";

  const isOwner =
    user?.role?.toLowerCase() === "owner";

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <p className="font-semibold uppercase tracking-wider text-emerald-600">
            RENTON MANAGEMENT
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-800">
            Inventory Management
          </h1>

          <p className="mt-3 text-slate-600">
            {isAdmin
              ? "Monitor equipment inventory across the entire Renton platform."
              : "Monitor your equipment availability and rental status."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        {!error && (
          <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Total
              </p>

              <p className="mt-3 text-4xl font-bold text-slate-800">
                {loading ? "..." : summary.total}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Available
              </p>

              <p className="mt-3 text-4xl font-bold text-emerald-600">
                {loading ? "..." : summary.available}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Reserved
              </p>

              <p className="mt-3 text-4xl font-bold text-blue-600">
                {loading ? "..." : summary.reserved}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Currently Rented
              </p>

              <p className="mt-3 text-4xl font-bold text-yellow-600">
                {loading
                  ? "..."
                  : summary.currentlyRented}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Unavailable
              </p>

              <p className="mt-3 text-4xl font-bold text-red-600">
                {loading ? "..." : summary.unavailable}
              </p>
            </div>
          </div>
        )}

        {/* Filter */}
        {!error && (
          <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  INVENTORY STATUS
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-800">
                  {filteredInventory.length} item
                  {filteredInventory.length !== 1
                    ? "s"
                    : ""}
                </h2>
              </div>

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
                className="rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="all">All Equipment</option>
                <option value="Available">
                  Available
                </option>
                <option value="Reserved">
                  Reserved
                </option>
                <option value="Currently Rented">
                  Currently Rented
                </option>
                <option value="Unavailable">
                  Unavailable
                </option>
              </select>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-600">
              Loading inventory...
            </p>
          </div>
        ) : error ? null : filteredInventory.length ===
          0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">🛠️</div>

            <h2 className="mt-4 text-2xl font-bold text-slate-800">
              No equipment found
            </h2>

            <p className="mt-2 text-slate-500">
              There is no equipment matching the selected
              inventory filter.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-5">
                      Equipment
                    </th>

                    <th className="px-6 py-5">
                      Category
                    </th>

                    <th className="px-6 py-5">
                      Location
                    </th>

                    {isAdmin && (
                      <th className="px-6 py-5">
                        Owner
                      </th>
                    )}

                    <th className="px-6 py-5">
                      Price / Day
                    </th>

                    <th className="px-6 py-5">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInventory.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-2xl">
                                🔧
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-bold text-slate-800">
                              {item.name}
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                              Equipment ID:{" "}
                              {item._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {item.category}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {item.location}
                      </td>

                      {isAdmin && (
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-700">
                            {item.owner?.name ||
                              "Unknown"}
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            {item.owner?.email ||
                              ""}
                          </p>
                        </td>
                      )}

                      <td className="px-6 py-5 font-semibold text-slate-700">
                        ₹{item.pricePerDay}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {isOwner && (
            <button
              onClick={() =>
                navigate("/my-equipment")
              }
              className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Manage My Equipment
            </button>
          )}

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-white"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Inventory;