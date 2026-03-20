import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: Array,
    total: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
