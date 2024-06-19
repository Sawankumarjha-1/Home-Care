import { isValidObjectId } from "mongoose";
import { Clients } from "../models/client.model.js";
import { API_ERROR } from "../utils/api.error.util.js";
import { API_RES } from "../utils/api.res.util.js";
import { asyncHandler } from "../utils/asynchandler.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { Employees } from "../models/employes.model.js";

/**************Helper Methods*******************/
async function generateAccessAndRefereshTokens(id) {
  const client = await Clients.findById(id);
  const accessToken = client.generateAccessToken();
  const refreshToken = client.generateRefreshToken();
  client.refreshToken = refreshToken;
  client.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
}
//************Client Registration Controllers****************/
export const insertClient = asyncHandler(async (req, res) => {
  const { name, username, password, aadhar, pan, phone, email, address } =
    req.body;
  // *****************************Validate All fields*************************
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
    address === undefined ||
    address === ""
  ) {
    throw new API_ERROR(
      406,
      "Please fill all the required field is required !"
    );
  }

  if (phone.length != 10) {
    throw new API_ERROR(406, "Invalid Phone number !");
  }

  // Validate Email address using regular expression
  const EmailRE = /\S+@\S+\.\S+/;
  if (!EmailRE.test(email)) {
    throw new API_ERROR(406, "Invalid Email address !");
  }

  /***************************************************************************/
  // check whether the details are unique or not if details are not unique throw error else insert data into the database

  const checkExisting = await Clients.findOne({
    $or: [{ username }, { email }],
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
  if (!file?.path) throw new API_ERROR(406, "Avatar required!");

  const imagLink = await uploadOnCloudinary(file.path);
  if (!imagLink) {
    throw new API_ERROR(406, "Please upload avatar !");
  }

  /******************Create CLient***************************/
  const user = await Clients.create({
    name,
    avatar: imagLink.url,
    email: email.trim(),
    password,
    username: username.toLowerCase(),
    aadhar,
    pan,
    phone,
    address,
  });

  //res must not contain password and refresh token so that we do that
  const createdUser = await Clients.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new API_ERROR(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new API_RES(201, createdUser, "User registered Successfully"));
});
/************************ Client Login Controller ********************/
export const clientLogin = asyncHandler(async (req, res) => {
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
  const client = await Clients.findOne({ username: username.toLowerCase() });

  //if client not found generate error
  if (!client) throw new API_ERROR(401, "Invalid Credentials");

  //if client is found then check password whether it is correct or not
  const isCorrect = await client.isPasswordCorrect(password);

  //if password is incorrect then throw error
  if (!isCorrect) throw new API_ERROR(401, "Invalid Credentials");

  //get generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    client._id
  );

  //We don't want to send the password and refresh token to the frontend so we fetch details like below
  const loggedInUser = await Clients.findById(client._id).select(
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

/*************************Client Update Password *******************************************/
export const updateClientPassword = asyncHandler(async (req, res) => {
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
  const client = await Clients.findById(id);

  const isSamePassword = await client.isPasswordCorrect(oldpassword);

  if (!isSamePassword) throw new API_ERROR(406, "Invalid Password!");

  client.password = newpassword;
  client.save({ validateBeforeSave: false });

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
  const client = await Clients.findById(id);
  if (client.phone !== oldphone) {
    throw new API_ERROR(406, "Invalid old phone number!");
  }
  client.phone = newphone;
  client.save({ validateBeforeSave: false });

  res.status(200).json(new API_RES(200, "Phone number update successfully..."));
});
//************************Update Address No **********************************************/
export const updateAddress = asyncHandler(async (req, res) => {
  const { address } = req.body;
  if (address === undefined || address === "") {
    throw new API_ERROR(401, "Address is required!");
  }
  const id = req?.user?._id;
  const client = await Clients.findById(id);
  client.address = address;
  client.save({ validateBeforeSave: false });

  res.status(200).json(new API_RES(200, "Address update successfully..."));
});
//************************Get Particular Client Details***************************/
export const getParticularClientDetails = asyncHandler(async (req, res) => {
  const id = req.params?.id;

  // isValidObjectId check whether the id is valid mongoose id or not
  if (!isValidObjectId(id)) {
    throw new API_ERROR(401, "Id is Invalid!");
  }

  const particularClient = await Clients.findById(id).select(
    "-password -username"
  );
  if (!particularClient) throw new API_ERROR(401, "Invalid Client Id!");
  res
    .status(200)
    .json(new API_RES(200, "Data fetched Successfully...", [particularClient]));
}); //************************Get All Client Details***************************/
export const getAllClientDetails = asyncHandler(async (req, res) => {
  const allClients = await Clients.find();
  res
    .status(200)
    .json(new API_RES(200, "Data fetched Successfully...", allClients));
});

//************************On Book Particular Employee/Worker*******************/
export const bookEmployee = asyncHandler(async (req, res) => {
  const { empId, paidAmount, balanceAmount, startDate, dueDate, serviceName } =
    req.body;

  if (
    empId === undefined ||
    empId === "" ||
    paidAmount === undefined ||
    paidAmount === "" ||
    balanceAmount === undefined ||
    balanceAmount === "" ||
    startDate === undefined ||
    startDate === "" ||
    dueDate === undefined ||
    dueDate === "" ||
    serviceName === undefined ||
    serviceName === ""
  ) {
    throw new API_ERROR(
      401,
      "empId ,paidAmount,balanceAmount,startDate,dueDate,serviceName fields are required!"
    );
  }
  //Check Whether the id that is received is valid mogoose id or not
  if (!isValidObjectId(empId)) throw new API_ERROR(406, "Invalid Id!");

  /********Check Whether the Enter Employee id is valid or not */
  const EData = await Employees.findById(empId);
  if (!EData) throw new API_ERROR(200, "Invalid Id!");

  const clientId = req?.user?._id;

  //Insert the Worker or Employee data into client model
  const insertClientObj = {
    employees: EData._id,
    paidAmount: parseInt(paidAmount),
    balanceAmount: parseInt(balanceAmount),
    startDate: startDate,
    dueDate: dueDate,
    service: serviceName,
  };

  await Clients.findByIdAndUpdate(
    clientId,
    { $push: { hired: insertClientObj } },
    { new: true }
  );

  //Insert the Client data into Worker Model
  const insertEmployeeObj = {
    clientId: clientId,
    paidAmount: parseInt(paidAmount),
    balanceAmount: parseInt(balanceAmount),
    startDate: startDate,
    dueDate: dueDate,
    service: serviceName,
  };

  await Employees.findByIdAndUpdate(empId, {
    currentStatus: "WORKING",
    $push: { clientDetails: insertEmployeeObj },
  });

  return res.status(200).json(new API_RES(200, "Booked Successfully...."));
});
//************************DELETE Particular Client*******/
export const deleteClient = asyncHandler(async (req, res) => {
  const id = req?.params?.id;

  if (!isValidObjectId(id)) throw new API_ERROR(406, "Invalid Id!");

  await Clients.findByIdAndDelete(id);
  return res.status(200).json(new API_RES(200, "Delete Successfully..."));
});
