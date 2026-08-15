import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function RentEquipment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [totalDays, setTotalDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // ===============================
  // GET EQUIPMENT
  // ===============================

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/equipment/${id}`
        );

        setEquipment(response.data);

      } catch (error) {
        console.error(
          "Failed to load equipment:",
          error
        );

        setError(
          "Unable to load equipment."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);


  // ===============================
  // CALCULATE PRICE
  // ===============================

  useEffect(() => {
    if (!startDate || !endDate || !equipment) {
      setTotalDays(0);
      setTotalAmount(0);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setTotalDays(0);
      setTotalAmount(0);
      return;
    }

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const days =
      Math.ceil(
        (end - start) /
          millisecondsPerDay
      ) || 1;

    setTotalDays(days);

    setTotalAmount(
      days * equipment.pricePerDay
    );

  }, [
    startDate,
    endDate,
    equipment,
  ]);


  // ===============================
  // SUBMIT BOOKING
  // ===============================

  const handleBooking = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token =
      localStorage.getItem(
        "rentonToken"
      );

    if (!token) {
      navigate("/signin");
      return;
    }

    if (!startDate || !endDate) {
      setError(
        "Please select both rental dates."
      );
      return;
    }

    if (totalDays <= 0) {
      setError(
        "Please select valid rental dates."
      );
      return;
    }

    try {
      setBooking(true);

      const response =
        await axios.post(
          "http://localhost:5000/api/rentals",
          {
            equipmentId: id,
            startDate,
            endDate,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setSuccess(
        response.data.message
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Booking failed."
      );

    } finally {
      setBooking(false);
    }
  };


  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Loading...
        </h1>
      </div>
    );
  }


  // ===============================
  // ERROR
  // ===============================

  if (!equipment) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">

        <h1 className="text-3xl font-bold text-slate-800">
          Equipment not found
        </h1>

        <Link
          to="/equipment"
          className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white"
        >
          Back to Equipment
        </Link>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 py-16">

      <div className="mx-auto max-w-5xl px-8">

        <Link
          to={`/equipment/${equipment._id}`}
          className="mb-8 inline-block font-semibold text-emerald-600"
        >
          ← Back to Details
        </Link>


        <div className="grid gap-8 md:grid-cols-2">


          {/* EQUIPMENT SUMMARY */}

          <div className="overflow-hidden rounded-3xl bg-white shadow-lg">

            <img
              src={equipment.image}
              alt={equipment.name}
              className="h-80 w-full object-cover"
            />

            <div className="p-7">

              <p className="font-semibold text-emerald-600">
                {equipment.category}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-800">
                {equipment.name}
              </h1>

              <p className="mt-3 text-slate-500">
                📍 {equipment.location}
              </p>

              <p className="mt-6 text-2xl font-bold text-emerald-600">
                ₹{equipment.pricePerDay}
                <span className="text-base font-medium text-slate-500">
                  /day
                </span>
              </p>

            </div>

          </div>


          {/* BOOKING FORM */}

          <div className="rounded-3xl bg-white p-8 shadow-lg">

            <h2 className="text-2xl font-bold text-slate-800">
              Rent this equipment
            </h2>

            <p className="mt-2 text-slate-500">
              Select your rental dates.
            </p>


            {error && (
              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}


            {success && (
              <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                {success}
              </div>
            )}


            <form
              onSubmit={handleBooking}
              className="mt-8 space-y-6"
            >

              <div>

                <label className="mb-2 block font-semibold text-slate-700">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(
                      e.target.value
                    )
                  }
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  required
                />

              </div>


              <div>

                <label className="mb-2 block font-semibold text-slate-700">
                  End Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(
                      e.target.value
                    )
                  }
                  min={
                    startDate ||
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  required
                />

              </div>


              {/* PRICE SUMMARY */}

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Price per day
                  </span>

                  <span className="font-semibold">
                    ₹{equipment.pricePerDay}
                  </span>

                </div>


                <div className="mt-3 flex justify-between">

                  <span className="text-slate-500">
                    Rental days
                  </span>

                  <span className="font-semibold">
                    {totalDays}
                  </span>

                </div>


                <div className="mt-4 border-t border-slate-200 pt-4">

                  <div className="flex justify-between">

                    <span className="font-bold text-slate-800">
                      Total
                    </span>

                    <span className="text-xl font-bold text-emerald-600">
                      ₹{totalAmount}
                    </span>

                  </div>

                </div>

              </div>


              <button
                type="submit"
                disabled={booking}
                className="w-full rounded-xl bg-emerald-600 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {booking
                  ? "Creating Booking..."
                  : "Confirm Rental"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RentEquipment;