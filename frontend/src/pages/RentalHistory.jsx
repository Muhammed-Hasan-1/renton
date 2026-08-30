import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function RentalHistory() {
  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ======================================================
  // FETCH CUSTOMER RENTALS
  // ======================================================

  useEffect(() => {
    const fetchRentals = async () => {
      const token =
        localStorage.getItem("rentonToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/rentals/my",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setRentals(response.data);

      } catch (error) {
        console.error(
          "Failed to fetch rental history:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load your rental history."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [navigate]);


  // ======================================================
  // STATUS STYLE
  // ======================================================

  const getStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "active":
        return "bg-emerald-100 text-emerald-700";

      case "completed":
        return "bg-slate-100 text-slate-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };


  // ======================================================
  // STATUS DESCRIPTION
  // ======================================================

  const getStatusMessage = (status) => {
    switch (status) {
      case "pending":
        return "Waiting for owner approval";

      case "confirmed":
        return "Booking approved";

      case "active":
        return "Equipment is currently rented";

      case "completed":
        return "Equipment returned successfully";

      case "cancelled":
        return "Rental request was rejected";

      default:
        return "";
    }
  };


  // ======================================================
  // LOADING
  // ======================================================

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


  // ======================================================
  // ERROR
  // ======================================================

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

        {/* Header */}

        <p className="font-semibold text-emerald-600">
          RENTON
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-800">
          Rental History
        </h1>

        <p className="mt-3 text-slate-600">
          Track your equipment rentals from booking to return.
        </p>


        {/* Empty */}

        {rentals.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-12 text-center shadow-md">

            <div className="text-5xl">
              📋
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-800">
              No rentals found
            </h2>

            <p className="mt-3 text-slate-500">
              You have not rented any equipment yet.
            </p>

            <Link
              to="/equipment"
              className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Browse Equipment
            </Link>

          </div>
        ) : (

          <div className="mt-10 grid gap-6">

            {rentals.map((rental) => (

              <div
                key={rental._id}
                className="rounded-3xl bg-white p-6 shadow-md"
              >

                <div className="flex flex-col justify-between gap-6 md:flex-row">

                  {/* Equipment */}

                  <div className="flex items-center gap-5">

                    {rental.equipment?.image && (
                      <img
                        src={
                          rental.equipment.image
                        }
                        alt={
                          rental.equipment.name
                        }
                        className="h-24 w-24 rounded-2xl object-cover"
                      />
                    )}

                    <div>

                      <h2 className="text-xl font-bold text-slate-800">
                        {rental.equipment?.name ||
                          "Equipment"}
                      </h2>

                      <p className="mt-2 text-slate-500">
                        {new Date(
                          rental.startDate
                        ).toLocaleDateString()}
                        {" → "}
                        {new Date(
                          rental.endDate
                        ).toLocaleDateString()}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {rental.totalDays} day
                        {rental.totalDays !== 1
                          ? "s"
                          : ""}
                        {" · "}
                        {rental.equipment?.category ||
                          "Equipment"}
                      </p>

                    </div>

                  </div>


                  {/* Amount */}

                  <div className="md:text-right">

                    <p className="text-xl font-bold text-emerald-600">
                      ₹{rental.totalAmount}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      ₹{rental.pricePerDay}/day
                    </p>

                  </div>

                </div>


                {/* Status */}

                <div className="mt-6 border-t border-slate-200 pt-5">

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                        Rental Status
                      </p>

                      <span
                        className={`mt-2 inline-block rounded-full px-4 py-2 text-sm font-bold capitalize ${getStatusClasses(
                          rental.status
                        )}`}
                      >
                        {rental.status}
                      </span>

                    </div>

                    <p className="text-sm text-slate-500 sm:text-right">
                      {getStatusMessage(
                        rental.status
                      )}
                    </p>

                  </div>

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