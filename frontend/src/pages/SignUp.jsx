import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function SignUp() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    role: "Customer",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  // Check password
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  // Check password length
  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,

        address1: formData.address1,
        address2: formData.address2,
        state: formData.state,
        district: formData.district,
        city: formData.city,
        pincode: formData.pincode,

        password: formData.password,
        role: formData.role,
      }
    );

    setSuccess(response.data.message);

    // Move to Sign In after successful registration
    setTimeout(() => {
      navigate("/signin");
    }, 1500);

  } catch (error) {
    setError(
      error.response?.data?.message ||
      "Registration failed. Please try again."
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 flex items-center justify-center px-6 py-20">

      <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid lg:grid-cols-2">

        {/* Left Side */}

        <div className="hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 p-14 text-white lg:flex lg:flex-col lg:justify-center">

          <h1 className="text-5xl font-bold leading-tight">
            Join Renton
          </h1>

          <p className="mt-6 text-lg leading-8 text-emerald-100">
            Create your account and start renting professional equipment with
            confidence.
          </p>

          <div className="mt-12 space-y-8">

            <div className="flex items-center gap-4">
              <span className="text-3xl">✔</span>
              <p>Verified Equipment Owners</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl">✔</span>
              <p>Fast & Secure Booking</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl">✔</span>
              <p>Affordable Daily Rentals</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl">✔</span>
              <p>24/7 Customer Support</p>
            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="p-10 md:p-14">

          <h2 className="text-4xl font-bold text-slate-800">
            Create Account
          </h2>

          <p className="mt-3 text-slate-500">
            Fill in your details to register.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">

            {/* Full Name */}

            <div>
              <label className="mb-2 block font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Muhammed Hasan"
                className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* Email */}

            <div>
              <label className="mb-2 block font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* Phone */}

            <div>
              <label className="mb-2 block font-medium">
                Mobile Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* Address */}

            <div>
              <label className="mb-2 block font-medium">
                Address Line 1
              </label>

              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                placeholder="House No, Street"
                className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Address Line 2
              </label>

              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                placeholder="Area / Landmark"
                className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* State & District */}

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-medium">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Kerala"
                  className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  District
                </label>

                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Malappuram"
                  className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

            </div>

            {/* City & Pincode */}

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-medium">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Perinthalmanna"
                  className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="679322"
                  className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

            </div>

            {/* Role */}

            <div>
              <label className="mb-2 block font-medium">
                Register As
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option>Customer</option>
                <option>Equipment Owner</option>
              </select>
            </div>

            {/* Password */}

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-medium">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

            </div>

            {/* Terms */}

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 accent-emerald-600"
                required
              />

              <span className="text-sm text-slate-600">
                I agree to the Terms & Conditions and Privacy Policy.
              </span>
            </label>
{error && (
  <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
    {error}
  </div>
)}

{success && (
  <div className="rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
    {success}
  </div>
)}
            {/* Button */}

<button
  type="submit"
  disabled={loading}
  className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Creating Account..." : "Create Account"}
</button>

          </form>

          <p className="mt-8 text-center text-slate-600">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Sign In
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}