"use client";

import React, { useState, FormEvent } from "react";
import styles from "../app/login.module.css";
import axios, { isAxiosError } from "axios";
function ForgetPassword({ role }: { role: string }) {
  const [error, setError] = useState<string>("");
  const [otpDisplay, setOtpDisplay] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [otpData, setOtpData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  function onOtpRequiredFieldValueChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setOtpData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function emailVerification() {
    // Validate Email address using regular expression
    const EmailRE = /\S+@\S+\.\S+/;
    if (!EmailRE.test(email)) {
      return setError("Please enter correct email address !");
    }
    const formData = new FormData();
    formData.append("email", email);
    formData.append("role", role);

    axios
      .post("http://localhost:5000/api/v1/common/verify-email", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setOtpDisplay(true);
          setError("");
        }
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          if (error?.response?.status === 401) {
            setError("No user found with this email address!");
          }
          if (error?.response?.status === 500) {
            setError("Something wents wrong !");
          }
        }
      });
  }
  function onSavePassword(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    if (
      otpData.otp === undefined ||
      otpData.otp === "" ||
      otpData.password === undefined ||
      otpData.password === "" ||
      otpData.confirmPassword === undefined ||
      otpData.confirmPassword === ""
    ) {
      return setError("Please fill all the required field!");
    }
    if (otpData.password.length < 6) {
      return setError("Password length must be greater than or equal to 6!");
    }
    if (otpData.password != otpData.confirmPassword) {
      return setError("Password and Confirm Password Does not match !");
    }

    const formData = new FormData();
    formData.append("role", role);
    formData.append("email", email);
    formData.append("otp", otpData.otp);
    formData.append("password", otpData.password);
    formData.append("cpassword", otpData.confirmPassword);
    axios
      .post("http://localhost:5000/api/v1/common/update-password", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          alert("Update Password Successfully...");
          window.location.pathname = "/";
        }
      })
      .catch((error) => {
        console.log(error);
        if (isAxiosError(error)) {
          if (error?.response?.status === 401) {
            alert("Please fill all the required details");
            setError("Please fill all the required details !");
          }
          if (error?.response?.status === 406) {
            alert("Invalid OTP !");
            setError("Invalid OTP");
          }
          if (error?.response?.status === 500) {
            alert("Something wents wrong !");
            setError("Something wents wrong !");
          }
        }
      });
  }

  return (
    <div className={styles.main}>
      <form
        className={styles.form}
        onSubmit={onSavePassword}
        encType="multipart/form-data"
      >
        {error != "" && <p className={styles.error}>{error}</p>}
        {otpDisplay == false && (
          <input
            type="email"
            name="email"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
            autoComplete="off"
          />
        )}
        {otpDisplay == false && (
          <div className={styles.contactBtnContainer}>
            <button
              type="button"
              className={styles.contactBtn}
              onClick={emailVerification}
            >
              Send OTP
            </button>
          </div>
        )}
        {otpDisplay && (
          <input
            type="text"
            name="otp"
            placeholder="Enter 4 Digit OTP"
            value={otpData.otp}
            onChange={onOtpRequiredFieldValueChange}
            required
            autoComplete="off"
            maxLength={4}
            minLength={4}
          />
        )}

        {otpDisplay && (
          <input
            type="password"
            name="password"
            placeholder="Enter New Password"
            value={otpData.password}
            onChange={onOtpRequiredFieldValueChange}
            required
            autoComplete="off"
          />
        )}
        {otpDisplay && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Enter Confirm Password"
            value={otpData.confirmPassword}
            onChange={onOtpRequiredFieldValueChange}
            required
            autoComplete="off"
          />
        )}
        {otpDisplay && (
          <div className={styles.contactBtnContainer}>
            <button type="submit" className={styles.contactBtn}>
              Save
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default ForgetPassword;
