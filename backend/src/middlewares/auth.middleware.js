import jwt from "jsonwebtoken";
import { API_ERROR } from "../utils/api.error.util.js";
import dotenv from "dotenv";
import { Clients } from "../models/client.model.js";
import { asyncHandler } from "../utils/asynchandler.util.js";
import { Employees } from "../models/employes.model.js";
dotenv.config();

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    //Cookies only found in browser so for mobile application header use
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    //if token not found throw error
    if (!token) {
      return res.status(401).json(new API_ERROR(401, "Unauthorized request"));
    }

    // if found then decode it to get id
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    let user = "";
    if (decodedToken?.role === "CLIENT") {
      //find the client detials using the decoded cookie id
      user = await Clients.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );
    } else {
      user = await Employees.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );
    }

    if (!user) {
      throw new API_ERROR(401, "Invalid Access Token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new API_ERROR(401, error?.message || "Invalid access token");
  }
});

export const employeeVerifyJWT = asyncHandler(async (req, _, next) => {
  try {
    //Cookies only found in browser so for mobile application header use
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    //if token not found throw error
    if (!token) {
      throw new API_ERROR(401, "Unauthorized request");
    }

    // if found then decode it to get id
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    //find the client detials using the decoded cookie id
    const user = await Employees.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new API_ERROR(401, "Invalid Access Token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new API_ERROR(401, error?.message || "Invalid access token");
  }
});
