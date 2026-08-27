import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AddEquipment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    pricePerDay: "",
    location: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "Power Tools",
    "Construction",
    "Gardening",
    "Painting",
    "Electrical",
    "Cleaning",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("rentonToken");

    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/equipment",
        {
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          pricePerDay: Number(formData.pricePerDay),
          location: formData.location.trim(),
          image: formData.image.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        response.data.message || "Equipment added successfully."
      );

      setTimeout(() => {
        navigate("/my-equipment");
      }, 1000);
    } catch (error) {
      console.error("Add equipment error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to add equipment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <Link
          to="/my-equipment"
          className="font-semibold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to My Equipment
        </Link>

        {/* Header */}
        <div className="mt-8">
          <p className="font-semibold uppercase tracking-wide text-emerald-600">
            OWNER PANEL
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-800">
            Add Equipment
          </h1>

          <p className="mt-3 text-slate-500">
            Add a new piece of equipment to your Renton listing.
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg md:p-10">

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 font-medium text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl bg-emerald-50 p-4 font-medium text-emerald-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Equipment Name */}
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Equipment Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Cordless Drill"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the equipment, its condition and suitable uses..."
                rows="5"
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
                required
              >
                <option value="">
                  Select a category
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price + Location */}
            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Price Per Day (₹)
                </label>

                <input
                  type="number"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleChange}
                  placeholder="250"
                  min="1"
                  step="1"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Kochi"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  required
                />
              </div>

            </div>

            {/* Image URL */}
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Image URL
              </label>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/equipment.jpg"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                required
              />

              <p className="mt-2 text-sm text-slate-500">
                Use a direct image URL for the equipment.
              </p>
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div>
                <p className="mb-2 font-semibold text-slate-700">
                  Image Preview
                </p>

                <img
                  src={formData.image}
                  alt="Equipment preview"
                  className="h-64 w-full rounded-2xl object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">

              <Link
                to="/my-equipment"
                className="flex-1 rounded-xl border-2 border-slate-300 px-6 py-4 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Adding Equipment..."
                  : "Add Equipment"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEquipment;