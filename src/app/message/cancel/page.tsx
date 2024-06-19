import Link from "next/link";
import React from "react";
import styles from "../../message.module.css";
import Image from "next/image";
import FailedIcon from "../../../../public/failed.png";
function page() {
  return (
    <div className={styles.mesageContainer}>
      {" "}
      <Image src={FailedIcon} alt="Payment Failed" />
      <h1>Your Payment Failed !</h1>
      <p>Please Try Again </p>
      <Link href="/">Back to Home</Link>
    </div>
  );
}

export default page;
