import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function OwnerRentalRequests() {
  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRentalRequests = async () => {
      const token = localStorage.getItem("rentonToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/rentals/owner",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRentals(response.data);

      } catch (error) {
        console.error(
          "Failed to load rental requests:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load rental requests."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchRentalRequests();
  }, [navigate]);


  const handleStatusChange = async (
    rentalId,
    newStatus
  ) => {
    const token =
      localStorage.getItem("rentonToken");

    if (!token) {
      navigate("/signin");
      return;
    }

    const action =
      newStatus === "confirmed"
        ? "approve"
        : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this rental request?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(rentalId);
      setError("");
      setSuccess("");

      const response = await axios.patch(
        `http://localhost:5000/api/rentals/${rentalId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRentals((previous) =>
        previous.map((rental) =>
          rental._id === rentalId
            ? response.data.rental
            : rental
        )
      );

      setSuccess(
        response.data.message ||
          "Rental request updated successfully."
      );

    } catch (error) {
      console.error(
        "Rental status update error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update rental request."
      );

    } finally {
      setProcessingId(null);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Loading rental requests...
        </h1>
      </div>
    );
  }


  const pendingRentals = rentals.filter(
    (rental) => rental.status === "pending"
  );

  const processedRentals = rentals.filter(
    (rental) => rental.status !== "pending"
  );


  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>
            <p className="font-semibold uppercase tracking-wide text-emerald-600">
              OWNER PANEL
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-800">
              Rental Requests
            </h1>

            <p className="mt-3 text-slate-500">
              Review and manage rental requests for your equipment.
            </p>
          </div>

          <Link
            to="/my-equipment"
            className="rounded-xl border-2 border-emerald-600 px-6 py-3 text-center font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            My Equipment
          </Link>
        </div>


        {/* Messages */}
        {error && (
          <div className="mt-8 rounded-xl bg-red-50 p-4 font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-8 rounded-xl bg-emerald-50 p-4 font-medium text-emerald-700">
            {success}
          </div>
        )}


        {/* Pending Requests */}
        <section className="mt-10">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Pending Requests
            </h2>

            <p className="mt-1 text-slate-500">
              Requests waiting for your approval.
            </p>
          </div>


          {pendingRentals.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

              <div className="text-5xl">
                📭
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-800">
                No pending requests
              </h3>

              <p className="mt-2 text-slate-500">
                New customer requests will appear here.
              </p>

            </div>
          ) : (
            <div className="grid gap-6">

              {pendingRentals.map((rental) => (
                <div
                  key={rental._id}
                  className="rounded-3xl bg-white p-6 shadow-lg"
                >

                  <div className="flex flex-col gap-6 lg:flex-row">

                    {/* Equipment */}
                    <div className="flex gap-5 lg:w-1/2">

                      <img
                        src={rental.equipment?.image}
                        alt={
                          rental.equipment?.name ||
                          "Equipment"
                        }
                        className="h-28 w-28 rounded-2xl object-cover"
                      />

                      <div>
                        <p className="font-semibold text-emerald-600">
                          {rental.equipment?.category ||
                            "Equipment"}
                        </p>

                        <h3 className="mt-1 text-2xl font-bold text-slate-800">
                          {rental.equipment?.name ||
                            "Equipment"}
                        </h3>

                        <p className="mt-2 text-slate-500">
                          📍 {rental.equipment?.location ||
                            "Location unavailable"}
                        </p>
                      </div>

                    </div>


                    {/* Customer */}
                    <div className="lg:w-1/4">

                      <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                        Customer
                      </p>

                      <p className="mt-2 font-bold text-slate-800">
                        {rental.customer?.name ||
                          "Unknown customer"}
                      </p>

                      <p className="mt-1 text-slate-500">
                        {rental.customer?.email ||
                          "No email"}
                      </p>

                      {rental.customer?.phone && (
                        <p className="mt-1 text-slate-500">
                          {rental.customer.phone}
                        </p>
                      )}

                    </div>


                    {/* Dates */}
                    <div className="lg:w-1/4">

                      <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                        Rental
                      </p>

                      <p className="mt-2 text-slate-700">
                        📅{" "}
                        {new Date(
                          rental.startDate
                        ).toLocaleDateString()}
                      </p>

                      <p className="mt-1 text-slate-700">
                        ↩️{" "}
                        {new Date(
                          rental.endDate
                        ).toLocaleDateString()}
                      </p>

                      <p className="mt-2 font-bold text-emerald-600">
                        ₹{rental.totalAmount}
                      </p>

                    </div>

                  </div>


                  {/* Actions */}
                  <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          rental._id,
                          "confirmed"
                        )
                      }
                      disabled={
                        processingId === rental._id
                      }
                      className="flex-1 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {processingId === rental._id
                        ? "Processing..."
                        : "Approve Rental"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          rental._id,
                          "cancelled"
                        )
                      }
                      disabled={
                        processingId === rental._id
                      }
                      className="flex-1 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {processingId === rental._id
                        ? "Processing..."
                        : "Reject Rental"}
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>


        {/* Processed Requests */}
        {processedRentals.length > 0 && (
          <section className="mt-14">

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Request History
              </h2>

              <p className="mt-1 text-slate-500">
                Previously processed rental requests.
              </p>
            </div>


            <div className="grid gap-4">

              {processedRentals.map((rental) => (
                <div
                  key={rental._id}
                  className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm md:flex-row md:items-center"
                >

                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {rental.equipment?.name ||
                        "Equipment"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Customer:{" "}
                      {rental.customer?.name ||
                        "Unknown"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(
                        rental.startDate
                      ).toLocaleDateString()}
                      {" → "}
                      {new Date(
                        rental.endDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-left md:text-right">

                    <p className="font-bold text-emerald-600">
                      ₹{rental.totalAmount}
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-4 py-1 text-sm font-semibold capitalize ${
                        rental.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {rental.status}
                    </span>

                  </div>

                </div>
              ))}

            </div>

          </section>
        )}

      </div>
    </div>
  );
}

export default OwnerRentalRequests;