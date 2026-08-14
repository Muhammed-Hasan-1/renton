import { Link } from "react-router-dom";

function Booking() {
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

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-semibold">
                Equipment
              </label>

              <select className="w-full rounded-xl border border-slate-300 px-4 py-3">
                <option>Select equipment</option>
                <option>Cordless Drill</option>
                <option>Angle Grinder</option>
                <option>Circular Saw</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Location
              </label>

              <input
                type="text"
                placeholder="Enter location"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Start Date
              </label>

              <input
                type="date"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                End Date
              </label>

              <input
                type="date"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

          </div>

          <Link
            to="/equipment"
            className="mt-8 inline-block rounded-xl bg-emerald-600 px-8 py-4 font-semibold text-white transition hover:bg-emerald-700"
          >
            Browse Equipment
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Booking;