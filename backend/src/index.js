//we modify the type in package .json that's why we are able to use import otherwise by default is common so we need to use require
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { DBConnection } from "./db/index.js";

/*****************************************************/

dotenv.config();
DBConnection();
const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
const port = process.env.PORT || 4000;

//you need to use multer too it is not enough now
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// it means that server is accepting json data
app.use(express.static("public"));

app.use(cookieParser());

//routes declaration
import client from "./routes/client.routes.js";
import employee from "./routes/employees.routes.js";
import payment from "./routes/payment.routes.js";
import common from "./routes/common.routes.js";

app.use("/api/v1/client", client);
app.use("/api/v1/employee", employee);
app.use("/api/v1/payment", payment);
app.use("/api/v1/common", common);

app.listen(port, () => {
  console.log("Listening at port no : " + port);
});
