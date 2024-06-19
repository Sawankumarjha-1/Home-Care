"use client";
import React, { useState, FormEvent } from "react";
import styles from "../../../app/login.module.css";
import Image from "next/image";
import Logo from "../../../../public/SmallLogo.png";
import Link from "next/link";

import axios, { isAxiosError } from "axios";
import { redirect } from "next/navigation";
import IsLogin from "@/utils/IsLogin";
import ForgetPassword from "@/components/ForgetPassword";

export default function page() {
  const login = IsLogin();
  if (login) redirect("/");
  const [display, setDisplay] = useState<boolean>(true);
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState<string>("");
  function onValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  }
  async function onSubmitFunc(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    axios
      .post("http://localhost:5000/api/v1/employee/login", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          alert("Login Successfully !");
          window.location.pathname = "/";
        }
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          if (error?.response?.status === 401) {
            alert("Invalid Credential !");
            setError("Invalid Credential !");
          }
        }
      });
  }

  return (
    <div className={styles.main}>
      {display && (
        <form
          className={styles.form}
          onSubmit={onSubmitFunc}
          encType="multipart/form-data"
        >
          <Image src={Logo} alt="Picture" />

          <h3>
            Home Care <span>Worker Login</span>
          </h3>
          {error != "" && <p className={styles.error}>{error}</p>}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={data.username}
            onChange={onValueChange}
            required
            autoComplete="off"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={onValueChange}
            required
            autoComplete="off"
          />
          <div className={styles.contactBtnContainer}>
            <button
              type="reset"
              className={styles.contactBtn}
              onClick={() => {
                setData({ username: "", password: "" });
              }}
            >
              Reset
            </button>
            <button type="submit" className={styles.contactBtn}>
              Sumbit
            </button>
          </div>
          <small
            className={styles.forget}
            onClick={() => {
              setDisplay(false);
            }}
          >
            Forget Password ?
          </small>
          <small>
            Don't have an account ? <Link href={"/worker/signup/"}>Signup</Link>
          </small>
        </form>
      )}
      {display == false && <ForgetPassword role="EMPLOYEE" />}
    </div>
  );
}
