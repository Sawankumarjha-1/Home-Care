"use client";
import React, { useState, FormEvent } from "react";
import styles from "../app/signup.module.css";
import { SC } from "@/types/form.type";
import axios from "axios";
import Image from "next/image";
import LoadingImg from "../../public/loading.gif";
function AddService({ userId }: { userId: string }) {
  console.log(userId);
  const [loading, setLoading] = useState<boolean>(false);
  const [service, setService] = useState<SC>({
    serviceName: "MAID",
    salary: "",
    workingHours: "",
    timing: "",
    preferredLocation: "",
  });
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
        setService({
          serviceName: "MAID",
          salary: "",
          workingHours: "",
          timing: "",
          preferredLocation: "",
        });
        alert("Added Successfully..");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.status === 406) {
          alert("All Details are required");
        }
        if (error?.response?.status === 500) {
          alert("Something Wents Wrong on server side");
        }
      }
    }

    setLoading(false);
  }

  return (
    <form
      action=""
      method="post"
      className={styles.registrationForm}
      encType="multipart/form-data"
      onSubmit={onServiceSumbit}
    >
      <div>
        <h2>Do you want to add more service? </h2>

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

          {loading && (
            <Image src={LoadingImg} alt="Loading..." width={50} height={50} />
          )}
        </div>
      </div>
    </form>
  );
}

export default AddService;
