import {
  employeeLogin,
  insertEmployee,
  getAllEmployeeDetails,
  updateAddress,
  updatePhone,
  updateEmployeePassword,
  getParticularEmployeeDetails,
  addServcie,
  deleteEmployee,
  removeParicularService,
} from "../controllers/employes.contoller.js";
import { employeeVerifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import express from "express";

const router = express.Router();
router.route("/").post(upload.single("avatar"), insertEmployee);
router.route("/login").post(upload.none(), employeeLogin);
router
  .route("/update/password")
  .post(upload.none(), employeeVerifyJWT, updateEmployeePassword);

router
  .route("/update/phoneno")
  .post(upload.none(), employeeVerifyJWT, updatePhone);
router
  .route("/update/address")
  .post(upload.none(), employeeVerifyJWT, updateAddress);
router.route("/particular/employee/:id").get(getParticularEmployeeDetails);
router.route("/all/employee").get(getAllEmployeeDetails);
router.route("/add/service-category").post(upload.none(), addServcie);

router.route("/delete/employee/:id").delete(deleteEmployee);
router
  .route("/delete/service/:id")
  .delete(employeeVerifyJWT, removeParicularService);

export default router;
