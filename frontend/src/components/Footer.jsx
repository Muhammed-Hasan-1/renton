import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-800 text-white">
      <div className="mx-auto max-w-7xl px-8 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-emerald-700 shadow-lg transition-all duration-500 hover:scale-110 hover:rotate-6">
                R
              </div>

              <div>
                <h1 className="text-3xl font-bold">Renton</h1>
                <p className="text-sm text-emerald-100">
                  Equipment Rental System
                </p>
              </div>
            </div>

            <p className="mt-6 leading-7 text-emerald-100">
              Renton is your trusted platform for renting tools and equipment.
              Book equipment online with ease and manage rentals efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Quick Links</h2>

            <ul className="space-y-4">
              <li>
                <Link
                  className="transition-all duration-300 hover:translate-x-2 hover:text-lime-300"
                  to="/"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  className="transition-all duration-300 hover:translate-x-2 hover:text-lime-300"
                  to="/equipment"
                >
                  Equipment
                </Link>
              </li>

              <li>
                <Link
                  className="transition-all duration-300 hover:translate-x-2 hover:text-lime-300"
                  to="/categories"
                >
                  Categories
                </Link>
              </li>

              <li>
                <Link
                  className="transition-all duration-300 hover:translate-x-2 hover:text-lime-300"
                  to="/about"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  className="transition-all duration-300 hover:translate-x-2 hover:text-lime-300"
                  to="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Services</h2>

            <ul className="space-y-4 text-emerald-100">
              <li>
                <Link
                  to="/equipment"
                  className="inline-block text-emerald-100 transition-all duration-300 hover:translate-x-2 hover:text-lime-300"
                >
                  Tool Rental
                </Link>
              </li>

              <li>
                <Link
                  to="/booking"
                  className="inline-block text-emerald-100 transition-all duration-300 hover:translate-x-2 hover:text-lime-300"
                >
                  Equipment Booking
                </Link>
              </li>

              <li>
                <Link
                  to="/inventory"
                  className="inline-block text-emerald-100 transition-all duration-300 hover:translate-x-2 hover:text-lime-300"
                >
                  Inventory Management
                </Link>
              </li>

              <li>
                <Link
                  to="/rental-history"
                  className="inline-block text-emerald-100 transition-all duration-300 hover:translate-x-2 hover:text-lime-300"
                >
                  Rental History
                </Link>
              </li>

              <li>
                <Link
                  to="/maintenance"
                  className="inline-block text-emerald-100 transition-all duration-300 hover:translate-x-2 hover:text-lime-300"
                >
                  Maintenance Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold">Contact</h2>

            <div className="space-y-4 text-emerald-100">
              <p>📍 Kerala, India</p>

              <p>📧 support@renton.com</p>

              <p>📞 +91 98765 43210</p>
            </div>

            {/* Social */}
            <div className="mt-8 flex gap-4">
              <button className="rounded-full bg-white/10 p-3 transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:bg-lime-400 hover:text-emerald-900">
                🌐
              </button>

              <button className="rounded-full bg-white/10 p-3 transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:bg-lime-400 hover:text-emerald-900">
                📘
              </button>

              <button className="rounded-full bg-white/10 p-3 transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:bg-lime-400 hover:text-emerald-900">
                📷
              </button>

              <button className="rounded-full bg-white/10 p-3 transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:bg-lime-400 hover:text-emerald-900">
                💼
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-emerald-500 pt-8">
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            <p className="text-emerald-100">
              © {new Date().getFullYear()} Renton. All rights reserved.
            </p>

            <div className="flex gap-8">
              <Link className="transition hover:text-lime-300" to="/privacy">
                Privacy Policy
              </Link>

              <Link className="transition hover:text-lime-300" to="/terms">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
