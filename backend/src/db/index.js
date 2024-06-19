import mongoose from "mongoose";
import { DATABASE_NAME } from "../constants/index.js";
export const DBConnection = async () => {
  try {
    let connection = await mongoose.connect(
      `${process.env.CONNECTION_URL}${DATABASE_NAME}`
    );
    console.log(
      "Database successfully connected : " + connection.connection.host
    );
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
