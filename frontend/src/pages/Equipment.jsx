import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";



const categories = [
  "All Categories",
  "Power Tools",
  "Construction",
  "Gardening",
  "Painting",
  "Electrical",
  "Cleaning",
];

function Equipment() {
  const [equipments, setEquipments] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All Categories");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
    useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/equipment"
        );

        setEquipments(response.data);

      } catch (error) {
        console.error("Failed to load equipment:", error);

        setError(
          "Unable to load equipment. Please try again."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);
  const filteredEquipment = useMemo(() => {
    return equipments.filter((equipment) => {
      const matchesSearch =
        equipment.name.toLowerCase().includes(search.toLowerCase()) ||
        equipment.category.toLowerCase().includes(search.toLowerCase()) ||
        equipment.location.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All Categories" ||
        equipment.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [equipments, search, category]);

  return (
    <div className="min-h-screen bg-slate-50 py-16">

      <div className="mx-auto max-w-7xl px-8">

        {/* Header */}
        <div className="mb-10">

          <p className="font-semibold text-emerald-600">
            RENTON EQUIPMENT
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-800">
            Browse Equipment
          </h1>

          <p className="mt-3 text-slate-600">
            Find the right equipment for your next project.
          </p>

        </div>

        {/* Search & Filter */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search equipment..."
            className="w-full rounded-xl border border-slate-300 bg-white px-5 py-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-5 py-4 outline-none focus:border-emerald-500"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

        </div>

        {/* Result count */}
        <div className="mb-6 flex items-center justify-between">

          <p className="text-slate-600">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredEquipment.length}
            </span>{" "}
            equipment
          </p>

          {(search || category !== "All Categories") && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
              }}
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Clear Filters
            </button>
          )}

        </div>

        {/* Equipment Grid */}
        {filteredEquipment.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {filteredEquipment.map((equipment) => (

              <div
                key={equipment._id}
                className="overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="h-60 w-full object-cover"
                />

                <div className="p-6">

                  <p className="font-semibold text-emerald-600">
                    {equipment.category}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-800">
                    {equipment.name}
                  </h2>

                  <p className="mt-3 text-slate-500">
                    📍 {equipment.location}
                  </p>

                  <p className="mt-4 text-xl font-bold text-emerald-600">
                    ₹{equipment.pricePerDay}/day
                  </p>

                  <Link
                    to={`/equipment/${equipment._id}`}
                    className="mt-6 block w-full rounded-xl bg-emerald-600 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
                  >
                    View Details
                  </Link>

                </div>

              </div>

            ))}

          </div>
        ) : (

          <div className="rounded-3xl bg-white py-20 text-center shadow">

            <div className="text-5xl">
              🔍
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-800">
              No equipment found
            </h2>

            <p className="mt-2 text-slate-500">
              Try another search term or category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
              }}
              className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white"
            >
              Clear Filters
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default Equipment;