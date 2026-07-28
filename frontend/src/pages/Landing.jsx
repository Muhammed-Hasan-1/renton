import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Landing() {
  const categories = [
    "Power Tools",
    "Construction",
    "Gardening",
    "Painting",
    "Electrical",
    "Cleaning",
  ];

  const equipments = [
    {
      name: "Cordless Drill",
      price: "₹300/day",
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600",
    },
    {
      name: "Angle Grinder",
      price: "₹250/day",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600",
    },
    {
      name: "Circular Saw",
      price: "₹350/day",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600",
    },
  ];

  return (
    <>
     

      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-50 to-lime-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-8 py-24 lg:flex-row">

          <div className="max-w-xl">

            <p className="mb-3 text-lg font-semibold text-emerald-600">
              Equipment Rental Platform
            </p>

            <h1 className="mb-6 text-6xl font-bold leading-tight text-slate-800">
              Rent Smarter.
              <br />
              Build Better.
            </h1>

            <p className="mb-8 text-lg text-slate-600">
              Find professional tools and equipment near you without spending
              thousands on buying them.
            </p>

            <div className="flex gap-5">
              <button className="rounded-xl bg-emerald-600 px-8 py-4 text-lg font-semibold text-white transition hover:scale-105 hover:bg-emerald-700">
                Browse Equipment
              </button>

              <button className="rounded-xl border-2 border-emerald-600 px-8 py-4 text-lg font-semibold text-emerald-700 transition hover:bg-emerald-100">
                Become a Lender
              </button>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900"
            alt="Construction Tools"
            className="mt-16 w-full max-w-xl rounded-3xl shadow-2xl transition duration-500 hover:scale-105 lg:mt-0"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 text-center md:grid-cols-4">

          <div>
            <h2 className="text-5xl font-bold text-emerald-600">500+</h2>
            <p className="mt-2 text-slate-600">Equipment</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-emerald-600">150+</h2>
            <p className="mt-2 text-slate-600">Owners</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-emerald-600">1200+</h2>
            <p className="mt-2 text-slate-600">Rentals</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-emerald-600">24/7</h2>
            <p className="mt-2 text-slate-600">Support</p>
          </div>

        </div>
      </section>

      {/* Categories */}
      <section className="bg-emerald-50 py-20">
        <div className="mx-auto max-w-7xl px-8">

          <h2 className="mb-12 text-center text-4xl font-bold">
            Equipment Categories
          </h2>

          <div className="grid gap-8 md:grid-cols-3">

            {categories.map((category) => (
              <div
                key={category}
                className="cursor-pointer rounded-2xl bg-white p-8 text-center shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
              >
                <h3 className="text-2xl font-semibold">{category}</h3>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Featured Equipment */}
      <section className="py-20">

        <div className="mx-auto max-w-7xl px-8">

          <h2 className="mb-12 text-center text-4xl font-bold">
            Featured Equipment
          </h2>

          <div className="grid gap-8 md:grid-cols-3">

            {equipments.map((item) => (
              <div
                key={item.name}
                className="overflow-hidden rounded-3xl bg-white shadow-xl transition hover:-translate-y-3 hover:shadow-2xl"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-64 w-full object-cover"
                />

                <div className="p-6">

                  <h3 className="text-2xl font-bold">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-lg text-emerald-600">
                    {item.price}
                  </p>

                  <button className="mt-6 w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700">
                    Rent Now
                  </button>

                </div>
              </div>
            ))}

          </div>

        </div>

      </section>

      {/* Why Choose Us */}
      <section className="bg-emerald-50 py-20">

        <div className="mx-auto max-w-7xl px-8">

          <h2 className="mb-12 text-center text-4xl font-bold">
            Why Choose Renton?
          </h2>

          <div className="grid gap-8 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h3 className="mb-3 text-2xl font-semibold">
                Verified Equipment
              </h3>

              <p>
                Every tool is checked before every rental.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h3 className="mb-3 text-2xl font-semibold">
                Secure Booking
              </h3>

              <p>
                Book safely with trusted owners.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h3 className="mb-3 text-2xl font-semibold">
                Affordable Prices
              </h3>

              <p>
                Save money by renting instead of buying.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="bg-emerald-700 py-20 text-center text-white">

        <h2 className="text-5xl font-bold">
          Ready to Rent?
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-lg text-emerald-100">
          Browse hundreds of professional tools and equipment today.
        </p>

        <button className="mt-10 rounded-xl bg-white px-10 py-4 text-lg font-semibold text-emerald-700 transition hover:scale-105">
          Get Started
        </button>

      </section>

    </>
  );
}