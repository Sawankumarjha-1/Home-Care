import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const Hired = new mongoose.Schema({
  employees: { type: mongoose.Schema.Types.ObjectId, ref: "Employees" },
  paidAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, default: 0 },
  startDate: { type: String },
  dueDate: { type: String },
  service: { type: String },
});

const ClientSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, requiredL: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    hired: [Hired],
    avatar: { type: String },
    refreshToken: { type: String },
    role: { type: String, default: "CLIENT" },
  },
  { timestamps: true }
);

//This middleware hash the password before save into the database
ClientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});
//User Define Model Methods to check whether the password is correct or not
ClientSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
//Generate access token ( it will store in client cookie )
ClientSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
ClientSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Clients = mongoose.model("Clients", ClientSchema);
