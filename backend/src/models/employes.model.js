import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const CD = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Clients" },
  paidAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, default: 0 },
  startDate: { type: String },
  dueDate: { type: String },
  service: { type: String },
});

const SC = new mongoose.Schema({
  name: {
    type: String,
    enum: ["MAID", "GARDRNER", "CHEF", "NANNY", "OLD CARE", "DRIVER"],
    default: "MAID",
  },
  salary: { type: Number, required: true },
  workingHours: { type: String, required: true },
  timing: { type: String, required: true },
  preferredLocation: { type: String, required: true },
});
const EmployeesSchmea = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: String, required: true },
    phone: { type: String, required: true, min: 10, max: 10 },
    email: { type: String, required: true },
    aadhar: { type: String, required: true },
    pan: { type: String, required: true },
    address: { type: String, required: true },
    avatar: { type: String },
    isVerified: {
      type: String,
      default: "VERIFIED",
      enum: ["PENDING", "VERIFIED"],
    },
    currentStatus: {
      type: String,
      default: "NOT WORKING",
      enum: ["WORKING", "NOT WORKING"],
    },
    clientDetails: [CD],
    services: [SC],
    refreshToken: { type: String },
    role: { type: String, enum: ["EMPLOYEE", "ADMIN"], default: "EMPLOYEE" },
    payment: { type: String, enum: ["SUCCESS", "PENDING"], default: "SUCCESS" },
  },
  { timestamps: true }
);

//This middleware hash the password before save into the database
EmployeesSchmea.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});
//User Define Model Methods to check whether the password is correct or not
EmployeesSchmea.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
//Generate access token ( it will store in client cookie )
EmployeesSchmea.methods.generateAccessToken = function () {
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
EmployeesSchmea.methods.generateRefreshToken = function () {
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

export const Employees = mongoose.model("Employees", EmployeesSchmea);
