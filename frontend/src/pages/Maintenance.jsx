import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Maintenance() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [maintenance, setMaintenance] = useState([]);

  const [summary, setSummary] = useState({
    totalEquipment: 0,
    scheduled: 0,
    good: 0,
    serviceSoon: 0,
    overdue: 0,
    notScheduled: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingEquipment, setEditingEquipment] =
    useState(null);

  const [formData, setFormData] = useState({
    lastServiceDate: "",
    nextServiceDate: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMaintenance();
  }, []);

  const loadMaintenance = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("rentonToken");

      const storedUser =
        localStorage.getItem("rentonUser");

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
        "http://localhost:5000/api/maintenance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMaintenance(
        response.data.maintenance || []
      );

      setSummary(
        response.data.summary || {
          totalEquipment: 0,
          scheduled: 0,
          good: 0,
          serviceSoon: 0,
          overdue: 0,
          notScheduled: 0,
        }
      );
    } catch (error) {
      console.error(
        "Maintenance loading error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("rentonToken");
        localStorage.removeItem("rentonUser");
        navigate("/signin");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load maintenance records"
      );
    } finally {
      setLoading(false);
    }
  };

  const openEditor = (item) => {
    setEditingEquipment(item);

    setFormData({
      lastServiceDate:
        item.maintenance?.lastServiceDate
          ? new Date(
              item.maintenance.lastServiceDate
            )
              .toISOString()
              .split("T")[0]
          : "",
      nextServiceDate:
        item.maintenance?.nextServiceDate
          ? new Date(
              item.maintenance.nextServiceDate
            )
              .toISOString()
              .split("T")[0]
          : "",
      notes:
        item.maintenance?.notes || "",
    });
  };

  const closeEditor = () => {
    setEditingEquipment(null);

    setFormData({
      lastServiceDate: "",
      nextServiceDate: "",
      notes: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!editingEquipment) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token =
        localStorage.getItem("rentonToken");

      await axios.put(
        `http://localhost:5000/api/maintenance/${editingEquipment.equipment._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      closeEditor();
      await loadMaintenance();
    } catch (error) {
      console.error(
        "Save maintenance error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save maintenance record"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (equipmentId) => {
    const confirmed = window.confirm(
      "Delete the maintenance record for this equipment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const token =
        localStorage.getItem("rentonToken");

      await axios.delete(
        `http://localhost:5000/api/maintenance/${equipmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await loadMaintenance();
    } catch (error) {
      console.error(
        "Delete maintenance error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete maintenance record"
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Good":
        return "bg-emerald-100 text-emerald-700";

      case "Service Soon":
        return "bg-yellow-100 text-yellow-700";

      case "Overdue":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

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
            Maintenance Tracking
          </h1>

          <p className="mt-3 text-slate-600">
            {isAdmin
              ? "Monitor equipment maintenance across the entire Renton platform."
              : "Track maintenance schedules for your equipment."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Summary */}
        {!error && (
          <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Total Equipment
              </p>

              <p className="mt-3 text-4xl font-bold text-slate-800">
                {loading ? "..." : summary.totalEquipment}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Good
              </p>

              <p className="mt-3 text-4xl font-bold text-emerald-600">
                {loading ? "..." : summary.good}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Service Soon
              </p>

              <p className="mt-3 text-4xl font-bold text-yellow-600">
                {loading ? "..." : summary.serviceSoon}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Overdue
              </p>

              <p className="mt-3 text-4xl font-bold text-red-600">
                {loading ? "..." : summary.overdue}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Not Scheduled
              </p>

              <p className="mt-3 text-4xl font-bold text-slate-600">
                {loading ? "..." : summary.notScheduled}
              </p>
            </div>
          </div>
        )}

        {/* Maintenance Cards */}
        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-600">
              Loading maintenance records...
            </p>
          </div>
        ) : error ? null : maintenance.length ===
          0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">🛠️</div>

            <h2 className="mt-4 text-2xl font-bold text-slate-800">
              No equipment found
            </h2>

            <p className="mt-2 text-slate-500">
              There is no equipment available for
              maintenance tracking.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {maintenance.map((item) => (
              <div
                key={item.equipment._id}
                className="rounded-3xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {item.equipment.name}
                    </h2>

                    <p className="mt-2 text-slate-500">
                      {item.equipment.category}
                    </p>

                    {isAdmin && (
                      <p className="mt-2 text-sm text-slate-400">
                        Owner:{" "}
                        {item.equipment.owner?.name ||
                          "Unknown"}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-8 space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">
                      Last Service
                    </p>

                    <p className="font-semibold text-slate-800">
                      {item.maintenance?.lastServiceDate
                        ? new Date(
                            item.maintenance
                              .lastServiceDate
                          ).toLocaleDateString()
                        : "Not recorded"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Next Service
                    </p>

                    <p className="font-semibold text-slate-800">
                      {item.maintenance?.nextServiceDate
                        ? new Date(
                            item.maintenance
                              .nextServiceDate
                          ).toLocaleDateString()
                        : "Not scheduled"}
                    </p>
                  </div>

                  {item.maintenance?.notes && (
                    <div>
                      <p className="text-sm text-slate-500">
                        Notes
                      </p>

                      <p className="mt-1 text-slate-600">
                        {item.maintenance.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {(isOwner || isAdmin) && (
                  <div className="mt-7 flex gap-3">
                    <button
                      onClick={() => openEditor(item)}
                      className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
                    >
                      {item.maintenance
                        ? "Edit Maintenance"
                        : "Add Maintenance"}
                    </button>

                    {item.maintenance && (
                      <button
                        onClick={() =>
                          handleDelete(
                            item.equipment._id
                          )
                        }
                        className="rounded-xl border border-red-300 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
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

      {/* Edit Modal */}
      {editingEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                  MAINTENANCE
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-800">
                  {editingEquipment.equipment.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                className="text-2xl font-bold text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="mt-8 space-y-6"
            >
              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Last Service Date
                </label>

                <input
                  type="date"
                  name="lastServiceDate"
                  value={formData.lastServiceDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Next Service Date
                </label>

                <input
                  type="date"
                  name="nextServiceDate"
                  value={formData.nextServiceDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Add maintenance notes..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emerald-600 px-7 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save Maintenance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Maintenance;