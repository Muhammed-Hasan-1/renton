import { Link, useParams } from "react-router-dom";

const equipments = [
  {
    id: 1,
    name: "Cordless Drill",
    category: "Power Tools",
    price: 300,
    location: "Kochi",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=900",
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
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900",
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
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900",
    description:
      "Professional circular saw suitable for wood cutting and construction projects.",
  },
];

function EquipmentDetails() {
  const { id } = useParams();

  const equipment = equipments.find(
    (item) => item.id === Number(id)
  );

  if (!equipment) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h1 className="text-3xl font-bold">
          Equipment not found
        </h1>

        <Link
          to="/equipment"
          className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 text-white"
        >
          Back to Equipment
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">

      <div className="mx-auto max-w-6xl px-8">

        <Link
          to="/equipment"
          className="font-semibold text-emerald-600"
        >
          ← Back to Equipment
        </Link>

        <div className="mt-8 grid overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

          <img
            src={equipment.image}
            alt={equipment.name}
            className="h-full min-h-[450px] w-full object-cover"
          />

          <div className="p-10">

            <p className="font-semibold text-emerald-600">
              {equipment.category}
            </p>

            <h1 className="mt-3 text-4xl font-bold text-slate-800">
              {equipment.name}
            </h1>

            <p className="mt-4 text-slate-500">
              📍 {equipment.location}
            </p>

            <div className="my-8 border-t border-slate-200" />

            <p className="text-3xl font-bold text-emerald-600">
              ₹{equipment.price}
              <span className="text-base font-normal text-slate-500">
                {" "}
                / day
              </span>
            </p>

            <h2 className="mt-8 text-xl font-bold">
              Description
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              {equipment.description}
            </p>

            <button
              className="mt-10 w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white transition hover:bg-emerald-700"
            >
              Rent Now
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EquipmentDetails;