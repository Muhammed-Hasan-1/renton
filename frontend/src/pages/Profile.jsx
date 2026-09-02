import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
  });

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("rentonToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = response.data.user;

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address1: user.address?.address1 || "",
        address2: user.address?.address2 || "",
        state: user.address?.state || "",
        district: user.address?.district || "",
        city: user.address?.city || "",
        pincode: user.address?.pincode || "",
      });

      setRole(user.role || "");
    } catch (err) {
      console.error("Profile loading error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("rentonToken");
        localStorage.removeItem("rentonUser");
        navigate("/signin");
        return;
      }

      setError(
        err.response?.data?.message || "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("rentonToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/users/me",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;

      // Keep localStorage user information in sync
      const storedUser = JSON.parse(
        localStorage.getItem("rentonUser") || "{}"
      );

      const updatedLocalUser = {
        ...storedUser,
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      };

      localStorage.setItem(
        "rentonUser",
        JSON.stringify(updatedLocalUser)
      );

      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        address1: updatedUser.address?.address1 || "",
        address2: updatedUser.address?.address2 || "",
        state: updatedUser.address?.state || "",
        district: updatedUser.address?.district || "",
        city: updatedUser.address?.city || "",
        pincode: updatedUser.address?.pincode || "",
      });

      setRole(updatedUser.role || "");

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("rentonToken");
        localStorage.removeItem("rentonUser");
        navigate("/signin");
        return;
      }

      setError(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg font-semibold text-slate-600">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-700 text-3xl font-bold text-white shadow-xl">
            {formData.name
              ? formData.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <h1 className="text-4xl font-extrabold text-slate-800">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500">
            View and update your Renton account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-emerald-100/60">
          {/* Top section */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-700 px-8 py-7 text-white">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  Account Information
                </h2>
                <p className="mt-1 text-emerald-100">
                  Keep your personal details up to date
                </p>
              </div>

              <div className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold capitalize backdrop-blur">
                {role || "user"}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Messages */}
            {message && (
              <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-medium text-emerald-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="mb-5 text-xl font-bold text-slate-800">
                Personal Information
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="mb-8">
              <h3 className="mb-5 text-xl font-bold text-slate-800">
                Address Information
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block font-semibold text-slate-700">
                    Address Line 1
                  </label>

                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block font-semibold text-slate-700">
                    Address Line 2
                  </label>

                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    District
                  </label>

                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-slate-800">
                    Account Role
                  </p>
                  <p className="text-sm text-slate-500">
                    Your account role cannot be changed from your
                    profile.
                  </p>
                </div>

                <span className="w-fit rounded-full bg-emerald-100 px-4 py-2 font-semibold capitalize text-emerald-700">
                  {role || "user"}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                Back to Dashboard
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}