import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    seller: { type: Boolean, default: false },
    sellerProfile: {
      companyName: String,
      category: String,
      description: String,
      phone: String,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
