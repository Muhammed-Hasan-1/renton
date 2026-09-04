import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminFeedback() {
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState([]);
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("rentonToken");

      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/feedback/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeedback(response.data.feedback || []);
    } catch (error) {
      console.error("Load admin feedback error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("rentonToken");
        localStorage.removeItem("rentonUser");
        navigate("/signin");
        return;
      }

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to view all feedback."
        );
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load feedback"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const filteredFeedback =
    filter === "all"
      ? feedback
      : feedback.filter(
          (item) => String(item.rating) === filter
        );

  const handleDelete = async (feedbackId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(feedbackId);
      setError("");

      const token = localStorage.getItem("rentonToken");

      await axios.delete(
        `http://localhost:5000/api/feedback/${feedbackId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeedback((prev) =>
        prev.filter((item) => item._id !== feedbackId)
      );
    } catch (error) {
      console.error("Delete feedback error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete feedback"
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-700 to-green-600 px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100">
            ADMINISTRATION
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Feedback Management
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-emerald-50">
            Review feedback submitted by Renton users.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Filter */}
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                FEEDBACK
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                {filteredFeedback.length} submission
                {filteredFeedback.length !== 1 ? "s" : ""}
              </h2>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-600">
              Loading feedback...
            </p>
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">💬</div>

            <h2 className="mt-4 text-2xl font-bold text-slate-800">
              No feedback found
            </h2>

            <p className="mt-2 text-slate-500">
              There are no feedback submissions matching the
              selected filter.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredFeedback.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl bg-white p-6 shadow-sm transition hover:shadow-md md:p-8"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <h3 className="text-xl font-bold text-slate-800">
                        {item.name || "Unknown User"}
                      </h3>

                      <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold capitalize text-emerald-700">
                        {item.user?.role || "user"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.email}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <span className="text-xl">
                        {"⭐".repeat(item.rating)}
                      </span>

                      <span className="text-sm font-semibold text-slate-500">
                        {item.rating}/5
                      </span>

                      <span className="text-sm text-slate-400">
                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleDateString()
                          : "Unknown date"}
                      </span>
                    </div>

                    <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                      <p className="leading-7 text-slate-600">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleDelete(item._id)
                    }
                    disabled={deletingId === item._id}
                    className="w-full rounded-xl border border-red-300 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
                  >
                    {deletingId === item._id
                      ? "Deleting..."
                      : "Delete Feedback"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-white"
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}