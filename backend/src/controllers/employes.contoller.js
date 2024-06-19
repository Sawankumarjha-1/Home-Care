import { Employees } from "../models/employes.model.js";
import { API_ERROR } from "../utils/api.error.util.js";
import { API_RES } from "../utils/api.res.util.js";
import { asyncHandler } from "../utils/asynchandler.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { isValidObjectId } from "mongoose";

/**************Helper Methods*******************/
async function generateAccessAndRefereshTokens(id) {
  const employee = await Employees.findById(id);
  const accessToken = employee.generateAccessToken();
  const refreshToken = employee.generateRefreshToken();
  employee.refreshToken = refreshToken;
  employee.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
}
/*************************Create Employee***************************/
export const insertEmployee = asyncHandler(async (req, res) => {
  const { username, password, name, age, phone, email, aadhar, pan, address } =
    req.body;
  if (
    username === undefined ||
    username === "" ||
    name === undefined ||
    name === "" ||
    password === undefined ||
    password === "" ||
    phone === undefined ||
    phone === "" ||
    email === undefined ||
    email === "" ||
    aadhar === undefined ||
    aadhar === "" ||
    pan === undefined ||
    pan === "" ||
    address === undefined ||
    address === "" ||
    age === undefined ||
    age === ""
  ) {
    throw new API_ERROR(
      406,
      "Please fill all the required field is required !"
    );
  }

  if (phone.length != 10) {
    throw new API_ERROR(406, "Invalid Phone number !");
  }

  //validate aadhar no
  const AadharRE = /^\d{12}$/;
  if (!AadharRE.test(aadhar)) {
    throw new API_ERROR(406, "Invalid Aadhar number !");
  }

  //Validate Pan number
  const PanRE = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
  if (!PanRE.test(pan)) {
    throw new API_ERROR(406, "Invalid PAN number !");
  }

  // Validate Email address using regular expression
  const EmailRE = /\S+@\S+\.\S+/;
  if (!EmailRE.test(email)) {
    throw new API_ERROR(406, "Invalid Email address !");
  }

  /***************************************************************************/
  // check whether the details are unique or not if details are not unique throw error else insert data into the database

  const checkExisting = await Employees.findOne({
    $or: [{ username }, { email }, { aadhar }, { pan }],
  });

  // find one return object
  if (checkExisting) {
    throw new API_ERROR(
      409,
      "User with email, username, pan or aadhar already exist !"
    );
  }
  /********************upload Image on cloudinary**************** */
  const { file } = req;
  // console.log(file);
  if (!file.path) throw new API_ERROR(406, "Avatar required!");

  const imagLink = await uploadOnCloudinary(file.path);
  if (!imagLink) {
    throw new API_ERROR(406, "Please upload avatar !");
  }

  /******************Create CLient***************************/
  const user = await Employees.create({
    name,
    avatar: imagLink.url,
    email: email.trim(),
    password,
    username: username.toLowerCase(),
    aadhar,
    pan,
    phone,
    address,
    age,
  });

  //res must not contain password and refresh token so that we do that
  const createdUser = await Employees.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new API_ERROR(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new API_RES(201, createdUser, "User registered Successfully"));
});

/*************************Login Employee****************************/
export const employeeLogin = asyncHandler(async (req, res) => {
  //Get the username and password field value
  const { username, password } = req.body;

  //if any of username or password fields doesn't have value then throw error
  if (
    username === undefined ||
    username === "" ||
    password === undefined ||
    password === ""
  ) {
    throw new API_ERROR(406, "Username and Password are required to login!");
  }

  //if both username and password have value then find the client
  const employee = await Employees.findOne({
    username: username.toLowerCase(),
  });

  //if employee not found generate error
  if (!employee) throw new API_ERROR(401, "Invalid Credentials");

  //if employee is found then check password whether it is correct or not
  const isCorrect = await employee.isPasswordCorrect(password);

  //if password is incorrect then throw error
  if (!isCorrect) throw new API_ERROR(401, "Invalid Credentials");

  //get generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    employee._id
  );

  //We don't want to send the password and refresh token to the frontend so we fetch details like below
  const loggedInUser = await Employees.findById(employee._id).select(
    "-password -refreshToken"
  );
  //Cookies Options
  const options = {
    httpOnly: true,
    secure: true, // Must be secure other wise any one can modify
  };

  //During Login We Set Cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new API_RES(
        200,

        "Client logged In Successfully",
        [loggedInUser, { accessToken }, { refreshToken }]
      )
    );
});

/*************************Employee Update Password *******************************************/
export const updateEmployeePassword = asyncHandler(async (req, res) => {
  //getting the password from the req.user because we firsty verify user
  //through verifyAuth middleware and if user verified then it send req.user details to us

  //Undefine when field not password but empty check when field passed with empty value
  const { oldpassword, newpassword } = req.body;
  if (
    oldpassword === undefined ||
    oldpassword === "" ||
    newpassword === undefined ||
    newpassword === ""
  ) {
    throw new API_ERROR(401, "Old and New Password Required !");
  }

  const id = req?.user?._id;
  const employee = await Employees.findById(id);

  const isSamePassword = await employee.isPasswordCorrect(oldpassword);

  if (!isSamePassword) throw new API_ERROR(406, "Invalid Password!");

  employee.password = newpassword;
  employee.save({ validateBeforeSave: false });

  res.status(200).json(new API_RES(200, "Password Update Successfully..."));
});
//************************Update Phone No **********************************************/
export const updatePhone = asyncHandler(async (req, res) => {
  const { oldphone, newphone } = req.body;
  if (
    oldphone === undefined ||
    oldphone === "" ||
    newphone === undefined ||
    newphone === ""
  ) {
    throw new API_ERROR(401, "Old and New Phone number is required!");
  }
  if (newphone.length != 10 || oldphone.length != 10) {
    throw new API_ERROR(406, "Invalid Phone number !");
  }

  const id = req?.user?._id;
  const employee = await Employees.findById(id);
  if (employee.phone !== oldphone) {
    throw new API_ERROR(406, "Invalid old phone number!");
  }
  employee.phone = newphone;
  employee.save({ validateBeforeSave: false });

  res.status(200).json(new API_RES(200, "Phone number update successfully..."));
});
//************************Update Address No **********************************************/
export const updateAddress = asyncHandler(async (req, res) => {
  const { address } = req.body;
  if (address === undefined || address === "") {
    throw new API_ERROR(401, "Address is required!");
  }
  const id = req?.user?._id;
  const employee = await Employees.findById(id);
  employee.address = address;
  employee.save({ validateBeforeSave: false });

  res.status(200).json(new API_RES(200, "Address update successfully..."));
});
//************************Get Particular Client Details***************************/
export const getParticularEmployeeDetails = asyncHandler(async (req, res) => {
  const id = req.params?.id;

  // isValidObjectId check whether the id is valid mongoose id or not
  if (!isValidObjectId(id)) {
    throw new API_ERROR(401, "Id is Invalid!");
  }

  const particularEmployee = await Employees.findById(id).select(
    "name phone address services email age payment isVerified avatar currentStatus"
  );
  if (!particularEmployee) throw new API_ERROR(401, "Invalid Client Id!");
  return res
    .status(200)
    .json(
      new API_RES(200, "Data fetched Successfully...", [particularEmployee])
    );
}); //************************Get All Client Details***************************/
export const getAllEmployeeDetails = asyncHandler(async (req, res) => {
  const allEmployees = await Employees.find().select(
    "name phone address services email age payment isVerified avatar currentStatus"
  );
  return res
    .status(200)
    .json(new API_RES(200, "Data fetched Successfully...", allEmployees));
});
//***************************Add Service into the Employee Model******************/
export const addServcie = asyncHandler(async (req, res) => {
  const { name, salary, workingHours, timing, preferredLocation, id } =
    req.body;
  if (
    name === undefined ||
    name === "" ||
    salary === undefined ||
    salary === "" ||
    workingHours === undefined ||
    workingHours === "" ||
    timing === undefined ||
    timing === "" ||
    preferredLocation === undefined ||
    preferredLocation === ""
  ) {
    throw new API_ERROR(
      406,
      "name, salary, workingHours, timing, preferredLocation field are required!"
    );
  }
  const serviceCategoryObj = {
    name,
    salary: parseInt(salary),
    workingHours,
    timing,
    preferredLocation,
  };
  if (!isValidObjectId(id)) throw new API_ERROR(406, "Invalid Id!");
  const EData = await Employees.findByIdAndUpdate(
    id,
    { $push: { services: serviceCategoryObj } },
    { new: true }
  );
  return res
    .status(200)
    .json(new API_RES(200, "Service Added Successfully!", [EData]));
});

//************************DELETE Particular Employee*******/
export const deleteEmployee = asyncHandler(async (req, res) => {
  const id = req?.params?.id;
  if (!isValidObjectId(id)) throw new API_ERROR(406, "Invalid Id!");
  await Employees.findByIdAndDelete(id);
  return res.status(200).json(new API_RES(200, "Delete Successfully..."));
});
//*********************Remove Particular Service**********/

export const removeParicularService = asyncHandler(async (req, res) => {
  //getting the id from params
  const id = req?.params?.id;
  //check validity of id
  if (!isValidObjectId(id)) throw new API_ERROR(406, "Invalid Id!");
  const userId = req?.user?._id;

  //find user with the help of userId
  const data = await Employees.findById(userId);
  //if user not exist throw error
  if (!data) {
    throw new API_ERROR(409, "No Employee Exist");
  }

  //Perform filtering the data to remove particular element
  data.services = data.services.filter((item, index) => {
    return item._id != id;
  });
  //Now at last save the data ans send back the response
  data.save({ validateBeforeSave: false });
  return res.status(200).json(new API_RES(200, "Delete Successfully..."));
});
