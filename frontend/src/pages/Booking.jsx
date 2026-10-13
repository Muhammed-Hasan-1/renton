import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Booking() {
  const navigate = useNavigate();
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await API.get("/equipment");
        setEquipmentList(response.data);
      } catch (err) {
        console.error("Failed to load equipment list:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  const handleProceed = (e) => {
    e.preventDefault();
    if (selectedId) {
      navigate(`/equipment/${selectedId}/rent`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">

        <p className="font-semibold text-emerald-600">
          RENTON
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-800">
          Equipment Booking
        </h1>

        <p className="mt-3 text-slate-600">
          Reserve equipment for your project quickly and easily.
        </p>

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg md:p-10">

          <h2 className="text-2xl font-bold text-slate-800">
            Start a Booking
          </h2>

          <form onSubmit={handleProceed} className="mt-8 space-y-6">

            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Select Equipment
              </label>

              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Select equipment from catalog...</option>
                {equipmentList.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} - ₹{item.pricePerDay}/day ({item.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={!selectedId || loading}
                className="rounded-xl bg-emerald-600 px-8 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
              >
                Proceed to Booking
              </button>

              <Link
                to="/equipment"
                className="rounded-xl border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Browse Catalog
              </Link>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}

export default Booking;