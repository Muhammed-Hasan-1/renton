import { useState } from "react";

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Feedback submitted:", formData);

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      rating: "",
      message: "",
    });
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
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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

                  <option value="">
                    Select a rating
                  </option>

                  <option value="5">
                    ⭐⭐⭐⭐⭐ Excellent
                  </option>

                  <option value="4">
                    ⭐⭐⭐⭐ Very Good
                  </option>

                  <option value="3">
                    ⭐⭐⭐ Good
                  </option>

                  <option value="2">
                    ⭐⭐ Needs Improvement
                  </option>

                  <option value="1">
                    ⭐ Poor
                  </option>

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


              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white transition hover:bg-emerald-700 hover:shadow-lg"
              >
                Submit Feedback
              </button>


              {/* Success */}
              {submitted && (
                <div className="rounded-xl bg-emerald-50 p-4 text-center font-medium text-emerald-700">
                  Thank you! Your feedback has been submitted successfully.
                </div>
              )}

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Feedback;