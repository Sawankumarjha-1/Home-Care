import Link from "next/link";
import React from "react";
import styles from "../../message.module.css";
import Image from "next/image";
import Success from "../../../../public/success.png";
function page() {
  return (
    <div className={styles.mesageContainer}>
      {" "}
      <Image src={Success} alt="Success" width={200} height={200} />
      <h1>Hurray!, You Registred Successfully !</h1>
      <p>Now you can login with your username and password</p>
      <Link href="/">Back to Home</Link>
    </div>
  );
}

export default page;
