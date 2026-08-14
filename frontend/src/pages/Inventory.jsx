function Inventory() {
  const equipment = [
    {
      name: "Cordless Drill",
      category: "Power Tools",
      quantity: 12,
      available: 8,
      status: "Available",
    },
    {
      name: "Angle Grinder",
      category: "Power Tools",
      quantity: 8,
      available: 5,
      status: "Available",
    },
    {
      name: "Circular Saw",
      category: "Construction",
      quantity: 5,
      available: 2,
      status: "Limited",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">

        <p className="font-semibold text-emerald-600">
          RENTON MANAGEMENT
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-800">
          Inventory Management
        </h1>

        <p className="mt-3 text-slate-600">
          Monitor equipment availability and inventory status.
        </p>

        <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-emerald-50">
                <tr>
                  <th className="px-6 py-5">Equipment</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Total</th>
                  <th className="px-6 py-5">Available</th>
                  <th className="px-6 py-5">Status</th>
                </tr>
              </thead>

              <tbody>
                {equipment.map((item) => (
                  <tr
                    key={item.name}
                    className="border-t border-slate-200"
                  >
                    <td className="px-6 py-5 font-semibold">
                      {item.name}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {item.category}
                    </td>

                    <td className="px-6 py-5">
                      {item.quantity}
                    </td>

                    <td className="px-6 py-5">
                      {item.available}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={
                          item.status === "Available"
                            ? "rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700"
                            : "rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700"
                        }
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

      </div>
    </div>
  );
}

export default Inventory;