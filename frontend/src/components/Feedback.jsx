import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Rahul Menon",
    role: "Civil Contractor",
    rating: 5,
    comment:
      "Renton saved us from buying expensive construction equipment. The booking process was smooth and the tools were in excellent condition.",
    image: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 2,
    name: "Anjali Nair",
    role: "Homeowner",
    rating: 5,
    comment:
      "I rented a pressure washer for a weekend project. Affordable pricing, easy pickup, and excellent customer service.",
    image: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 3,
    name: "Arjun Thomas",
    role: "Electrician",
    rating: 4,
    comment:
      "The equipment was well maintained and available exactly when I needed it. Highly recommended for professionals.",
    image: "https://i.pravatar.cc/150?img=15",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-white to-emerald-50 py-24">
      <div className="mx-auto max-w-7xl px-8">

        <div className="text-center">
          <p className="font-semibold uppercase tracking-[4px] text-emerald-600">
            Testimonials
          </p>

          <h2 className="mt-4 text-5xl font-bold text-slate-800">
            What Our Customers Say
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Trusted by homeowners, contractors, and professionals across India.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {testimonials.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
            >
              <div className="flex items-center gap-4">

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-full border-4 border-emerald-100 object-cover transition duration-500 group-hover:scale-110"
                />

                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {item.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {item.role}
                  </p>
                </div>

              </div>

              <div className="mt-6 flex gap-1">

                {[...Array(item.rating)].map((_, index) => (
                  <FaStar
                    key={index}
                    className="text-yellow-400"
                  />
                ))}

              </div>

              <p className="mt-6 leading-8 text-slate-600">
                "{item.comment}"
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}