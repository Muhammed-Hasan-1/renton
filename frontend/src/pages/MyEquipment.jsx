import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function MyEquipment() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyEquipment = async () => {
      const token = localStorage.getItem("rentonToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/equipment/my-equipment",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEquipments(response.data);
      } catch (error) {
        console.error("Failed to load my equipment:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your equipment."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyEquipment();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Loading your equipment...
        </h1>
      </div>
    );
  }

  const handleDelete = async (equipmentId, equipmentName) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${equipmentName}"?`
  );

  if (!confirmed) {
    return;
  }

  const token = localStorage.getItem("rentonToken");

  if (!token) {
    navigate("/signin");
    return;
  }

  try {
    await axios.delete(
      `http://localhost:5000/api/equipment/${equipmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Remove deleted equipment from the screen
    setEquipments((previous) =>
      previous.filter(
        (equipment) => equipment._id !== equipmentId
      )
    );
  } catch (error) {
    console.error("Delete equipment error:", error);

    setError(
      error.response?.data?.message ||
        "Failed to delete equipment."
    );
  }
};

const handleAvailabilityToggle = async (
  equipmentId,
  currentAvailability
) => {
  const token = localStorage.getItem("rentonToken");

  if (!token) {
    navigate("/signin");
    return;
  }

  try {
    setError("");

    const response = await axios.patch(
      `http://localhost:5000/api/equipment/${equipmentId}/availability`,
      {
        available: !currentAvailability,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update the equipment immediately on the page
    setEquipments((previous) =>
      previous.map((equipment) =>
        equipment._id === equipmentId
          ? response.data.equipment
          : equipment
      )
    );
  } catch (error) {
    console.error(
      "Availability update error:",
      error
    );

    setError(
      error.response?.data?.message ||
        "Failed to update availability."
    );
  }
};

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-8">
        {/* Page Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="font-semibold text-emerald-600">
              OWNER PANEL
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-800">
              My Equipment
            </h1>

            <p className="mt-2 text-slate-500">
              Manage the equipment you have listed for rent.
            </p>
          </div>

          <Link
            to="/add-equipment"
            className="rounded-xl bg-emerald-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
          >
            + Add Equipment
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-xl bg-red-50 p-4 font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && equipments.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800">
              No equipment yet
            </h2>

            <p className="mt-3 text-slate-500">
              You haven't added any equipment for rent.
            </p>

            <Link
              to="/add-equipment"
              className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Add Your First Equipment
            </Link>
          </div>
        )}

        {/* Equipment Grid */}
        {equipments.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {equipments.map((equipment) => (
              <div
                key={equipment._id}
                className="overflow-hidden rounded-3xl bg-white shadow-lg"
              >
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-emerald-600">
                        {equipment.category}
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-slate-800">
                        {equipment.name}
                      </h2>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        equipment.available
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {equipment.available
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>

                  <p className="mt-4 text-slate-500">
                    📍 {equipment.location}
                  </p>

                  <p className="mt-4 text-xl font-bold text-emerald-600">
                    ₹{equipment.pricePerDay}/day
                  </p>

<div className="mt-6 grid grid-cols-2 gap-3">

  <Link
    to={`/equipment/${equipment._id}`}
    className="rounded-xl border border-emerald-600 px-3 py-3 text-center font-semibold text-emerald-700 transition hover:bg-emerald-50"
  >
    View
  </Link>

  <Link
    to={`/my-equipment/${equipment._id}/edit`}
    className="rounded-xl bg-slate-800 px-3 py-3 text-center font-semibold text-white transition hover:bg-slate-700"
  >
    Edit
  </Link>

  <button
    type="button"
    onClick={() =>
      handleAvailabilityToggle(
        equipment._id,
        equipment.available
      )
    }
    className={`rounded-xl px-3 py-3 font-semibold text-white transition ${
      equipment.available
        ? "bg-amber-500 hover:bg-amber-600"
        : "bg-emerald-600 hover:bg-emerald-700"
    }`}
  >
    {equipment.available
      ? "Set Unavailable"
      : "Set Available"}
  </button>

  <button
    type="button"
    onClick={() =>
      handleDelete(
        equipment._id,
        equipment.name
      )
    }
    className="rounded-xl bg-red-600 px-3 py-3 font-semibold text-white transition hover:bg-red-700"
  >
    Delete
  </button>

</div>                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEquipment;