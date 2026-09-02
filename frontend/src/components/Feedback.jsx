import { useEffect, useState } from "react";
import axios from "axios";

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [myFeedback, setMyFeedback] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("rentonToken");

    if (token) {
      loadMyFeedback();
      loadUserDetails();
    }
  }, []);

  const loadUserDetails = () => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("rentonUser") || "{}"
      );

      setFormData((prev) => ({
        ...prev,
        name: storedUser.name || "",
        email: storedUser.email || "",
      }));
    } catch (err) {
      console.error("Failed to load user details:", err);
    }
  };

  const loadMyFeedback = async () => {
    try {
      const token = localStorage.getItem("rentonToken");

      if (!token) {
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/feedback/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMyFeedback(response.data.feedback || []);
    } catch (err) {
      console.error("Failed to load feedback:", err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSubmitted(false);
    setError("");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitted(false);
    setError("");

    const token = localStorage.getItem("rentonToken");

    if (!token) {
      setError("Please sign in before submitting feedback.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/feedback",
        {
          rating: formData.rating,
          message: formData.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubmitted(true);

      setFormData((prev) => ({
        ...prev,
        rating: "",
        message: "",
      }));

      setMyFeedback((prev) => [
        response.data.feedback,
        ...prev,
      ]);
    } catch (err) {
      console.error("Feedback submission error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to submit feedback. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-semibold uppercase tracking-wider text-emerald-600">
            Renton Feedback
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-800 md:text-5xl">
            We'd love to hear from you
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Your feedback helps us improve the Renton equipment rental
            experience.
          </p>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl bg-white p-8 shadow-lg md:p-10">
            <h2 className="text-2xl font-bold text-slate-800">
              Share your experience
            </h2>

            <p className="mt-2 text-slate-500">
              Tell us what you think about Renton.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  readOnly
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-600 outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-600 outline-none"
                />
              </div>

              {/* Rating */}
              <div>
                <label
                  htmlFor="rating"
                  className="mb-2 block font-semibold text-slate-700"
                >
                  How would you rate Renton?
                </label>

                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Select a rating</option>
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Very Good</option>
                  <option value="3">⭐⭐⭐ Good</option>
                  <option value="2">⭐⭐ Needs Improvement</option>
                  <option value="1">⭐ Poor</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block font-semibold text-slate-700"
                >
                  Your Feedback
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your experience..."
                  rows="6"
                  required
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white transition hover:bg-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>

              {/* Success */}
              {submitted && (
                <div className="rounded-xl bg-emerald-50 p-4 text-center font-medium text-emerald-700">
                  Thank you! Your feedback has been submitted successfully.
                </div>
              )}
            </form>
          </div>

          {/* Previous Feedback */}
          {myFeedback.length > 0 && (
            <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg md:p-10">
              <h2 className="text-2xl font-bold text-slate-800">
                Your Previous Feedback
              </h2>

              <div className="mt-6 space-y-5">
                {myFeedback.map((feedback) => (
                  <div
                    key={feedback._id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="font-semibold text-emerald-700">
                        {"⭐".repeat(feedback.rating)}
                      </div>

                      <div className="text-sm text-slate-400">
                        {new Date(
                          feedback.createdAt
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="mt-3 leading-7 text-slate-600">
                      {feedback.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Feedback;