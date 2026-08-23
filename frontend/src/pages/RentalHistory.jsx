import { useEffect, useState } from "react";
import axios from "axios";

function RentalHistory() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("rentonToken");

        if (!token) {
          setError("Please sign in to view your rental history.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/rentals/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRentals(response.data);
      } catch (error) {
        console.error("Failed to fetch rental history:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your rental history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Loading rental history...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-2xl font-bold text-red-600">
            {error}
          </h1>
        </div>
      </div>
    );
  }

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
          View all your equipment rentals.
        </p>

        {rentals.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-md">
            <h2 className="text-2xl font-bold text-slate-800">
              No rentals found
            </h2>

            <p className="mt-3 text-slate-500">
              You have not rented any equipment yet.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6">

            {rentals.map((rental) => (
              <div
                key={rental._id}
                className="flex flex-col justify-between gap-5 rounded-2xl bg-white p-6 shadow-md md:flex-row md:items-center"
              >

                <div className="flex items-center gap-5">

                  {rental.equipment?.image && (
                    <img
                      src={rental.equipment.image}
                      alt={rental.equipment.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  )}

                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {rental.equipment?.name || "Equipment"}
                    </h2>

                    <p className="mt-2 text-slate-500">
                      {new Date(rental.startDate).toLocaleDateString()}
                      {" → "}
                      {new Date(rental.endDate).toLocaleDateString()}
                      {" · "}
                      {rental.totalDays} day
                      {rental.totalDays !== 1 ? "s" : ""}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {rental.equipment?.category || "Equipment"} · ₹
                      {rental.pricePerDay}/day
                    </p>
                  </div>

                </div>

                <div className="md:text-right">

                  <p className="text-xl font-bold text-emerald-600">
                    ₹{rental.totalAmount}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold capitalize text-emerald-700">
                    {rental.status}
                  </span>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default RentalHistory;