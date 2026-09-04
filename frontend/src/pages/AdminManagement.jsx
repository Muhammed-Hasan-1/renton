import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminManagement() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("equipment");

  const [equipment, setEquipment] = useState([]);
  const [rentals, setRentals] = useState([]);

  const [loadingEquipment, setLoadingEquipment] =
    useState(true);

  const [loadingRentals, setLoadingRentals] =
    useState(false);

  const [error, setError] = useState("");

  const [equipmentAction, setEquipmentAction] =
    useState("");

  const [rentalAction, setRentalAction] =
    useState("");

  useEffect(() => {
    loadEquipment();
  }, []);

  const getToken = () => {
    return localStorage.getItem("rentonToken");
  };

  const loadEquipment = async () => {
    try {
      setLoadingEquipment(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/admin/management/equipment",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEquipment(response.data.equipment || []);
    } catch (error) {
      console.error(
        "Load admin equipment error:",
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
          "Failed to load equipment"
      );
    } finally {
      setLoadingEquipment(false);
    }
  };

  const loadRentals = async () => {
    try {
      setLoadingRentals(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/admin/management/rentals",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRentals(response.data.rentals || []);
    } catch (error) {
      console.error(
        "Load admin rentals error:",
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
          "Failed to load rentals"
      );
    } finally {
      setLoadingRentals(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");

    if (
      tab === "rentals" &&
      rentals.length === 0
    ) {
      loadRentals();
    }
  };

  const handleDeleteEquipment = async (
    equipmentId,
    equipmentName
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${equipmentName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setEquipmentAction(equipmentId);
      setError("");

      const token = getToken();

      await axios.delete(
        `http://localhost:5000/api/admin/management/equipment/${equipmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEquipment((prev) =>
        prev.filter(
          (item) => item._id !== equipmentId
        )
      );
    } catch (error) {
      console.error(
        "Delete admin equipment error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete equipment"
      );
    } finally {
      setEquipmentAction("");
    }
  };

  const handleRentalStatusChange = async (
    rentalId,
    status
  ) => {
    try {
      setRentalAction(`${rentalId}-${status}`);
      setError("");

      const token = getToken();

      const response = await axios.patch(
        `http://localhost:5000/api/admin/management/rentals/${rentalId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRentals((prev) =>
        prev.map((rental) =>
          rental._id === rentalId
            ? response.data.rental
            : rental
        )
      );

      await loadEquipment();
    } catch (error) {
      console.error(
        "Admin rental status error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update rental status"
      );
    } finally {
      setRentalAction("");
    }
  };

  const equipmentStatusClass = (available) => {
    return available
      ? "bg-emerald-100 text-emerald-700"
      : "bg-red-100 text-red-700";
  };

  const rentalStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "active":
        return "bg-emerald-100 text-emerald-700";

      case "completed":
        return "bg-slate-100 text-slate-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-700 to-green-600 px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100">
            ADMINISTRATION
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Equipment & Rental Management
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-emerald-50">
            Monitor equipment listings and rental activity
            across the entire Renton platform.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Tabs */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() =>
              handleTabChange("equipment")
            }
            className={`rounded-xl px-6 py-3 font-semibold transition ${
              activeTab === "equipment"
                ? "bg-emerald-600 text-white shadow-lg"
                : "border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Equipment Management
          </button>

          <button
            onClick={() =>
              handleTabChange("rentals")
            }
            className={`rounded-xl px-6 py-3 font-semibold transition ${
              activeTab === "rentals"
                ? "bg-emerald-600 text-white shadow-lg"
                : "border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Rental Management
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Equipment */}
        {activeTab === "equipment" && (
          <section>
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                EQUIPMENT
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                All Equipment
              </h2>

              <p className="mt-2 text-slate-500">
                Review equipment listed by all Renton
                owners.
              </p>
            </div>

            {loadingEquipment ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-600">
                  Loading equipment...
                </p>
              </div>
            ) : equipment.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                <div className="text-5xl">🔧</div>

                <h2 className="mt-4 text-2xl font-bold text-slate-800">
                  No equipment found
                </h2>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px] text-left">
                    <thead className="bg-emerald-50">
                      <tr>
                        <th className="px-6 py-5">
                          Equipment
                        </th>

                        <th className="px-6 py-5">
                          Owner
                        </th>

                        <th className="px-6 py-5">
                          Category
                        </th>

                        <th className="px-6 py-5">
                          Price / Day
                        </th>

                        <th className="px-6 py-5">
                          Location
                        </th>

                        <th className="px-6 py-5">
                          Status
                        </th>

                        <th className="px-6 py-5">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {equipment.map((item) => (
                        <tr
                          key={item._id}
                          className="border-t border-slate-200 hover:bg-slate-50"
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
                                  ID:{" "}
                                  {item._id.slice(-6)}
                                </p>
                              </div>
                            </div>
                          </td>

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

                          <td className="px-6 py-5 text-slate-600">
                            {item.category}
                          </td>

                          <td className="px-6 py-5 font-semibold text-slate-700">
                            ₹{item.pricePerDay}
                          </td>

                          <td className="px-6 py-5 text-slate-600">
                            {item.location}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`rounded-full px-3 py-2 text-sm font-semibold ${equipmentStatusClass(
                                item.available
                              )}`}
                            >
                              {item.available
                                ? "Available"
                                : "Unavailable"}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <button
                              onClick={() =>
                                handleDeleteEquipment(
                                  item._id,
                                  item.name
                                )
                              }
                              disabled={
                                equipmentAction ===
                                item._id
                              }
                              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {equipmentAction ===
                              item._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Rentals */}
        {activeTab === "rentals" && (
          <section>
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                RENTALS
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                All Rentals
              </h2>

              <p className="mt-2 text-slate-500">
                Review and manage rental activity across
                Renton.
              </p>
            </div>

            {loadingRentals ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-600">
                  Loading rentals...
                </p>
              </div>
            ) : rentals.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                <div className="text-5xl">📋</div>

                <h2 className="mt-4 text-2xl font-bold text-slate-800">
                  No rentals found
                </h2>
              </div>
            ) : (
              <div className="space-y-5">
                {rentals.map((rental) => (
                  <div
                    key={rental._id}
                    className="rounded-3xl bg-white p-6 shadow-sm md:p-8"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <h3 className="text-xl font-bold text-slate-800">
                            {rental.equipment?.name ||
                              "Equipment unavailable"}
                          </h3>

                          <span
                            className={`w-fit rounded-full px-3 py-2 text-sm font-semibold capitalize ${rentalStatusClass(
                              rental.status
                            )}`}
                          >
                            {rental.status}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-slate-400">
                              Customer
                            </p>

                            <p className="mt-1 font-semibold text-slate-800">
                              {rental.customer?.name ||
                                "Unknown"}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {rental.customer?.email ||
                                ""}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-slate-400">
                              Equipment Owner
                            </p>

                            <p className="mt-1 font-semibold text-slate-800">
                              {rental.equipment?.owner?.name ||
                                "Unknown"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-slate-400">
                              Rental Period
                            </p>

                            <p className="mt-1 font-semibold text-slate-800">
                              {new Date(
                                rental.startDate
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                rental.endDate
                              ).toLocaleDateString()}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-slate-400">
                              Total Amount
                            </p>

                            <p className="mt-1 font-semibold text-emerald-600">
                              ₹{rental.totalAmount}
                            </p>
                          </div>
                        </div>
                      </div>

                      {rental.status !==
                        "completed" &&
                        rental.status !==
                          "cancelled" && (
                          <div className="flex flex-wrap gap-3 lg:max-w-xs lg:justify-end">
                            {rental.status ===
                              "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleRentalStatusChange(
                                      rental._id,
                                      "confirmed"
                                    )
                                  }
                                  disabled={
                                    rentalAction ===
                                    `${rental._id}-confirmed`
                                  }
                                  className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() =>
                                    handleRentalStatusChange(
                                      rental._id,
                                      "cancelled"
                                    )
                                  }
                                  disabled={
                                    rentalAction ===
                                    `${rental._id}-cancelled`
                                  }
                                  className="rounded-xl border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {rental.status ===
                              "confirmed" && (
                              <button
                                onClick={() =>
                                  handleRentalStatusChange(
                                    rental._id,
                                    "active"
                                  )
                                }
                                disabled={
                                  rentalAction ===
                                  `${rental._id}-active`
                                }
                                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                              >
                                Start Rental
                              </button>
                            )}

                            {rental.status ===
                              "active" && (
                              <button
                                onClick={() =>
                                  handleRentalStatusChange(
                                    rental._id,
                                    "completed"
                                  )
                                }
                                disabled={
                                  rentalAction ===
                                  `${rental._id}-completed`
                                }
                                className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                              >
                                Mark Returned
                              </button>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <div className="mt-8">
          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-white"
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}