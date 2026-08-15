const mongoose = require("mongoose");
require("dotenv").config();

const Equipment = require("./models/Equipment");

const equipments = [
  {
    name: "Cordless Drill",
    category: "Power Tools",
    pricePerDay: 300,
    location: "Kochi",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=900",
    description:
      "A powerful cordless drill suitable for home repairs, furniture work and DIY projects.",
  },

  {
    name: "Angle Grinder",
    category: "Power Tools",
    pricePerDay: 250,
    location: "Kochi",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900",
    description:
      "Reliable angle grinder for cutting, grinding and polishing different materials.",
  },

  {
    name: "Circular Saw",
    category: "Construction",
    pricePerDay: 350,
    location: "Ernakulam",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900",
    description:
      "Professional circular saw suitable for wood cutting and construction projects.",
  },

  {
    name: "Pressure Washer",
    category: "Cleaning",
    pricePerDay: 450,
    location: "Kochi",
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=900",
    description:
      "High-pressure cleaning equipment for vehicles, floors and outdoor areas.",
  },

  {
    name: "Lawn Mower",
    category: "Gardening",
    pricePerDay: 500,
    location: "Aluva",
    image:
      "https://images.unsplash.com/photo-1599685315640-4e6e0f4d6a4f?w=900",
    description:
      "Efficient lawn mower for maintaining gardens and outdoor spaces.",
  },

  {
    name: "Paint Sprayer",
    category: "Painting",
    pricePerDay: 400,
    location: "Thrissur",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e768c9f3f5?w=900",
    description:
      "Easy-to-use paint sprayer for walls, furniture and large painting projects.",
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    await Equipment.deleteMany();

    await Equipment.insertMany(equipments);

    console.log("Equipment data inserted successfully");

    await mongoose.connection.close();

    console.log("Database connection closed");

  } catch (error) {
    console.error("Seeding failed:", error.message);

    process.exit(1);
  }
}

seedDatabase();