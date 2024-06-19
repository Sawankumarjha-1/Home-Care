"use client";
import React, { FormEvent, useState } from "react";
import styles from "../../../app/signup.module.css";

import axios from "axios";
import { EmployeeReg, SC } from "@/types/form.type";
import Image from "next/image";
import LoadingImg from "../../../../public/loading.gif";
import Stripe from "../../../../public/stripe.png";
import Agreement from "../../../../public/agreement.png";
import StripeCheckout from "react-stripe-checkout";

import { useRouter, redirect } from "next/navigation";
import IsLogin from "@/utils/IsLogin";

export default function page() {
  const login = IsLogin();
  if (login) redirect("/");
  const [display, setDisplay] = useState<string>("General");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compatibleFileSize, setCompatibleFileSize] = useState<boolean>(false);
  const [imageType, setImageType] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [next, setNext] = useState<boolean>(false);
  const [data, setData] = useState<EmployeeReg>({
    username: "",
    password: "",
    cpassword: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    address: "",
    aadhar: "",
    pan: "",
    age: "",
  });
  const [storage, setStorage] = useState({
    name: "",
    phone: "",
    id: "",
    email: "",
    amount: "",
  });
  const [service, setService] = useState<SC>({
    serviceName: "MAID",
    salary: "",
    workingHours: "",
    timing: "",
    preferredLocation: "",
  });

  const route = useRouter();
  /*************************On Input Value Change********************/
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData((prevData) => {
      return { ...prevData, [name]: value };
    });
  }
  /**************Handle File Change**********/
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const res = file.size / 1000 <= 1024;
      //Set Compatible and file size to check further whether it is according the our rules or not
      setCompatibleFileSize(res);
      setImageType(file.type);
    }
    setSelectedFile(file || null);
  }
  //*************General Data Sumition******/
  async function onGeneralSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (
      data.username === undefined ||
      data.username === "" ||
      data.name === undefined ||
      data.name === "" ||
      data.password === undefined ||
      data.password === "" ||
      data.phone === undefined ||
      data.phone === "" ||
      data.email === undefined ||
      data.email === "" ||
      data.address === undefined ||
      data.address === "" ||
      selectedFile === null ||
      data.pan === undefined ||
      data.pan === "" ||
      data.aadhar === undefined ||
      data.aadhar === "" ||
      data.age === undefined ||
      data.age === ""
    ) {
      setLoading(false);
      return setError(
        "Please fill all the below details accrately!. All detials are required "
      );
    }
    if (parseInt(data.age) <= 18) {
      setLoading(false);
      return setError("You are not elgible to work ?");
    }
    /****************Password Check*****/
    if (data.password !== data.cpassword) {
      setLoading(false);
      return setError("Password and Conform password does not match !");
    }
    /*************Phone no Validation*****/
    if (data.phone.length != 10) {
      setLoading(false);
      alert("Invalid Phone number !");
      return setError("Invalid Phone number !");
    }
    /*************Email Validation*****/
    const EmailRE = /\S+@\S+\.\S+/;
    if (!EmailRE.test(data.email)) {
      setLoading(false);
      alert("Invalid Email address !");
      return setError("Invalid Email address !");
    }
    //validate aadhar no
    const AadharRE = /^\d{12}$/;
    if (!AadharRE.test(data.aadhar)) {
      setLoading(false);
      alert("Invalid Aadhar number !");
      return setError("Invalid Aadhar number !");
    }
    //Validate Pan number
    const PanRE = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    if (!PanRE.test(data.pan)) {
      setLoading(false);
      alert("Invalid pan number !");
      return setError("Invalid PAN number !");
    }

    /*******************Image Type Compatibility************* */
    if (
      imageType !== "image/png" &&
      imageType !== "image/jpg" &&
      imageType != "image/jpeg"
    ) {
      setLoading(false);
      alert("Incompatible image file!");
      return setError("Incompatible image file!");
    }
    /**********Image Size Should be less than or equal to 1MB*/
    if (!compatibleFileSize) {
      setLoading(false);
      alert("Image Size Should be less than 1 MB!");
      return setError("Image Size Should be less than 1 MB!");
    }

    const username = data.username.trim().toLowerCase();
    username.replaceAll(" ", "");

    let formD = new FormData();

    formD.append("name", data.name);
    formD.append("avatar", selectedFile);
    formD.append("username", username);
    formD.append("password", data.password);
    formD.append("email", data.email);
    formD.append("phone", data.phone);
    formD.append("age", data.age);
    formD.append("aadhar", data.aadhar);
    formD.append("pan", data.pan);
    formD.append(
      "address",
      data.address + " | " + data.city + " | " + data.pincode
    );

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/employee/",
        formD,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.statusCode === 201) {
        const id = response?.data?.message?._id;
        setStorage({
          name: response?.data?.message?.name || "",
          phone: response?.data?.message?.phone || "",
          email: response?.data.message?.email || "",
          amount: "200",
          id: id,
        });
        setUserId(id);
        setDisplay("Service");
        setError("");
        setData({
          username: "",
          password: "",
          cpassword: "",
          name: "",
          email: "",
          phone: "",
          city: "",
          pincode: "",
          address: "",
          pan: "",
          aadhar: "",
          age: "",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.status === 409) {
          alert("User with username or email is already exist");
          setError("User with username or email is already exist");
        }
        if (error?.response?.status === 406) {
          alert("All Details are required");
          setError("All Details are required");
        }
        if (error?.response?.status === 500) {
          alert("Something Wents Wrong on server side");
          setError("Something Wents Wrong on server side");
        }
      }
    }

    setLoading(false);
  }

  /*************************On Service Form Input Value Change********************/
  function onServiceDetailsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setService((prevData) => {
      return { ...prevData, [name]: value };
    });
  }
  function onServiceTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setService((dt) => {
      return { ...dt, [name]: value };
    });
  }

  /***********************On Service Submit****************************/
  async function onServiceSumbit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (
      service.serviceName === undefined ||
      service.serviceName === "" ||
      service.salary === undefined ||
      service.salary === "" ||
      service.workingHours === undefined ||
      service.workingHours === "" ||
      service.timing === undefined ||
      service.timing === "" ||
      service.preferredLocation === undefined ||
      service.preferredLocation === ""
    ) {
      setLoading(false);
      alert("All fields are required!");
      return setError("All fields are required!");
    }

    let formD = new FormData();

    formD.append("name", service.serviceName);
    formD.append("salary", service.salary);
    formD.append("workingHours", service.workingHours);
    formD.append("timing", service.timing);
    formD.append("preferredLocation", service.preferredLocation);
    formD.append("id", userId);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/employee/add/service-category",
        formD,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.statusCode === 200) {
        setNext(true);
        setError("");
        setService({
          serviceName: "MAID",
          salary: "",
          workingHours: "",
          timing: "",
          preferredLocation: "",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.status === 406) {
          alert("All Details are required");
          setError("All Details are required");
        }
        if (error?.response?.status === 500) {
          alert("Something Wents Wrong on server side");
          setError("Something Wents Wrong on server side");
        }
      }
    }

    setLoading(false);
  }
  /***********************On Pay Now**********************************/
  async function onPayNow(token) {
    try {
      const body = { token, storage };
      const response = await axios.post(
        "http://localhost:5000/api/v1/payment/",
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        return (window.location.pathname = "/message/success");
      } else {
        const res = await axios.delete(
          `http://localhost:5000/api/v1/employee/delete/employee/:${userId}`
        );
        if (res.data.statusCode) {
          return (window.location.pathname = "/message/cancel");
        }
      }
    } catch (error) {
      console.log("Something wents wrong");
    }
  }

  return (
    <main className={styles.main}>
      {display !== "Payment" && (
        <h2 className={styles.heading}>
          Registration Form For <span>Worker</span>{" "}
        </h2>
      )}

      {display !== "Payment" && (
        <div className={styles.timeLine}>
          <span className={`${display === "General" && styles.activeSpan}`}>
            General Info
          </span>
          <span className={`${display === "Service" && styles.activeSpan}`}>
            Service Info
          </span>
          <span className={`${display === "Payment" && styles.activeSpan}`}>
            Payment Info
          </span>
        </div>
      )}

      {display === "General" && <h3>Important Note :</h3>}
      {display === "General" && (
        <ul className={styles.importantNotes}>
          <li>Username must be in smallcase and no space is allowed</li>
          <li>All the fields are required</li>
          <li>Passowrd must contain atleast 6 character</li>
          <li>Profile Picture is required</li>
          <li>Image Size should be lesser than 1MB</li>
          <li>Compatible image type : png, jpg, jpeg only</li>
        </ul>
      )}
      <p>
        <b>{error && "Error : "}</b>
        <span id={styles.error}>{error}</span>
      </p>
      <form
        action=""
        method="post"
        className={styles.registrationForm}
        encType="multipart/form-data"
        onSubmit={onGeneralSubmit}
      >
        {/***********General Info***************/}
        {display === "General" && (
          <div>
            <h3>Login Credential Details : </h3>
            <input
              type="text"
              placeholder="Enter your username"
              name="username"
              value={data.username}
              onChange={onInputChange}
              required
              autoComplete="off"
            />
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={data.password}
              onChange={onInputChange}
              required
              autoComplete="off"
              minLength={6}
            />
            <input
              type="password"
              placeholder="Enter your confirm password...."
              name="cpassword"
              value={data.cpassword}
              onChange={onInputChange}
              required
              autoComplete="off"
              minLength={6}
            />
            <h3>Personal Details : </h3>
            <input
              type="text"
              placeholder="Enter your name"
              name="name"
              value={data.name}
              onChange={onInputChange}
              required
              autoComplete="off"
            />
            <input
              type="text"
              placeholder="Enter your email"
              name="email"
              value={data.email}
              onChange={onInputChange}
              required
              autoComplete="off"
            />
            <input
              type="text"
              placeholder="Enter your phone no"
              name="phone"
              value={data.phone}
              onChange={onInputChange}
              required
              autoComplete="off"
              minLength={10}
              maxLength={10}
            />
            <input
              type="string"
              placeholder="Enter your age"
              name="age"
              value={data.age}
              onChange={onInputChange}
              required
              autoComplete="off"
              minLength={2}
              maxLength={2}
            />{" "}
            <input
              type="text"
              placeholder="Enter your aadhar no"
              name="aadhar"
              value={data.aadhar}
              onChange={onInputChange}
              required
              autoComplete="off"
              minLength={12}
              maxLength={12}
            />
            <input
              type="text"
              placeholder="Enter your pan no"
              name="pan"
              value={data.pan}
              onChange={onInputChange}
              required
              autoComplete="off"
              minLength={10}
              maxLength={10}
            />
            <h3>Address Details : </h3>
            <input
              type="text"
              placeholder="Enter your HNo, Aparment, Sector"
              name="address"
              value={data.address}
              onChange={onInputChange}
              required
              autoComplete="off"
            />
            <input
              type="text"
              placeholder="Enter your city"
              name="city"
              value={data.city}
              onChange={onInputChange}
              required
              autoComplete="off"
            />
            <input
              type="text"
              placeholder="Enter your pincode"
              name="pincode"
              value={data.pincode}
              onChange={onInputChange}
              required
              autoComplete="off"
            />
            <h3>Upload Profile Picture :</h3>
            <input
              type="file"
              id=""
              name="avatar"
              onChange={handleFileChange}
              required
              autoComplete="off"
            />
            <div className={styles.signupBtnContainer}>
              {loading == false && (
                <button type="submit" className={styles.submitBtn}>
                  Sumbit
                </button>
              )}
              {loading && (
                <Image
                  src={LoadingImg}
                  alt="Loading..."
                  width={50}
                  height={50}
                />
              )}
            </div>
          </div>
        )}
      </form>
      {/***********Service Info**************/}

      {display === "Service" && (
        <form
          action=""
          method="post"
          className={styles.registrationForm}
          encType="multipart/form-data"
          onSubmit={onServiceSumbit}
        >
          <div>
            <h3>Add Service Details : </h3>

            <select name="serviceName" onChange={onServiceDetailsChange}>
              <option value="MAID" defaultChecked>
                MAID
              </option>
              <option value="GARDERNER">GARDERNER</option>{" "}
              <option value="CHEF">CHEF</option>{" "}
              <option value="OLD CARE">OLD CARE</option>{" "}
              <option value="DRIVER">DRIVER</option>{" "}
              <option value="NANNY">NANNY</option>
            </select>

            <input
              type="text"
              placeholder="Expected salary per month"
              name="salary"
              value={service.salary}
              onChange={onServiceDetailsChange}
              required
              autoComplete="off"
            />
            <input
              type="text"
              placeholder="Working Hours"
              name="workingHours"
              value={service.workingHours}
              onChange={onServiceDetailsChange}
              required
              autoComplete="off"
            />
            <input
              type="text"
              placeholder="Timing ( from - to separetd by , )"
              name="timing"
              value={service.timing}
              onChange={onServiceDetailsChange}
              required
              autoComplete="off"
            />
            <textarea
              name="preferredLocation"
              id=""
              placeholder="Enter all your preferred location (City - Pincode - State)"
              value={service.preferredLocation}
              onChange={onServiceTextareaChange}
              required
              autoComplete="off"
            ></textarea>

            <div className={styles.signupBtnContainer}>
              {loading === false && (
                <button type="submit" className={styles.submitBtn}>
                  ADD
                </button>
              )}
              {next && (
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => {
                    setDisplay("Payment");
                  }}
                >
                  Next
                </button>
              )}
              {loading && (
                <Image
                  src={LoadingImg}
                  alt="Loading..."
                  width={50}
                  height={50}
                />
              )}
            </div>
          </div>
        </form>
      )}

      {/* {**************Payment Info************} */}
      {display === "Payment" && (
        <form
          action=""
          method="post"
          className={styles.phonePeForm}
          encType="multipart/form-data"
        >
          <div className={styles.phonePeContentDiv}>
            <h1>
              <span>Pay Now to Complete</span> your registration with us
            </h1>
            <p>
              Homeassist Sense offers a range of services tailored to meet the
              diverse homecare needs of individuals and families. From eldercare
              to childcare and beyond, we provide comprehensive solutions to
              support you in every aspect of home management.
            </p>
            <Image
              src={Agreement}
              alt="Agreement"
              className={styles.agreementLogo}
              priority
            />
          </div>
          <div className={styles.phonePeDiv}>
            <Image
              src={Stripe}
              alt="PhonePe Logo"
              className={styles.phonePe}
              priority
            />
            <div className={styles.phoneDetails}>
              <p>
                <b>Name : </b>
                {storage.name}
              </p>{" "}
              <p>
                <b>Phone no : </b> {storage.phone}
              </p>
              <p>
                <b>Amount : </b>₹ 200/-
              </p>
            </div>

            <StripeCheckout
              stripeKey={process.env.NEXT_PUBLIC_PUBLISHABLE_KEY}
              token={onPayNow}
              name="Pay Now ₹ 200/-"
              email={storage.email}
            >
              <button type="button" className={styles.submitBtn}>
                Pay Now
              </button>
            </StripeCheckout>
          </div>
        </form>
      )}
    </main>
  );
}
