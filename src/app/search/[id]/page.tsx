"use client";
import React, { useEffect, useState } from "react";
import searchStyle from "../../search.module.css";
import { useParams } from "next/navigation";
import axios from "axios";
import LoadingIcon from "../../../../public/loading.gif";
import { CardType } from "@/types/form.type";
import Image from "next/image";
import Dummy from "../../../../public/chef.png";

function page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<[CardType]>();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/v1/employee/particular/employee/${params.id}`
      )
      .then((response) => {
        setData(response.data.data);
        console.log(response.data.data[0].avatar);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function onBook(serviceName: string) {
    console.log(serviceName);
    const date = new Date();
    const dt = date.getDate() + 1;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formData = new FormData();
    formData.append("empId", `${id}`);
    formData.append("paidAmount", `0`);
    formData.append("balanceAmount", `0`);
    formData.append("startDate", `${dt}-${month}-${year}`);
    formData.append("dueDate", `${dt}-${month + 1}-${year}`);
    formData.append("serviceName", serviceName);
    axios
      .post(`http://localhost:5000/api/v1/client/book/employee/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        alert("You Booked Successfully , He/She will come from tommorow");
        window.location.pathname = "/";
      })
      .catch((err) => {
        alert("Please Login to Continue");
      });
  }

  return loading === false ? (
    <main>
      <div className={searchStyle.generalIndividualContainer}>
        <div className={searchStyle.individualCardDetailsImage}>
          <Image
            src={data[0].avatar}
            alt="Profile Photo"
            width={300}
            height={300}
          />
        </div>
        <div className={searchStyle.generalIndivdualDetails}>
          <div>
            <p>
              <b>Name : </b>
              {data[0].name}
            </p>
            <p>
              <b>Age : </b>
              {data[0].age}
            </p>
            <p>
              <b>Phone no : </b>
              {data[0].phone}
            </p>
            <p>
              <b>Phone no : </b>
              {data[0].email}
            </p>
            <p>
              <b>Verified : </b>
              {data[0].isVerified === "VERIFIED" ? "YES" : "NO"}
            </p>
            <p>
              <b>Current Status: </b>
              {data[0].currentStatus}
            </p>
          </div>
          <h2>Choice Service :</h2>
          <div>
            {data?.length &&
              data[0].services.map((item, index) => {
                return (
                  <div
                    key={"serviceInfo" + index}
                    className={searchStyle.serviceDetails}
                  >
                    <p>
                      <b>Service : </b> {item.name}
                    </p>
                    <p>
                      <b>Working Hour : </b>
                      {item.workingHours}
                    </p>
                    <p>
                      <b>Timing : </b>
                      {item.timing}
                    </p>
                    <p>
                      <b>Salary : </b>
                      {item.salary}
                    </p>{" "}
                    <p>
                      <b>Preferred Location : </b>
                      {item.preferredLocation}
                    </p>
                    <button
                      className={searchStyle.individualServiceBook}
                      onClick={() => {
                        onBook(item?.name);
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </main>
  ) : (
    <main className={searchStyle.Loading}>
      <Image src={LoadingIcon} alt="Loading..." />
    </main>
  );
}

export default page;
