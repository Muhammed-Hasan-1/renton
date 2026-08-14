const categories = [
  {
    name: "Power Tools",
    description: "Drills, grinders and other electric tools.",
  },
  {
    name: "Construction",
    description: "Professional equipment for construction work.",
  },
  {
    name: "Gardening",
    description: "Equipment for gardening and outdoor work.",
  },
  {
    name: "Painting",
    description: "Sprayers, rollers and painting equipment.",
  },
  {
    name: "Electrical",
    description: "Electrical tools and testing equipment.",
  },
  {
    name: "Cleaning",
    description: "Pressure washers and cleaning equipment.",
  },
];

function Categories() {
  return (
    <div className="min-h-screen bg-emerald-50 py-20">

      <div className="mx-auto max-w-7xl px-8">

        <div className="mb-14 text-center">

          <p className="font-semibold text-emerald-600">
            EXPLORE RENTON
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-800">
            Equipment Categories
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Choose a category and find the equipment you need.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {categories.map((category) => (
            <div
              key={category.name}
              className="cursor-pointer rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                🔧
              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                {category.name}
              </h2>

              <p className="mt-3 text-slate-600">
                {category.description}
              </p>

              <p className="mt-5 font-semibold text-emerald-600">
                Explore →
              </p>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Categories;