function RentalHistory() {
  const rentals = [
    {
      equipment: "Cordless Drill",
      date: "10 Aug 2026",
      duration: "2 days",
      amount: "₹600",
      status: "Completed",
    },
    {
      equipment: "Angle Grinder",
      date: "04 Aug 2026",
      duration: "3 days",
      amount: "₹750",
      status: "Completed",
    },
    {
      equipment: "Circular Saw",
      date: "28 Jul 2026",
      duration: "2 days",
      amount: "₹700",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">

        <p className="font-semibold text-emerald-600">
          RENTON
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-800">
          Rental History
        </h1>

        <p className="mt-3 text-slate-600">
          View previous equipment rentals.
        </p>

        <div className="mt-10 grid gap-6">

          {rentals.map((rental) => (
            <div
              key={`${rental.equipment}-${rental.date}`}
              className="flex flex-col justify-between gap-5 rounded-2xl bg-white p-6 shadow-md md:flex-row md:items-center"
            >

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {rental.equipment}
                </h2>

                <p className="mt-2 text-slate-500">
                  {rental.date} · {rental.duration}
                </p>
              </div>

              <div className="md:text-right">

                <p className="text-xl font-bold text-emerald-600">
                  {rental.amount}
                </p>

                <span className="mt-2 inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
                  {rental.status}
                </span>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default RentalHistory;