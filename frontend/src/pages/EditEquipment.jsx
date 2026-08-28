import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditEquipment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    pricePerDay: "",
    location: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  // Load equipment
  useEffect(() => {
    const fetchEquipment = async () => {
      const token = localStorage.getItem("rentonToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/equipment/${id}`
        );

        const equipment = response.data;

        setFormData({
          name: equipment.name || "",
          description: equipment.description || "",
          category: equipment.category || "",
          pricePerDay: equipment.pricePerDay || "",
          location: equipment.location || "",
          image: equipment.image || "",
        });
      } catch (error) {
        console.error("Failed to load equipment:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load equipment."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("rentonToken");

    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await axios.put(
        `http://localhost:5000/api/equipment/${id}`,
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
        response.data.message ||
          "Equipment updated successfully."
      );

      setTimeout(() => {
        navigate("/my-equipment");
      }, 1000);
    } catch (error) {
      console.error("Update equipment error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update equipment."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Loading equipment...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">

        <Link
          to="/my-equipment"
          className="font-semibold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to My Equipment
        </Link>

        <div className="mt-8">
          <p className="font-semibold uppercase tracking-wide text-emerald-600">
            OWNER PANEL
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-800">
            Edit Equipment
          </h1>

          <p className="mt-3 text-slate-500">
            Update the details of your equipment listing.
          </p>
        </div>

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

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Name */}
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Equipment Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
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
                rows="5"
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
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
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
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

            {/* Price and Location */}
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
                  min="1"
                  step="1"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                  required
                />
              </div>

            </div>

            {/* Image */}
            <div>
              <label className="mb-2 block font-semibold text-slate-700">
                Image URL
              </label>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Preview */}
            {formData.image && (
              <div>
                <p className="mb-2 font-semibold text-slate-700">
                  Image Preview
                </p>

                <img
                  src={formData.image}
                  alt="Equipment preview"
                  className="h-64 w-full rounded-2xl object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
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
                disabled={saving}
                className="flex-1 rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditEquipment;