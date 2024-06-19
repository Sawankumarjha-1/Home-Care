"use client";
import React, { FormEvent, useState } from "react";
import styles from "../../../app/signup.module.css";
import { ClientReg } from "@/types/form.type";
import LoadingImg from "../../../../public/loading.gif";
import axios from "axios";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import IsLogin from "@/utils/IsLogin";

export default function page() {
  const login = IsLogin();
  if (login) redirect("/");
  /**********State Variables************************ */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compatibleFileSize, setCompatibleFileSize] = useState<boolean>(false);
  const [imageType, setImageType] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [data, setData] = useState<ClientReg>({
    username: "",
    password: "",
    cpassword: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    address: "",
  });

  /*************************On Input Value Change********************/
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData((prevData) => {
      return { ...prevData, [name]: value };
    });
  }
  /*************************Function Exceute After Click on Reset Buton********************/
  function onReset() {
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
    });
  }
  /*************************Handle File Input Change****************/
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
  /*************************Call Whene Data Submit Button Trigger********************/
  async function onSubmitFunc(e: FormEvent<HTMLFormElement>) {
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
      selectedFile === null
    ) {
      setLoading(false);
      return setError(
        "Please fill all the below details accrately!. All detials are required "
      );
    }

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

    formD.append(
      "address",
      data.address + " | " + data.city + " | " + data.pincode
    );

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/client/",
        formD,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.statusCode === 201) {
        alert("User created successflly now you can login successfully...");
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
        });
        router.push("/client/login/");
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

  return (
    <main className={styles.main}>
      <h2 className={styles.heading}>
        Registration Form For <span>Recuriters</span>{" "}
      </h2>
      {/* Registration Form */}
      <form
        action=""
        method="post"
        className={styles.registrationForm}
        onSubmit={onSubmitFunc}
        encType="multipart/form-data"
      >
        <h3>Important Note :</h3>
        <ul className={styles.importantNotes}>
          <li>Username must be in smallcase and no space is allowed</li>
          <li>All the fields are required</li>
          <li>Passowrd must contain atleast 6 character</li>
          <li>Profile Picture is required</li>
          <li>Image Size should be lesser than 1MB</li>
          <li>Compatible image type : png, jpg, jpeg only</li>
        </ul>

        <p>
          <b>{error && "Error : "}</b>
          <span id={styles.error}>{error}</span>
        </p>
        {/* {**************************Login Credential Section******************} */}
        <h3>Login Credential Details : </h3>
        <input
          type="text"
          placeholder="Enter your username"
          name="username"
          value={data.username}
          onChange={onInputChange}
          autoComplete="off"
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          name="password"
          value={data.password}
          onChange={onInputChange}
          autoComplete="off"
          required
          minLength={6}
        />
        <input
          type="password"
          placeholder="Enter your confirm password...."
          name="cpassword"
          value={data.cpassword}
          onChange={onInputChange}
          autoComplete="off"
          required
          minLength={6}
        />

        {/* {**************************Perosnal Details Section******************} */}
        <h3>Personal Details : </h3>
        <input
          type="text"
          placeholder="Enter your name"
          name="name"
          value={data.name}
          onChange={onInputChange}
          autoComplete="off"
          required
        />
        <input
          type="text"
          placeholder="Enter your email"
          name="email"
          value={data.email}
          onChange={onInputChange}
          autoComplete="off"
          required
        />
        <input
          type="text"
          placeholder="Enter your phone no"
          name="phone"
          value={data.phone}
          onChange={onInputChange}
          autoComplete="off"
          required
          minLength={10}
          maxLength={10}
        />

        {/* {**************************Address Section******************} */}
        <h3>Address Details : </h3>
        <input
          type="text"
          placeholder="Enter your HNo, Aparment, Sector"
          name="address"
          value={data.address}
          onChange={onInputChange}
          autoComplete="off"
          required
        />
        <input
          type="text"
          placeholder="Enter your city"
          name="city"
          required
          value={data.city}
          onChange={onInputChange}
          autoComplete="off"
        />
        <input
          type="text"
          placeholder="Enter your pincode"
          name="pincode"
          value={data.pincode}
          onChange={onInputChange}
          autoComplete="off"
          required
        />

        {/* {**************************Upload Image Section******************} */}

        <h3>Upload Profile Picture :</h3>
        <input type="file" id="" onChange={handleFileChange} />

        {/* {**************************Button Section******************} */}
        <div className={styles.signupBtnContainer}>
          {loading == false && (
            <button type="reset" className={styles.resetBtn} onClick={onReset}>
              Reset
            </button>
          )}

          {loading == false && (
            <button type="submit" className={styles.submitBtn}>
              Sumbit
            </button>
          )}
          {loading && (
            <Image src={LoadingImg} alt="Loading..." width={50} height={50} />
          )}
        </div>
      </form>
    </main>
  );
}
