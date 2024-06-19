"use client";
import React, { useState } from "react";
import Hero from "../../public/Hero2.jpg";
import Image from "next/image";
import styles from "../app/page.module.css";
import { CiSearch } from "react-icons/ci";
function HeroSection() {
  const [search, setSearch] = useState({
    city: "",
    state: "",
    pincode: "",
    searchText: "",
  });

  function onChangeFunction(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setSearch((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    console.log(search);
  }

  return (
    <div className={styles.heroSection}>
      <div className={styles.heroImageContainer}>
        <Image src={Hero} alt="Not Found" />
        <div className={styles.fixedImageDiv}>
          <p>
            Hey, Are you looking for <span>Maid ?</span>
          </p>
        </div>
        <div className={styles.fixedImageDiv2}>
          <p>
            Hey, Are you looking for <span>Gardner ?</span>
          </p>
        </div>{" "}
        <div className={styles.fixedImageDiv3}>
          <p>
            Hey, Are you looking for <span>Nanny?</span>
          </p>
        </div>
        <div className={styles.fixedImageDiv4}>
          <p>
            Hey, Are you looking for <span>Cheif etc?</span>
          </p>
        </div>
        <div className={styles.fixedImageDiv5}>
          <p>
            If yes then you are in right place where you can find{" "}
            <span>trustworthy</span>
            Maid, Gardner, Nanny, Chief etc accoring to you requirement at
            <span>resonable salary.</span>
          </p>
        </div>
      </div>

      <div className={styles.heroContentSection}>
        <h1>
          <span>Find Your Perfect </span>Home Care
        </h1>
        <p>
          we understand that managing your home can sometimes feel like a
          full-time job. From routine maintenance tasks to unexpected
          emergencies, there's always something demanding your attention. That's
          where we come in.
        </p>
      </div>
    </div>
  );
}

export default HeroSection;
