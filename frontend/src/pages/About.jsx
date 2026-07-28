import {
  FaTools,
  FaUsers,
  FaShieldAlt,
  FaLeaf,
  FaHandshake,
  FaBullseye,
} from "react-icons/fa";

export default function About() {
  return (
    <div className="overflow-hidden">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-lime-500 py-32">

        {/* Background circles */}
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-lime-300/20 blur-3xl animate-pulse"></div>

        <div className="relative mx-auto max-w-7xl px-8 text-center">

          <p className="mb-4 text-xl font-semibold uppercase tracking-[6px] text-lime-200">
            About Renton
          </p>

          <h1 className="mb-8 text-6xl font-black text-white md:text-7xl">
            Rent Smarter.
            <br />
            Build Better.
          </h1>

          <p className="mx-auto max-w-3xl text-xl leading-9 text-emerald-100">
            Making professional equipment accessible, affordable and available
            whenever you need it.
          </p>

        </div>

      </section>

      {/* About */}
      <section className="bg-white py-24">

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-8 lg:grid-cols-2">

          <div>

            <span className="rounded-full bg-emerald-100 px-5 py-2 font-semibold text-emerald-700">
              WHO WE ARE
            </span>

            <h2 className="mt-6 text-5xl font-bold text-slate-800">
              Equipment Rental Made Easy
            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-600">
              Renton helps customers rent professional equipment without
              purchasing expensive tools. We connect trusted owners with people
              who need quality equipment for construction, gardening,
              renovation, painting, and DIY projects.
            </p>

            <p className="mt-6 text-lg leading-9 text-slate-600">
              Our platform provides secure bookings, real-time availability,
              affordable pricing, and a seamless rental experience.
            </p>

          </div>

          <div className="group">

            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356df?w=900"
              alt=""
              className="rounded-3xl shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
            />

          </div>

        </div>

      </section>

      {/* Mission Vision */}

      <section className="bg-emerald-50 py-24">

        <div className="mx-auto grid max-w-7xl gap-10 px-8 md:grid-cols-2">

          <div className="group rounded-3xl bg-white p-10 shadow-lg transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl">

            <FaBullseye className="mb-6 text-6xl text-emerald-600 transition group-hover:rotate-12" />

            <h2 className="mb-4 text-3xl font-bold">
              Our Mission
            </h2>

            <p className="leading-8 text-slate-600">
              Simplify equipment rentals through technology while reducing
              unnecessary equipment purchases.
            </p>

          </div>

          <div className="group rounded-3xl bg-white p-10 shadow-lg transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl">

            <FaLeaf className="mb-6 text-6xl text-emerald-600 transition group-hover:rotate-12" />

            <h2 className="mb-4 text-3xl font-bold">
              Our Vision
            </h2>

            <p className="leading-8 text-slate-600">
              Build India's most trusted and sustainable equipment sharing
              community.
            </p>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="py-24">

        <div className="mx-auto max-w-7xl px-8">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-[4px] text-emerald-600">
              Why Renton
            </p>

            <h2 className="mt-4 text-5xl font-bold">
              Why Choose Us?
            </h2>

          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                icon: <FaTools />,
                title: "Premium Equipment",
                text: "Verified and maintained tools.",
              },
              {
                icon: <FaShieldAlt />,
                title: "Secure Booking",
                text: "Protected and trusted rentals.",
              },
              {
                icon: <FaUsers />,
                title: "Trusted Community",
                text: "Thousands of happy customers.",
              },
              {
                icon: <FaHandshake />,
                title: "Affordable",
                text: "Save money by renting.",
              },
            ].map((item, index) => (

              <div
                key={index}
                className="group rounded-3xl bg-white p-10 shadow-lg transition-all duration-500 hover:-translate-y-5 hover:bg-emerald-600 hover:text-white hover:shadow-2xl"
              >

                <div className="mb-6 text-6xl text-emerald-600 transition-all duration-500 group-hover:scale-125 group-hover:text-white">
                  {item.icon}
                </div>

                <h3 className="mb-4 text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="leading-8 text-slate-600 group-hover:text-emerald-100">
                  {item.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Statistics */}

      <section className="bg-gradient-to-r from-emerald-700 to-green-800 py-24">

        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-8 text-center text-white md:grid-cols-4">

          {[
            ["500+", "Equipment"],
            ["150+", "Owners"],
            ["1200+", "Rentals"],
            ["24/7", "Support"],
          ].map((item, index) => (

            <div
              key={index}
              className="rounded-3xl border border-white/20 bg-white/10 p-10 backdrop-blur-lg transition duration-500 hover:-translate-y-3 hover:bg-white/20"
            >

              <h2 className="text-6xl font-black text-lime-300">
                {item[0]}
              </h2>

              <p className="mt-4 text-xl">
                {item[1]}
              </p>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}