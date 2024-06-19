"use client";
import React, { useEffect, useState } from "react";

import searchStyles from "../search.module.css";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";
import Link from "next/link";
import Maid from "../../../public/icons/maid.png";
import Chef from "../../../public/icons/chef.png";
import Driver from "../../../public/icons/driver.png";
import Gardner from "../../../public/icons/gardner.png";
import Nanny from "../../../public/icons/nanny.png";
import Oldcare from "../../../public/icons/oldcare.png";
import Verify from "../../../public/icons/verify.png";
import axios from "axios";
import LoadingIcon from "../../../public/loading.gif";
import { CardType } from "@/types/form.type";
export default function page() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<[CardType]>();
  const [original, setOriginal] = useState<[CardType]>();
  const [service, setService] = useState("MAID");
  function onChangeFunction(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setSearch(value);
  }
  function onServiceDetailsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setService(value);
    console.log(service);
  }
  function onSearch() {
    const filteredData = original?.filter((item) =>
      item.services.some((nestedItem) => {
        if (search === "") return nestedItem.name === service;
        return (
          nestedItem.preferredLocation
            .toLowerCase()
            .match(search.toLowerCase()) && nestedItem.name === service
        );
      })
    );

    setData(filteredData);
  }

  // Fetching all the data about home care from database
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/employee/all/employee`)
      .then((response) => {
        const dt = response.data.data.filter((item, index) => {
          return (
            item.currentStatus !== "WORKING" && item.isVerified !== "PENDING"
          );
        });

        setData(dt);
        setOriginal(dt);
        setLoading(false);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);

  return loading === false ? (
    <main className={searchStyles.main}>
      {/*************************Search Bar***********************/}
      <div className={searchStyles.heroContentSection}>
        <h1>
          <span>Find Your Perfect </span>Home Care
        </h1>
        <p>
          we understand that managing your home can sometimes feel like a
          full-time job. From routine maintenance tasks to unexpected
          emergencies, there's always something demanding your attention. That's
          where we come in.
        </p>
        <div className={searchStyles.mainSearchContainer}>
          <div className={searchStyles.searchContainer}>
            <select
              name="serviceName"
              onChange={onServiceDetailsChange}
              className={searchStyles.searchSelect}
            >
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
              className={`${searchStyles.searchInput} ${searchStyles.categorySearch}`}
              type="search"
              placeholder="Search location"
              name="searchText"
              value={search}
              onChange={onChangeFunction}
              autoComplete="off"
            />
            <button className={searchStyles.searchbtn} onClick={onSearch}>
              <CiSearch size={30} className={searchStyles.searchIcon} />
            </button>
          </div>
        </div>
      </div>

      {/************************Search Result Card ***********/}
      <div className={searchStyles.searchCardContainer}>
        {data?.length ? (
          data.map((item, index) => {
            return (
              item.services.length > 0 && (
                <div
                  className={searchStyles.individualSearchCard}
                  key={"EmployeeContainer" + index}
                >
                  <div className={searchStyles.searchImageCardConatiner}>
                    <Image
                      src={item?.avatar}
                      alt="Profile Picture"
                      width={150}
                      height={150}
                    />
                  </div>
                  <div className={searchStyles.searchCardContentContainer}>
                    <div className={searchStyles.nameContainer}>
                      <b>{item?.name}</b>

                      <Image
                        src={Verify}
                        alt="Verified"
                        className={searchStyles.verifyIcon}
                      />
                    </div>
                    <div key={"offerServices" + index}>
                      <small>
                        <span>Preferred Location : </span>{" "}
                        {item.services[0].preferredLocation}
                      </small>
                      <br />
                      <small>
                        <span>Timing: </span> {item.services[0].timing}
                      </small>
                      <br />

                      <br />
                      <small>
                        <span>Choose Any Service : </span>
                      </small>
                      <div className={searchStyles.searchCardServiceContainer}>
                        {item?.services.map((serviceItem, servIndex) => {
                          return (
                            <>
                              {serviceItem.name === "MAID" && (
                                <Image
                                  src={Maid}
                                  alt="Service Image"
                                  className={`${searchStyles.serviceIcons}`}
                                />
                              )}
                              {serviceItem.name === "NANNY" && (
                                <Image
                                  src={Nanny}
                                  alt="Service Image"
                                  className={`${searchStyles.serviceIcons} `}
                                />
                              )}
                              {serviceItem.name === "OLD CARE" && (
                                <Image
                                  src={Oldcare}
                                  alt="Service Image"
                                  className={`${searchStyles.serviceIcons} `}
                                />
                              )}

                              {serviceItem.name === "CHEF" && (
                                <Image
                                  src={Chef}
                                  alt="Service Image"
                                  className={`${searchStyles.serviceIcons} `}
                                />
                              )}

                              {serviceItem.name === "DRIVER" && (
                                <Image
                                  src={Driver}
                                  alt="Service Image"
                                  className={`${searchStyles.serviceIcons}`}
                                />
                              )}
                              {serviceItem.name === "GARDERNER" && (
                                <Image
                                  src={Gardner}
                                  alt="Service Image"
                                  className={`${searchStyles.serviceIcons}`}
                                />
                              )}
                            </>
                          );
                        })}
                      </div>
                    </div>
                    <Link
                      href={`/search/${item?._id}`}
                      className={searchStyles.bookNow}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              )
            );
          })
        ) : (
          <p>No Home Care Found!</p>
        )}
      </div>
    </main>
  ) : (
    <main className={searchStyles.Loading}>
      <Image src={LoadingIcon} alt="Loading..." />
    </main>
  );
}
