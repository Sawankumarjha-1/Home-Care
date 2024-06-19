import { isValidObjectId } from "mongoose";
import { Clients } from "../models/client.model.js";
import { API_ERROR } from "../utils/api.error.util.js";
import { API_RES } from "../utils/api.res.util.js";
import { asyncHandler } from "../utils/asynchandler.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { Employees } from "../models/employes.model.js";
import nodemailer from "nodemailer";

let serverOTP = "";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const getInfo = asyncHandler(async (req, res) => {
  res.status(200).json(new API_RES(200, "SUCCESS", req.user));
});

export const updateInfo = asyncHandler(async (req, res) => {
  const { name, phone, address, currentStatus } = req.body;
  console.log(currentStatus);

  // *********************Validation*************
  if (phone.length != 10) {
    throw new API_ERROR(406, "Invalid Phone number !");
  }

  //Find and Update data
  let data = "";
  if (req.user.role === "CLIENT") {
    data = await Clients.findById(req.user._id);
  }
  if (req.user.role === "EMPLOYEE") {
    data = await Employees.findById(req.user._id);
    data.currentStatus = currentStatus;
  }
  if (name !== req.user.name) {
    data.name = name;
  }
  if (phone !== req.user.phone) {
    data.phone = phone;
  }
  if (address !== req.user.address) {
    data.address = address;
  }

  //if their is image update then do this
  if (req.file !== undefined) {
    const imageLink = await uploadOnCloudinary(req.file.path);
    data.avatar = imageLink?.url;
  }

  data.save({ validateBeforeSave: false });

  res.status(200).json(new API_RES(200, "Update Successfully"));
});

/*************************Client Logout Controller*******************************************/
export const logout = asyncHandler(async (req, res) => {
  //req.user set by Auth Middleware
  if (req.user.role === "CLIENT") {
    await Clients.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      }
    );
  }
  if (req.user.role === "EMPLOYEE") {
    await Employees.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      }
    );
  }
  const options = {
    httpOnly: true,
    secure: true,
  };

  //In logout we clear cookie
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new API_RES(200, {}, "User logged Out"));
});
/*****************************Verify Email**********************/
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, role } = req?.body;
  let data = "";
  if (role === "CLIENT") {
    data = await Clients.findOne({ email: email });
  }

  if (role === "EMPLOYEE") {
    data = await Employees.findOne({ email: email });
  }

  if (!data) {
    throw new API_ERROR(401, "No user found with this email !");
  }

  //Generate 4 Digit OTP
  serverOTP = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

  const mailOptions = {
    from: "workrideapp@gmail.com",
    to: email,
    subject: `OTP From Home Assist`,
    text: `Do not share this otp with anyone OTP : ${serverOTP}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw new API_ERROR(500, "Something Wents Wrong !");
    } else {
      return res.status(200).json(new API_RES(200, "Verified Successfully !"));
    }
  });

  //Send OTP to email

  return res.status(200).json(new API_RES(200, "Verified Successfully !"));
});
/*********************Update password*******/
export const updatePassword = asyncHandler(async (req, res) => {
  const { otp, password, cpassword, role, email } = req.body;

  if (
    otp === undefined ||
    otp === "" ||
    password === undefined ||
    password === "" ||
    cpassword === undefined ||
    cpassword === "" ||
    role === undefined ||
    role === "" ||
    email === undefined ||
    email === ""
  ) {
    throw new API_ERROR(401, "Please fill all the required field!");
  }
  if (password.length < 6) {
    throw new API_ERROR(
      406,
      "Password Length Must be greater than or equal to 6!"
    );
  }
  if (password !== cpassword)
    throw new API_ERROR(406, "Password and Confirm Password Does not match !");

  // console.log(serverOTP);

  if (parseInt(otp) !== serverOTP) {
    throw new API_ERROR(406, "Invalid OTP");
  }

  let user = "";
  if (role === "CLIENT") {
    user = await Clients.findOne({ email: email });
  }
  if (role === "EMPLOYEE") {
    user = await Employees.findOne({ email: email });
  }

  user.password = password;
  user.save({ validateBeforeSave: false });

  res.status(200).json(new API_RES(200, "Password Update Successfully..."));
});
