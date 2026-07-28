import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-gradient-to-b from-emerald-50 to-white py-24"
    >
      <div className="mx-auto max-w-7xl px-8">

        {/* Heading */}
        <div className="mb-16 text-center">
          <p className="text-lg font-semibold uppercase tracking-widest text-emerald-600">
            Contact Us
          </p>

          <h2 className="mt-3 text-5xl font-bold text-slate-800">
            We'd Love to Hear From You
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Have questions about renting equipment or becoming an equipment
            owner? Get in touch with our team and we'll help you.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">

          {/* Contact Info */}
          <div className="space-y-8">

            <div className="flex items-center gap-5 rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="rounded-full bg-emerald-100 p-5">
                <FaPhoneAlt className="text-2xl text-emerald-600" />
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-slate-800">
                  Phone
                </h3>

                <p className="text-slate-600">
                  +91 98765 43210
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="rounded-full bg-emerald-100 p-5">
                <FaEnvelope className="text-2xl text-emerald-600" />
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-slate-800">
                  Email
                </h3>

                <p className="text-slate-600">
                  support@renton.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="rounded-full bg-emerald-100 p-5">
                <FaMapMarkerAlt className="text-2xl text-emerald-600" />
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-slate-800">
                  Location
                </h3>

                <p className="text-slate-600">
                  Kerala, India
                </p>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="rounded-3xl bg-white p-10 shadow-2xl">

            <h3 className="mb-8 text-3xl font-bold text-slate-800">
              Send a Message
            </h3>

            <form className="space-y-6">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />

              <textarea
                rows="5"
                placeholder="Write your message..."
                className="w-full rounded-xl border border-gray-300 px-5 py-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              ></textarea>

              <button
                className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-xl"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
}