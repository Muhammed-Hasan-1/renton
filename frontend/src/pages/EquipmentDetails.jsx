import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function EquipmentDetails() {
  const { id } = useParams();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:5000/api/equipment/${id}`
        );

        setEquipment(response.data);
      } catch (error) {
        console.error("Failed to load equipment:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load equipment details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-8 text-center">
          <div className="text-5xl">⏳</div>

          <h1 className="mt-5 text-3xl font-bold text-slate-800">
            Loading equipment...
          </h1>

          <p className="mt-3 text-slate-500">
            Please wait while we load the equipment details.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !equipment) {
    return (
      <div className="min-h-screen bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-8 text-center">
          <div className="text-5xl">⚠️</div>

          <h1 className="mt-5 text-3xl font-bold text-slate-800">
            Equipment not found
          </h1>

          <p className="mt-3 text-red-500">
            {error || "The requested equipment could not be found."}
          </p>

          <Link
            to="/equipment"
            className="mt-8 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Back to Equipment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-8">

        {/* Back button */}
        <Link
          to="/equipment"
          className="mb-8 inline-flex items-center font-semibold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Equipment
        </Link>

        {/* Details Card */}
        <div className="grid overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

          {/* Image */}
          <div className="bg-slate-100">
            <img
              src={equipment.image}
              alt={equipment.name}
              className="h-full min-h-[450px] w-full object-cover"
            />
          </div>

          {/* Information */}
          <div className="p-8 md:p-10">

            {/* Category */}
            <p className="font-semibold uppercase tracking-wide text-emerald-600">
              {equipment.category}
            </p>

            {/* Name */}
            <h1 className="mt-3 text-4xl font-bold text-slate-800">
              {equipment.name}
            </h1>

            {/* Location */}
            <p className="mt-5 text-slate-500">
              📍 {equipment.location}
            </p>

            {/* Price */}
            <div className="mt-8">
              <p className="text-sm font-medium text-slate-500">
                Rental price
              </p>

              <p className="mt-1 text-3xl font-bold text-emerald-600">
                ₹{equipment.pricePerDay}
                <span className="text-base font-medium text-slate-500">
                  /day
                </span>
              </p>
            </div>

            {/* Availability */}
            <div className="mt-6">
              {equipment.available ? (
                <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                  ✓ Available for rent
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                  Currently unavailable
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-8 border-t border-slate-200 pt-8">
              <h2 className="text-xl font-bold text-slate-800">
                About this equipment
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                {equipment.description}
              </p>
            </div>

            {/* Rent button */}
            <div className="mt-8">
              {equipment.available ? (
                <Link
                  to={`/equipment/${equipment._id}/rent`}
                  className="block w-full rounded-xl bg-emerald-600 py-4 text-center font-semibold text-white transition hover:bg-emerald-700"
                >
                  Rent Now
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-slate-300 py-4 font-semibold text-slate-500"
                >
                  Currently Unavailable
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default EquipmentDetails;