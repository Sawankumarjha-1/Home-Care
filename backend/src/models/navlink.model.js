import mongoose from "mongoose";
const NavSchema = new mongoose({
  title: { type: String, required: true },
  url: { type: String, required: true },
  is_active: {
    type: String,
    enum: ["ACTIVE", "NOT ACTIVE"],
    default: "ACTIVE",
  },
});
export const Navlinks = mongoose.model("Navlinks", NavSchema);
