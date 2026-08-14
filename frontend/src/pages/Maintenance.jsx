function Maintenance() {
  const equipment = [
    {
      name: "Cordless Drill",
      lastService: "01 Aug 2026",
      nextService: "01 Nov 2026",
      status: "Good",
    },
    {
      name: "Angle Grinder",
      lastService: "15 Jul 2026",
      nextService: "15 Oct 2026",
      status: "Good",
    },
    {
      name: "Circular Saw",
      lastService: "10 Jun 2026",
      nextService: "10 Sep 2026",
      status: "Service Soon",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">

        <p className="font-semibold text-emerald-600">
          RENTON MANAGEMENT
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-800">
          Maintenance Tracking
        </h1>

        <p className="mt-3 text-slate-600">
          Track equipment maintenance and service schedules.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {equipment.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl bg-white p-7 shadow-lg"
            >

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {item.name}
                  </h2>

                  <p className="mt-2 text-slate-500">
                    Equipment maintenance
                  </p>
                </div>

                <span
                  className={
                    item.status === "Good"
                      ? "rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700"
                      : "rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700"
                  }
                >
                  {item.status}
                </span>

              </div>

              <div className="mt-8 space-y-4">

                <div>
                  <p className="text-sm text-slate-500">
                    Last Service
                  </p>

                  <p className="font-semibold">
                    {item.lastService}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Next Service
                  </p>

                  <p className="font-semibold">
                    {item.nextService}
                  </p>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Maintenance;