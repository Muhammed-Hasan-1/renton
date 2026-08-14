import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const equipments = [
  {
    id: 1,
    name: "Cordless Drill",
    category: "Power Tools",
    price: 300,
    location: "Kochi",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600",
    description:
      "A powerful cordless drill suitable for home repairs, furniture work and DIY projects.",
  },
  {
    id: 2,
    name: "Angle Grinder",
    category: "Power Tools",
    price: 250,
    location: "Kochi",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600",
    description:
      "Reliable angle grinder for cutting, grinding and polishing different materials.",
  },
  {
    id: 3,
    name: "Circular Saw",
    category: "Construction",
    price: 350,
    location: "Ernakulam",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600",
    description:
      "Professional circular saw suitable for wood cutting and construction projects.",
  },
  {
    id: 4,
    name: "Pressure Washer",
    category: "Cleaning",
    price: 450,
    location: "Kochi",
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600",
    description:
      "High-pressure cleaning equipment for vehicles, floors and outdoor areas.",
  },
  {
    id: 5,
    name: "Lawn Mower",
    category: "Gardening",
    price: 500,
    location: "Aluva",
    image:
      "https://images.unsplash.com/photo-1599685315640-4e6e0f4d6a4f?w=600",
    description:
      "Efficient lawn mower for maintaining gardens and outdoor spaces.",
  },
  {
    id: 6,
    name: "Paint Sprayer",
    category: "Painting",
    price: 400,
    location: "Thrissur",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e768c9f3f5?w=600",
    description:
      "Easy-to-use paint sprayer for walls, furniture and large painting projects.",
  },
];

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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

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
  }, [search, category]);

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
                key={equipment.id}
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
                    ₹{equipment.price}/day
                  </p>

                  <Link
                    to={`/equipment/${equipment.id}`}
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